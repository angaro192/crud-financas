import type { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { authMiddleware } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export async function userRoutes(fastify: FastifyInstance) {
  // Add authentication middleware to all user routes
  fastify.addHook('preHandler', authMiddleware);

  // Get all users (protected)
  fastify.get('/users', async (request, reply) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true
        }
      });
      return { users };
    } catch (error) {
      console.error('Get users error:', error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  });

  // Create a new user (protected - admin only functionality)
  fastify.post('/users', async (request, reply) => {
    try {
      const createUserSchema = z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
      });

      const { name, email, password } = createUserSchema.parse(request.body);

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return reply.status(400).send({
          error: 'User with this email already exists'
        });
      }

      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        },
        select: {
          name: true,
          email: true,
          createdAt: true
        }
      });

      return reply.status(201).send({
        message: 'User created successfully',
        user
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.issues
        });
      }
      
      console.error('Create user error:', error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  });
}