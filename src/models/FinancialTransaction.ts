import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/library';

// Enum for transaction types
export enum TransactionType {
  DESPESA = 'Despesa',
  RECEITA = 'Receita'
}

// Validation schema for creating a financial transaction
export const createFinancialTransactionSchema = z.object({
  valor: z.number().positive('Valor must be positive').multipleOf(0.001, 'Valor can have at most 3 decimal places'),
  empresa: z.string().min(1, 'Empresa is required').max(255, 'Empresa must be less than 255 characters'),
  data: z.string().datetime('Data must be a valid ISO datetime string').or(z.date()),
  tipo: z.enum(['Despesa', 'Receita']).refine(
    (val) => val === 'Despesa' || val === 'Receita',
    { message: 'Tipo must be either "Despesa" or "Receita"' }
  )
});

// Validation schema for updating a financial transaction
export const updateFinancialTransactionSchema = z.object({
  valor: z.number().positive('Valor must be positive').multipleOf(0.001, 'Valor can have at most 3 decimal places').optional(),
  empresa: z.string().min(1, 'Empresa is required').max(255, 'Empresa must be less than 255 characters').optional(),
  data: z.string().datetime('Data must be a valid ISO datetime string').or(z.date()).optional(),
  tipo: z.enum(['Despesa', 'Receita']).refine(
    (val) => val === 'Despesa' || val === 'Receita',
    { message: 'Tipo must be either "Despesa" or "Receita"' }
  ).optional()
});

// Query parameters schema for listing transactions
export const listFinancialTransactionsSchema = z.object({
  page: z.string().transform(val => parseInt(val)).pipe(z.number().min(1)).optional().default(() => 1),
  limit: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(100)).optional().default(() => 10),
  tipo: z.enum(['Despesa', 'Receita']).optional(),
  empresa: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

// Types
export type CreateFinancialTransactionData = z.infer<typeof createFinancialTransactionSchema>;
export type UpdateFinancialTransactionData = z.infer<typeof updateFinancialTransactionSchema>;
export type ListFinancialTransactionsQuery = z.infer<typeof listFinancialTransactionsSchema>;

// Helper function to convert number to Decimal for Prisma
export const numberToDecimal = (value: number): Decimal => {
  return new Decimal(value);
};

// Helper function to convert Decimal to number for API responses
export const decimalToNumber = (value: Decimal): number => {
  return value.toNumber();
};