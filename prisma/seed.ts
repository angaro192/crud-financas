import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Configurações do usuário inicial
  const initialUser = {
    name: 'Administrador',
    email: 'admin@myfinance.com',
    password: 'admin123' // Senha padrão - ALTERE APÓS O PRIMEIRO LOGIN
  };

  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: initialUser.email }
    });

    if (existingUser) {
      console.log('⚠️  Usuário administrador já existe:', existingUser.email);
      console.log('📧 Email:', existingUser.email);
      console.log('👤 Nome:', existingUser.name);
      return;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(initialUser.password, 10);

    // Criar usuário inicial
    const user = await prisma.user.create({
      data: {
        name: initialUser.name,
        email: initialUser.email,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    console.log('✅ Usuário administrador criado com sucesso!');
    console.log('📧 Email:', user.email);
    console.log('🔑 Senha:', initialUser.password);
    console.log('👤 Nome:', user.name);
    console.log('🆔 ID:', user.id);
    console.log('📅 Criado em:', user.createdAt);
    
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
    console.log('🔐 Use estes dados para fazer login pela primeira vez:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Senha: ${initialUser.password}`);

  } catch (error) {
    console.error('❌ Erro ao criar usuário inicial:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Falha no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Conexão com banco de dados encerrada.');
  });