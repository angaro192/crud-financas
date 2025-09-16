import type { FastifyInstance } from 'fastify';
import { FinancialTransactionController } from '../controllers/FinancialTransactionController';

export async function financialTransactionRoutes(fastify: FastifyInstance) {
  // Create a new financial transaction
  fastify.post('/financial-transactions', FinancialTransactionController.create);

  // Get all financial transactions with optional filtering and pagination
  fastify.get('/financial-transactions', FinancialTransactionController.list);

  // Get financial transaction statistics
  fastify.get('/financial-transactions/stats', FinancialTransactionController.getStats);

  // Get a specific financial transaction by ID
  fastify.get('/financial-transactions/:id', FinancialTransactionController.getById);

  // Update a financial transaction
  fastify.put('/financial-transactions/:id', FinancialTransactionController.update);
  
  // Partial update a financial transaction
  fastify.patch('/financial-transactions/:id', FinancialTransactionController.update);

  // Delete a financial transaction
  fastify.delete('/financial-transactions/:id', FinancialTransactionController.delete);
}