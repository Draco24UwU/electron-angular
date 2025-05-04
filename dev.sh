#!/bin/bash

# Puerto en el que ng serve escucha (normalmente 4200)
PORT=4200

# Función para verificar si el puerto está en uso
wait_for_port() {
    echo "Esperando a que el servidor de Angular esté listo..."
    until curl -s http://localhost:$PORT >/dev/null; do
        sleep 1
    done
    echo "¡Servidor de Angular listo!"
}

# Ejecutar ng serve en segundo plano
ng serve &

# Guardar el PID del proceso de ng serve
NG_PID=$!

# Esperar a que el puerto esté activo
wait_for_port

# Ahora ejecutar Electron
electron . &

# Guardar el PID del proceso de electron
ELECTRON_PID=$!

# Configurar la captura de Ctrl+C para matar ambos procesos
trap "kill $NG_PID $ELECTRON_PID" SIGINT

# Esperar a que ambos procesos terminen (normalmente se quedará esperando hasta Ctrl+C)
wait $NG_PID $ELECTRON_PID