// l'ensemble des imports
import express from 'express'

const app = express()
const PORT = 4000

// Structure pour un utilisateur
interface User {
  id: string
  username: string
  birthdate: string
}

// Tableau pour stocker les utilisateurs
const users: User[] = []

app.use(express.json())

// logique métier
app.get('/users', (_req, res) => {
  console.log('test route users')
  res.json(users)
})

app.get('/users/:username', (req, res) => {
  const username = req.params.username

  const result = users.filter((user) => user.username.toLowerCase() === username.toLowerCase())

  res.json(result)
})

app.post('/users', (req, res) => {
  const { username, birthdate } = req.body as { username: string; birthdate: string }
  const id = String(users.length + 1)

  const newUser: User = { id, username, birthdate }
  users.push(newUser)

  res.json(newUser)
})

// écouter sur un port
app.listen(PORT, () => {
  console.log(`server running on localhost:${PORT}`)
})
