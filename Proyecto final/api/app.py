import mysql.connector
from flask import Flask, g, request, jsonify, session, redirect, url_for, render_template
from dotenv import load_dotenv
from flask_cors import CORS
import os


load_dotenv()#lee la funciones

app = Flask(__name__)
CORS(app)

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






@app.route('/menu', methods=['GET'])
def listar_productos():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute('SELECT * FROM Productos')
    resultado = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(resultado)  # 🔹 Solo la lista



if __name__ == '__main__':
    app.run(debug=True)



@app.route('/stock/agregar', methods=['POST'])
def agregar():
    data = request.get_json()#Le envia el request en formato json
    db = get_db()
    cursor = db.cursor()# el cursor es para ejecutar mejor las sentencias de sql 
    cursor.execute(   'INSERT INTO Stock (Producto, Cantidad) VALUES (%s, %s)',
        (data['Producto'], data['Cantidad']))
    
    db.commit()#para guardar los cambios
    return "funciono"


@app.route('/stock/<int:stock_id>', methods=['DELETE'])
def eliminar_stock(stock_id):
    db = get_db()
    cursor = db.execute('DELETE FROM Stock WHERE id_Stock = %s', (stock_id,))
    db.commit()  # Guardar cambios en la base de datos

    if cursor.rowcount == 0:
        return {'mensaje': 'No se encontró el registro'}, 404

    return {'mensaje': f'Stock con ID {stock_id} eliminado correctamente'}



# mas adelante modificar la ruta por que son las misma que la de borrar



from flask import request

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




@app.route('/registro', methods=['POST'])
def registrar_usuario():
   data = request.get_json()
   if not data or 'Usuario' not in data or 'Email' not in data or 'Password' not in data:
       return {'mensaje': 'Faltan datos'}, 400


   nombre = data['Usuario']
   email = data['Email']
   password = data['Password']

   db = get_db()
   
   cursor = db.cursor()
   cursor.execute('INSERT INTO Usuarios (Usuario, Email, Password) VALUES (%s, %s, %s)',
                      (nombre, email, password))
   db.commit()
    
   return {'mensaje': 'El email se registro registrado'}, 400



@app.route('/inicio', methods=['POST'])
def inicio():
   data = request.get_json()


   if not data or 'Email' not in data or 'Password' not in data:
       return {'mensaje': 'Faltan datos'}, 400


   email = data['Email']
   password = data['Password']


   db = get_db()
   cursor = db.cursor(dictionary=True)
# Usamos diccionario=True para acceder a los campos por nombre en lugar de por índice
# Sin esto, el cursor devuelve tuplas y habría que usar usuario[0], usuario[1], etc.




   cursor.execute("SELECT * FROM Usuarios WHERE Email = %s AND Password = %s", (email, password))
   usuario = cursor.fetchone()


   cursor.close()
   db.close()


   if usuario:
       return {'mensaje': 'Inicio de sesión exitoso', 'usuario': usuario}, 200
   else:
       return {'mensaje': 'Email o contraseña incorrectos'}, 401
   




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
@app.before_request
def iniciar_carrito():
    # Si el carrito no existe en la sesión, lo creamos como una lista vacía.
    if "carrito" not in session:
        session["carrito"] = []


    


@app.route("/carrito", methods=["GET"])
def ver_carrito():
    # 🔹 Verificamos que el usuario esté logueado
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        print("⚠️ Debes iniciar sesión para ver el carrito", "error")
        return redirect(url_for("inicio"))
    
      # 🔹 Recuperamos el carrito de la sesión
    carrito = session.get("carrito", [])

    # 🔹 Calculamos el total
    total = sum(item["Precio"] * item["cantidad"] for item in carrito)

    # 🔹 Renderizamos el HTML del carrito
    return render_template("carrito.html", carrito=carrito, total=total)




@app.route("/carrito/agregar/<int:id_Stock>", methods=['POST'])
def agregar_carrito(id_Stock):
     #Verificar si hay usuario logueado
     usuario_id = session.get("usuario_id")
     if not usuario_id :
        print("⚠️ Debes iniciar sesión para agregar productos al carrito", "error")
        return redirect(url_for("inicio"))#redirect sirve para hacer un a redireccion
    

     db = get_db()
     cursor = db.cursor(dictionary=True)#Ahora podés acceder por nombre de columna ej cursor['nombre]
     cursor.execute("SELECT id_Stock, Producto, Costo FROM Productos WHERE id_Stock = %s", (id_Stock,))
     producto = cursor.fetchone()
     cursor.close()
     db.close()

     if not producto:
        print("⚠️ Producto no encontrado", "error")
        return redirect(url_for("listar_usuarios"))
    
     carrito = session.get("carrito", [])
     for item in carrito:
      if item["id_Stock"] == id_Stock:
        item["cantidad"] += 1
        encontrado = True
        break#termina el bucle
     
     
     
     if not encontrado:
        producto["cantidad"] = 1
        carrito.append(producto)


     session["carrito"] = carrito
     print(f"✅ {producto['Producto']} agregado al carrito", "success")
     return redirect(url_for("inicio"))  # 🔹 Redirige al menú



@app.route('/Productos/<string:nombre>', methods=['GET'])
def ver_producto(nombre):
    db = get_db()  # Conexión a la base de datos
    cursor = db.cursor(dictionary=True)
    # Buscamos el producto exacto por nombre
    cursor.execute("SELECT * FROM Productos WHERE Producto = %s", (nombre,))
    producto = cursor.fetchone()  # Tomamos solo el primer resultado
    cursor.close()
    db.close()
    if producto:
        # Si existe el producto, renderizamos producto.html pasándole los datos
        return render_template("producto.html", producto=producto)
    else:
        # Si no existe, devolvemos un mensaje de error
        return "Producto no encontrado", 404




# --------------------------
# GET: Listar todas las promociones
# --------------------------
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

@app.route('/Promociones/<int:id>', methods=['DELETE'])
def eliminar_promocion(id):
 db = get_db()
 cursor = db.cursor()
 cursor.execute("DELETE FROM Promociones WHERE id = %s", (id,))
 db.commit()
 cursor.close()
 db.close()
 return jsonify({"mensaje": "Promoción eliminada"}), 200