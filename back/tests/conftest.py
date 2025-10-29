import pytest
from api.app import create_app  # Importa tu aplicación Flask

# Configurar el cliente para realizar solicitudes de prueba
@pytest.fixture #Fixture en pytest es una función que se utiliza para preparar 
#y devolver algún recurso o dato que pueda ser utilizado en tus pruebas
def client():#la fucnion que va a simular las peticiones
    app = create_app()
    with app.test_client() as client:# es uan funcion que devulve un cliente de prueba
        yield client#puede remplazar el returno y cuando termina la prueba vuelve al estado natural


@pytest.fixture(scope="function") # or "class", "module", "session"
def my_fixture():
    print("\nSetup: Initializing resource...")
    resource = "some_resource"
    yield resource  # Yield the resource to the test function
    print("Teardown: Cleaning up resource...")
    "delete * from Usuarios where id_usuario = 999;"
     # Cleanup code here, e.g., closing a database connection, deleting a file

@pytest.fixture   #este codigo define los datos de un nuevo producto
def nuevo_stock():
     """Datos del producto de prueba."""
     return {
        "Producto": "Pan de larbas",
        "Cantidad": 10
     }   

@pytest.fixture #me tra su id para el test de eliminar
def stock_creado(client, nuevo_stock):
     """Crea el stock y devuelve su ID."""
     response = client.post('/stock/agregar', json=nuevo_stock)
     assert response.status_code == 200
     data = response.get_json()

