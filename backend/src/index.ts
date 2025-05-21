import express from 'express';
import cors from 'cors';
import routes from './routes';
import { db } from './database';

export const app = express();
const port = process.env.PORT || 3306;

const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL].filter(
          (url): url is string => typeof url === 'string'
        )
      : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Configuração avançada do CORS
app.use(cors(corsOptions));
app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`App está rodando na porta ${port}`);
});

// connection test:
db.getConnection()
  .then((connection) => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    connection.release();
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });
