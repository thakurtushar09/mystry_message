import {z} from 'zod';


export const usernameValidation = z
        .string()
        .min(2,"username have atleast 2 character")
        .max(20,"username cant exceed 20 character")
        .regex(/^[a-zA-Z0-9_]+$/,"username must not contain any special character")



export const signUpValidation = z.object({
    username:usernameValidation,
    email:z.string().email({message:"invalid email adddress"}),
    password:z.string().min(6,{message:"password must be atleast 6 character"})
})