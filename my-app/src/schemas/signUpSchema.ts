import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(2,"Must me atleast 2 characters")
    .max(20,"Must not be more than 20 characters")

export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"invalid email address"}),
    password: z.string().min(6,{message:"password must be atleast 6 chars"})
})