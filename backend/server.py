from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="buystickets"
)
cursor = db.cursor(dictionary=True)

import base64

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = data.get('user')
    password = data.get('password')

    cursor.execute("SELECT * FROM users WHERE user = %s", (user,))
    user_data = cursor.fetchone()

    if user_data and check_password_hash(user_data['password'], password):
        # Convertir imagen a base64 si existe
        profile_base64 = None
        if user_data['profile']:
            profile_base64 = f"data:image/png;base64,{base64.b64encode(user_data['profile']).decode('utf-8')}"

        return jsonify(success=True, 
                        nombre=user_data['name'], 
                        apellido=user_data['surname'], 
                        role=user_data['role'], 
                        profile=profile_base64)
    
    return jsonify(success=False, message="Usuario o contraseña incorrectos.")

import re  # Importamos el módulo para expresiones regulares

@app.route('/register', methods=['POST'])
def register():
    user = request.form['user']
    password = request.form['password']
    nombre = request.form['nombre']
    apellido = request.form['apellido']
    email = request.form['email']
    role = "estandar"

    # Expresión regular para restringir nombres que contengan "admin" o "administrador" en cualquier parte
    forbidden_pattern = r".*admin.*|.*administrador.* | .*root*.|.*super*."

    if re.search(forbidden_pattern, user, re.IGNORECASE):  
        return jsonify(success=False, message="El nombre de usuario no está permitido. Por favor, elige otro.")

    # Verificar si el usuario ya existe
    cursor.execute("SELECT * FROM users WHERE user = %s", (user,))
    existing_user = cursor.fetchone()

    if existing_user:
        return jsonify(success=False, message="El usuario ya existe. Por favor, elige otro nombre de usuario.")

    # Obtener la imagen correctamente
    profile = request.files['profile'].read() if 'profile' in request.files else None

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    try:
        cursor.execute("INSERT INTO users (user, password, name, surname, email, role, profile) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                        (user, hashed_password, nombre, apellido, email, role, profile))
        db.commit()
        return jsonify(success=True)
    except mysql.connector.Error as err:
        return jsonify(success=False, message=str(err))

@app.route('/update-user', methods=['POST'])
def update_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    user = data.get('user')  # Se necesita el usuario para identificarlo

    if not user:
        return jsonify(success=False, message="Falta el nombre de usuario.")

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256') if password else None

    try:
        if email and hashed_password:
            cursor.execute("UPDATE users SET email=%s, password=%s WHERE user=%s", (email, hashed_password, user))
        elif email:
            cursor.execute("UPDATE users SET email=%s WHERE user=%s", (email, user))
        elif hashed_password:
            cursor.execute("UPDATE users SET password=%s WHERE user=%s", (hashed_password, user))
        else:
            return jsonify(success=False, message="No se enviaron datos para actualizar.")

        db.commit()
        return jsonify(success=True, message="Datos actualizados correctamente.")
    
    except mysql.connector.Error as err:
        return jsonify(success=False, message=str(err))

if __name__ == '__main__':
    app.run(debug=True)
