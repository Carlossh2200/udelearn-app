import re
import requests
import json
import google.generativeai as genai
from sentence_transformers import SentenceTransformer, util
from sentence_transformers import SentenceTransformer, util
from utils.utils_for_extracting import remove_semantically_similar
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import DatabaseError
from contextlib import contextmanager
Base = declarative_base()

DATABASE_URL = "postgresql://postgres:myscoQ-bojnu3-seqtax@db.urgaduirlpcawuyuwemy.supabase.co:5432/postgres"

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=False,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

@contextmanager
def session_scope():
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

class RecVideo(Base):
    __tablename__ = 'rec_videos'

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String(16), index=True)
    career_topic = Column(String(255))
    concept = Column(String(255))
    title = Column(Text)
    url = Column(Text)
    days = Column(Integer, nullable=True)

def init_db():
    print("Inicializando tablas en supabase")
    Base.metadata.create_all(bind=engine)
    print("Tablas inicializadas.")


print("Cargando modelos...")
try:
    API_KEY = "AIzaSyD0JuHylU7ed6j-x2neQn2H0_OdyhKRVsg" 
    if not API_KEY:
        print("GEMINI_API_KEY no cargada")
    
    genai.configure(api_key=API_KEY)
    gemini_model = genai.GenerativeModel('gemini-2.5-flash-preview-09-2025')
    summaryModel = SentenceTransformer("all-MiniLM-L6-v2")
    print("Modelos cargados con exito.")
except Exception as e:
    print(f"Error cargando modelos: {e}")


def generate_learning_plan(context_text, career_topic):
    dependency_graph = []
    parsed_summary = []
    summary = ""

    prompt = (f"Based on the following context about {career_topic}, what are the most important "
              f"*technical skills*, *learning topics*, *tools*, and *core concepts* "
              f"to become a specialist in this field? "
              f"Return them as a simple comma-separated list of keywords.\n\nContext:\n{context_text}")

    try:
        print("Generating core concepts with Gemini...")
        response = gemini_model.generate_content(prompt)
        summary = response.text
        concepts = [c.strip() for c in summary.split(",") if c.strip() and len(c) > 1]
        
        if not concepts:
            print("No concepts generated from the text.")
            return {"summary": "No concepts generated.", "parsed_summary": [], "dependency_graph": []}
            
        summaryEmbeddings = summaryModel.encode(concepts, convert_to_tensor=True)
        cleanedSummary = remove_semantically_similar(concepts, summaryEmbeddings, threshold=0.7)
        print(f"Refined concepts: {', '.join(cleanedSummary)}")

        if cleanedSummary:
            try:
                print("Generating dependency graph with Gemini...")
                dependency_prompt = (
                    f"Given the following list of topics for {career_topic}: {', '.join(cleanedSummary)}. "
                    "Structure these as a dependency graph in JSON format. Each object in the array "
                    "should have a 'concept' key and a 'prerequisites' key. "
                    "If a topic has no prerequisites, use an empty array. Respond ONLY with the valid JSON array."
                    "Example: [{\"concept\": \"Python\", \"prerequisites\": []}, {\"concept\": \"Flask\", \"prerequisites\": [\"Python\"]}]"
                )
                graph_response = gemini_model.generate_content(dependency_prompt)
                cleaned_json_string = graph_response.text.strip().replace("```json", "").replace("```", "").strip()
                dependency_graph = json.loads(cleaned_json_string)
                print("Successfully generated dependency graph.")
            except Exception as e:
                print(f"Error generating or parsing dependency graph: {e}")
                dependency_graph = [{"concept": c, "prerequisites": []} for c in cleanedSummary]

            print("Sorting concepts by difficulty with Gemini...")
            datesPrompt = f"""Sort the following keywords for a {career_topic} student by difficulty (easiest to hardest) Keywords: {', '.join(cleanedSummary)} Return them as a simple comma-separated list in order."""
            datesResponse = gemini_model.generate_content(datesPrompt)
            summaryDates = datesResponse.text
            print(f"Sorted by difficulty: {summaryDates}")

            for item in summaryDates.split(","):
                item = item.strip()
                if item:
                    parsed_summary.append({"concept": item, "day": None})

    except Exception as e:
        summary = f"Error generating learning plan with Gemini: {str(e)}"
        print(summary)

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


def generate_video_recommendations(videoList, topic, career_topic, run_id, session):
    """
    MODIFIED: Uses Gemini, then adds RecVideo objects to the session.
    It no longer takes 'conn' and does not commit.
    """
    video_list_str = "\n".join([f"- {video['title']}" for video in videoList])
    
    prompt = (
        f"Given the following list of YouTube video titles, select the top 2 most relevant for learning "
        f"'{topic}' to become a specialist in {career_topic}. Return only the titles, one per line, exactly "
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
            # Create a new RecVideo object
            new_video = RecVideo(
                run_id=run_id,
                career_topic=career_topic,
                concept=topic,
                title=title,
                url=video_url,
                days=days
            )
            session.add(new_video)
            
    return {"summaryList": summaryList}