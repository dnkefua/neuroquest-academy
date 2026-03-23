import { z } from 'zod'

export const StudentClassSchema = z.enum(['math', 'science', 'english', 'arabic'])
export type StudentClass = z.infer<typeof StudentClassSchema>

export const GenerateLessonSchema = z.object({
  subject: StudentClassSchema,
  grade: z.union([z.string(), z.number()]),
  language: z.enum(['en', 'ar', 'EN', 'AR']),
  studentName: z.string().optional(),
  emotion: z.enum(['neutral', 'frustrated', 'anxious', 'happy']).optional().default('neutral'),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional().default('medium'),
  studentClass: StudentClassSchema.optional().default('math'),
})

export const TutorExplanationSchema = z.object({
  question: z.string().min(1),
  studentAnswer: z.string(),
  correctAnswer: z.string(),
  studentName: z.string().optional(),
  grade: z.union([z.string(), z.number()]),
  language: z.enum(['en', 'ar', 'EN', 'AR']),
})

export const NPCReactionSchema = z.object({
  npcName: z.string().min(1),
  situation: z.string().min(1),
  studentChoice: z.string(),
  wasCorrect: z.boolean(),
  studentName: z.string().optional(),
  grade: z.union([z.string(), z.number()]),
  language: z.enum(['en', 'ar', 'EN', 'AR']),
})

export type GenerateLessonInput = z.infer<typeof GenerateLessonSchema>
export type TutorExplanationInput = z.infer<typeof TutorExplanationSchema>
export type NPCReactionInput = z.infer<typeof NPCReactionSchema>
