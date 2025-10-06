from sqlalchemy import Column, Integer, String, JSON, select, delete, update
from sqlalchemy.dialects.postgresql import UUID,JSONB
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from ..database.db import get_session, Base
from .entities.Path import Path
import uuid

class PathTable(Base):
    __tablename__ = 'path'
    
    id = Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    name = Column(String, nullable=False)
    major = Column(String)
    email = Column(String)
    keywords = Column(JSONB)

class PathModel:
    
    @classmethod
    def get_collections(cls):
        try:
            session = get_session()
            paths = []
            
            stmt = select(PathTable).order_by(PathTable.name.asc())
            results = session.execute(stmt).scalars().all()
            
            for row in results:
                path = Path(row.id,row.name,row.major,row.email,row.keywords)
                paths.append(path.to_JSON())
            
            session.close()
            return paths
        
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def add_path(cls,path):
        try:
            session = get_session()
            
            new_path = PathTable(
                id = path.id if hasattr(path,'id') and path.id else uuid.uiid4(),
                name = path.name,
                major = path.major,
                email = path.email,
                keywords = path.keywords
            )    
            
            session.add(new_path)
            session.commit()
            affected_rows = 1
            
            return affected_rows
        except IntegrityError as ex:
            session.rollback()
            raise Exception(ex)
        except Exception as ex:
            session.rollback()
            raise Exception(ex)
        finally:
            session.close()
    
    @classmethod
    def delete_path(cls,path):
        try:
            session = get_session()
            
            stmt = delete(PathTable).where(PathTable.id == path.id)
            result = session.execute(stmt)
            affected_rows = result.rowcount
            session.commit()
            
            session.close()
            return affected_rows
        except Exception as ex:
            session.rollback()
            raise Exception(ex)
        
#Update path va aqui
    
    @classmethod
    def get_path_from_db(cls):
        try:
            session = get_session()
            
            stmt = select(
                PathTable.id,
                PathTable.name,
                PathTable.major,
                PathTable.email,
                PathTable.keywords
            )    
            results = session.execute(stmt).all()
            
            session.close()
            
            print(f"Succesfully fetched {len(results)} rows from db")
            return results
        except Exception as error:
            print(f"Error connecting to or fetching from database.")
            return []
    
            
    