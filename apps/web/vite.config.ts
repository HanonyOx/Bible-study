import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const demoMode =
    env.VITE_SUNDAY_SCHOOL_DATABASE_READS !== 'true' &&
    env.VITE_SUNDAY_SCHOOL_DEMO_MODE === 'true'
  const sundaySchoolDirectory = path.resolve(
    process.cwd(),
    'src/features/sunday-school',
  )

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: [
        {
          find: './demoLessonData',
          replacement: path.join(
            sundaySchoolDirectory,
            demoMode ? 'demoLessonData.ts' : 'noDemoLessonData.ts',
          ),
        },
      ],
    },
  }
})
