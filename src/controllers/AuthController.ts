import { PrismaClient } from '@prisma/client';
import type { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { isValidUUID } from '../utils/uuid';

const prisma = new PrismaClient();

// JWT secret - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthController {
  static async register(request: FastifyRequest, reply: FastifyReply) {
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

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return reply.status(201).send({
        message: 'User created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        },
        token
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.issues
        });
      }
      
      console.error('Registration error:', error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }

  static async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const loginSchema = z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(1, 'Password is required'),
      });

      const { email, password } = loginSchema.parse(request.body);

      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return reply.status(401).send({
          error: 'Invalid credentials'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return reply.status(401).send({
          error: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return reply.send({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.issues
        });
      }
      
      console.error('Login error:', error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }

  static async me(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Get user from the authenticated request
      const user = (request as any).user;

      // Validate UUID format
      if (!isValidUUID(user.userId)) {
        return reply.status(400).send({
          error: 'Invalid user ID format'
        });
      }

      const userData = await prisma.user.findUnique({
        where: { id: user.userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      });

      if (!userData) {
        return reply.status(404).send({
          error: 'User not found'
        });
      }

      return reply.send({
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          createdAt: userData.createdAt
        }
      });

    } catch (error) {
      console.error('Get user error:', error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }
}