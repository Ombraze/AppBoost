import { pool } from './db.js';

export type UserRecord = {
  id: number;
  username: string;
  email: string;
  password: string;
};

export const createUserRecord = async (
  username: string,
  email: string,
  hashedPassword: string
) => {
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );

  const insertId = (result as any).insertId as number;

  return {
    id: insertId,
    username,
    email,
  };
};

export const getUserByUsername = async (username: string) => {
  const [result] = await pool.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  return result[0];
};

export const getUserByEmail = async (email: string) => {
  const [result] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return result[0];
};

export const getUserById = async (id: number) => {
  const [result] = await pool.query(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return result[0];
};

