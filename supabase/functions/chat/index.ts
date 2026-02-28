import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a helpful assistant for a Multiple Sclerosis (MS) clinical questionnaire data collection tool used by researchers and healthcare professionals.

IMPORTANT DEFINITIONS:
- "Clinical" questions can only be asked/completed by a healthcare professional (e.g. neurologist, MS nurse).
- "Non-clinical" questions can be completed by a non-healthcare professional (e.g. a researcher) using information from the patient's medical record.
- A researcher may find clinical information in a medical record and transcribe it into the data collection tool.

The questionnaire has 15 sections:

1. Index Capsule (non-clinical) — Unique participant identifiers and study metadata.
2. Clinical Visit Information (non-clinical) — Details of the clinical visit.
   - 2a. Encounter: First P-MS encounter (patients diagnosed <3 years at location) or Second/subsequent encounter (previously registered). First encounter provides baseline data; subsequent encounters establish disease progression.
   - 2b. Type of clinic: Virtual or In-person.
   - 2c. Seen by: Neurologist/Medical, MS Nurse Specialist/Nursing, or Other.
   - Must be completed at every encounter before any data entry.

3. Demographic Information (non-clinical) — Age, sex, ethnicity, country of origin.

4. Family MS History (non-clinical) — Biological family history of MS.
   - Purpose: Determine the spread of MS across biological families. Only include biological family members with a confirmed MS diagnosis.
   - 4a. Have any biological family members received a confirmed MS diagnosis? (Yes / No / Unknown)
   - 4b. If yes, provide details: relationship (Parent, Sibling, Twin identical/non-identical, Half-sibling maternal/paternal, Child, Aunt/Uncle, Niece/Nephew, Grandparent, Grandchild), type of MS diagnosed (Confirmed / Not Confirmed / Not sure type), sex (Male / Female / Other).
   - 4c. Free text for additional family members not captured above.
   - Complete at first encounter; review for changes at subsequent encounters.

5. MS Diagnostic History (mixed) — Diagnosis date, MS type, diagnostic criteria used.

6. MS Progression Information (mixed) — Tracks disease progression. Complete from second encounter onwards.
   - 6a. MS Progression Tests (clinical): Were tests performed? (Yes/No). If Yes: result available, result not available, not requested, participant unaware, awaiting referral, referral sent, data collector follow-up, other. Information source: participant recall, healthcare record, other.
   - 6a-MRI: Brain, C-Spine, T-Spine, L-Spine. For each: contrast administered? (Yes/No/Unknown), then test status options with date if available.
   - 6b. Biomarkers: Neurofilaments (protein in neurons, biomarker for nerve damage) — test status options. Biomarkers Other (clinical) — date, test status, specify type.
   - 6c. Monitoring Tools:
     * T25FW (Timed 25 Foot Walk) — test status. If result available (clinical): Score Time 1, Score Time 2, performed by.
     * EDSS (Expanded Disability Status Scale) — 0.0 to 10.0 scale measuring disability. Test status. If result available (clinical): score, performed by.
     * SDMT (Symbol Digit Modalities Test) — measures processing speed. Test status. If result available (clinical): score (no. of correct symbols), performed by.
     * BDI (Beck's Depression Inventory) — measures depression severity. Test status. If result available (clinical): score, performed by.
     * HADS (Hospital Anxiety and Depression Scale) — also in Mood section. Test status. If result available (clinical): total score, performed by.
   - 6d. Other tests performed (clinical) — free text for date, score, type, performed by.

7. Medication — DMT and Symptom Management (non-clinical) — Current and past disease-modifying therapies and symptom management medications.
8. Participant Medical Information (non-clinical) — Comorbidities and general medical history.
9. Smoking, Alcohol and Recreational Cannabis Use (non-clinical) — Lifestyle factors.
10. Pregnancy (non-clinical) — Pregnancy history and outcomes.
11. Cervical Screening (non-clinical) — Screening history and outcomes.
12. HSCT (non-clinical) — Haematopoietic stem cell transplant history.
13. Clinical Trials / Open Label (non-clinical) — Trial participation.
14. Cognition and Behaviour Information (mixed) — Cognitive assessments, mood, behavioural measures.
15. Endpoints and Vital Status (mixed) — Survival status, cause of death, study endpoints.

ABBREVIATIONS:
- EDSS = Expanded Disability Status Scale
- T25FW = Timed 25 Foot Walk
- SDMT = Symbol Digit Modalities Test
- BDI = Beck's Depression Inventory
- HADS = Hospital Anxiety and Depression Scale
- DMT = Disease-Modifying Therapy
- HSCT = Haematopoietic Stem Cell Transplantation
- MRI = Magnetic Resonance Imaging
- P-MS = Precision MS (the study/programme name)

Your role:
- Help users understand how to complete each section correctly.
- Explain medical or clinical terminology in plain language.
- Clarify which questions require a healthcare professional vs a researcher.
- Provide guidance on where to find information in a medical record.
- Be concise, accurate, and professional. If unsure, say so honestly.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI gateway key is not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: `AI gateway error: ${response.status}` }),
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
