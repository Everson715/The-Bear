// src/app.ts (or server.ts)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import your route files
import authRoutes from './routes/authRoutes'; // Assuming you have this
import userRoutes from './routes/userRoutes';
import menuRoutes from './routes/menuRoutes'; // Assuming you have this
import purchaseRoutes from './routes/purchaseRoutes';
import missionRoutes from './routes/missionRoutes'; // Assuming you have this

dotenv.config();

const app = express();

// Middlewares
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Route registrations
app.use('/api/auth', authRoutes); // e.g., /api/auth/login, /api/auth/register
app.use('/api', userRoutes); // e.g., /api/profile (no prefix for this one as per frontend)
app.use('/api/menu', menuRoutes);
app.use('/api', purchaseRoutes); // Purchase routes might use /api/cart, /api/purchases, etc.
app.use('/api/missions', missionRoutes); // e.g., /api/missions/assign

// Basic error handling middleware (optional, but good practice)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});