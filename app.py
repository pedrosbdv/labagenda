from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
#commit add .
app = Flask(__name__)
ma = Marshmallow(app)
CORS(app)

if __name__ == '__main__':
    app.run(debug=True)


# configure the SQLite database, relative to the app instance folder
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:@localhost/labagenda"  
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# initialize the app with the extension
db = SQLAlchemy(app)



############################# USERS ##############################################################
class Users(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(45))
    email = db.Column(db.String(45))
    type = db.Column(db.String(45))
    

    def __init__(self, name, email, type):
        self.name = name
        self.email = email
        self.type = type


#Schema download
class UserSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ("id", "name", "email", "type")

user_schema = UserSchema()
users_schema = UserSchema(many=True)

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
    name = request.json['name']
    email = request.json['email'] 
    type = request.json['type'] 

    users = Users(name, email, type)
    db.session.add(users)
    db.session.commit()

    return user_schema.jsonify(users)

############################# LABS ##############################################################


class Labs(db.Model):
    __tablename__           = "labs"
    id                      = db.Column(db.Integer, primary_key = True)
    hours                   = db.Column(db.String(45))
    labs_name               = db.Column(db.String(20))
    responsible_teacher     = db.Column(db.String(45))
    matter                  = db.Column(db.String(45))
    
    def __init__(self, hours, labs_name, responsible_teacher, matter):
        self.hours                      = hours
        self.labs_name                  = labs_name
        self.responsible_teacher        = responsible_teacher
        self.matter                     = matter


#Schema download
class LabsSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ("id", "hours", "labs_name", "responsible_teacher", "matter" )

lab_schema = LabsSchema()
labs_schema = LabsSchema(many=True)


@app.route('/labsadd', methods=['POST'])
def labsadd():
    hours                   = request.json['hours']
    labs_name               = request.json['labs_name']
    responsible_teacher     = request.json['responsible_teacher']
    matter                  = request.json['matter']

    labs = Labs(hours, labs_name, responsible_teacher, matter)
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



############################# LABS NEW ##############################################################
class LabsNovo(db.Model):
    __tablename__           = "labsNew"
    id                      = db.Column(db.Integer, primary_key = True)
    name                    = db.Column(db.String(45))
    build                   = db.Column(db.String(45))
    
    def __init__(self, name, build):
        self.name                 = name
        self.build                = build
        
        
#Schema download
class LabsNew(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ("id", "name", "build")

lab_schema = LabsNew()
labs_schema_novo_n = LabsNew(many=True)


@app.route('/labsaddnew', methods=['POST'])
def labsaddnew():
    name                 = request.json['room']
    build                = request.json['build']


    labs = LabsNovo(name, build)
    db.session.add(labs)
    db.session.commit()

    return lab_schema.jsonify(labs)

@app.route('/labdeletenew/<id>', methods = ['DELETE'])
def labdeletenew(id):
    lab = LabsNovo.query.get(id)
    db.session.delete(lab)
    db.session.commit()
    return user_schema.jsonify(lab)



@app.route('/listlabsnew', methods=['GET'])
def listlabsnew():
    all_labs = LabsNovo.query.all()
    results_labs = labs_schema_novo_n.dump(all_labs)
    return jsonify(results_labs)


@app.route('/listlabsfilter', methods=['GET'])
def listlabsfilter():

    # Recebe a data em formato brasileiro, se disponível
    date_str = request.args.get('date', None)  # Mudei de request.json para request.args

    if date_str:
        # Converte a data para o formato YYYY-MM-DD
        try:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')  # Ajustado para o formato correto
            date_formatted = date_obj.strftime('%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Data inválida. Use o formato YYYY-MM-DD.'}), 400

        # Modifica a consulta SQL para filtrar pela data
        sql = """
                SELECT 
                    id,
                    hours, 
                    labs_name, 
                    responsible_teacher
                FROM
                    labs
                WHERE
                    DATE(date_time) >= :date_param
                """
        
        # Executa a consulta com o parâmetro de data
        result = db.session.execute(text(sql), {'date_param': date_formatted})
    
    else:
        # Se não houver data, retorna todos os registros
        sql = """
                SELECT 
                    id,
                    hours, 
                    labs_name, 
                    responsible_teacher
                FROM
                    labs
                """
        
        result = db.session.execute(text(sql))

    data = result.fetchall()

    results_list = [{'id': row[0], 'labs_name': row[1], 'hours': row[2], 'responsible_teacher': row[3]} for row in data]
    
    return jsonify(results_list)



############################# HOURS ##############################################################
class Hours(db.Model):
    __tablename__               = "hours"
    id                          = db.Column(db.Integer, primary_key = True)
    time_off                    = db.Column(db.String(45))
    time_until                  = db.Column(db.String(45))
   

    
    def __init__(self, time_off, time_until):
        self.time_off                   = time_off
        self.time_until                 = time_until
        
        
        
#Schema download
class HoursSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ("id", "time_off", "time_until")

hour_schema = HoursSchema()
hours_schema = HoursSchema(many=True)


@app.route('/hoursadd', methods=['POST'])
def hoursadd():
    time_off                    = request.json['time_off']
    time_until                  = request.json['time_until']
    

    hour = Hours(time_off, time_until)
    db.session.add(hour)
    db.session.commit()

    return hour_schema.jsonify(hour)

@app.route('/hoursdelete/<id>', methods = ['DELETE'])
def hoursdelete(id):
    hour = Hours.query.get(id)
    db.session.delete(hour)
    db.session.commit()
    return hour_schema.jsonify(hour)



@app.route('/hourslist', methods=['GET'])
def hourslist():
    all_hours = Hours.query.all()
    results_labs = hours_schema.dump(all_hours)
    return jsonify(results_labs)

@app.route('/hourslistFilter', methods=['GET'])


def hourslistFilter():

    sql = """
    SELECT 
        id,
        time_off,
        time_until,
        CONCAT(time_off, ' | ', time_until) as hours
    FROM 
        hours
    WHERE
        CONCAT(time_off, ' | ', time_until) not in (SELECT hours FROM labs where date(date_time) = CURDATE());
    """
    
    result = db.session.execute(text(sql))
    data = result.fetchall()

    results_list = [{'id': row[0], 'hours': row[3]} for row in data]
    return jsonify(results_list)