import { PrismaClient } from '@prisma/client';
import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  createFinancialTransactionSchema,
  updateFinancialTransactionSchema,
  listFinancialTransactionsSchema,
  numberToDecimal,
  decimalToNumber
} from '../models/FinancialTransaction';
import type {
  CreateFinancialTransactionData,
  UpdateFinancialTransactionData,
  ListFinancialTransactionsQuery
} from '../models/FinancialTransaction';

const prisma = new PrismaClient();

export class FinancialTransactionController {
  // Create a new financial transaction
  static async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createFinancialTransactionSchema.parse(request.body) as CreateFinancialTransactionData;
      const user = (request as any).user;
      
      const transaction = await prisma.financialTransaction.create({
        data: {
          valor: numberToDecimal(data.valor),
          empresa: data.empresa,
          data: new Date(data.data),
          tipo: data.tipo,
          userId: user.userId
        }
      });

      return reply.status(201).send({
        valor: decimalToNumber(transaction.valor),
        empresa: transaction.empresa,
        data: transaction.data,
        tipo: transaction.tipo,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.errors
        });
      }
      
      console.error('Error creating financial transaction:', error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }

  // Get all financial transactions with optional filtering
  static async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = listFinancialTransactionsSchema.parse(request.query) as ListFinancialTransactionsQuery;
      const user = (request as any).user;
      
      const { page, limit, tipo, empresa, startDate, endDate } = query;
      const skip = (page - 1) * limit;

      // Build where clause for filtering (only user's transactions)
      const where: any = {
        userId: user.userId  // Only show transactions for the authenticated user
      };
      if (tipo) where.tipo = tipo;
      if (empresa) where.empresa = { contains: empresa, mode: 'insensitive' };
      if (startDate || endDate) {
        where.data = {};
        if (startDate) where.data.gte = new Date(startDate);
        if (endDate) where.data.lte = new Date(endDate);
      }

      const [transactions, total] = await Promise.all([
        prisma.financialTransaction.findMany({
          where,
          skip,
          take: limit,
          orderBy: { data: 'desc' }
        }),
        prisma.financialTransaction.count({ where })
      ]);

      const formattedTransactions = transactions.map(transaction => ({
        valor: decimalToNumber(transaction.valor),
        empresa: transaction.empresa,
        data: transaction.data,
        tipo: transaction.tipo,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt
      }));

      return reply.send({
        transactions: formattedTransactions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.errors
        });
      }
      
      console.error('Error listing financial transactions:', error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }

  // Get a single financial transaction by ID
  static async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const user = (request as any).user;

      const transaction = await prisma.financialTransaction.findUnique({
        where: { 
          id,
          userId: user.userId  // Only allow access to user's own transactions
        }
      });

      if (!transaction) {
        return reply.status(404).send({
          error: 'Financial transaction not found'
        });
      }

      return reply.send({
        valor: decimalToNumber(transaction.valor),
        empresa: transaction.empresa,
        data: transaction.data,
        tipo: transaction.tipo,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt
      });
    } catch (error: any) {
      console.error('Error getting financial transaction:', error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }

  // Update a financial transaction
  static async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const data = updateFinancialTransactionSchema.parse(request.body) as UpdateFinancialTransactionData;
      const user = (request as any).user;

      // Check if transaction exists and belongs to the user
      const existingTransaction = await prisma.financialTransaction.findUnique({
        where: { 
          id,
          userId: user.userId  // Only allow access to user's own transactions
        }
      });

      if (!existingTransaction) {
        return reply.status(404).send({
          error: 'Financial transaction not found'
        });
      }

      // Prepare update data
      const updateData: any = {};
      if (data.valor !== undefined) updateData.valor = numberToDecimal(data.valor);
      if (data.empresa !== undefined) updateData.empresa = data.empresa;
      if (data.data !== undefined) updateData.data = new Date(data.data);
      if (data.tipo !== undefined) updateData.tipo = data.tipo;

      const transaction = await prisma.financialTransaction.update({
        where: { id },
        data: updateData
      });

      return reply.send({
        valor: decimalToNumber(transaction.valor),
        empresa: transaction.empresa,
        data: transaction.data,
        tipo: transaction.tipo,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.errors
        });
      }
      
      console.error('Error updating financial transaction:', error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }

  // Delete a financial transaction
  static async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const user = (request as any).user;

      // Check if transaction exists and belongs to the user
      const existingTransaction = await prisma.financialTransaction.findUnique({
        where: { 
          id,
          userId: user.userId  // Only allow access to user's own transactions
        }
      });

      if (!existingTransaction) {
        return reply.status(404).send({
          error: 'Financial transaction not found'
        });
      }

      await prisma.financialTransaction.delete({
        where: { id }
      });

      return reply.status(204).send();
    } catch (error: any) {
      console.error('Error deleting financial transaction:', error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }

  // Get statistics for financial transactions
  static async getStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as any;
      const user = (request as any).user;
      const { startDate, endDate, empresa } = query;

      // Build where clause (only user's transactions)
      const where: any = {
        userId: user.userId  // Only calculate stats for the authenticated user
      };
      if (empresa) where.empresa = { contains: empresa, mode: 'insensitive' };
      if (startDate || endDate) {
        where.data = {};
        if (startDate) where.data.gte = new Date(startDate);
        if (endDate) where.data.lte = new Date(endDate);
      }

      const [receitas, despesas, total] = await Promise.all([
        prisma.financialTransaction.aggregate({
          where: { ...where, tipo: 'Receita' },
          _sum: { valor: true },
          _count: true
        }),
        prisma.financialTransaction.aggregate({
          where: { ...where, tipo: 'Despesa' },
          _sum: { valor: true },
          _count: true
        }),
        prisma.financialTransaction.count({ where })
      ]);

      const totalReceitas = receitas._sum.valor ? decimalToNumber(receitas._sum.valor) : 0;
      const totalDespesas = despesas._sum.valor ? decimalToNumber(despesas._sum.valor) : 0;
      const saldo = totalReceitas - totalDespesas;

      return reply.send({
        stats: {
          totalTransactions: total,
          totalReceitas: {
            amount: totalReceitas,
            count: receitas._count || 0
          },
          totalDespesas: {
            amount: totalDespesas,
            count: despesas._count || 0
          },
          saldo: saldo
        }
      });
    } catch (error: any) {
      console.error('Error getting financial transaction stats:', error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }
}