#!/bin/bash

# Configuración
PORT=4200
ELECTRON_PID=""
NG_PID=""
TSC_PID=""

# Función para limpiar procesos al salir
cleanup() {
    echo "Cerrando procesos..."
    kill -9 $NG_PID $TSC_PID $ELECTRON_PID 2>/dev/null
    exit 0
}

# Registrar la función cleanup para ejecutarse al recibir SIGINT (Ctrl+C) o SIGTERM
trap cleanup SIGINT SIGTERM

# 1. Compilar TypeScript de Electron
echo "Compilando archivos de Electron..."
tsc

# 2. Iniciar TypeScript en watch mode (segundo plano)
echo "Iniciando watch de TypeScript..."
tsc --watch &
TSC_PID=$!

# 3. Iniciar Angular (segundo plano)
echo "Iniciando servidor de Angular..."
ng serve --port $PORT &
NG_PID=$!

# 4. Esperar a que Angular esté listo
echo "Esperando a que Angular esté disponible..."
until curl -s http://localhost:$PORT >/dev/null; do
    sleep 1
done

# 5. Iniciar Electron
echo "Iniciando Electron..."
electron . &
ELECTRON_PID=$!

# Esperar a que Electron termine (cuando la ventana se cierra)
wait $ELECTRON_PID

# 6. Limpiar procesos al salir (Electron cerró la ventana)
cleanup