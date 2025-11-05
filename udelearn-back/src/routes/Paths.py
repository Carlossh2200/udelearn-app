from flask import Blueprint,jsonify,request,send_file
import io
from database.db import get_connection
#models
from models.PathModel import PathModel
#entities
from models.entities.Path import Path

import pdfplumber
import fitz

main = Blueprint('paths_blueprint',__name__)

@main.route('/')
def landing_page():
    return jsonify({'message':'Welcome to UdeLearn!'})

@main.route('/upload-file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file present in the request"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and file.filename.endswith('pdf'):
        try:
            #full_text = ""
            with pdfplumber.open(file) as pdf:
                text = " ".join(page.extract_text() or "" for page in pdf.pages[:5])
            
            document = fitz.open(file)
            toc = document.get_toc()
            toc_text = " ".join(item[1] for item in toc)[:512] if toc else ""
                
            return jsonify({
                "file": file.filename,
                "toc": toc_text,
                "text": text[:3000]
                })   
            
        except Exception as e:
            print(f"Error reading PDF {file.filename}: {e}")
            return {"file": file.filename}

                
                