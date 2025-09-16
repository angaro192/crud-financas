import { z } from 'zod';
import { randomUUID } from 'crypto';

/**
 * Schema for UUID validation using Zod
 */
export const uuidSchema = z.string().uuid('Invalid UUID format');

/**
 * Schema for parameters that contain an ID field
 */
export const idParamsSchema = z.object({
  id: uuidSchema
});

/**
 * Validates if a string is a valid UUID
 * @param value - The string to validate
 * @returns true if valid UUID, false otherwise
 */
export const isValidUUID = (value: string): boolean => {
  try {
    uuidSchema.parse(value);
    return true;
  } catch {
    return false;
  }
};

/**
 * Generates a cryptographically secure UUID
 * @returns A new UUID string
 */
export const generateSecureUUID = (): string => {
  return randomUUID();
};

/**
 * Middleware to validate UUID parameters in routes
 * @param paramName - The name of the parameter to validate (e.g., 'id')
 * @returns Fastify middleware function
 */
export const validateUUID = (paramName: string = 'id') => {
  return (request: any, reply: any, done: () => void) => {
    const params = request.params;
    const id = params[paramName];
    
    if (!id || !isValidUUID(id)) {
      return reply.status(400).send({
        error: `Invalid ${paramName} format. Expected UUID.`,
        received: id
      });
    }
    
    done();
  };
};

/**
 * Type guard for UUID strings
 */
export type UUID = string & { readonly __brand: unique symbol };

/**
 * Creates a branded UUID type
 * @param value - The UUID string to validate and brand
 * @returns Branded UUID or throws error
 */
export const createUUID = (value: string): UUID => {
  if (!isValidUUID(value)) {
    throw new Error(`Invalid UUID format: ${value}`);
  }
  return value as UUID;
};

export default {
  uuidSchema,
  idParamsSchema,
  isValidUUID,
  generateSecureUUID,
  validateUUID,
  createUUID
};