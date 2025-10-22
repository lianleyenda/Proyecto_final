import pytest
from app import app, get_db  # Importa tu aplicación Flask

# Configurar el cliente para realizar solicitudes de prueba
@pytest.fixture #Fixture en pytest es una función que se utiliza para preparar 
#y devolver algún recurso o dato que pueda ser utilizado en tus pruebas
def client():#la fucnion que va a simular las peticiones
    with app.test_client() as client:# es uan funcion que devulve un cliente de prueba
        yield client#puede remplazar el returno y cuando termina la prueba vuelve al estado natural

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

def test_agregar_stock(client):
    "Test par el endpoint '/stock/agregar' que agrega productos a la tabla stock"

    nuevo_stock ={
        "Producto": "Pan de larbas",
        "Cantidad": 10

    }




    response = client.post('/stock/agregar', json=nuevo_stock)

    assert response.status_code ==  200 #asser es como un true o false si es true da 200
#si es false tira algo com assertError

    assert response.is_json #verivifa que se json con is_json

    stock= response.get_json()
    assert (stock['mensaje'] == "Producto agregado exitosamente")




