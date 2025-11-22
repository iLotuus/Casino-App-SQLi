require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database-mysql.cjs');
const { exec } = require('child_process');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'super_secret_casino_key'; // In production, use env var
const USE_HASHING = false; // CAMBIAR A TRUE PARA HABILITAR HASHING (false = texto plano para pruebas)

app.use(cors());
app.use(express.json());

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    // --- INICIO: BLOQUE DE CÓDIGO INSEGURO (SOLO PARA PRUEBAS) ---

    // Comenta o elimina la verificación segura
    // jwt.verify(token, SECRET_KEY, (err, user) => {
    //     if (err) return res.sendStatus(403);
    //     req.user = user;
    //     next();
    // });

    // Decodifica el token SIN verificar la firma
    const decodedToken = jwt.decode(token);

    if (decodedToken) {
        req.user = decodedToken;
        next();
    } else {
        return res.sendStatus(403); // Falla si el token no es un JWT válido
    }

    // --- FIN: BLOQUE DE CÓDIGO INSEGURO ---
};

// Register
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    // const hashedPassword = bcrypt.hashSync(password, 8);
    const hashedPassword = USE_HASHING ? bcrypt.hashSync(password, 8) : password;

    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function (err) {
        if (err) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const token = jwt.sign({ id: this.lastID, username, is_admin: false }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token, user: { id: this.lastID, username, balance: 1000.00, is_admin: false } });
    });
});

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        if (!user) return res.status(404).json({ error: 'User not found' });

        let passwordIsValid;
        if (USE_HASHING) {
            passwordIsValid = bcrypt.compareSync(password, user.password);
        } else {
            passwordIsValid = password === user.password;
        }

        if (!passwordIsValid) return res.status(401).json({ token: null, error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, username: user.username, is_admin: user.is_admin }, SECRET_KEY, { expiresIn: '24h' });
        // Convert balance from string to number (MySQL returns DECIMAL as string)
        const balance = parseFloat(user.balance) || 0;
        res.json({ token, user: { id: user.id, username: user.username, balance: balance, is_admin: user.is_admin } });
    });
});

// Get User Data (Balance)
app.get('/api/user', authenticateToken, (req, res) => {
    db.get(`SELECT id, username, balance, is_admin FROM users WHERE id = ?`, [req.user.id], (err, user) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        // Convert balance from string to number (MySQL returns DECIMAL as string)
        user.balance = parseFloat(user.balance) || 0;
        // Ensure is_admin is boolean
        user.is_admin = !!user.is_admin;
        res.json(user);
    });
});

// Deposit
app.post('/api/deposit', authenticateToken, (req, res) => {
    const { amount } = req.body;

    // Validación mínima para permitir SQL injection en demos académicas
    if (!amount) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    // INICIO DE LA VULNERABILIDAD
    // Se concatenan las variables directamente en la consulta SQL.
    // ¡Esto es extremadamente peligroso!
    // USO DIRECTO DE 'amount' para permitir inyección SQL en el campo description
    const updateQuery = `UPDATE users SET balance = balance + 100 WHERE id = ${req.user.id}`;
    const insertQuery = `INSERT INTO transactions (user_id, type, amount, date, description) VALUES (${req.user.id}, 'deposit', 100, NOW(), ${amount})`;
    const selectQuery = `SELECT balance FROM users WHERE id = ${req.user.id}`;
    const getTransactionQuery = `SELECT description FROM transactions WHERE user_id = ${req.user.id} ORDER BY id DESC LIMIT 1`;

    db.serialize(() => {
        // Se ejecutan las consultas construidas de forma insegura.
        db.run(updateQuery);

        // Esperar a que el INSERT termine antes de leer
        db.run(insertQuery, function (err) {
            db.get(selectQuery, (err, row) => {
                const balance = row?.balance ?? 0;

                // Leer description de la transacción para exfiltración de datos
                db.get(getTransactionQuery, (err, transaction) => {
                    const txDesc = transaction?.description || 'Deposit';
                    // Mostrar la descripción en el mensaje (permite ver datos exfiltrados)
                    const message = `Depósito exitoso: ${txDesc}`;
                    res.json({ balance: balance, message: message });
                });
            });
        });
    });
    // FIN DE LA VULNERABILIDAD
});

// Get User Transactions
app.get('/api/transactions', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM transactions WHERE user_id = ? ORDER BY id DESC LIMIT 10`, [req.user.id], (err, transactions) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json(transactions || []);
    });
});

// Withdraw
app.post('/api/withdraw', authenticateToken, (req, res) => {
    const { amount } = req.body;

    // Validación mínima para permitir SQL injection en demos académicas
    if (!amount) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    // INICIO DE LA VULNERABILIDAD
    // Se concatenan las variables directamente en la consulta SQL.
    const selectBalanceQuery = `SELECT balance FROM users WHERE id = ${req.user.id}`;

    db.get(selectBalanceQuery, (err, user) => {
        // Skip balance check for SQL injection demo (allows negative amounts)
        // if (user.balance < parseFloat(amount)) {
        //     return res.status(400).json({ error: 'Insufficient funds' });
        // }

        db.serialize(() => {
            // USO DIRECTO DE 'amount' SIN parseFloat() para permitir inyección SQL
            const updateQuery = `UPDATE users SET balance = balance - ${amount} WHERE id = ${req.user.id}`;
            const insertQuery = `INSERT INTO transactions (user_id, type, amount, date, description) VALUES (${req.user.id}, 'withdraw', ${amount}, NOW(), 'Withdrawal')`;
            const finalSelectQuery = `SELECT balance FROM users WHERE id = ${req.user.id}`;
            const getTransactionQuery = `SELECT description, amount FROM transactions WHERE user_id = ${req.user.id} ORDER BY id DESC LIMIT 1`;

            // Se ejecutan las consultas construidas de forma insegura.
            db.run(updateQuery);
            db.run(insertQuery);

            db.get(finalSelectQuery, (err, row) => {
                const balance = row?.balance ?? 0;

                // Obtener la descripción para exfiltración de datos
                db.get(getTransactionQuery, (err, transaction) => {
                    const message = transaction?.description
                        ? `Has retirado correctamente. ${transaction.description}`
                        : 'Withdrawal successful';
                    res.json({ balance: balance, message: message });
                });
            });
        });
    });
    // FIN DE LA VULNERABILIDAD
});

// Slots Spin
app.post('/api/slots/spin', authenticateToken, (req, res) => {
    const { bet } = req.body;
    const numericBet = parseFloat(bet);

    if (isNaN(numericBet) || numericBet <= 0) {
        return res.status(400).json({ error: 'Invalid bet amount' });
    }

    db.get(`SELECT balance FROM users WHERE id = ?`, [req.user.id], (err, user) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        if (user.balance < numericBet) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        const symbols = ["🍒", "🍋", "🔔", "💎", "7️⃣", "⭐"];
        const reels = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];

        let winAmount = 0;
        let winType = null;

        if (reels[0] === reels[1] && reels[1] === reels[2]) {
            winAmount = numericBet * 10;
            winType = 'JACKPOT';
        } else if (reels[0] === reels[1] || reels[1] === reels[2]) {
            winAmount = numericBet * 2;
            winType = 'WIN';
        }

        const netChange = winAmount - numericBet;

        db.serialize(() => {
            // Deduct bet
            db.run(`UPDATE users SET balance = balance - ? WHERE id = ?`, [numericBet, req.user.id]);
            // Add winnings (if any)
            if (winAmount > 0) {
                db.run(`UPDATE users SET balance = balance + ? WHERE id = ?`, [winAmount, req.user.id]);
            }

            // Record transactions
            db.run(`INSERT INTO transactions (user_id, type, amount, date, description) VALUES (?, 'bet', ?, datetime('now'), 'Slots Bet')`,
                [req.user.id, numericBet]);

            if (winAmount > 0) {
                db.run(`INSERT INTO transactions (user_id, type, amount, date, description) VALUES (?, 'win', ?, datetime('now'), ?)`,
                    [req.user.id, winAmount, `Slots Win (${winType})`]);
            }

            db.get(`SELECT balance FROM users WHERE id = ?`, [req.user.id], (err, row) => {
                res.json({
                    balance: row.balance,
                    reels,
                    winAmount,
                    winType
                });
            });
        });
    });
});



// Admin Middleware
const authenticateAdmin = (req, res, next) => {
    authenticateToken(req, res, () => {
        if (req.user && req.user.is_admin) {
            next();
        } else {
            res.status(403).json({ error: 'Access denied. Admin only.' });
        }
    });
};

// Admin: Get all users
app.get('/api/admin/users', authenticateAdmin, (req, res) => {
    db.all(`SELECT id, username, balance, is_admin FROM users`, [], (err, users) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        // Convert balance from string to number for MySQL compatibility
        const usersWithParsedBalance = users.map(user => ({
            ...user,
            balance: parseFloat(user.balance) || 0
        }));
        res.json(usersWithParsedBalance);
    });
});

// Admin: Update user balance
app.post('/api/admin/users/:id/balance', authenticateAdmin, (req, res) => {
    const userId = req.params.id;
    const { amount } = req.body;
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount)) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    db.run(`UPDATE users SET balance = ? WHERE id = ?`, [numericAmount, userId], function (err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Balance updated successfully', balance: numericAmount });
    });
});

// Admin: Terminal (Command Execution)
app.post('/api/admin/terminal', authenticateAdmin, (req, res) => {
    const { command } = req.body;

    // Execute command in the server's directory
    exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            return res.json({ output: `Error: ${error.message}` });
        }
        if (stderr) {
            return res.json({ output: `Stderr: ${stderr}` });
        }
        res.json({ output: stdout });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
