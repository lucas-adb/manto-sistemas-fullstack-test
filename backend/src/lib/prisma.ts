import { PrismaClient } from '../../generated/client'

// Determinar qual URL do banco de dados usar com base no ambiente
const databaseUrl = process.env.NODE_ENV === 'test' 
  ? (process.env.DATABASE_TEST_URL || 'mysql://root:senha@localhost:3306/task_manager_test')
  : process.env.DATABASE_URL;

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

async function main() {
  // Adicione aqui um script de inicialização ou teste
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Erro:', e)
    await prisma.$disconnect()
    process.exit(1)
  })