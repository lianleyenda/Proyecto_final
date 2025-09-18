#!/bin/bash

# Detener el script si algo falla
set -e

# Crear entorno virtual si no existe
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi

# Activar entorno virtual
. .venv/bin/activate

# Instalar dependencias
pip install --upgrade pip
pip install flask
pip install mysql-connector-python
pip install python-dotenv

