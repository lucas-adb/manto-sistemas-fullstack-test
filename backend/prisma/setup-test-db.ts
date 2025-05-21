import { exec } from 'child_process';
import { promisify } from 'util';
import * as mysql from 'mysql2/promise';

const execAsync = promisify(exec);

async function setupTestDatabase() {
  try {
    // Usar variáveis de ambiente com fallbacks explícitos
    const host = process.env.DB_HOST || 'localhost';
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || 'senha';

    // Configuração para conectar ao MySQL
    const connection = await mysql.createConnection({
      host,
      user,
      password,
    });

    console.log('Conectado ao MySQL');

    // Verifica se o banco de dados de teste existe e o cria se não existir
    try {
      await connection.execute('DROP DATABASE IF EXISTS task_manager_test');
      console.log('Banco de dados de teste removido (se existia)');

      await connection.execute('CREATE DATABASE task_manager_test');
      console.log('Banco de dados de teste criado com sucesso');

      // Desconecta após a criação do banco
      await connection.end();

      // Define a variável de ambiente para usar o banco de dados de teste
      const testDatabaseUrl =
        'mysql://root:senha@localhost:3306/task_manager_test';
      process.env.DATABASE_URL = testDatabaseUrl;
      process.env.NODE_ENV = 'test';

      console.log('Executando migrações no banco de dados de teste...');
      console.log(`URL do banco de dados: ${process.env.DATABASE_URL}`);
      await execAsync('npx prisma migrate deploy');

      console.log(
        'Configuração do banco de dados de teste concluída com sucesso!'
      );
    } catch (err) {
      console.error('Erro ao configurar o banco de dados de teste:', err);
      await connection.end();
      process.exit(1);
    }
  } catch (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    process.exit(1);
  }
}

setupTestDatabase();
