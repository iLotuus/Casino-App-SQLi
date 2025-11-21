# Guía para Subir a GitHub y Descargar en Ubuntu

Sigue estos pasos para subir tu proyecto a GitHub y luego descargarlo en tu servidor Ubuntu.

## Parte 1: Subir el Código a GitHub (Desde tu PC Local)

1.  **Crea un Nuevo Repositorio en GitHub**:
    *   Ve a [github.com/new](https://github.com/new).
    *   Ponle un nombre (ej: `casino-app`).
    *   Déjalo como **Público** o **Privado** (si es privado, necesitarás configurar claves SSH o usar token en Ubuntu).
    *   **NO** inicialices con README, .gitignore o licencia (ya los tenemos).
    *   Haz clic en **Create repository**.

2.  **Inicializa Git y Sube los Archivos**:
    Abre una terminal en la carpeta de tu proyecto (`c:\Casino`) y ejecuta:

    ```bash
    # 1. Inicializar repositorio (si no lo has hecho)
    git init

    # 2. Agregar todos los archivos
    git add .

    # 3. Crear el primer commit
    git commit -m "Initial commit: Casino app with Admin Panel and MySQL support"

    # 4. Renombrar la rama principal a 'main'
    git branch -M main

    # 5. Conectar con tu repositorio remoto (REEMPLAZA TU_USUARIO)
    # Copia la URL que te dio GitHub en el paso 1
    git remote add origin https://github.com/TU_USUARIO/casino-app.git

    # 6. Subir los cambios
    git push -u origin main
    ```

## Parte 2: Descargar e Instalar en Ubuntu

1.  **Conéctate a tu servidor Ubuntu**.

2.  **Clona el Repositorio**:
    ```bash
    # Si es público:
    git clone https://github.com/TU_USUARIO/casino-app.git

    # Si es privado, te pedirá usuario y contraseña (token personal)
    ```

3.  **Entra a la carpeta**:
    ```bash
    cd casino-app
    ```

4.  **Ejecuta el Script de Instalación Automática**:
    He creado un script que hace todo por ti (instalar Node, MySQL, dependencias, etc.).

    ```bash
    # Dar permisos de ejecución
    chmod +x install_ubuntu.sh

    # Ejecutar el instalador
    ./install_ubuntu.sh
    ```

5.  **Verificación**:
    Si todo sale bien, el script te dirá que la instalación fue exitosa.
    Podrás iniciar el servidor con `node server.cjs`.

## Nota de Seguridad
El archivo `database/setup_db.sh` contiene una contraseña de base de datos por defecto. Si este proyecto es público, cualquiera podrá verla.
*   **Recomendación**: Cambia la contraseña en tu servidor Ubuntu después de la instalación o usa variables de entorno.
