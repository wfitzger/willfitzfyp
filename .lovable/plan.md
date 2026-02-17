
## AI Chatbot with OpenAI — Implementation Plan

### Prerequisites
- Lovable Cloud is already active (confirmed by existing `LOVABLE_API_KEY` secret)
- Your new OpenAI API key will be stored securely as `OPENAI_API_KEY`

---

### Step 1 — Securely Request Your API Key
I will use the secure secrets prompt to ask for your OpenAI API key. It will be stored encrypted and only accessible inside the edge function — never in browser code.

---

### Step 2 — Create `supabase/config.toml`
Registers the edge function with `verify_jwt = false` so the chatbot works without requiring users to be logged in:

```toml
[functions.chat]
verify_jwt = false
```

---

### Step 3 — Create `supabase/functions/chat/index.ts`
A backend function that:
- Handles CORS (required for browser access)
- Receives the conversation history from the frontend
- Prepends a **system prompt** with full questionnaire context, including all 15 sections:
  - Section 1: Index Capsule (non-clinical)
  - Section 2: Clinical Visit Information (non-clinical)
  - Section 3: Demographic Information (non-clinical)
  - Section 4: Family MS History (non-clinical)
  - Section 5: MS Diagnostic History (mixed)
  - Section 6: MS Progression Information (mixed)
  - Section 7: Medication — DMT and Symptom Management (non-clinical)
  - Section 8: Participant Medical Information (non-clinical)
  - Section 9: Smoking, Alcohol and Recreational Cannabis Use (non-clinical)
  - Section 10: Pregnancy (non-clinical)
  - Section 11: Cervical Screening (non-clinical)
  - Section 12: HSCT (non-clinical)
  - Section 13: Clinical Trials/Open label (non-clinical)
  - Section 14: Cognition and Behaviour Information (mixed)
  - Section 15: Endpoints and Vital Status (mixed)
- Calls OpenAI `gpt-4o-mini` with streaming enabled
- Streams the response back using Server-Sent Events (SSE)
- Returns clear error messages for invalid key or network failures

---

### Step 4 — Add `react-markdown` Dependency
Allows AI responses that include bold text, bullet points, and numbered lists to render properly in the chat bubble rather than showing raw `**` and `*` characters.

---

### Step 5 — Update `src/components/ChatbotPopup.tsx`
- Remove the hardcoded `faqResponses` array and `getResponse` function entirely
- Replace the fake `setTimeout` delay with a real `fetch` call to the edge function
- Pass the full conversation history on every request (so the AI remembers context)
- Implement SSE streaming — tokens appear one-by-one as OpenAI generates them
- Keep the typing indicator visible until the first token arrives
- Render AI responses using `react-markdown` instead of plain `<div>` text
- Disable the input while the AI is responding
- Show a user-friendly toast error if the API call fails

---

### Files
- **Create**: `supabase/config.toml`
- **Create**: `supabase/functions/chat/index.ts`
- **Edit**: `src/components/ChatbotPopup.tsx`
- **Edit**: `package.json` (add `react-markdown`)
