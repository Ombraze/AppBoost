import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { createUserRecord, getUserByUsername, getUserByEmail } from "../repositories/user.repository.js";


const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 12);  
};

const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};

export const createUser = async (req: Request, res: Response) => {
    const { username, email, password, localisation } = req.body;

    if (!username || typeof username !== "string") {
        return res.status(400).send({ message: "username invalide" });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).send({ message: "email invalide" });
    }

    if (!password || typeof password !== "string" || password.length < 16) {
        return res.status(400).send({
            message: "mot de passe invalide : au moins 16 caractères, avec lettres et chiffres"
        });
    }

    if (!localisation || typeof localisation !== "string") {
        return res.status(400).send({ message: "localisation invalide" });
    }


    const existingUserByUsername = await getUserByUsername(username);
    if (existingUserByUsername) {
        return res.status(400).send({ message: "Cet username existe déjà" });
    }
    const existingUserByEmail = await getUserByEmail(email);
    if (existingUserByEmail) {
        return res.status(400).send({ message: "Cet email existe déjà" });
    }


    try {
        //  hash le mot de passe
        const hashedPassword = await hashPassword(password);

        // insert en base via le repository (mot de passe hashé) et retourne l'utilisateur
        const createdUser = await createUserRecord(username, email, hashedPassword, localisation);

        return res.status(201).send({
            message: "Utilisateur créé.",
            data: createdUser,
        });
    } catch (error: any) {
        // Si email/username existe déjà en DB
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).send({ message: "Cet email ou username existe déjà" });
        }
        return res.status(500).send({ message: "Erreur serveur" });
    }
};
