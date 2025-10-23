import mysql.connector
from flask import Flask, g, request, jsonify, session, redirect, url_for, render_template
from dotenv import load_dotenv
from flask_cors import CORS
import os
request
from werkzeug.security import generate_password_hash, check_password_hash



load_dotenv()#lee la funciones

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

data = {
   'host': os.getenv("DB_HOST"),
   'port': int(os.getenv("DB_PORT")),
   'user': os.getenv("DB_USER"),
   'password': os.getenv("DB_PASS"),
   'database': os.getenv("DB_NAME")
}


# Datos de conexión


# Crear conexión


#crea la conxion
def get_db():
    conn = mysql.connector.connect(**data)
    return conn





#lian
@app.route('/menu', methods=['GET'])
def listar_productos():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute('SELECT * FROM Productos')
    resultado = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(resultado)  # 🔹 Solo la lista


#lian
@app.route('/stock/agregar', methods=['POST'])
def agregar():
    """
    Endpoint para agregar un nuevo registro de Stock.
    Recibe los datos en formato JSON con dos campos:
      - Producto: nombre del producto
      - Cantidad: cantidad de unidades del producto
    """
    
    # 📥 Obtener los datos enviados por el cliente en formato JSON
    data = request.get_json()  # Ej: {"Producto": "Hamburguesa", "Cantidad": 10}
    
    # 🔹 Crear conexión a la base de datos usando la función get_db()
    db = get_db()
    cursor = db.cursor()# el cursor es para ejecutar mejor las sentencias de sql 
    cursor.execute(   'INSERT INTO Stock (Producto, Cantidad) VALUES (%s, %s)',
        (data['Producto'], data['Cantidad']))
    
    db.commit()#para guardar los cambios
    return jsonify({"mensaje": "Producto agregado exitosamente"})

#valen
@app.route('/stock/<int:stock_id>', methods=['DELETE'])
def eliminar_stock(stock_id):
    db = get_db()
    cursor = db.cursor()  # ← creás el cursor
    cursor.execute('DELETE FROM Stock WHERE id_Stock = %s', (stock_id,))
    db.commit()


    if cursor.rowcount == 0:
        return {'mensaje': 'No se encontró el registro'}, 404

    return {'mensaje': f'Stock con ID {stock_id} eliminado correctamente'}



# mas adelante modificar la ruta por que son las misma que la de borrar




#valen
@app.route('/stock/<int:stock_id>', methods=['PUT']) 
def modificar_stock(stock_id):
    data = request.get_json()  # Recibe datos en formato JSON

    # Validar que vengan los datos necesarios
    if not data or 'cantidad' not in data:
        return {'mensaje': 'Falta el campo cantidad'}, 400

    nueva_cantidad = data['cantidad']

    db = get_db()
    cursor = db.execute(
        'UPDATE Stock SET cantidad = %s WHERE id_Stock = %s',
        (nueva_cantidad, stock_id)
    ) 
    db.commit()

    if cursor.rowcount == 0:
        return {'mensaje': 'No se encontró el registro'}, 404

    return {'mensaje': f'Stock con ID {stock_id} actualizado correctamente'}



#valen
@app.route('/registro', methods=['POST'])
def registrar_usuario():
    # 1. Validación de la solicitud (sin cambios)
    data = request.get_json()
    if not data or 'Usuario' not in data or 'Email' not in data or 'Password' not in data:
        return {'mensaje': 'Faltan datos'}, 400

    nombre = data['Usuario']
    email = data['Email']
    password = data['Password']

    db = None
    cursor = None
    try:
        db = get_db()  # Asume que esta función abre la conexión
        cursor = db.cursor(dictionary=True)

        # 2. Verificar si el email ya existe (SELECT)
        # Una SELECT también es una transacción, aunque ligera.
        cursor.execute('SELECT 1 FROM Usuarios WHERE Email = %s', (email,))
        if cursor.fetchone():
            # No necesitamos hacer commit/rollback para un SELECT si no está en una transacción explícita
            return {'mensaje': 'El email ya está registrado'}, 400

        # 3. Encriptar la contraseña
        password_hash = generate_password_hash(password)

        # 4. Insertar usuario (INSERT)
        cursor.execute(
            'INSERT INTO Usuarios (Usuario, Email, Password) VALUES (%s, %s, %s)',
            (nombre, email, password_hash)
        )
        
        # 5. Confirmar la transacción
        db.commit() # ¡IMPORTANTE! Este libera los bloqueos de fila del INSERT.

        return {'mensaje': 'Usuario registrado con éxito'}, 201

    except mysql.connector.Error as err:
        # En caso de cualquier error de MySQL (incluyendo Lock wait timeout exceeded)
        print(f"Error de base de datos: {err}")
        if db:
            db.rollback() # Deshace la transacción para liberar cualquier bloqueo residual.
        
        # Puedes revisar códigos de error específicos si es necesario
        if err.errno == 1205: # Código de error para Lock wait timeout exceeded
             return {'mensaje': 'Error de concurrencia: El sistema está ocupado. Intente de nuevo.'}, 503
             
        return {'mensaje': 'Error al registrar el usuario en la base de datos.'}, 500

    except Exception as e:
        # Manejo de cualquier otro error no relacionado con MySQL
        print(f"Error inesperado: {e}")
        return {'mensaje': 'Error interno del servidor.'}, 500

    finally:
        # 6. Cerrar recursos (¡Siempre debe ejecutarse!)
        if cursor:
            cursor.close()
        if db:
            # Asume que get_db() crea una conexión que debe ser cerrada.
            db.close()

#valen
@app.route('/inicio', methods=['POST'])
def inicio():
    data = request.get_json()
    if not data or 'Email' not in data or 'Password' not in data:
        return {'mensaje': 'Faltan datos'}, 400

    email = data['Email']
    password = data['Password']

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # Buscar usuario
    cursor.execute('SELECT * FROM Usuarios WHERE Email = %s', (email,))
    user = cursor.fetchone()
    cursor.close()
    db.close()

    if user is None:
        return {'mensaje': 'Usuario no encontrado'}, 404

    if check_password_hash(user['Password'], password):
        return {'mensaje': 'Inicio de sesión exitoso', 'usuario': user}, 200
    else:
        return {'mensaje': 'Contraseña incorrecta'}, 401




#lian
@app.route('/inicio/cambiar/<int:id_Usuarios>', methods=['PUT'])
def modificar(id_Usuarios):
    data = request.get_json()
    if not data:
        return {'mensaje': 'No se enviaron datos'}, 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # Primero obtenemos los valores actuales de la fila
    cursor.execute('SELECT Usuario, Email, Password FROM Usuarios WHERE id_usuarios = %s', (id_Usuarios,))
    fila = cursor.fetchone()
    if not fila:
        cursor.close()
        return {'mensaje': 'No se encuentra el usuario'}, 404

    # Si no se envía un campo, se mantiene el valor actual
    mod_Usuario = data.get('Usuario', fila['Usuario'])
    mod_Email = data.get('Email', fila['Email'])
    mod_Password = data.get('Password', fila['Password'])

    # Ahora ejecutamos la consulta UPDATE fija
    cursor.execute(
        'UPDATE Usuarios SET Usuario = %s, Email = %s, Password = %s WHERE id_usuarios = %s',
        (mod_Usuario, mod_Email, mod_Password, id_Usuarios)
    )
    db.commit()
    cursor.close()

    if fila['Usuario'] != mod_Usuario and fila['Password'] != mod_Password and fila['Email'] != mod_Email:
        return {'mensaje': f'Usuario con ID {id_Usuarios} cambió Usuario, Email y Password correctamente'}, 200

    if fila['Usuario'] != mod_Usuario and fila['Password'] != mod_Password:
        return {'mensaje': f'Usuario con ID {id_Usuarios} cambió Usuario y Password correctamente'}, 200

    if fila['Usuario'] != mod_Usuario and fila['Email'] != mod_Email:
        return {'mensaje': f'Usuario con ID {id_Usuarios} cambió Usuario y Email correctamente'}, 200

    if fila['Password'] != mod_Password and fila['Email'] != mod_Email:
        return {'mensaje': f'Usuario con ID {id_Usuarios} cambió Password y Email correctamente'}, 200

    if fila['Usuario'] != mod_Usuario:
        return {'mensaje': f'Usuario con ID {id_Usuarios} cambió su Usuario correctamente a: {mod_Usuario}'}, 200

    if fila['Password'] != mod_Password:
        return {'mensaje': f'Usuario con ID {id_Usuarios} cambió su Password correctamente'}, 200

    if fila['Email'] != mod_Email:
        return {'mensaje': f'Usuario con ID {id_Usuarios} cambió su Email correctamente a: {mod_Email}'}, 200

    return {'mensaje': 'No se hicieron cambios'}, 200



 #lian
@app.route('/inicio/borrar/<int:id_usuarios>', methods=['DELETE'])
def borrar_cuenta(id_usuarios):
    db = get_db()
    cursor = db.cursor()
    cursor.execute('DELETE FROM Usuarios WHERE id_usuarios = %s', (id_usuarios,))
    db.commit()
    filas_afectadas = cursor.rowcount
    cursor.close()
    db.close()
    if filas_afectadas == 0:
        return {'mensaje': 'No se encontró el usuario'}, 404
    return {'mensaje': f'Usuario con ID {id_usuarios} eliminado correctamente'}, 200






# Configuración de la clave secreta.
# Necesaria para que Flask pueda firmar y proteger las cookies de sesión.
# SIN esto, no podríamos usar `session`.
app.secret_key = "clave_secreta_super_segura"


# Middleware que se ejecuta antes de cada request.
# Su función es asegurarse de que la sesión SIEMPRE tenga un carrito.
#lian
@app.before_request
def iniciar_carrito():
    # Si el carrito no existe en la sesión, lo creamos como una lista vacía.
    if "carrito" not in session:
        session["carrito"] = []


    

# -----------------------------
# 📌 Ver carrito
# -----------------------------
#lian
@app.route("/carrito", methods=["GET"])
def ver_carrito():
    carrito = session.get("carrito", [])
    total = sum(float(item["Costo"]) * item["cantidad"] for item in carrito)
    return jsonify({"carrito": carrito, "total": total}), 200


# -----------------------------
# 📌 Agregar producto al carrito
# -----------------------------
#lian
@app.route("/carrito/agregar/<int:id_Stock>", methods=["POST"])
def agregar_carrito(id_Stock):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id_Stock, Producto, Costo FROM Productos WHERE id_Stock = %s", (id_Stock,))
    producto = cursor.fetchone()
    cursor.close()
    db.close()

    if not producto:
        return jsonify({"mensaje": "Producto no encontrado"}), 404

    carrito = session.get("carrito", [])
    encontrado = False

    for item in carrito:
        if item["id_Stock"] == id_Stock:
            item["cantidad"] += 1
            encontrado = True
            break

    if not encontrado:
        producto["cantidad"] = 1
        carrito.append(producto)

    session["carrito"] = carrito
    return jsonify({"mensaje": f"{producto['Producto']} agregado al carrito", "carrito": carrito}), 200


# -----------------------------
# 📌 Eliminar producto del carrito
# -----------------------------
#lian
@app.route("/carrito/eliminar/<int:id_Stock>", methods=["POST"])
def eliminar_carrito(id_Stock):
    carrito = session.get("carrito", [])
    carrito = [item for item in carrito if item["id_Stock"] != id_Stock]
    session["carrito"] = carrito
    return jsonify({"mensaje": "Producto eliminado del carrito", "carrito": carrito}), 200


# -----------------------------
# 📌 Vaciar carrito
# -----------------------------
#lian
@app.route("/carrito/vaciar", methods=["POST"])
def vaciar_carrito():
    session["carrito"] = []
    return jsonify({"mensaje": "Carrito vaciado", "carrito": []}), 200





# --------------------------
# GET: Listar todas las promociones
# --------------------------
#valen
@app.route('/Promociones', methods=['GET'])
def obtener_promociones():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Promociones")
    promociones = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(promociones), 200       



# --------------------------
# GET: Obtener una promoción por ID
# --------------------------
#valen
@app.route('/Promociones/<int:id>', methods=['GET'])
def obtener_promocion(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Promociones WHERE id = %s", (id,))
    promo = cursor.fetchone()
    cursor.close()
    db.close()
    if promo:
        return jsonify(promo), 200
    else:
        return jsonify({"mensaje": "Promoción no encontrada"}), 404


# --------------------------
# POST: Agregar una nueva promoción
# --------------------------
#valen
@app.route('/Promociones', methods=['POST'])
def agregar_promocion():
    datos = request.get_json()
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO Promociones (nombre, descripcion, precio, productos) VALUES (%s, %s, %s, %s)",
        (datos["nombre"], datos.get("descripcion"), datos["precio"], datos.get("productos"))
    )
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"mensaje": "Promoción agregada"}), 201
# --------------------------
# PUT: Actualizar una promoción existente
# --------------------------
#valen
@app.route('/Promociones/<int:id>', methods=['PUT'])

def actualizar_promocion(id):
    datos = request.get_json()
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "UPDATE Promociones SET nombre=%s, descripcion=%s, precio=%s, productos=%s WHERE id=%s",
        (datos["nombre"], datos.get("descripcion"), datos["precio"], datos.get("productos"), id)
    )
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"mensaje": "Promoción actualizada"}), 200
# --------------------------
# DELETE: Eliminar una promoción
# --------------------------
#valen
@app.route('/Promociones/<int:id>', methods=['DELETE'])
def eliminar_promocion(id):
 db = get_db()
 cursor = db.cursor()
 cursor.execute("DELETE FROM Promociones WHERE id = %s", (id,))
 db.commit()
 cursor.close()
 db.close()
 return jsonify({"mensaje": "Promoción eliminada"}), 200






#valen
@app.route('/contacto', methods=['POST'])
def guardar_contacto():
    data = request.get_json()
    
    # Validar que los datos estén completos
    if not data or 'nombre' not in data or 'email' not in data or 'mensaje' not in data:
        return {'mensaje': 'Todos los campos son requeridos'}, 400
    
    nombre = data['nombre']
    email = data['email']
    mensaje = data['mensaje']
    
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO Contacto (nombre, email, mensaje) VALUES (%s, %s, %s)",
        (nombre, email, mensaje)
    )
    db.commit()
    cursor.close()
    db.close()
    
    return {'mensaje': 'Mensaje de contacto guardado exitosamente'}, 201

#lian
@app.route('/carrito/total', methods=['GET'])
def total_carrito():
    # Verificamos que haya usuario logueado
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return jsonify({"mensaje": "Debes iniciar sesión para ver el total"}), 401

    # Recuperamos el carrito de la sesión
    carrito = session.get("carrito", [])

    if not carrito:
        return jsonify({"mensaje": "El carrito está vacío", "total": 0}), 200

    # Calculamos el total (precio * cantidad de cada producto)
    total = sum(item["Costo"] * item["cantidad"] for item in carrito)

    return jsonify({"total": total, "items": carrito}), 200


#lian
@app.route("/crear_preferencia", methods=["POST"])
def crear_preferencia():
    try:
        data = request.get_json()
        carrito = data.get("carrito", [])

        if not carrito:
            print("⚠️ Carrito vacío:", carrito)
            return jsonify({"error": "El carrito está vacío"}), 400

        items = []
        for item in carrito:
            print("🧾 Item recibido:", item)
            items.append({
                "title": item.get("Producto", "Sin nombre"),
                "quantity": int(item.get("cantidad", 1)),
                "unit_price": float(item.get("Costo", 0))
            })

        preference_data = {
            "items": items,
            "back_urls": {
                "success": "http://localhost:5173/pago/exitoso",
                "failure": "http://localhost:5173/pago_fallido",
                "pending": "http://localhost:5173/pago_pendiente"
            },
               # 👈 Esto hace que se redirija automáticamente al success si el pago fue aprobado
        }

        print("📦 Enviando a Mercado Pago:", preference_data)
        preference_response = sdk.preference().create(preference_data)
        preference = preference_response["response"]
        print("✅ Preferencia creada:", preference)

        return jsonify({"id": preference["id"]})

    except Exception as e:
        print("❌ Error creando preferencia:", e)
        return jsonify({"error": str(e)}), 500


# Endpoint para obtener los productos más 
#valen
@app.route('/productos-mas-vendidos', methods=['GET'])
def productos_mas_vendidos():
    # Conexión a la base de datos
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    # Consulta SQL para obtener los productos más vendidos
    cursor.execute("""
        SELECT s.Producto, SUM(v.Cantidad) AS total_vendido
        FROM Ventas v
        JOIN Productos s ON v.id_Stock = s.id_Stock
        GROUP BY s.Producto
        ORDER BY total_vendido DESC
        LIMIT 10;
    """)
    
    # Obtener los resultados
    resultados = cursor.fetchall()
    
    # Cerrar la conexión
    cursor.close()
    conn.close()
    
    # Retornar los resultados como JSON
    return jsonify(resultados)


#lian
@app.route('/productos/promedio-precios', methods=['GET'])
def promedio_precios():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT AVG(Costo) AS promedio_precio FROM Productos")
    resultado = cursor.fetchone()
    cursor.close()
    db.close()

    promedio = resultado['promedio_precio'] if resultado['promedio_precio'] else 0
    return jsonify({'promedio_precio_productos': promedio}), 200

#lian
@app.route('/productos/mas-caro', methods=['GET'])
def producto_mas_caro():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Productos ORDER BY Costo DESC LIMIT 1")
    producto = cursor.fetchone()
    cursor.close()
    db.close()

    if not producto:
        return jsonify({'mensaje': 'No hay productos registrados'}), 404
    return jsonify({'producto_mas_caro': producto}), 200



#lian
@app.route('/ventas/ganancia-mensual', methods=['GET'])
def ganancia_mensual():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            DATE_FORMAT(NOW(), '%Y-%m') AS mes_actual,
            SUM(Total) AS ganancia_total
        FROM Ventas
        WHERE MONTH(Fecha) = MONTH(CURRENT_DATE())
          AND YEAR(Fecha) = YEAR(CURRENT_DATE());
    """)

    resultado = cursor.fetchone()
    cursor.close()
    db.close()

    ganancia = resultado['ganancia_total'] if resultado['ganancia_total'] else 0
    return jsonify({"mes": resultado['mes_actual'], "ganancia_total": ganancia}), 200



#valen
@app.route('/usuarios/top-compradores', methods=['GET'])
def top_compradores():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT u.Usuario, COUNT(v.id_Venta) AS total_compras, SUM(v.Total) AS monto_total
        FROM Ventas v
        JOIN Usuarios u ON v.id_Usuarios = u.id_usuarios
        GROUP BY u.Usuario
        ORDER BY monto_total DESC
        LIMIT 5;
    """)

    resultado = cursor.fetchall()
    cursor.close()
    db.close()

    return jsonify(resultado), 200


#lian
@app.route('/productos/agregar', methods=['POST'])
def agregar_producto():
    db = get_db()
    cursor = db.cursor()

    data = request.get_json()
    nombre = data.get('Nombre')
    descripcion = data.get('Descripcion')
    categoria = data.get('Categoria')

    if not nombre or not descripcion or not categoria:
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    cursor.execute("""
        INSERT INTO Producto (Nombre, Descripcion, Categoria)
        VALUES (%s, %s, %s);
    """, (nombre, descripcion, categoria))
    db.commit()

    cursor.close()
    db.close()




@app.route('/productos/<int:id_producto>', methods=['DELETE'])
def eliminar_producto(id_producto):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("DELETE FROM Producto WHERE id_Producto = %s;", (id_producto,))
    db.commit()

    cursor.close()
    db.close()

    return jsonify({"mensaje": "Producto eliminado correctamente"}), 200




@app.route("/carrito/agregarPromo/<int:id>", methods=["POST"])
def agregar_promo_carrito(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT id, nombre AS Producto, precio AS Costo FROM Promociones WHERE id = %s",
        (id,),
    )
    promo = cursor.fetchone()
    cursor.close()
    db.close()

    if not promo:
        return jsonify({"mensaje": "Promoción no encontrada"}), 404

    carrito = session.get("carrito", [])
    encontrado = False

    for item in carrito:
        if item.get("id") == id:
            item["cantidad"] += 1
            encontrado = True
            break

    if not encontrado:
        promo["cantidad"] = 1
        carrito.append(promo)

    session["carrito"] = carrito
    return jsonify(
        {"mensaje": f"{promo['Producto']} agregado al carrito", "carrito": carrito}
    ), 200




##valen
@app.route("/sucursales_tempranas", methods=["GET"])
def sucursales_tempranas():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT Ciudad, Pais, Horario_abierto
        FROM Sucursales
        WHERE Horario_abierto < '09:00:00'
        ORDER BY Horario_abierto ASC
    """)
    
    resultado = cursor.fetchall()
    cursor.close()
    db.close()
    
    # Convertir Horario_abierto a string HH:MM:SS
    for fila in resultado:
        if 'Horario_abierto' in fila and fila['Horario_abierto'] is not None:
            fila['Horario_abierto'] = str(fila['Horario_abierto'])
    
    return jsonify(resultado)

##valen
@app.route("/empleados", methods=["GET"])
def obtener_empleados():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT id_Empleados, Nombre, Apellido, Email, Numero, id_Sucursales
        FROM Empleados
        ORDER BY id_Empleados ASC
    """)
    
    empleados = cursor.fetchall()
    cursor.close()
    db.close()
    
    return jsonify(empleados), 200





@app.route("/empleados/por_sucursal", methods=["GET"])
def empleados_por_sucursal():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT id_Sucursales, COUNT(*) AS Total_Empleados
        FROM Empleados
        GROUP BY id_Sucursales
        ORDER BY id_Sucursales ASC
    """)
    
    resultado = cursor.fetchall()
    cursor.close()
    db.close()
    
    return jsonify(resultado), 200



# Iniciar el servidor Flask
if __name__ == '__main__':
    app.run(debug=True)






