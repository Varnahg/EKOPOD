import { z } from 'zod'

const tagsSchema = z
  .array(z.string().trim().min(1))
  .min(1, 'Pole `tags` musí obsahovat aspoň jeden tag.')

export const questionFrontmatterSchema = z.object({
  id: z.string().trim().min(1, 'Pole `id` je povinné.'),
  set: z.string().trim().min(1, 'Pole `set` je povinné.'),
  chapter: z.string().trim().min(1, 'Pole `chapter` je povinné.'),
  subchapter: z.string().trim().optional(),
  title: z.string().trim().min(1, 'Pole `title` je povinné.'),
  order: z.coerce.number().int().nonnegative('Pole `order` musí být celé číslo >= 0.'),
  tags: tagsSchema,
  difficulty: z.coerce
    .number()
    .int()
    .min(1, 'Pole `difficulty` musí být v rozsahu 1-5.')
    .max(5, 'Pole `difficulty` musí být v rozsahu 1-5.'),
  sourcePdfPath: z.string().trim().min(1, 'Pole `sourcePdfPath` je povinné.'),
  sourcePages: z.array(z.coerce.number().int().positive()).optional(),
  sourceSections: z.array(z.string().trim().min(1)).optional(),
  summaryId: z.string().trim().optional(),
})

export const summaryFrontmatterSchema = z.object({
  id: z.string().trim().min(1, 'Pole `id` je povinné.'),
  title: z.string().trim().min(1, 'Pole `title` je povinné.'),
  chapter: z.string().trim().min(1, 'Pole `chapter` je povinné.'),
  order: z.coerce.number().int().nonnegative('Pole `order` musí být celé číslo >= 0.'),
  tags: z.array(z.string().trim().min(1)).default([]),
  description: z.string().trim().optional(),
  relatedQuestionIds: z.array(z.string().trim().min(1)).default([]),
})

export function formatZodIssues(issues: z.ZodIssue[]) {
  return issues.map((issue) => {
    const path = issue.path.length ? `${issue.path.join('.')}: ` : ''
    return `${path}${issue.message}`
  })
}
