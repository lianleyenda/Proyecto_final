import pytest
from api.app import app  # Importa tu aplicación Flask

# Configurar el cliente para realizar solicitudes de prueba
@pytest.fixture #Fixture en pytest es una función que se utiliza para preparar 
#y devolver algún recurso o dato que pueda ser utilizado en tus pruebas
def client():#la fucnion que va a simular las peticiones
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