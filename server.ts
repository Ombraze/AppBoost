// l'ensemble des imports 

import express from 'express';
import userRouter from './routes/users.routes.js';

const app = express();
const PORT: number = 4000;

// utilise les routes 
app.use(express.json());
app.use(userRouter);

// écouter sur un port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});