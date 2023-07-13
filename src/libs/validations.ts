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
    }),
  CSRFToken: z.string()
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
  isFavorite: z.string().optional(),
  isDone: z.string().optional(),
  CSRFToken: z.string()
});

const passwordError = {
  message:
    'Your password should have at least 4 characters and contain alphanumeric characters'
};

const passwordValidation = (value: string) => {
  const minLength = 4;
  const hasNumber = /\d/.test(value);
  return value.length >= minLength && hasNumber;
};

export const singupSchema = z
  .object({
    username: z.string().min(1, { message: 'An username is required' }),
    email: z
      .string()
      .min(1, { message: 'An email is required' })
      .email({ message: 'Invalid email address' })
      .refine(value => {
        if (value === 'test@test.com') return false;
        return true;
      }, 'You cannot use this email'),
    password: z
      .string({ required_error: 'You need to enter a password' })
      .refine(passwordValidation, passwordError),
    confirmPassword: z.string({
      required_error: 'You need to enter a confirm password'
    })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Password do not match'
  });
