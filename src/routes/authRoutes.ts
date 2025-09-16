import type { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/authMiddleware';

export async function authRoutes(fastify: FastifyInstance) {
  // Public routes - no authentication required
  fastify.post('/auth/register', AuthController.register);
  fastify.post('/auth/login', AuthController.login);

  // Protected routes - authentication required
  fastify.register(async function (fastify) {
    // Add authentication middleware to all routes in this context
    fastify.addHook('preHandler', authMiddleware);
    
    // Get current user information
    fastify.get('/auth/me', AuthController.me);
  });
}