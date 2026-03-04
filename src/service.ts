import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();

export const isValidUsername = (username: string): boolean => {
    return /^[a-zA-Z0-9_-]+$/.test(username);
};

export const hasDigit = (password: string): boolean => {
    return /\d/.test(password);
};

export const hasLetter = (password: string): boolean => {
    return /[A-Za-z]/.test(password);
};

export const isValidPassword = (password: string): boolean => {
    return hasDigit(password) && hasLetter(password);
};

export const isValidLocalisation = (localisation: string): boolean => {
    return /^[a-zA-Z]+$/.test(localisation);
};


/**
 * Vérifie si une chaîne respecte un format d'adresse email valide.
 * Utilise une expression régulière qui impose :
 * - partie locale (avant @) : au moins un caractère, pas d'espace ni de @
 * - un seul @
 * - domaine : au moins un caractère, pas d'espace ni de @
 * - un point puis l'extension (ex: .com, .fr)
 */
export const isValidEmail = (email: string): boolean => {
    // ^[^\s@]+  = début, puis 1+ caractères autres que espace et @ (avant @)
    // @        = le symbole @
    // [^\s@]+  = 1+ caractères (nom de domaine)
    // \.       = un point littéral
    // [^\s@]+$ = 1+ caractères jusqu'à la fin (extension)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Hashage du mot de passe
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};
