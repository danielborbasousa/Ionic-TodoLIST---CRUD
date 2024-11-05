const express = require('express');  // Importa o Express
const mysql = require('mysql2');     // Importa o MySQL
const cors = require('cors');        // Importa o CORS para permitir requisiÃ§Ãµes de diferentes domÃ­nios

const app = express();  // Cria a aplicaÃ§Ã£o Express
const port = 3000;      // Define a porta do servidor

// Middleware para permitir CORS e converter o corpo da requisiÃ§Ã£o para JSON
app.use(cors());
app.use(express.json()); 

// Configura a conexÃ£o com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',     // EndereÃ§o do servidor MySQL (mude para o seu endereÃ§o se nÃ£o for local)
  user: 'root',          // UsuÃ¡rio do MySQL (mude conforme sua configuraÃ§Ã£o)
  password: 'root',  // Senha do MySQL (mude conforme sua configuraÃ§Ã£o)
  database: 'todo_database'    // Nome do banco de dados
});

// Conecta ao banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL');
});

// Rota para obter todas as tarefas
app.get('/tasks', (req, res) => {
  const sql = 'SELECT * FROM tasks';  // Consulta SQL para pegar todas as tarefas
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar tarefas:', err);
      res.status(500).json({ error: 'Erro ao buscar tarefas' });
      return;
    }
    res.json(results);  // Retorna a lista de tarefas
  });
});

// Rota para adicionar uma nova tarefa
app.post('/tasks', (req, res) => {
  const { name } = req.body;  // ObtÃ©m o nome da tarefa do corpo da requisiÃ§Ã£o
  const sql = 'INSERT INTO tasks (name) VALUES (?)';  // Consulta SQL para adicionar a tarefa
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar tarefa:', err);
      res.status(500).json({ error: 'Erro ao adicionar tarefa' });
      return;
    }
    res.json({ id: result.insertId, name });  // Retorna a tarefa adicionada com o ID gerado
  });
});

// Rota para atualizar uma tarefa
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;  // ObtÃ©m o ID da tarefa a ser atualizada
  const { name } = req.body;  // ObtÃ©m o novo nome da tarefa
  const sql = 'UPDATE tasks SET name = ? WHERE id = ?';  // Consulta SQL para atualizar a tarefa
  db.query(sql, [name, id], (err) => {
    if (err) {
      console.error('Erro ao atualizar tarefa:', err);
      res.status(500).json({ error: 'Erro ao atualizar tarefa' });
      return;
    }
    res.json({ id, name });  // Retorna a tarefa atualizada
  });
});

// Rota para deletar uma tarefa
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;  // ObtÃ©m o ID da tarefa a ser deletada
  const sql = 'DELETE FROM tasks WHERE id = ?';  // Consulta SQL para deletar a tarefa
  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Erro ao deletar tarefa:', err);
      res.status(500).json({ error: 'Erro ao deletar tarefa' });
      return;
    }
    res.json({ message: 'Tarefa deletada com sucesso' });  // Confirma a exclusÃ£o da tarefa
  });
});

// Inicia o servidor na porta definida
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
