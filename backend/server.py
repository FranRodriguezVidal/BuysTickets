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

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = data.get('user')
    password = data.get('password')
    
    cursor.execute("SELECT * FROM users WHERE user = %s", (user,))
    user_data = cursor.fetchone()
    
    if user_data and check_password_hash(user_data['password'], password):
        return jsonify(success=True, nombre=user_data['name'], apellido=user_data['surname'], role=user_data['role'])
    return jsonify(success=False, message="Usuario o contraseña incorrectos.")

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    user = data.get('user')
    password = data.get('password')
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    email = data.get('email')
    role = "estandar"
    profile = data.get('profile', None)
    
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    
    try:
        cursor.execute("INSERT INTO users (user, password, name, surname, email, role, profile) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                        (user, hashed_password, nombre, apellido, email, role, profile))
        db.commit()
        return jsonify(success=True)
    except mysql.connector.Error as err:
        return jsonify(success=False, message=str(err))

if __name__ == '__main__':
    app.run(debug=True)
