import express from "express";
import cors from "cors";
import routes from "./routes";
import userRoutes from "./routes/userRoutes";

const app = express();

// CORS ajustado com origem explícita
app.use(cors({
  origin: "",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.use(routes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
