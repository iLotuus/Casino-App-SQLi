#!/bin/bash

if [ -z "$1" ]; then
  echo "Por favor proporciona un nombre de usuario."
  echo "Uso: ./make_admin_mysql.sh <username>"
  exit 1
fi

USERNAME=$1

echo "Intentando hacer administrador al usuario: $USERNAME en MySQL..."

sudo mysql -e "USE casino_db; UPDATE users SET is_admin = TRUE WHERE username = '$USERNAME';"

if [ $? -eq 0 ]; then
  echo "¡Comando ejecutado! Verifica si el usuario existe y fue actualizado."
else
  echo "Error al ejecutar el comando MySQL."
fi
