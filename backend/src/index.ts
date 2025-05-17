import express from 'express'
import { Request, Response } from 'express'
import routes from './routes'
import { db } from './database'

const app = express()
const port = process.env.PORT || 3000

// Middleware para processar JSON no corpo das requisições
app.use(express.json())

// Rotas de autenticação
app.use(routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Olá Mundo!')
})

app.listen(port, () => {
  console.log(`App está rodando na porta ${port}`)
})

// connection test:
db.getConnection()
  .then((connection) => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    connection.release();
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });