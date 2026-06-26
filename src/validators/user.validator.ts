import z from "zod";

const RoleEnum = z.enum([
    "admin", 
    "buyer", 
    "contributor", 
    "reseller",
    "service_provider",
    "bulk_buyer",
    "seller",
]);
const StatusEnum = z.enum(["active", "suspended"]);
const SortEnum = z.enum(["full_name", "email", "created_at"]);
const OrderEnum = z.enum(["asc", "desc"]);

export const createUserSchema = z.object({
    full_name: z.string().min(3).max(100),
    email: z.email().transform(val => val.toLowerCase()),
    password: z.string().min(6).max(50),
    role: RoleEnum.default("buyer"),
    status: StatusEnum.default("active"),
});

export const updateSchema = z.object({
    full_name: z.string().min(3).max(100).optional(),
    email: z.email().transform(val => val.toLowerCase()).optional(),
    role: RoleEnum.optional(),
    status: StatusEnum.optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
});

export const getUserSchema = z.object({
    page: z.coerce.number().refine(val => !isNaN(val) && val > 0, { message: "Page must be a positive integer" }).default(1),
    limit: z.coerce.number().refine(val => !isNaN(val) && val > 0 && val <= 100, { message: "Limit must be a positive integer between 1 and 100" }).default(10),
    role: z.preprocess((val) => {
            if (!val || val === "") return undefined;
            return val;
    }, RoleEnum).optional(),
    status: z.preprocess((val) => {
            if (!val || val === "") return undefined;
            return val;
    }, StatusEnum).default("active"),  
    search: z.string().max(100).optional(),
    sort: SortEnum.default("created_at"),
    order: OrderEnum.default("desc"),   
});


export const getOneUserSchema = z.object({
    id: z.uuid(),
});

export const deleteUserSchema = z.object({
    id: z.uuid(),
});

export type CreateUserBody = z.infer<typeof createUserSchema>;
export type UpdateUserBody = z.infer<typeof updateSchema>;
export type GetUserQuery = z.infer<typeof getUserSchema>;
export type GetOneUserParams = z.infer<typeof getOneUserSchema>;
export type DeleteUserParams = z.infer<typeof deleteUserSchema>;