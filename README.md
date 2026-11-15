# OKUConnect

**A bilingual (Bahasa Malaysia / English) disability support information assistant for OKU in Malaysia**

Final Year Project (FYP II) – Bachelor of Information Systems (Hons), Universiti Teknologi PETRONAS
Author: Nur Alisya Nadhra binti Ahmad Nizar (22000734)
Supervisor: TS. Dr. Emelia Akashah binti Patah Akhir

---

## About the project

Information about support for OKU (Orang Kurang Upaya / persons with disabilities) in Malaysia is spread across many agency websites, including JKM, PERKESO/SOCSO, LHDN and the Ministry of Education. OKUConnect brings that information together into one knowledge base. Users ask questions in Bahasa Malaysia or English through an accessible web portal or a Telegram bot and get answers that cite the official sources.

The system uses **Retrieval-Augmented Generation (RAG)**. Answers are generated from verified documents stored in a vector database, so the language model doesn't rely on its own memory.

### Main features

- Accessible web portal designed to WCAG 2.1 AA guidelines, with a BM/EN language toggle
- Telegram bot with menu buttons, related-topic suggestions and answer feedback (👍 / 👎)
- Answers grounded in official sources, with source links included
- Automatic weekly checks of source web pages. Changed pages are re-ingested into the knowledge base.
- Weekly scheme digest for Telegram subscribers (opt in and opt out)
- Anonymised chat logging (session IDs are hashed) for monitoring and evaluation
- Repeatable evaluation runner covering 20 test queries for the Information Quality (IQ) assessment

---

## Repository structure

```
okuconnect/
├── portal/              # Web portal (HTML5, CSS3, JavaScript)
├── n8n-workflows/       # Exported n8n workflows (JSON, credentials removed)
│   ├── OKUConnect - Chat.json
│   ├── OKUConnect - Telegram.json
│   ├── OKUConnect - Web Ingest.json
│   ├── OKUConnect - Load Knowledge Base.json
│   └── OKUConnect - Evaluation Runner.json
├── supabase/            # Database schema (SQL)
└── README.md
```

---

## System architecture

OKUConnect has four layers:

| Layer | Components |
|---|---|
| User interface | Web portal, Telegram bot |
| Orchestration | n8n workflows |
| AI / RAG engine | n8n AI Agent, OpenAI chat model, OpenAI embeddings |
| Knowledge base | Supabase (PostgreSQL + pgvector) |

**How a question is answered:**

1. The user sends a question from the portal or Telegram.
2. The **Chat** workflow passes it to an AI Agent.
3. The agent searches the `documents` table in Supabase with vector similarity search over OpenAI embeddings.
4. The language model writes an answer from the retrieved chunks only, in the user's language, with source links.
5. The question, answer, sources and status (`answered`, `no_info` or `out_of_scope`) are logged to `chat_logs`.

---

## n8n workflows

| Workflow | Trigger | Purpose |
|---|---|---|
| **Chat** | Chat webhook | Main RAG pipeline. Answers questions from the portal and Telegram and logs each exchange. |
| **Telegram** | Telegram trigger | Handles bot messages, menu buttons, feedback votes and weekly-update subscriptions, then forwards questions to the Chat workflow. |
| **Web Ingest** | Schedule | Checks official source pages for changes (by page hash), replaces outdated chunks, sends an admin summary and sends the weekly digest to subscribers. |
| **Load Knowledge Base** | n8n form | Manual upload of documents (acts, scheme pages, FAQs, official replies, budget documents) with metadata such as effective date and last-verified date. Text is split into chunks (200-character overlap) and embedded. |
| **Evaluation Runner** | Manual | Sends the 20 IQ test queries (BM and EN, including out-of-scope questions) to the Chat workflow, each in a separate session, and exports the answers and response times to `okuconnect-eval-answers.xlsx`. |

---

## Database (Supabase)

The schema is in `/supabase`. Main tables:

| Table | Purpose |
|---|---|
| `documents` | Knowledge base chunks, embeddings and metadata (source URL, scheme name, topic) |
| `chat_logs` | Anonymised log of questions, answers, sources, language, channel and status |
| `feedback` | User 👍 / 👎 votes on answers |
| `subscribers` | Telegram users subscribed to the weekly digest, with their preferred language |
| `page_hashes` | Last-checked and last-changed records for monitored source pages |

---

## Setup

### Requirements

- An [n8n](https://n8n.io) instance (self-hosted or n8n Cloud)
- A [Supabase](https://supabase.com) project with the `pgvector` extension enabled
- An OpenAI API key
- A Telegram bot token from [@BotFather](https://t.me/BotFather)

### Steps

1. **Database**: In the Supabase SQL Editor, run the SQL files in `/supabase` to create the tables and the vector search function.
2. **Workflows**: In n8n, go to *Workflows → Import from File* and import each JSON file from `/n8n-workflows`.
3. **Credentials**: In n8n, create the following credentials and assign them to the matching nodes in each workflow:
   - Supabase API (project URL and service key)
   - Postgres (Supabase database connection)
   - OpenAI API
   - Telegram API (bot token)
4. **Knowledge base**: Activate **Load Knowledge Base**, open its form URL and upload the source documents. Alternatively, run **Web Ingest** to fetch the monitored pages.
5. **Activate**: Turn on the **Chat**, **Telegram** and **Web Ingest** workflows.
6. **Portal**: In the portal's JavaScript, set the chat endpoint to the webhook URL of your Chat workflow, then open `index.html` or deploy the `/portal` folder to any static hosting service.

---

## Evaluation

The `/evaluation` folder contains the Information Quality (IQ) workbook used in Chapter 4 of the dissertation. It contains:

- the 20 test queries (10 BM, 10 EN, including out-of-scope and unanswerable questions)
- the answers OKUConnect generated, as exported by the Evaluation Runner
- the scores for each IQ dimension and the response times

To reproduce the answers, import and run the **Evaluation Runner** workflow. You may need to change the Chat webhook URL in the *Ask OKUConnect* node to match your n8n instance.

---

## Security note

All API keys, tokens, passwords and credential values have been **removed** from the exported workflows. Credential references in the JSON files are placeholders, so you must connect your own accounts before the workflows will run.

---

## Disclaimer

OKUConnect is an academic prototype. It gives general information from official Malaysian sources and isn't a substitute for official advice. Users should confirm eligibility and application details with the relevant agency (for example JKM or PERKESO).

---

## Citation

If you refer to this work, please cite:

> N. A. Nadhra, "OKUConnect: A bilingual disability support information assistant for OKU in Malaysia," Final Year Project dissertation, Universiti Teknologi PETRONAS, 2026. [Online]. Available: https://github.com/*alsiyanizar*/okuconnect

---

