



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



def test_agregar_stock(client, nuevo_stock):
    "Test par el endpoint '/stock/agregar' que agrega productos a la tabla stock"




    response = client.post('/stock/agregar', json=nuevo_stock)

    assert response.status_code ==  200 #asser es como un true o false si es true da 200
#si es false tira algo com assertError

    assert response.is_json #verivifa que se json con is_json

    stock= response.get_json()
    assert (stock['mensaje'] == "Producto agregado exitosamente")


def test_eliminar_stock(client, stock_creado):
    """Test para el endpoint DELETE /stock/<id>"""

    # Ejecutamos la petición DELETE usando el ID recién creado
    response = client.delete(f'/stock/{stock_creado}')

    # Verificamos que la respuesta sea exitosa
    assert response.status_code == 200
    assert response.is_json

    data = response.get_json()
    assert data["mensaje"] == f"Stock con ID {stock_creado} eliminado correctamente"

  



