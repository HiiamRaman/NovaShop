import {z} from "zod";

 export const checkoutSchema = z.object({
    fullName:z.string().min(3,"Name must be at least 3 characters"),
    email:z.email("Please enter a valid email"),
    phone:z.string().min(10,'Phone number must be at least 10 digits'),
    address:z.string().min(5,'Address must be at least 5 characters'),
    city:z.string().min(2,'City is required'),
    zipCode:z.string().min(2,'Zip code is required')

 })



 export type checkoutFormData = z.infer<typeof checkoutSchema>