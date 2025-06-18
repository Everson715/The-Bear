// server.ts

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Importa o roteador principal que agrega a maioria das suas rotas (menu, missões, etc.)
// O caminho é "./src/routes/index" porque server.ts está na raiz e index.ts está em src/routes/.
import apiRoutes from "../src/routes/index";

// Importa as rotas de usuário/autenticação separadamente,
// pois elas serão montadas sob um prefixo diferente (/auth).
import userRoutes from "../src/routes/userRoutes";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();

// Configuração do CORS: Permite que seu frontend (http://127.0.0.1:5500) se comunique com o backend.
app.use(cors({
  origin: "http://127.0.0.1:5500", // A origem exata do seu frontend (baseado nos erros anteriores)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Métodos HTTP permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos nas requisições
  credentials: true // Importante para permitir o envio de cookies ou credenciais (se usados)
}));

// Middleware para fazer o parse do corpo das requisições em formato JSON
app.use(express.json());

// --- Definição e Montagem das Rotas ---

// Monta as rotas de usuário/autenticação sob o prefixo "/auth".
// Isso significa que router.post("/login") em userRoutes.ts será acessível via POST /auth/login.
// E router.post("/register") em userRoutes.ts será acessível via POST /auth/register.
app.use("/auth", userRoutes);

// Monta as outras rotas (menu, notificações, missões, compras) sob o prefixo "/api".
// Isso significa que as rotas definidas em src/routes/index.ts (que agrega as demais)
// serão acessíveis começando com /api. Ex: GET /api/menu, POST /api/missions.
app.use("/api", apiRoutes);

// Rota de teste básica para a raiz do servidor (acessível via GET /)
app.get("/", (req, res) => {
  res.send("Servidor Express rodando com sucesso!");
});

// Início do Servidor
const PORT = process.env.PORT || 3000; // Usa a porta do ambiente ou 3000 por padrão
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`🕒 Hora atual: ${new Date().toLocaleString('pt-BR')}`);
});