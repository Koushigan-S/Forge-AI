import unittest
import json
from fastapi.testclient import TestClient
from main import app

class TestForgeAIBackend(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "online")

    def test_predict_healthy(self):
        payload = {
            "temperature": 45.0,
            "vibration": 2.1,
            "current": 12.0,
            "rpm": 1800.0
        }
        response = self.client.post("/api/predict", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreater(data["health_score"], 80)
        self.assertEqual(data["status"], "Healthy")
        self.assertEqual(data["color_code"], "#10b981")

    def test_predict_critical(self):
        payload = {
            "temperature": 110.0,
            "vibration": 14.0,
            "current": 48.0,
            "rpm": 4800.0
        }
        response = self.client.post("/api/predict", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertLess(data["health_score"], 45)
        self.assertEqual(data["status"], "Critical")
        self.assertEqual(data["color_code"], "#ef4444")

    def test_telemetry_history(self):
        response = self.client.get("/api/telemetry")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue("history" in data)
        self.assertEqual(len(data["history"]), 24)

if __name__ == "__main__":
    unittest.main()
