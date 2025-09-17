import type { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/authMiddleware';

export async function authRoutes(fastify: FastifyInstance) {
  // Public routes - no authentication required
  fastify.post('/auth/login', AuthController.login);

  // Protected routes - authentication required
  fastify.register(async function (fastify) {
    // Add authentication middleware to all routes in this context
    fastify.addHook('preHandler', authMiddleware);
    
    // User registration now requires authentication (admin functionality)
    fastify.post('/auth/register', AuthController.register);
    
    // Get current user information
    fastify.get('/auth/me', AuthController.me);
  });
}