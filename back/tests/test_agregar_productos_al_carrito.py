import json
from flask import jsonify


def test_menu(client):
    response = client.post("/carrito/agregar_producto/2")
    assert response.status_code == 200

    response = client.get("/carrito")
    assert response.status_code == 200
    datos = response.get_json()

    assert len(datos['carrito']) >= 1
