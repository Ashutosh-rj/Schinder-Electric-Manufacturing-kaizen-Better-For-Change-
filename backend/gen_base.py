import os
from pathlib import Path

BASE_DIR = Path(r"D:\Hackthaon\Scnider\Kaizen Changer for Better\kaizen\backend")

def write_file(rel_path, content):
    full_path = BASE_DIR / rel_path
    full_path.parent.mkdir(parents=True, exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

# DOCKER & REQS
write_file("Dockerfile", """
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN mkdir -p logs models
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
""")

write_file("requirements.txt", """
fastapi==0.111.0
uvicorn[standard]==0.30.1
pydantic==2.7.1
pydantic-settings==2.3.1
sqlalchemy==2.0.30
asyncpg==0.29.0
alembic==1.13.1
bcrypt==4.1.3
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9
httpx==0.27.0
redis==5.0.4
aiokafka==0.11.0
minio==7.2.7
numpy==1.26.4
pandas==2.2.2
scipy==1.13.0
scikit-learn==1.5.0
prometheus-fastapi-instrumentator==7.0.0
structlog==24.1.0
python-dateutil==2.9.0
""")

write_file("alembic.ini", """
[alembic]
script_location = alembic
sqlalchemy.url = postgresql+asyncpg://postgres:postgres@localhost:5432/kaizen
""")

print("Base setup done.")
