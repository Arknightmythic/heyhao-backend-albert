import z from "zod";

export const withDrawSchema = z.object({
    amount : z.number(),
    bank_name: z.enum(['BCA','MANDIRI', 'BRI']),
    bank_account_number : z.number(),
    bank_account_name : z.string()
})

export type withdrawavalues = z.infer<typeof withDrawSchema>