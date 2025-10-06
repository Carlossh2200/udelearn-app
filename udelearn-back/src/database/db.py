from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import DatabaseError
from decouple import config
from contextlib import contextmanager

# Create the declarative base
Base = declarative_base()

DATABASE_URL = "postgresql://postgres:myscoQ-bojnu3-seqtax@db.urgaduirlpcawuyuwemy.supabase.co:5432/postgres"

# Create the engine
# For Supabase, you may want to add these connection pool settings
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Verify connections before using them
    pool_size=10,        # Number of connections to maintain
    max_overflow=20,     # Maximum number of connections to create beyond pool_size
    echo=False,          # Set to True to see SQL queries (useful for debugging)
)

# Create a sessionmaker
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_session():
    try:
        session = SessionLocal()
        return session
    except DatabaseError as ex:
        raise ex

def get_connection():
    return get_session()


@contextmanager
def session_scope():
    """
    Provide a transactional scope around a series of operations.
    Usage:
        with session_scope() as session:
            session.add(some_object)
            # session.commit() is called automatically
    """
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

# Initialize database tables (run this once)
def init_db():
    """
    Create all tables defined in your models.
    Call this once when setting up your database.
    """
    Base.metadata.create_all(bind=engine)

def drop_all_tables():
    """
    Drop all tables. Use with caution!
    Only for development/testing.
    """
    Base.metadata.drop_all(bind=engine)