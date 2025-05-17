import { PrismaClient } from '../generated/prisma'

export const prisma = new PrismaClient();

async function main() {
  // Criar um usuário
  // const user = await prisma.user.create({
  //   data: {
  //     email: 'teste@exemplo.com',
  //     name: 'Usuario Teste',
  //     password: 'senha123',
  //   }
  // })
  // console.log('Usuário criado:', user)
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