
# The Bear - Sistema Gamificado para Cafeteria

**The Bear** é uma aplicação web gamificada desenvolvida para a cafeteria **The Bear**, que transforma compras em uma jornada de recompensas. Os clientes acumulam XP e Grãos de Café a cada compra e podem desbloquear níveis com prêmios.

---

## 🚀 Funcionalidades Principais

- Registro e login de usuários com autenticação JWT.
- Visualização e administração de um cardápio com categorias.
- Realização de compras que geram XP e grãos.
- Sistema de notificações personalizadas.
- Níveis de progressão com recompensas.
- Interface separada para clientes e administradores.

---

## 🛠️ Tecnologias Utilizadas

### Back-End
- **Node.js** + **Express**
- **Prisma ORM**
- **PostgreSQL**
- **JWT (JSON Web Token)**
- **TypeScript**

### Front-End
- **HTML5 + CSS3 + JavaScript Puro**
- Integração via `fetch` com a API Express

---

## 📁 Estrutura do Projeto

```

the-bear/
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── prisma/
│   │   └── schema.prisma
│   └── server.ts
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── menu.html
│   ├── purchase.html
│   ├── profile.html
│   └── notifications.html
├── .env
├── README.md
└── package.json

````

---

## 📦 Instalação e Uso

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/the-bear.git
cd the-bear
````

### 2. Instale as dependências

```bash
cd backend
npm install
```

### 3. Configure o banco de dados

* Crie o arquivo `.env` com a variável:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/thebear"
JWT_SECRET="seu_segredo"
```

* Execute a migração:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Inicie o servidor

```bash
npm run dev
```

> O servidor estará rodando em: `http://localhost:3000`

---

## ✨ Níveis e Recompensas

| Nível            | Recompensa                           |
| ---------------- | ------------------------------------ |
| Urso Curioso     | Adesivo digital + Badge              |
| Urso Forrageiro  | Café pequeno grátis                  |
| Urso Explorador  | Caneca personalizada ou item extra   |
| Urso Aventureiro | Camiseta “The Bear” + 5% de desconto |

---

## ✅ Casos de Uso Atendidos

* ✅ Cadastro e Login com JWT
* ✅ Visualização de cardápio
* ✅ Compras associadas ao usuário
* ✅ Sistema de notificações
* ✅ Acesso de admin com permissões exclusivas

---

## 🤝 Contribuição

Contribuições são bem-vindas! Se quiser melhorar algo, abra uma *issue* ou envie um *pull request*.

---

## 🛡️ Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 🙏 Agradecimentos

* A todos os baristas da **The Bear** por inspirarem esta jornada.
* A São Bento, São Miguel Arcanjo, Nossa Senhora das Dores e São José, por guiarem os caminhos do criador deste projeto.

---