import z from 'zod';

const statisticsQueryValidationSchema = z.object({
    query: z.object({
        period: z.enum(['day', 'week', 'month', 'year']).optional()
    })
});

export const statisticValidations = {
    statisticsQueryValidationSchema
};
