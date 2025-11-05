import pytest
from api.app import create_app , get_db   # Importa tu aplicación Flask
import uuid

# # Configurar el cliente para realizar solicitudes de prueba
# @pytest.fixture #Fixture en pytest es una función que se utiliza para preparar 
# #y devolver algún recurso o dato que pueda ser utilizado en tus pruebas
# def client():#la fucnion que va a simular las peticiones
#     app = create_app()
#     with app.test_client() as client:# es uan funcion que devulve un cliente de prueba
#         yield client#puede remplazar el returno y cuando termina la prueba vuelve al estado natural


@pytest.fixture
def app():
    """Crea y configura la app Flask para pytest-flask"""
    app = create_app()
    app.config.update({
        "TESTING": True,
        'SECRET_KEY' : 'testkey'
    })
    yield app


@pytest.fixture
def client(app):
    """Devuelve un cliente de prueba"""
    """Devuelve un cliente de prueba con carrito inicializado"""
    with app.test_client() as client:
        # Inicializamos carrito vacío antes de cada test
        with client.session_transaction() as sess:
            sess['carrito'] = []
        yield client
        # Limpiamos el carrito después de cada test
        with client.session_transaction() as sess:
            sess['carrito'] = []

    return app.test_client()



@pytest.fixture(scope="function") # or "class", "module", "session"
def my_fixture():
    print("\nSetup: Initializing resource...")
    resource = "some_resource"
    yield resource  # Yield the resource to the test function
    print("Teardown: Cleaning up resource...")
    "delete * from Usuarios where id_usuario = 999;"
     # Cleanup code here, e.g., closing a database connection, deleting a file




@pytest.fixture
def db(app):
    """Devuelve una conexión activa a la base de datos dentro del contexto"""
    with app.app_context():
        db = get_db()
        yield db



@pytest.fixture
def email_unico():
    """Genera un email único para tests"""
    return f"test_{uuid.uuid4().hex[:8]}@example.com"
