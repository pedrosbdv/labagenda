from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_jwt_extended import create_access_token, JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta

app = Flask(__name__)

ma = Marshmallow(app)
jwt = JWTManager(app)
CORS(app)


# configure the SQLite database, relative to the app instance folder
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:@localhost/labagenda"  
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['SECRET_KEY'] = 'SPFC O MAIOR DE TODOS'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)


# initialize the app with the extension
bcrypt = Bcrypt(app)
db = SQLAlchemy(app)






############################# USERS ##############################################################


class Users(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(45))
    email = db.Column(db.String(45))
    password = db.Column(db.Text)
    # date = db.Column(db.DateTime, default=datetime.datetime.now)

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password

#Schema download
class UserSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ("id", "name", "email")

user_schema = UserSchema()
users_schema = UserSchema(many=True)

############################# LOGIN TOKEN ##############################################################
@app.route('/logintoken', methods=['POST'])
def createtoken():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = Users.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Wrong email or passwords"}), 401

    # return jsonify({"error": "Chegou aqui"})
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Acesso não autorizado"}), 401

    access_token = create_access_token(identity=email)
    
    return jsonify({"email": email, "access_token": access_token})
############################################################################################################









@app.route('/listusers', methods=['GET'])
def listusers():
    all_users = Users.query.all()
    results = users_schema.dump(all_users)
    return jsonify(results)


@app.route('/userdetails/<id>', methods = ['GET'])
def userdetails(id):
    user = Users.query.get(id)
    return user_schema.jsonify(user)

@app.route('/userdelete/<id>', methods = ['DELETE'])
def userdelete(id):
    user = Users.query.get(id)
    db.session.delete(user)
    db.session.commit()
    return user_schema.jsonify(user)

@app.route('/useradd', methods=['POST'])
def useradd():
    name        = request.json['name']
    email       = request.json['email']
    password    = request.json['password']

    user_exists = Users.query.filter_by(email=email).first()

    if user_exists:
        return jsonify({"error": "Esse Email ja esta cadastrado"}), 409
    
    hashed_password = bcrypt.generate_password_hash(password)
    users = Users(name, email, hashed_password)
    db.session.add(users)
    db.session.commit()

    return user_schema.jsonify(users)

############################# LABS ##############################################################


class Labs(db.Model):
    __tablename__           = "labs"
    id                      = db.Column(db.Integer, primary_key = True)
    start_time              = db.Column(db.String(45))
    end_time                = db.Column(db.String(45))
    labs_name               = db.Column(db.String(20))
    responsible_teacher     = db.Column(db.String(45))
    matter                  = db.Column(db.String(45))
    
    def __init__(self, start_time, end_time, labs_name, responsible_teacher, matter):
        self.start_time                 = start_time
        self.end_time                   = end_time
        self.labs_name                  = labs_name
        self.responsible_teacher        = responsible_teacher
        self.matter                     = matter


#Schema download
class LabsSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ("id", "start_time", "end_time", "labs_name", "responsible_teacher", "matter" )

lab_schema = LabsSchema()
labs_schema = LabsSchema(many=True)


@app.route('/labsadd', methods=['POST'])
def labsadd():
    start_time              = request.json['start_time']
    end_time                = request.json['end_time']
    labs_name               = request.json['labs_name']
    responsible_teacher     = request.json['responsible_teacher']
    matter                  = request.json['matter']

    labs = Labs(start_time, end_time, labs_name, responsible_teacher, matter)
    db.session.add(labs)
    db.session.commit()

    return lab_schema.jsonify(labs)

@app.route('/labdelete/<id>', methods = ['DELETE'])
def labdelete(id):
    lab = Labs.query.get(id)
    db.session.delete(lab)
    db.session.commit()
    return user_schema.jsonify(lab)



@app.route('/listlabs', methods=['GET'])
def listlabs():
    all_labs = Labs.query.all()
    results_labs = labs_schema.dump(all_labs)
    return jsonify(results_labs)