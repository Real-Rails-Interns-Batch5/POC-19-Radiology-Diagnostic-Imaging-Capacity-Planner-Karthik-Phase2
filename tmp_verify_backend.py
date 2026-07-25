from backend.main import app
from fastapi.testclient import TestClient

client = TestClient(app)
for path in ['/', '/health']:
    resp = client.get(path)
    print(path, resp.status_code, resp.text)
