import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import menuRoutes from './routes/menuRoutes.js'
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import path from 'path'
import { fileURLToPath } from 'url';
import { trackVisitor } from './middleware/visit.js';
import adminRoutes from './routes/adminRoutes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(limiter);

mongoose 
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));
 
app.use(trackVisitor);

app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/admin', adminRoutes);
app.use('/api/menu',menuRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
