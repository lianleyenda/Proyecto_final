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
#pipenv install --upgrade pipenv
pipenv install flask
pipenv install mysql-connector-python
pipenv install python-dotenv
pipenv install flask-cors
pipenv install werkzeug
pipenv install pytest pytest-flask


