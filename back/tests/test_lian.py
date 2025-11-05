



def test_menu(client):
    """Test para el endpoint '/menu' que lista los productos"""

    # Realiza la solicitud GET al endpoint '/menu'
    response = client.get('/menu')
    
    # Verifica que el código de estado sea 200
    assert response.status_code == 200
    
    # Verifica que la respuesta sea un JSON (asegúrate que sea la estructura correcta)
    assert response.is_json
    
    # Si tienes datos de ejemplo, puedes verificar que algunos productos estén presentes
    # Ejemplo: Verificar si el nombre de algún producto aparece en la respuesta
    # Esto depende de cómo se almacenen los productos en tu base de datos.
    # Supongamos que hay un producto con el nombre 'Hamburguesa'
    productos = response.get_json()  # Convierte la respuesta en JSON
    assert any(producto['Producto'] == 'Doble LTC' for producto in productos)



def test_agregar_stock_exito(client):
    "Test par el endpoint '/stock/agregar' que agrega productos a la tabla stock"

    nuevo_stock={
    "Producto": "ravioles",
    "Cantidad": 10
             }


    response = client.post('/stock/agregar', json=nuevo_stock)

    assert response.status_code ==  200 #asser es como un true o false si es true da 200
#si es false tira algo com assertError

    assert response.is_json #verivifa que se json con is_json

    stock= response.get_json()
    assert (stock['mensaje'] == "Producto agregado exitosamente")

def test_agregar_stock_productoExistente(client):
    "Test par el endpoint '/stock/agregar' que agrega productos a la tabla stock"

    nuevo_stock={
    "Producto": "Pan francés",
    "Cantidad": 10
             }


    response = client.post('/stock/agregar', json=nuevo_stock)

    assert response.status_code ==  400 #asser es como un true o false si es true da 200
#si es false tira algo com assertError

    assert response.is_json #verivifa que se json con is_json

    stock= response.get_json()
    assert (stock['mensaje'] == "El producto ya está registrado")




def test_eliminar_stock(client):
    """Test para el endpoint DELETE /stock/<id>"""

    # Paso 1: Crear un stock (producto) en la base de datos
    data_crear = {"Producto": "jamon serrano", "Cantidad": 10}
    response_crear = client.post('/stock/agregar', json=data_crear)
    
    # Verificar que la creación del stock fue exitosa
    assert response_crear.status_code == 200
    assert response_crear.is_json
    
    data_creado = response_crear.get_json()
    stock_creado_id = data_creado['id']  # Obtener el ID del stock creado
    
    # Paso 2: Ejecutar la petición DELETE usando el ID recién creado
    response_eliminar = client.delete(f'/stock/{stock_creado_id}')

    # Verificar que la respuesta sea exitosa
    assert response_eliminar.status_code == 200
    assert response_eliminar.is_json
    
    data_eliminado = response_eliminar.get_json()
    assert data_eliminado["mensaje"] == f"Stock con ID {stock_creado_id} eliminado correctamente"
    
    # Paso 3: Verificar que el stock ha sido efectivamente eliminado
    # Intentamos obtener el producto que acabamos de eliminar
  
    
    # Verificamos que al intentar obtenerlo, el stock no existe (suponiendo que la API devuelve 404 si no existe)
  
  


def test_modificar_usuario_exitoso(client, db, email_unico ):
    """Prueba que se modifique correctamente un usuario existente"""

    
    cursor = db.cursor()


     

    # Insertamos un usuario temporal
    cursor.execute("INSERT INTO Usuarios (Usuario, Email, Password) VALUES (%s, %s, %s)", 
                   ("usuario_original", email_unico, "1234"))
    id_usuario = cursor.lastrowid
    db.commit()

    # Datos modificados
    data = {
        "Usuario": "usuario_modificado",
        "Email": f"mod_{email_unico}",
        "Password": "123"
    }

    # Ejecutamos el PUT
    response = client.put(f"/inicio/cambiar/{id_usuario}", json=data)

    # Verificaciones
    assert response.status_code == 200
    assert "Usuario con ID" in response.get_json()["mensaje"]

def test_carrito(client):
    """Test para el endpoint '/menu' que lista los productos"""
    with client.session_transaction() as sess:
        sess['carrito'] = [
            {"Producto": "Juguete", "Costo": "100", "cantidad": 2},
            {"Producto": "Libro", "Costo": "50", "cantidad": 1},
        ]

    # Realiza la solicitud GET al endpoint '/menu'
    response = client.get('/carrito')
    
    # Verifica que el código de estado sea 200
    assert response.status_code == 200
    
    # Verifica que la respuesta sea un JSON (asegúrate que sea la estructura correcta)
    assert response.is_json
    
    # Si tienes datos de ejemplo, puedes verificar que algunos productos estén presentes
    # Ejemplo: Verificar si el nombre de algún producto aparece en la respuesta
    # Esto depende de cómo se almacenen los productos en tu base de datos.
    # Supongamos que hay un producto con el nombre 'Hamburguesa'
    productos = response.get_json()  # Convierte la respuesta en JSON
    assert len(productos["carrito"]) == 2
    assert productos["carrito"][0]["Producto"] == "Juguete"
    assert productos["carrito"][1]["Producto"] == "Libro"

    # Verificamos el total
    assert productos["total"] == 250.0





