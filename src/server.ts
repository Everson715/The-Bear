// src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes'; // Importa o roteador default de src/routes/index.ts

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://127.0.0.1:5500", // Confirme o URL do seu frontend
  credentials: true
}));
app.use(express.json());

app.use('/api', routes); // Todas as rotas serão prefixadas com '/api'

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});