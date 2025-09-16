import jwt from 'jsonwebtoken';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { isValidUUID } from '../utils/uuid';

// JWT secret - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Extend FastifyRequest interface to include user
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: string;
      email: string;
    };
  }
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({
        error: 'Access token is required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      iat: number;
      exp: number;
    };

    // Validate that userId is a valid UUID
    if (!isValidUUID(decoded.userId)) {
      return reply.status(401).send({
        error: 'Invalid token format - userId must be UUID'
      });
    }

    // Add user info to request
    request.user = {
      userId: decoded.userId,
      email: decoded.email
    };

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return reply.status(401).send({
        error: 'Invalid token'
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return reply.status(401).send({
        error: 'Token expired'
      });
    }

    console.error('Auth middleware error:', error);
    return reply.status(500).send({
      error: 'Internal server error'
    });
  }
}