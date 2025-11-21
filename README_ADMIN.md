# Guía de Administración del Casino

## Panel de Administración
El panel de administración está disponible en `/admin` (ej: `http://localhost:5173/admin`).
Solo los usuarios con el rol de administrador pueden acceder.

### Funcionalidades:
1.  **Ver Usuarios**: Lista de todos los usuarios registrados, sus saldos y roles.
2.  **Editar Saldo**: Permite modificar el saldo de cualquier usuario.
3.  **Terminal del Sistema**: Una mini-terminal que permite ejecutar comandos del sistema en el servidor (ej: `ls`, `cat server.cjs`).

## Cómo Promover un Usuario a Administrador

### Opción 1: SQLite (Entorno Local por defecto)
Si estás usando la base de datos SQLite (por defecto), usa el script `make_admin.cjs`:

```bash
node make_admin.cjs <nombre_de_usuario>
```

Ejemplo:
```bash
node make_admin.cjs admin
```

### Opción 2: MySQL (Entorno Ubuntu/Producción)
Si has migrado a MySQL, usa el script `make_admin_mysql.sh`:

1. Dale permisos de ejecución al script:
   ```bash
   chmod +x make_admin_mysql.sh
   ```

2. Ejecuta el script:
   ```bash
   ./make_admin_mysql.sh <nombre_de_usuario>
   ```

Ejemplo:
```bash
./make_admin_mysql.sh admin
```

Alternativamente, puedes hacerlo manualmente accediendo a MySQL:
```sql
sudo mysql -e "USE casino_db; UPDATE users SET is_admin = TRUE WHERE username = 'admin';"
```
