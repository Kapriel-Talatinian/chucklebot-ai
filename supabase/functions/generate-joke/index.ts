import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const stylePrompts: Record<string, string> = {
  dad: "Create a wholesome dad joke with a groan-worthy pun. It should be family-friendly and make people roll their eyes while smiling.",
  sarcastic: "Create a sarcastic, dry-wit joke. Use irony and deadpan humor. Be clever and subtly cutting.",
  absurd: "Create an absurd, surreal joke. The humor should come from unexpected and bizarre connections. Be weird and surprising.",
  dark: "Create a dark humor joke that's edgy but still tasteful. Push boundaries cleverly without being offensive or crude.",
  oneliner: "Create a quick one-liner zinger. It should be punchy, memorable, and land immediately.",
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

    const systemPrompt = `You are JokeCrafter, a master comedy writer. Your job is to create short, punchy jokes that land perfectly.

RULES:
1. Keep jokes SHORT - 1-3 sentences maximum
2. Use a clear setup → punchline structure
3. The punchline must be surprising and clever
4. No explaining the joke
5. No emojis in the joke itself
6. Be original - no tired internet jokes

${styleGuide}

RESPONSE FORMAT:
Return ONLY valid JSON with this exact structure:
{"setup": "The setup line", "punchline": "The punchline"}

Nothing else. Just the JSON.`;

    const userPrompt = `Create a ${style || "dad"} joke about: ${topic}`;

    console.log(`Generating ${style} joke about: ${topic}`);

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
        temperature: 0.9,
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
