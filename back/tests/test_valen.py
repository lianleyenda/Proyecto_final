

###verificamos que el registro sea exitoso. 

#definimos una funcion test, y ponemos clien para que sepa que es un cliente prueba
def test_registro_exitoso(client, email_unico): 
##crea un diccionario. Simula enviar un registro para probarlo.  
    datos = {
        "Usuario": "alteenTest",
        "Email": f"Prue_{email_unico}",
        "Password": "123"
    }
##hace una peticion post al endpoint registro     
    response = client.post("/registro", json=datos)
 ##verifica que el codigo respuesta sea un 201 que seria "creado con exito"    
    assert response.status_code == 201
##covierte la respuesta del servidor para poder leer su contenido.    
    data = response.get_json()
##comprueba que el servidor responda con    
##verifica si es true o false= assert.
    assert "Usuario registrado con éxito" in data["mensaje"]
    # print(response.get_json())
    


def test_registro_campos_incompletos(client):
    # No enviamos todos los campos (falta "Password")
    datos = {
        "Usuario": "TestSinPassword",
        "Email": "correo@prueba.com"
    }
    response = client.post("/registro", json=datos)
    # Debe devolver código 400 (Bad Request)
    assert response.status_code == 400
    data = response.get_json()
    # Verificamos que el mensaje sea el correcto
    assert data["mensaje"] == "Faltan datos"
    # print(response.get_json())


    
    
def test_promociones(client):
    """Test para el endpoint '/Promociones' que lista las promociones"""
    response = client.get('/Promociones')
    # Debe responder OK
    assert response.status_code == 200
    assert response.is_json
    promociones = response.get_json()
    # Verifica que la respuesta sea una lista
    assert isinstance(promociones, list)
    # Verifica que exista al menos una promoción
    assert len(promociones) > 0
    # Toma la primera promoción
    promo = promociones[0]
    # Verifica que tenga las claves esperadas
    assert "id" in promo
    assert "nombre" in promo
    assert "descripcion" in promo
    assert "precio" in promo
    assert "productos" in promo
    # Nuevo: Verifica que el nombre contenga "Combo"
    assert "Combo" in promo["nombre"]




    
def test_obtener_promocion_por_id(client):
    """Test para el endpoint '/Promociones/<id>' que obtiene una promoción específica"""
#Hacemos la solicitud GET con un ID existente (por ejemplo, 1)
    response = client.get("/Promociones/1")
#Verificamos que el código de estado sea 200 (OK)
    assert response.status_code == 200
#Verificamos que la respuesta sea JSON
    assert response.is_json
#Convertimos la respuesta en formato Python
    data = response.get_json()
#Comprobamos que tenga las claves esperadas
    assert "id" in data
    assert "nombre" in data
    assert "descripcion" in data
    assert "precio" in data
    assert "productos" in data
#comprobamos que el id sea 1
    assert data["id"] == 1 or data["nombre"] == "ComboGordo"





def test_guardar_contacto_exitoso(client, email_unico):
    """Test que guarda un mensaje de contacto correctamente"""

    datos = {
        "nombre": "Valentín Test",
        "email": f"{email_unico}",
        "mensaje": "Este es un mensaje de prueba"
    }
    response = client.post("/contacto", json=datos)
    # Verifica que la respuesta sea 201 (creado)
    assert response.status_code == 201
    assert response.is_json
    data = response.get_json()
    assert data["mensaje"] == "Mensaje de contacto guardado exitosamente"


    
def test_guardar_contacto_campos_incompletos(client):
    """Test que falla si faltan campos obligatorios"""
    datos = {
        "nombre": "Valentín Test",
        # "email" falta
        "mensaje": "Mensaje sin email"
    }
    response = client.post("/contacto", json=datos)
    # Debe devolver 400 (Bad Request)
    assert response.status_code == 400
    assert response.is_json
    data = response.get_json()
    assert data["mensaje"] == "Todos los campos son requeridos"





def test_productos_mas_vendidos(client):
    """Test para el endpoint '/productos-mas-vendidos' que devuelve los productos más vendidos"""
    # Realiza una solicitud GET al endpoint
    response = client.get("/productos-mas-vendidos")
    # Verificamos que la respuesta sea exitosa
    assert response.status_code == 200
    assert response.is_json
    # Convertimos la respuesta a formato Python
    data = response.get_json()
    # Verifica que la respuesta sea una lista
    assert isinstance(data, list)
    # Si hay productos, revisamos el primero
    if len(data) > 0:
        producto = data[0]
        # Verifica que tenga las claves esperadas
        assert "Producto" in producto
        assert "total_vendido" in producto
        # Verifica que total_vendido sea un número entero o flotante
        assert isinstance(producto["total_vendido"], (int, float))
        # Verifica que el total vendido sea mayor o igual a 0
        assert producto["total_vendido"] >= 0
    # Verifica que haya 10 o menos resultados
    assert len(data) <= 10


def test_productos_mas_vendidos_vacio(client, mocker):
    """Test que simula el caso cuando no hay productos vendidos"""
    # Simulamos que la base de datos devuelve una lista vacía
    mock_cursor = mocker.MagicMock()
    mock_cursor.fetchall.return_value = []
    mock_conn = mocker.MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    mocker.patch("tu_archivo.get_db", return_value=mock_conn)  
    # 👆 reemplazá "tu_archivo" por el nombre real del archivo donde está la función get_db
    # Llamamos al endpoint
    response = client.get("/productos-mas-vendidos")
    # Verificamos que responda con 200 aunque no haya resultados
    assert response.status_code == 200
    assert response.is_json
    # Debe devolver una lista vacía
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 0

