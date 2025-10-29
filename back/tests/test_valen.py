

###verificamos que el registro sea exitoso. 

#definimos una funcion test, y ponemos clien para que sepa que es un cliente prueba
def test_registro_exitoso(client): 
##crea un diccionario. Simula enviar un registro para probarlo.  
    datos = {
        "Usuario": "alteenTest",
        "Email": "lenetntest@gmail.com",
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
    print(response.get_json())

    
    

##test para verificar que me traiga todas las promociones.    
def test_promociones(client):
    """Test para el endpoint '/Promociones' que lista las promociones"""
#  Realiza la solicitud GET al endpoint '/Promociones'
    response = client.get('/Promociones')
#  Verifica que el código de estado sea 200 (OK)
    assert response.status_code == 200
# Verifica que la respuesta sea JSON
    assert response.is_json
# Convierte la respuesta a formato Python (lista de promociones)
    promociones = response.get_json()
#  Verifica que sea una lista
    assert isinstance(promociones, list)
# Si hay promociones, comprobá que tengan las claves esperadas
    if len(promociones) > 0:##si promociones tien al menos un elemento
        promo = promociones[0]
        assert "id" in promo
        assert "nombre" in promo
        assert "descripcion" in promo
        assert "precio" in promo
        assert "productos" in promo





    
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
#(Opcional) Verificamos que sea la promoción correcta
    assert data["id"] == 1 or data["nombre"] == "ComboGordo"
        
