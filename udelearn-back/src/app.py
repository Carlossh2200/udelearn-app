import faiss
import numpy as np
from flask import Flask,request
from flask_cors import CORS
from config import config
from flask_sqlalchemy import SQLAlchemy
import uuid
#from models.PathModel import PathModel
#from services.SemanticSearchService import SemanticSearchService

#database
db = SQLAlchemy()

#Routes
#from routes import Paths
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:myscoQ-bojnu3-seqtax@db.urgaduirlpcawuyuwemy.supabase.co:5432/postgres"
db.init_app(app)
    
CORS(app,resources={"*" : {"origins":"http://localhost:5173"}})

#model = PathModel()

def page_not_found(error):
    return "<h1>Page not found</h1>",404

if __name__ == '__main__':
    app.config.from_object(config['development'])
    
    with app.app_context():
        try:
            db.session.execute(db.text('SELECT 1'))
            print("Database connected successfully!")
        except Exception as e:
            print(f"Database connection failed: {e}")
    
    #Blueprints
    #app.register_blueprint(Paths.main,url_prefix='/api/paths')
    
    @app.route('/')
    def index():
        return "Bienvenido a UdeLearn!"
    app.register_error_handler(404,page_not_found)
    
    app.run()