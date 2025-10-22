import pytest
from app import app,get_db  # 👈 importás directamente la instancia desde app.py
import json



##crea un cliente para simular las rutas sin levantar un servidor real
@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_agregar_stock(client):
    # 1️⃣ Datos que vamos a enviar
    nuevo_stock = {
        "Producto": "Hamburguesa Test",
        "Cantidad": 10
    }

    # 2️⃣ Hacemos POST al endpoint
    response = client.post('/stock/agregar', json=nuevo_stock)
    assert response.status_code == 200
    assert b"funciono" in response.data

    # 3️⃣ Verificamos que se insertó en la base de datos
    db = get_db()
    # 🔹 Usamos buffered=True para evitar "Unread result found"
    cursor = db.cursor(dictionary=True, buffered=True)
    cursor.execute(
        "SELECT * FROM Stock WHERE Producto = %s AND Cantidad = %s",
        (nuevo_stock["Producto"], nuevo_stock["Cantidad"])
    )
    resultados = cursor.fetchall()  # 🔹 Traemos todos los resultados
    resultado = resultados[0] if resultados else None
    cursor.close()
    db.close()

    # 🔹 Aseguramos que se haya insertado correctamente
    assert resultado is not None
    assert resultado['Producto'] == nuevo_stock["Producto"]
    assert resultado['Cantidad'] == nuevo_stock["Cantidad"]

    # 4️⃣ Limpieza: eliminamos el registro creado
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM Stock WHERE id_Stock = %s", (resultado['id_Stock'],))
    db.commit()
    cursor.close()
    db.close()

    
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