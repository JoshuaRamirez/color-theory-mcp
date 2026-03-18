import { z } from 'zod';
export declare const calculateTemperatureSchema: z.ZodObject<{
    color: z.ZodOptional<z.ZodString>;
    kelvin: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CalculateTemperatureInput = z.infer<typeof calculateTemperatureSchema>;
/**
 * Converts between colors and correlated color temperatures (Kelvin).
 * Accepts a color to estimate its temperature, a Kelvin value to convert to a color,
 * or both to perform both operations simultaneously.
 */
export declare function calculateTemperature(input: CalculateTemperatureInput): Promise<Record<string, unknown>>;
//# sourceMappingURL=calculateTemperature.d.ts.map