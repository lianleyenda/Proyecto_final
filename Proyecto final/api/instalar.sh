#!/bin/sh

python -m venv .venv
. .venv/bin/activate
pip install flask
pip install mysql-connector-python

