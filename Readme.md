# FastAPI ML Integration Guide

This document explains **how your FastAPI ML service should integrate with the Node.js WebCrawler**. The crawler is already functional up to LLM-based structuring. Your job is to plug in an ML model that **filters and ranks structured pages**.

---

##  Big Picture Architecture

```
[ Web Pages ]
      ↓
[ Node.js Crawler ]
      ↓
[ LLM Structuring (Groq / LLaMA) ]
      ↓   (JSON payload)
[ FastAPI ML Service  ← YOU ARE HERE ]
      ↓
[ Ranked / Filtered JSON Output ]
```

The crawler **will call your FastAPI endpoint**, send structured page data, and expects back a ranked / filtered response.

---

## 🚦 Current Status

* ✅ Web crawling: DONE
* ✅ LLM structuring: DONE
* ❌ ML filtering via FastAPI: **NOT READY YET (your task)**

Until your service is ready, the crawler fails at Stage 3.

---

##  Environment Variables (Important)

The Node.js crawler expects these variables:

```env
USE_FASTAPI=true
FAST_API_URL=http://127.0.0.1:8000/filter
```

* `USE_FASTAPI` → Enables FastAPI filtering stage
* `FAST_API_URL` → Endpoint your FastAPI app exposes

Your service **must match this URL and contract**.

---

##  Request Payload (What You Receive)

The crawler sends **an array of structured pages**.

### Example Request

```json
{
  "pages": [
    {
      "url": "https://www.geeksforgeeks.org/...",
      "priority_features": {
        "page_summary": "Intro to ML",
        "primary_topic": "Machine Learning",
        "key_entities": ["ML", "AI", "Python"],
        "content_depth": 1,
        "is_actionable": true
      },
      "spam_features": {
        "link_density": 0,
        "has_urgency_words": false,
        "is_error_page": false,
        "grammar_quality_score": 1,
        "suspicious_patterns": 0
      }
    }
  ]
}
```

You **do not crawl**. You **do not call LLMs**. You only process this JSON.

---

##  Expected Response (What You Return)

You should return **filtered and ranked pages**.

### Minimum Required Format

```json
{
  "results": [
    {
      "url": "https://www.geeksforgeeks.org/...",
      "score": 0.92,
      "label": "high_quality"
    }
  ]
}
```

### Rules

* `score` → float between `0 and 1`
* `label` → your model’s classification (free to design)
* Order matters: **highest score first**

---

##  Model Freedom (Up to You)

---

## ⚙️ FastAPI Skeleton (Minimal)

```python
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class Page(BaseModel):
    url: str
    priority_features: dict
    spam_features: dict

class RequestBody(BaseModel):
    pages: List[Page]

@app.post("/filter")
def filter_pages(data: RequestBody):
    # TODO: apply ML logic
    return {"results": []}
```

---

##  Local Testing

Run your service:

```bash
uvicorn main:app --reload
```

Test manually:

```bash
curl -X POST http://127.0.0.1:8000/filter \
  -H "Content-Type: application/json" \
  -d @sample.json
```

---

##  Common Failure Modes

*  Wrong endpoint path
*  Different response JSON shape
*  Server not running when crawler starts
*  Score not numeric

If anything breaks, the crawler **fails hard**.

---

##  Goal

Your service should:

✔ Accept structured pages
✔ Score & rank them
✔ Return clean JSON
✔ Be fast (<100ms per request)

Once this works, the crawler becomes a **full ML-powered web intelligence pipeline**.

---

If anything here is unclear, **do not change the Node.js side** — adapt FastAPI to this contract.
