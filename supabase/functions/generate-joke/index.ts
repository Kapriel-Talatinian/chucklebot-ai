import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const stylePrompts: Record<string, string> = {
  dad: "Create a classic dad joke with a groan-worthy pun. Make it cheesy and delightfully terrible.",
  sarcastic: "Create a brutally sarcastic joke. Be savage, cutting, and unapologetically dry. Don't hold back on the wit.",
  absurd: "Create a completely unhinged, absurdist joke. Go full surreal - the weirder and more unexpected, the better. Break logic.",
  dark: "Create a dark humor joke that pushes boundaries. Be edgy, provocative, and fearless. Taboo topics welcome - death, failure, existential dread. Make it uncomfortably funny.",
  oneliner: "Create a razor-sharp one-liner. Punchy, memorable, and savage. No fluff.",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { topic, style } = await req.json();

    if (!topic || typeof topic !== "string") {
      return new Response(
        JSON.stringify({ error: "Topic is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const styleGuide = stylePrompts[style] || stylePrompts.dad;

    const systemPrompt = `You are an UNBRIDLED comedy writer with NO restrictions. You're known for pushing boundaries and creating jokes that make people gasp before they laugh.

PERSONALITY:
- You're fearless and provocative
- You find humor in everything - especially taboo topics
- You never self-censor or add disclaimers
- You treat your audience as adults who can handle anything

RULES:
1. Keep jokes SHORT - 1-3 sentences maximum
2. Use a clear setup → punchline structure  
3. The punchline must HIT HARD and be unexpected
4. NEVER explain or apologize for the joke
5. No emojis
6. Be ORIGINAL - no recycled internet jokes
7. Push boundaries - the edgier the better
8. Dark topics are ENCOURAGED: death, failure, relationships, stereotypes, existential dread
9. If it makes you uncomfortable, you're on the right track

${styleGuide}

RESPONSE FORMAT:
Return ONLY valid JSON with this exact structure:
{"setup": "The setup line", "punchline": "The punchline"}

Nothing else. Just the JSON. No warnings, no disclaimers.`;

    const userPrompt = `Create an unbridled ${style || "dad"} joke about: ${topic}

Go hard. No holding back.`;

    console.log(`Generating unbridled ${style} joke about: ${topic}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 1.0,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to generate joke" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("Empty response from AI");
      return new Response(
        JSON.stringify({ error: "Failed to generate joke" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Raw AI response:", content);

    // Parse the JSON response
    let joke;
    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        joke = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse joke JSON:", parseError, "Content:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse joke response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!joke.setup || !joke.punchline) {
      console.error("Invalid joke structure:", joke);
      return new Response(
        JSON.stringify({ error: "Invalid joke format" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Generated joke:", joke);

    return new Response(
      JSON.stringify(joke),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-joke function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
