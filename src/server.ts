import fastify from 'fastify';
import { financialTransactionRoutes } from './routes/financialTransactionRoutes';
import { authRoutes } from './routes/authRoutes';
import { userRoutes } from './routes/userRoutes';

const app = fastify();

// Register authentication routes
app.register(authRoutes);

// Register protected user routes
app.register(userRoutes);

// Register financial transaction routes
app.register(financialTransactionRoutes);



app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => { 
    console.log('HTTP Server Running!');
    console.log('\n=== Authentication Endpoints (Public) ===');
    console.log('  POST   /auth/register - Register new user');
    console.log('  POST   /auth/login - User login');
    console.log('  GET    /auth/me - Get current user info (Protected)');
    console.log('\n=== User Management Endpoints (Protected) ===');
    console.log('  GET    /users - List all users');
    console.log('  POST   /users - Create new user');
    console.log('\n=== Financial Transaction Endpoints (Protected) ===');
    console.log('  POST   /financial-transactions - Create transaction');
    console.log('  GET    /financial-transactions - List transactions');
    console.log('  GET    /financial-transactions/stats - Get statistics');
    console.log('  GET    /financial-transactions/:id - Get transaction by ID');
    console.log('  PUT    /financial-transactions/:id - Update transaction');
    console.log('  PATCH  /financial-transactions/:id - Partial update transaction');
    console.log('  DELETE /financial-transactions/:id - Delete transaction');
    console.log('\n⚠️  All protected endpoints require: Authorization: Bearer <token>');
});