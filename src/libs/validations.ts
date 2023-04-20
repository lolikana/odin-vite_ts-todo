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
