import type {
  SundaySchoolCurriculum,
  SundaySchoolLesson,
} from './sundaySchoolData'

export type CurriculumImportSubmission = {
  curriculum: SundaySchoolCurriculum
  lessons: SundaySchoolLesson[]
  sourceVerificationEvidence: string
  usageRightsEvidence: string
}

export type CurriculumImportSubmissionReceipt = {
  submissionId: string
  status: 'pending_review'
}

export interface CurriculumImportGateway {
  submitForReview(
    submission: CurriculumImportSubmission,
  ): Promise<CurriculumImportSubmissionReceipt>
  publishApprovedSubmission(submissionId: string): Promise<void>
}

// Implement this contract only behind a trusted server endpoint or database
// policy that verifies administrator authority, source rights, and review state.
