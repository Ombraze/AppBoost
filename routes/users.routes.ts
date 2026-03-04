// imports nécessaires pour les routes utilisateurs
import { Router, Request, Response } from "express";
import { pool } from "../src/db.js";

// type pour représenter un utilisateur
type UserType = {
    id: number;
    name: string;
    email: string;
    username: string;
};

// tableau en mémoire pour stocker des utilisateurs
const users: UserType[] = [];
const userRouter = Router();

// récupérer un utilisateur par son id
userRouter.get('/users/:id', async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    console.log('test route users');

    const [rows] = await pool.query(
        'SELECT id, email, name FROM users WHERE id = ?',
        [id]
    );
    return res.status(200).json(rows);
});

// récupérer tous les utilisateurs ou filtrer par username
userRouter.get('/users', (req: Request, res: Response) => {
    const { username } = req.query;

    if (!username || typeof username !== 'string') {
        return res.status(200).json(users);
    }

    const results = users.filter(user =>
        user.username.toLowerCase() === username.toLowerCase()
    );

    return res.json(results);
});

// créer un nouvel utilisateur
userRouter.post('/users', async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Le champ name est requis.' });
    }

    const result = await pool.query(
        'INSERT INTO users (name) VALUES (?)',
        [name.trim()]
    );

    return res.status(201).json(result);
});

export default userRouter;