import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.utils_for_extracting import extract_toc_and_text, identify_career_topic 
from utils.utils_for_generating import generate_learning_plan,fetch_youtube_search_titles_and_urls,generate_video_recommendations,session_scope,RecVideo,init_db
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})


@app.route('/api/process-pdf', methods=['POST'])
def process_pdf_endpoint():
    if 'file' not in request.files:
        return jsonify({"error": "Archivo no cargado correctamente"}), 400
    
    file = request.files['file']
    
    if file.filename == '' or not file.filename.endswith('.pdf'):
        return jsonify({"error": "Archivo no seleccionado o archivo en formato diferente a PDF"}), 400

    run_id = os.urandom(8).hex()
    
    try:
        print(f"[Run {run_id}] Procesando {file.filename}")
        pdf_bytes = file.read()

        doc_data = extract_toc_and_text(pdf_bytes)
        context_text = doc_data['toc'] if doc_data['toc'] else doc_data['text']
        if not context_text:
            return jsonify({"error": "No se pudo extraer datos del PDF cargado."}), 500

        career_topic = identify_career_topic(context_text)
        plan = generate_learning_plan(context_text, career_topic)
        concepts_to_search = [item['concept'] for item in plan.get('parsed_summary', [])]

        if concepts_to_search:
            print(f"--- [Run {run_id}] Encontrando Recommendaciones ")
            with session_scope() as session:
                for concept in concepts_to_search:
                    enhanced_search_query = f"{concept} tutorial para {career_topic}"
                    print(f"\nBuscando videos con la query: '{enhanced_search_query}'")
                    
                    videoList = fetch_youtube_search_titles_and_urls(enhanced_search_query, max_results=8)
                    
                    if videoList:
                        resultVideo = generate_video_recommendations(videoList, concept, career_topic, run_id, session)
                        print(f"Contenido recomendado para '{concept}': {resultVideo['summaryList']}")
                    else:
                        print(f"No se encontraron videos para '{concept}'")
        
        
        final_results = []
        with session_scope() as session:
            video_data = session.query(RecVideo).filter_by(run_id=run_id).all()
            
            for video in video_data:
                final_results.append({
                    "career_topic": video.career_topic,
                    "concept": video.concept,
                    "title": video.title,
                    "url": video.url,
                    "days": video.days
                })

        print(f"--- [Run {run_id}] Procesamiento completado. ---")
        
        return jsonify({
            "career_topic": career_topic,
            "learning_plan": plan,
            "video_recommendations": final_results
        }), 200

    except Exception as e:
        print(f"Error durante procesamiento: {e}")
        return jsonify({"error": f"Error interno de servidor: {str(e)}"}), 500

if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5000)

