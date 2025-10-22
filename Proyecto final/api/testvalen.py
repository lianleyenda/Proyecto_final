import pytest
from app import app,get_db  # 👈 importás directamente la instancia desde app.py
import json



##crea un cliente para simular las rutas sin levantar un servidor real
@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_registro_exitoso(client):
    payload = {
        "Usuario": "TestUser",
        "Email": "testuservisual@gmail.com",
        "Password": "123456"
    }
    response = client.post("/registro", json=payload)
    assert response.status_code == 201
    data = response.get_json()
    assert "Usuario registrado con éxito" in data["mensaje"]
    
#def test_agregar_stock(client):
    # JSON de ejemplo que vamos a enviar
  #  nuevo_stock = {
   #     "Producto": "Hamburguesa doble",
    #    "Cantidad": 10
    #}

    # Hacemos POST al endpoint
    #@response = client.post(
    #  "/stock/agregar",
     #   data=json.dumps(nuevo_stock),
    #    content_type="application/json"
    #)

    # Revisamos que devolvió el mensaje correcto
    #assert response.status_code == 200