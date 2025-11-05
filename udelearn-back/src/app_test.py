import os
import re
import requests
import json
import pdfplumber
import fitz
import sqlite3
import google.generativeai as genai
from sentence_transformers import SentenceTransformer, util
from transformers import pipeline
import torch

# --- 1. SETUP & CONFIGURATION ---

# WARNING: It's not safe to hardcode API keys. Use environment variables.
API_KEY = "AIzaSyD0JuHylU7ed6j-x2neQn2H0_OdyhKRVsg" 
genai.configure(api_key=API_KEY)
gemini_model = genai.GenerativeModel('gemini-2.5-flash')

# Model for de-duplicating keywords
summaryModel = SentenceTransformer("all-MiniLM-L6-v2")

# Model for local, zero-shot topic classification (Option 2)
classifier = pipeline("zero-shot-classification", 
                      model="facebook/bart-large-mnli")

# Connect to the database
with sqlite3.connect("career_keywords.db") as conn:
    cursor = conn.cursor()
    cursor.execute(""" CREATE TABLE IF NOT EXISTS rec_videos(
               query TEXT,
               title TEXT,
               url TEXT,
               days INTEGER
               )
               """)

# --- 2. HELPER FUNCTIONS ---

def extract_toc_and_text(pdf_path):
    """Extracts TOC and text from the first 5 pages of a single PDF."""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            # Extract text from the first 5 pages
            text = "".join(page.extract_text() or "" for page in pdf.pages[:5])

        document = fitz.open(pdf_path)
        toc = document.get_toc()
        # Get up to 512 chars from the Table of Contents
        toc_text = " ".join(item[1] for item in toc)[:512] if toc else ""

        return {
            "file": pdf_path,
            "toc": toc_text,
            "text": text[:2000] # Get up to 2000 chars of text
        }
    except Exception as e:
        print(f"Error reading PDF {pdf_path}: {e}")
        return {"file": pdf_path, "toc": "", "text": ""}

def remove_semantically_similar(items, embeddings, threshold=0.6):
    """De-duplicates a list of strings based on semantic similarity."""
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
    """
    (Option 2) Analyzes PDF text to identify its main subject using a local model.
    """
    text_sample = (context_text[:1500] if context_text else "")
    
    # You can expand this list to be more comprehensive for your needs
    candidate_labels = [
        "Ingenieria en Computacion", "Ciencia de Materiales", "Fisica", "Ingenieria Biomedica", 
        "Ingenieria Civil", "Ingenieria en Alimentos y Biotecnologia", 
        "Ingenieria en Comunicaciones y Electronica", "Ingenieria en Logistica y Transporte", 
        "Ingenieria en Topografia Geomatica", "Ingenieria Informatica", "Ingenieria Mecanica Electrica",
        "Ingenieria Quimica", "Ingenieria Robotica", "Quimica", "Quimico Farmaceutico Biologo"
        
    ]
    
    try:
        # This model ranks the labels based on how well they fit the text
        print("Identifying PDF topic (using local model)...")
        result = classifier(text_sample, candidate_labels)
        
        topic = result['labels'][0]
        print(f"Identified PDF topic as: {topic} (Score: {result['scores'][0]:.2f})")
        return topic

    except Exception as e:
        print(f"Error identifying career topic locally: {e}")
        return "General Studies" # A safe fallback

def generate_learning_plan(context_text, career_topic):
    """
    Generates a full learning plan (concepts, graph, sort) based on
    the provided text and identified career topic.
    """
    dependency_graph = []
    parsed_summary = []
    summary = ""

    # Prompt 1: Get Technical Concepts
    prompt = (f"Based on the following context about {career_topic}, what are the most important "
              f"*technical skills*, *learning topics*, *tools*, and *core concepts* "
              f"to become a specialist in this field? "
              f"Return them as a simple comma-separated list of keywords.\n\nContext:\n{context_text}")

    try:
        print("Generating core concepts with Gemini...")
        response = gemini_model.generate_content(prompt)
        summary = response.text
        concepts = [c.strip() for c in summary.split(",") if c.strip()]
        
        if not concepts:
            print("No concepts generated from the text.")
            return {"summary": "No concepts generated.", "parsed_summary": [], "dependency_graph": []}
            
        summaryEmbeddings = summaryModel.encode(concepts, convert_to_tensor=True)
        cleanedSummary = remove_semantically_similar(concepts, summaryEmbeddings, threshold=0.7)
        print(f"Refined concepts: {', '.join(cleanedSummary)}")

        # Prompt 2: Get Dependency Graph
        if cleanedSummary:
            try:
                print("Generating dependency graph with Gemini...")
                dependency_prompt = (
                    f"Given the following list of topics for {career_topic}: {', '.join(cleanedSummary)}. "
                    "Structure these as a dependency graph in JSON format. For each topic, list its prerequisites from the given list. "
                    "If a topic has no prerequisites, use an empty array. Respond ONLY with the valid JSON array."
                )
                graph_response = gemini_model.generate_content(dependency_prompt)
                cleaned_json_string = graph_response.text.strip().replace("```json", "").replace("```", "").strip()
                dependency_graph = json.loads(cleaned_json_string)
                print("Successfully generated dependency graph.")
            except Exception as e:
                print(f"Error generating or parsing dependency graph: {e}")
                dependency_graph = [{"concept": c, "prerequisites": []} for c in cleanedSummary]

        # Prompt 3: Sort by Difficulty
        print("Sorting concepts by difficulty with Gemini...")
        datesPrompt = f"""Sort the following keywords for a {career_topic} student by difficulty (easiest to hardest) Keywords: {', '.join(cleanedSummary)} Return them as a simple comma-separated list in order."""
        datesResponse = gemini_model.generate_content(datesPrompt)
        summaryDates = datesResponse.text
        print(f"Sorted by difficulty: {summaryDates}")

        for item in summaryDates.split(","):
            item = item.strip()
            parsed_summary.append({"concept": item, "day": None})

    except Exception as e:
        summary = f"Error generating learning plan with Gemini: {str(e)}"

    return {
        "summary": summary,
        "parsed_summary": parsed_summary,
        "dependency_graph": dependency_graph
    }

def fetch_youtube_search_titles_and_urls(query, max_results=15):
    """Scrapes YouTube search results for video titles and URLs."""
    try:
        url = "https://www.youtube.com/results"
        resp = requests.get(url, params={"search_query": query})
        resp.raise_for_status()
        html = resp.text

        m = re.search(r"ytInitialData\s*=\s*({.*?});</script>", html, re.DOTALL)
        if not m:
            print("Could not find ytInitialData. YouTube layout may have changed.")
            return []
        data = json.loads(m.group(1))

        section = (data
            ["contents"]["twoColumnSearchResultsRenderer"]
            ["primaryContents"]["sectionListRenderer"]
            ["contents"]
        )
        results = []
        for sec in section:
            items = sec.get("itemSectionRenderer", {}).get("contents", [])
            for it in items:
                vr = it.get("videoRenderer")
                if not vr:
                    continue
                runs = vr["title"]["runs"]
                title = "".join(run["text"] for run in runs)
                video_id = vr.get("videoId")
                if not video_id:
                    continue
                video_url = f"https://www.youtube.com/watch?v={video_id}"
                results.append({"title": title, "url": video_url})
                if len(results) >= max_results:
                    return results
        return results
    except Exception as e:
        print(f"Error fetching YouTube results for query '{query}': {e}")
        return []

def generate_video_recommendations(videoList, topic, context="a specialist"):
    """Uses Gemini to select the best 2 videos and estimate learning time."""
    video_list_str = "\n".join([f"- {video['title']}" for video in videoList])
    
    # The 'query' (topic) and 'context' are now dynamic
    prompt = (
        f"Given the following list of YouTube video titles, select the top 2 most relevant for learning "
        f"'{topic}' to become {context}. Return only the titles, one per line, exactly "
        f"as they appear in the list. After the titles, add a line with an estimate of how many days it "
        f"will take an intern to learn this topic (e.g., days: 1, days: 2, etc..)\n\n{video_list_str}"
    )

    try:
        response = gemini_model.generate_content(prompt)
        summaryList = [title.strip() for title in response.text.split('\n') if title.strip()]
    except Exception as e:
        summaryList = [f"Error generating summary with Gemini: {str(e)}"]

    days = None
    video_titles = []

    for item in summaryList:
        if item.lower().startswith('days:'):
            try:
                days = int(item.split(':')[1].strip())
            except (IndexError, ValueError):
                days = None
        else:
            video_titles.append(item)

    for title in video_titles:
        if not title.strip():
            continue
        video_url = next((video['url'] for video in videoList if video['title'].strip() == title), "")
        if video_url:
            # The 'query' column now stores the main career_topic
            cursor.execute(
                "INSERT INTO rec_videos (query, title, url, days) VALUES (?, ?, ?, ?)",
                (context, title, video_url, days)
            )
    conn.commit()
    return {"summaryList": summaryList}

# --- 3. MAIN EXECUTION LOGIC ---

def main():
    
        # pdf_path = input("Please enter the path to your PDF: ").strip().replace("'", "").replace('"', '')
    pdf_path = "requisitos-examen-ceneval-ICOMPU-2.pdf"
    #     if not (pdf_path.endswith(".pdf") and os.path.exists(pdf_path)):
    #         raise ValueError("Invalid file. Please provide a valid .pdf file path.")
    # except (ValueError, EOFError) as e:
    #     print(e)
    #     return

    # 1. Extract text from the single PDF
    print(f"Processing {pdf_path}...")
    doc_data = extract_toc_and_text(pdf_path)
    # Prioritize TOC, but fall back to body text
    context_text = doc_data['toc'] if doc_data['toc'] else doc_data['text']

    if not context_text:
        print("Could not extract any text from the PDF.")
        return

    # 2. Identify the career/topic (Local Model)
    career_topic = identify_career_topic(context_text)

    # 3. Generate the full learning plan (Gemini)
    plan = generate_learning_plan(context_text, career_topic)

    # Print the dependency graph
    print("\n--- Concept Dependency Graph ---")
    print(json.dumps(plan.get("dependency_graph", "Not generated."), indent=2))
    print("--------------------------------\n")

    # 4. Find video recommendations for the generated concepts
    concepts_to_search = [item['concept'] for item in plan.get('parsed_summary', [])]

    if not concepts_to_search:
        print("No concepts were generated to search for videos.")
    else:
        print("--- Finding Video Recommendations ---")
        for concept in concepts_to_search:
            # Create a dynamic, context-aware search query
            enhanced_search_query = f"{concept} tutorial for {career_topic}"
            print(f"\nSearching for videos with query: '{enhanced_search_query}'")

            videoList = fetch_youtube_search_titles_and_urls(enhanced_search_query, max_results=8)

            if videoList:
                # Pass the dynamic career_topic as the context
                resultVideo = generate_video_recommendations(videoList, concept, career_topic)
                print(f"Recommended content for '{concept}': {resultVideo['summaryList']}")
            else:
                print(f"Could not find any videos for '{concept}'")

    # 5. Display all results from the database
    print("\n--- All Recommendations in Database ---")
    cursor.execute("SELECT query, title, url, days FROM rec_videos")
    video_data = cursor.fetchall()
    for row in video_data:
        # The 'query' column now stores 'Chemical Engineering', 'Mathematics', etc.
        print(f"Topic: {row[0]}, Title: {row[1]}, URL: {row[2]}, Days: {row[3]}")

    conn.close()
    print("\nProcess finished.")

if __name__ == "__main__":
    main()