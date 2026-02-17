import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a helpful assistant for a Multiple Sclerosis (MS) clinical questionnaire data collection tool used by researchers and healthcare professionals.

The questionnaire is organised into 15 sections:

1. Index Capsule (non-clinical) — Unique participant identifiers and study metadata.
2. Clinical Visit Information (non-clinical) — Details of the clinical visit date and site.
3. Demographic Information (non-clinical) — Age, sex, ethnicity, country of origin.
4. Family MS History (non-clinical) — Family history of MS in first/second-degree relatives.
5. MS Diagnostic History (mixed) — Diagnosis date, MS type, diagnostic criteria used.
6. MS Progression Information (mixed) — EDSS scores, relapse history, disease course.
7. Medication — DMT and Symptom Management (non-clinical) — Current and past disease-modifying therapies and symptom management medications.
8. Participant Medical Information (non-clinical) — Comorbidities and general medical history.
9. Smoking, Alcohol and Recreational Cannabis Use (non-clinical) — Lifestyle factors and substance use history.
10. Pregnancy (non-clinical) — Pregnancy history and outcomes.
11. Cervical Screening (non-clinical) — Cervical screening history and outcomes.
12. HSCT (non-clinical) — Haematopoietic stem cell transplant history.
13. Clinical Trials / Open Label (non-clinical) — Participation in clinical trials or open-label studies.
14. Cognition and Behaviour Information (mixed) — Cognitive assessments, mood, and behavioural measures.
15. Endpoints and Vital Status (mixed) — Survival status, cause of death, study endpoints.

Definitions:
- **Non-clinical sections** do not require clinical judgement and can be completed by a researcher using information from the patient's medical record.
- **Mixed sections** contain some questions that require clinical judgement from a qualified healthcare professional (e.g. neurologist, MS nurse), as well as questions that can be completed by a researcher.

Your role:
- Help users understand how to complete each section correctly.
- Explain the meaning of medical or clinical terminology in plain language.
- Clarify when a question requires a healthcare professional versus a researcher.
- Provide guidance on where to find specific information in a medical record.
- Be concise, accurate, and professional. If you are unsure about something, say so honestly.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key is not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error:", response.status, errorText);

      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: "Invalid OpenAI API key. Please check your configuration." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat function error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
