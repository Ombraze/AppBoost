import { pool } from './db.js';

export type UserRecord = {
  id: number;
  username: string;
  email: string;
  password: string;
  localisation: string;
  createdAt: Date;
};

export const createUserRecord = async (
  username: string,
  email: string,
  password: string,
  localisation: string
) => {
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password, localisation) VALUES (?, ?, ?, ?)',
    [username, email, password, localisation]
  );

  const insertId = (result as any).insertId as number;

  return {
    id: insertId,
    username,
    email,
    password,
    localisation,
    createdAt: new Date()
  } as UserRecord;
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
export const getUserByLocalisation = async (localisation: string) => {
  const [result] = await pool.query(
    'SELECT * FROM users WHERE localisation = ?',
    [localisation]
  );
  return result[0];
};

export const getUserByCreatedAt = async (createdAt: Date) => {
  const [result] = await pool.query(
    'SELECT * FROM users WHERE createdAt = ?',
    [createdAt]
  );
  return result[0];
};

