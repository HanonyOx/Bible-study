$ErrorActionPreference = 'Stop'

$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$webRoot = Join-Path $repositoryRoot 'apps\web'
$configPath = Join-Path $repositoryRoot 'supabase\config.toml'
$linkedProjectRefPath = Join-Path $repositoryRoot 'supabase\.temp\project-ref'
$cliPath = Join-Path $webRoot 'node_modules\.bin\supabase.cmd'
$expectedProjectId = 'word-and-way-curriculum-test'
$dockerCommand = Get-Command docker -ErrorAction SilentlyContinue

if ($dockerCommand) {
  $dockerPath = $dockerCommand.Source
} else {
  $dockerPath = Join-Path $env:LOCALAPPDATA 'Programs\DockerDesktop\resources\bin\docker.exe'
}

if (-not (Test-Path $dockerPath)) {
  throw 'Docker CLI is unavailable. Start or install Docker Desktop, then see LOCAL_TESTING.md.'
}
if (-not (Test-Path $configPath)) {
  throw 'supabase/config.toml is missing. See LOCAL_TESTING.md.'
}
if (Test-Path $linkedProjectRefPath) {
  throw 'Refusing to run because supabase/.temp/project-ref exists. This runner only targets an unlinked local project.'
}
if (-not (Test-Path $cliPath)) {
  throw 'Supabase CLI is missing from apps/web/node_modules. Restore the existing project dependencies before testing.'
}

$config = Get-Content -Raw $configPath
if ($config -notmatch '(?m)^\s*project_id\s*=\s*"word-and-way-curriculum-test"\s*$') {
  throw "Refusing to run: config project_id must be exactly '$expectedProjectId'."
}

$previousPath = $env:PATH
$env:PATH = "$(Split-Path $dockerPath);$previousPath"

function Get-ProjectContainers([switch]$IncludeStopped) {
  $allFlag = if ($IncludeStopped) { '-a' } else { $null }
  $ids = if ($allFlag) {
    @(& $dockerPath ps $allFlag -q --filter "name=$expectedProjectId")
  } else {
    @(& $dockerPath ps -q --filter "name=$expectedProjectId")
  }
  if ($LASTEXITCODE -ne 0) {
    throw 'Could not query Docker containers for local diagnostics.'
  }

  foreach ($id in $ids) {
    if ($id) {
      & $dockerPath inspect $id --format '{{.Name}}|{{.State.Status}}|{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}'
    }
  }
}

function Protect-DiagnosticText([string]$Text) {
  return [regex]::Replace(
    $Text,
    '(?i)(service[_ -]?role[_ -]?key|secret[_ -]?key|anon[_ -]?key|publishable[_ -]?key|authorization|password|jwt[_ -]?secret)(["''\s:=]+)([^,\s"''}]+)',
    '$1$2[REDACTED]'
  )
}

function Show-ProjectDiagnostics([string]$Phase) {
  Write-Host "`nLocal Supabase diagnostics after failure during: $Phase"
  $containers = @(Get-ProjectContainers -IncludeStopped)
  if ($containers.Count -eq 0) {
    Write-Host "No containers currently match local project '$expectedProjectId'."
    return
  }

  foreach ($container in $containers) {
    $parts = $container -split '\|', 3
    $name = $parts[0].TrimStart('/')
    $status = if ($parts.Count -gt 1) { $parts[1] } else { 'unknown' }
    $health = if ($parts.Count -gt 2) { $parts[2] } else { 'unknown' }
    Write-Host "`n$name state=$status health=$health"

    $databaseQueryFailed = $Phase -match 'migration|studies|security'
    if ($health -eq 'unhealthy' -or $status -ne 'running' -or
      ($databaseQueryFailed -and $name -like 'supabase_db_*')) {
      $id = (& $dockerPath ps -aq --filter "name=$name" | Select-Object -First 1)
      if ($id) {
        $healthLog = & $dockerPath inspect $id --format '{{if .State.Health}}{{json .State.Health.Log}}{{end}}'
        if ($healthLog) {
          Write-Host 'Health-check output:'
          Write-Host (Protect-DiagnosticText ($healthLog -join "`n"))
        }
        Write-Host 'Recent container log:'
        $logs = & $dockerPath logs --tail 60 $id 2>&1
        Write-Host (Protect-DiagnosticText ($logs -join "`n"))
      }
    }
  }
}

function Invoke-LocalCli([string[]]$CliArguments, [string]$Phase) {
  Write-Host "`n$Phase"
  $cliOutput = & $cliPath --workdir $repositoryRoot @CliArguments 2>&1
  $exitCode = $LASTEXITCODE
  if ($exitCode -ne 0) {
    if ($cliOutput) {
      Write-Host (Protect-DiagnosticText ($cliOutput -join "`n"))
    }
    Show-ProjectDiagnostics $Phase
    throw "$Phase failed with exit code $exitCode."
  }
}

function Invoke-LocalSqlFile([string]$SqlPath, [string]$Phase) {
  Write-Host "`n$Phase"
  $databaseContainer = "supabase_db_$expectedProjectId"
  $runningDatabase = @(
    & $dockerPath ps --filter "name=$databaseContainer" --format '{{.Names}}'
  )
  if ($LASTEXITCODE -ne 0 -or $runningDatabase -notcontains $databaseContainer) {
    Show-ProjectDiagnostics $Phase
    throw "Refusing to execute SQL: expected running local database container '$databaseContainer'."
  }

  $sql = Get-Content -Raw -LiteralPath $SqlPath
  $sql | & $dockerPath exec -i $databaseContainer psql `
    --username postgres `
    --dbname postgres `
    --quiet `
    --set ON_ERROR_STOP=1
  $exitCode = $LASTEXITCODE
  if ($exitCode -ne 0) {
    Show-ProjectDiagnostics $Phase
    throw "$Phase failed with exit code $exitCode."
  }
}

try {
  & $dockerPath info *> $null
  if ($LASTEXITCODE -ne 0) {
    throw 'Docker CLI is available but the Docker Desktop engine is not responding.'
  }

  Invoke-LocalCli @('start', '--ignore-health-check') 'Starting local Supabase services'

  $deadline = [DateTime]::UtcNow.AddSeconds(90)
  $unhealthyContainers = @()
  do {
    $states = @(Get-ProjectContainers)
    $unhealthyContainers = @(
      $states | Where-Object {
        $fields = $_ -split '\|', 3
        $fields.Count -lt 2 -or
        $fields[1] -ne 'running' -or
        ($fields.Count -eq 3 -and $fields[2] -notin @('healthy', 'none'))
      }
    )
    if ($unhealthyContainers.Count -eq 0) { break }
    Start-Sleep -Seconds 5
  } while ([DateTime]::UtcNow -lt $deadline)

  if ($states.Count -eq 0) {
    Show-ProjectDiagnostics 'local service health verification'
    throw 'Supabase start returned without any containers for the dedicated local project.'
  }
  if ($unhealthyContainers.Count -gt 0) {
    Show-ProjectDiagnostics 'local service health verification'
    throw 'One or more local Supabase containers did not reach a healthy/running state within 90 seconds.'
  }

  $requiredServices = @(
    'supabase_db',
    'supabase_studio',
    'supabase_kong',
    'supabase_auth',
    'supabase_rest',
    'supabase_storage',
    'supabase_realtime',
    'supabase_pg_meta',
    'supabase_inbucket'
  )
  foreach ($service in $requiredServices) {
    $requiredName = "$service`_$expectedProjectId"
    if (-not ($states | Where-Object { ($_ -split '\|', 3)[0].TrimStart('/') -eq $requiredName })) {
      Show-ProjectDiagnostics 'required local service verification'
      throw "Required local service '$service' is not running."
    }
  }

  Invoke-LocalCli @('migration', 'up', '--local') 'Applying pending local migrations'
  Invoke-LocalSqlFile `
    (Join-Path $repositoryRoot 'supabase\seeds\original_word_and_way_studies.sql') `
    'Loading the original Word & Way draft studies'
  Invoke-LocalSqlFile `
    (Join-Path $repositoryRoot 'supabase\tests\curriculum_security.sql') `
    'Running the rollback-only curriculum security test'

  Write-Host "`nLocal Supabase services are healthy; migrations, seed, and curriculum security test completed."
} finally {
  $env:PATH = $previousPath
}
