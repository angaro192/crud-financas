import { PrismaClient } from '@prisma/client';
import fastify from 'fastify';
import { z } from 'zod';
import { financialTransactionRoutes } from './routes/financialTransactionRoutes';
import { authRoutes } from './routes/authRoutes';

const app = fastify();

const prisma = new PrismaClient();

// Register authentication routes
app.register(authRoutes);

// Register financial transaction routes
app.register(financialTransactionRoutes);

// Existing user routes (kept for compatibility)
app.get('/users', async (request, reply) => {
    const users = await prisma.user.findMany();
    return { users };
});

app.post('/users', async (request, reply) => {
    const createUserSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6, 'Password must be at least 6 characters'),
    });

    const { name, email, password } = createUserSchema.parse(request.body);

    // Hash password before saving
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      },
    });

    return reply.status(201).send();
});

app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => { 
    console.log('HTTP Server Running!');
    console.log('Financial Transaction endpoints available at:');
    console.log('  POST   /financial-transactions - Create transaction');
    console.log('  GET    /financial-transactions - List transactions');
    console.log('  GET    /financial-transactions/stats - Get statistics');
    console.log('  GET    /financial-transactions/:id - Get transaction by ID');
    console.log('  PUT    /financial-transactions/:id - Update transaction');
    console.log('  PATCH  /financial-transactions/:id - Partial update transaction');
    console.log('  DELETE /financial-transactions/:id - Delete transaction');
});