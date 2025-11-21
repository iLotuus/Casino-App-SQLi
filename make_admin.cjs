const db = require('./database.cjs');

const username = process.argv[2];

if (!username) {
    console.error('Por favor proporciona un nombre de usuario.');
    console.log('Uso: node make_admin.js <username>');
    process.exit(1);
}

console.log(`Intentando hacer administrador al usuario: ${username}...`);

// Wait a bit for DB connection to open
setTimeout(() => {
    db.run(`UPDATE users SET is_admin = 1 WHERE username = ?`, [username], function (err) {
        if (err) {
            console.error('Error al actualizar:', err.message);
        } else if (this.changes === 0) {
            console.log('No se encontró el usuario o ya es administrador.');
        } else {
            console.log(`¡Éxito! El usuario '${username}' ahora es administrador.`);
        }
        // Close isn't strictly necessary as process will exit, but good practice if we had a handle
        // db object in database.cjs doesn't expose close easily without raw access, 
        // but the process exit will handle it.
    });
}, 1000);
