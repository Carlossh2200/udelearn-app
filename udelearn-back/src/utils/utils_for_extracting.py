import pdfplumber
import fitz
import torch
import io

from transformers import pipeline
from sentence_transformers import util
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

def extract_toc_and_text(pdf_bytes):
    try:
        with io.BytesIO(pdf_bytes) as file_stream:
            with pdfplumber.open(file_stream) as pdf:
                text = "".join(page.extract_text() or "" for page in pdf.pages[:5])

        with io.BytesIO(pdf_bytes) as file_stream:
            document = fitz.open(stream=file_stream, filetype="pdf")
            toc = document.get_toc()
            toc_text = " ".join(item[1] for item in toc)[:512] if toc else ""

        return {
            "toc": toc_text,
            "text": text[:2000]
        }
    except Exception as e:
        print(f"Error reading PDF bytes: {e}")
        return {"toc": "", "text": ""}

def remove_semantically_similar(items, embeddings, threshold=0.6):
    kept = []
    kept_embeddings = []

    for i, phrase in enumerate(items):
        if not kept_embeddings:
            kept.append(phrase)
            kept_embeddings.append(embeddings[i].unsqueeze(0))
            continue

        kept_tensor = torch.cat(kept_embeddings, dim=0)
        similarities = util.cos_sim(embeddings[i], kept_tensor)
        similarities = similarities.cpu().numpy().flatten()

        if all(s < threshold for s in similarities):
            kept.append(phrase)
            kept_embeddings.append(embeddings[i].unsqueeze(0))

    return kept

def identify_career_topic(context_text):
    text_sample = (context_text[:1500] if context_text else "")
    candidate_labels = [
        "Ingenieria en Computacion", "Ciencia de Materiales", "Fisica", "Ingenieria Biomedica", 
        "Ingenieria Civil", "Ingenieria en Alimentos y Biotecnologia", 
        "Ingenieria en Comunicaciones y Electronica", "Ingenieria en Logistica y Transporte", 
        "Ingenieria en Topografia Geomatica", "Ingenieria Informatica", "Ingenieria Mecanica Electrica",
        "Ingenieria Quimica", "Ingenieria Robotica", "Quimica", "Quimico Farmaceutico Biologo"
    ]
    try:
        print("Identificando carrera a la que perteneces...")
        result = classifier(text_sample, candidate_labels, multi_label=False)
        topic = result['labels'][0]
        print(f"PDF identificado como: {topic} (Puntuacion: {result['scores'][0]:.2f})")
        return topic
    except Exception as e:
        print(f"Error identificando carrera: {e}")
        return "General Studies"
