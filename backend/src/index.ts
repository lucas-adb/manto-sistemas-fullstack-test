import express from 'express';
import cors from 'cors';
import routes from './routes';
import { db } from './database';

export const app = express();
const port = process.env.PORT || 3306;

app.use(cors());
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
