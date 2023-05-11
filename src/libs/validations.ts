import { z } from 'zod';

export const labelSchema = z.object({
  inputLabel: z
    .string({
      required_error: 'Label is required',
      invalid_type_error: 'Label must be a string'
    })
    .min(2, { message: 'Must be 2 or more (max: 10)' })
    .max(10, { message: 'Must be 10 or fewer (min: 2)' })
    .nonempty({
      message: 'Cannot not be empty'
    })
});

export const todoSchema = z.object({
  createdAt: z.date(),
  text: z
    .string({
      required_error: 'Text is required'
    })
    .min(5, { message: 'at least 5 characters' })
    .max(300, { message: 'No more than 300 characters' })
    .nonempty({
      message: 'Cannot not be empty'
    }),
  label: z.string({
    required_error: 'Label is required'
  }),
  dueDate: z
    .string({
      required_error: 'Date is required'
    })
    .nonempty({
      message: 'Cannot not be empty'
    }),
  favorite: z.string().optional(),
  done: z.string().optional()
});
