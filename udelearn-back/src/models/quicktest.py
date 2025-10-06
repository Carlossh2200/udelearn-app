from .PathModel import PathModel
from .entities.Path import Path
import uuid

# Create test collection
test_col = Path(
    id=uuid.uuid4(),
    name="Test Person",
    major="Computer Science",
    email="test@example.com",
    keywords={"skills": ["Python", "SQL"]}
)

# Add it
result = PathModel.add_path(test_col)
print(f"Added: {result} row(s), ID: {test_col.id}")

# Verify
fetched = PathModel.get_path_from_db()
print(f"Retrieved: {fetched}")