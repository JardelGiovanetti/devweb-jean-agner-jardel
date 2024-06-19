const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const moment = require('moment-timezone');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
const port = 5001;
const saltRounds = 10;

app.set('trust proxy', true);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({
    origin: 'https://jeanhenrique.site',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

const jwtSecret = process.env.JWT_SECRET;
const senha = process.env.ACCESS_TOKEN;

const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'SitePessoal'
});

dbConnection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados MySQL:', err);
        throw err;
    }
    console.log('Conexão bem sucedida com o banco de dados MySQL');
});

// Middleware de limitação de taxa
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 30, // Limite de 30 requisições por minuto
    message: "Too many requests, please try again later"
});
app.use(limiter);

// Middleware para logar o endereço IP do cliente
app.use((req, res, next) => {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('Endereço IP do cliente:', clientIP);
    req.clientIP = clientIP.split(',')[0].trim(); // Caso haja mais de um IP no cabeçalho
    next();
});

// Função para enviar email usando o comando 'mail'
function sendEmail(to, subject, html) {
    const styles = `
        <style>
            body {
                font-family: Arial, sans-serif;
                color: black;
            }
            h1 {
                font-size: 18px;
                color: black;
                margin-bottom: 10px;
            }
            h2 {
                font-size: 16px;
                color: red;
                margin-top: 10px;
            }
            strong {
                font-weight: bold;
                color: black;
            }
        </style>
    `;
    const headers = `-s "$(echo "${subject}\nContent-Type: text/html; charset=UTF-8")" -a "From: ToDoList <notificador@fuchshenrique.com.br>"`;
    const command = `echo "${styles + html.toString('utf8')}" | mail ${headers} ${to}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Erro ao enviar email:', error);
            return;
        }
        console.log('Email enviado com sucesso:', stdout);
    });
}

// Middleware para autenticação JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Acesso não autorizado' });
    }

    jwt.verify(token.split(' ')[1], jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Acesso não autorizado' });
        }
        req.user = decoded;
        next();
    });
};

// Validar email
const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return re.test(email);
};

// Validar nome de usuário
const isValidUsername = (username) => {
    const re = /^[a-zA-Z0-9 _-]{3,30}$/; // Alterado para permitir espaços e aumentar o limite de caracteres
    return re.test(username);
};

// Rota para registrar usuário
app.post('/Projetos/To-Do-List/register', async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const lastLogin = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
    const clientIP = req.clientIP;

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Email inválido.' });
    }

    if (!isValidUsername(username)) {
        return res.status(400).json({ error: 'Nome de usuário inválido.' });
    }

    if (password.length < 7 || password.length > 30) {
        return res.status(400).json({ error: 'A senha deve ter entre 7 e 30 caracteres.' });
    }

    try {
        const oneWeekAgo = moment().tz('America/Sao_Paulo').subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss');
        const existingUserCount = await new Promise((resolve, reject) => {
            dbConnection.query(
                'SELECT COUNT(*) AS count FROM users WHERE ip = ? AND last_login > ?',
                [clientIP, oneWeekAgo],
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results[0].count);
                    }
                }
            );
        });

        if (existingUserCount >= 1) {
            return res.status(403).json({ error: 'Limite de 1 conta por IP por semana alcançado.' });
        }

        dbConnection.query(
            'INSERT INTO users (username, password, email, last_login, ip) VALUES (?, ?, ?, ?, ?)',
            [username, hashedPassword, email, lastLogin, clientIP],
            async (error) => {
                if (error) {
                    console.error('Erro ao registrar usuário no MySQL:', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                const subject = 'Registro de Conta na To-Do-List';
                const html = `
                    <h1>Olá ${username},</h1>
                    <h2>Sua conta foi registrada com sucesso.</h2>
                    <h2>Usuário: ${username}</h2>
                    <h2>Senha: ${password}</h2>
                    <h2>Atenciosamente,</h2>
                    <h2>Equipe To-Do-List</h2>
                `;

                sendEmail(email, subject, html);
                res.status(200).json({ message: 'Usuário registrado com sucesso. Por favor, faça login.' });
            }
        );
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Rota para login
app.post('/Projetos/To-Do-List/login', (req, res) => {
    const { email, password } = req.body;

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Email inválido.' });
    }

    if (password.length < 7 || password.length > 30) {
        return res.status(400).json({ error: 'A senha deve ter entre 7 e 30 caracteres.' });
    }

    dbConnection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        async (error, results) => {
            if (error || results.length === 0) {
                return res.status(401).json({ error: 'Email ou senha inválidos' });
            }

            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Email ou senha inválidos' });
            }

            const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '7d' });

            const lastLogin = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
            dbConnection.query(
                'UPDATE users SET last_login = ?, ip = ? WHERE id = ?',
                [lastLogin, req.clientIP, user.id],
                (error) => {
                    if (error) {
                        console.error('Erro ao atualizar último login no MySQL:', error);
                    }
                }
            );

            res.status(200).json({ token, message: 'Login bem-sucedido' });
        }
    );
});

// Rota para adicionar tarefa
app.post('/Projetos/To-Do-List/todos', authenticateJWT, (req, res) => {
    const { text, priority, date } = req.body;
    const userId = req.user.id;

    dbConnection.query(
        'INSERT INTO todos (user_id, text, priority, date) VALUES (?, ?, ?, ?)',
        [userId, text, priority, date],
        (error, results) => {
            if (error) {
                console.error('Erro ao adicionar tarefa no MySQL:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json({ message: 'Tarefa adicionada com sucesso', task: { id: results.insertId, text, priority, date, isCompleted: false } });
        }
    );
});

// Rota para obter tarefas
app.get('/Projetos/To-Do-List/todos', authenticateJWT, (req, res) => {
    const userId = req.user.id;

    dbConnection.query(
        'SELECT * FROM todos WHERE user_id = ?',
        [userId],
        (error, results) => {
            if (error) {
                console.error('Erro ao obter tarefas do MySQL:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json({ todos: results, username: req.user.username });
        }
    );
});

// Rota para atualizar tarefa
app.put('/Projetos/To-Do-List/todos/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    const { text, priority, date, isCompleted } = req.body;
    const userId = req.user.id;

    dbConnection.query(
        'UPDATE todos SET text = ?, priority = ?, date = ?, is_completed = ? WHERE id = ? AND user_id = ?',
        [text, priority, date, isCompleted, id, userId],
        (error) => {
            if (error) {
                console.error('Erro ao atualizar tarefa no MySQL:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json({ message: 'Tarefa atualizada com sucesso' });
        }
    );
});

// Rota para deletar tarefa
app.delete('/Projetos/To-Do-List/todos/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    dbConnection.query(
        'DELETE FROM todos WHERE id = ? AND user_id = ?',
        [id, userId],
        (error) => {
            if (error) {
                console.error('Erro ao deletar tarefa no MySQL:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json({ message: 'Tarefa deletada com sucesso' });
        }
    );
});

// Deletar contas inativas após 7 dias
setInterval(() => {
    const oneWeekAgo = moment().tz('America/Sao_Paulo').subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss');
    dbConnection.query(
        'DELETE FROM users WHERE last_login < ?',
        [oneWeekAgo],
        (error) => {
            if (error) {
                console.error('Erro ao deletar contas inativas no MySQL:', error);
            }
        }
    );
}, 86400000); // Executa a cada 24 horas

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});


// Middleware para registrar visitas
app.use(async (req, res, next) => {
    const { clientIP } = req;
    const userAgent = req.headers['user-agent'];
    const referrer = req.headers['referer'] || '';
    const visitTime = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');

    try {
        const oneWeekAgo = moment().tz('America/Sao_Paulo').subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss');
        const existingVisit = await new Promise((resolve, reject) => {
            dbConnection.query(
                'SELECT id FROM visitantes WHERE ip = ? AND visit_time > ?',
                [clientIP, oneWeekAgo],
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results.length > 0);
                    }
                }
            );
        });

        if (!existingVisit) {
            dbConnection.query(
                'INSERT INTO visitantes (ip, user_agent, referrer, visit_time) VALUES (?, ?, ?, ?)',
                [clientIP, userAgent, referrer, visitTime],
                (error, results) => {
                    if (error) {
                        console.error('Erro ao registrar visita no MySQL:', error);
                    }
                }
            );
        }
    } catch (error) {
        console.error('Database error:', error);
    }

    try {
        const oneWeekAgo = moment().tz('America/Sao_Paulo').subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss');
        dbConnection.query(
            'DELETE FROM visitantes WHERE visit_time < ?',
            [oneWeekAgo],
            (error, results) => {
                if (error) {
                    console.error('Erro ao deletar visitas antigas no MySQL:', error);
                }
            }
        );
    } catch (error) {
        console.error('Database error:', error);
    }

    next();
});

// Rotas para registro de visitas
app.post('/registrar-visita', (req, res) => {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.body.userAgent;
    const referrer = req.body.referrer;
    const visitTime = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');

    dbConnection.query(
        'INSERT INTO visitantes (ip, user_agent, referrer, visit_time) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE user_agent = ?, referrer = ?, visit_time = ?',
        [clientIP, userAgent, referrer, visitTime, userAgent, referrer, visitTime],
        (error) => {
            if (error) {
                console.error('Erro ao registrar visita no MySQL:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json({ message: 'Visita registrada com sucesso' });
        }
    );
});

setInterval(() => {
    const oneWeekAgo = moment().tz('America/Sao_Paulo').subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss');
    dbConnection.query(
        'DELETE FROM visitantes WHERE visit_time < ?',
        [oneWeekAgo],
        (error) => {
            if (error) {
                console.error('Erro ao deletar visitas antigas no MySQL:', error);
            }
        }
    );
}, 86400000); // Executa a cada 24 horas
