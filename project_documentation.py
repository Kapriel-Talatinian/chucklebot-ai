"""
===============================================================================
JOKECRAFTER - DEGEN MODE
Documentation complète du projet
===============================================================================

Ce fichier contient la documentation et la structure complète du projet
JokeCrafter, une application web de génération de blagues alimentée par l'IA.

STACK TECHNOLOGIQUE:
- Frontend: React 18 + TypeScript + Vite
- Styling: Tailwind CSS + Framer Motion (animations)
- Backend: Supabase Edge Functions (Deno)
- IA: Google Gemini via Lovable AI Gateway

===============================================================================
STRUCTURE DU PROJET
===============================================================================
"""

PROJECT_STRUCTURE = {
    "src/": {
        "App.tsx": "Point d'entrée principal de l'application React",
        "main.tsx": "Bootstrap React avec providers",
        "index.css": "Styles globaux, thème sombre, animations CSS",
        
        "components/": {
            "JokeGenerator.tsx": "Composant principal - formulaire de génération",
            "JokeCard.tsx": "Affichage de la blague avec animations",
            "StyleSelector.tsx": "Dropdown pour choisir le style de blague",
            "HistorySidebar.tsx": "Historique des blagues générées",
            "NavLink.tsx": "Composant de navigation",
            "ui/": "Composants shadcn/ui (Button, Card, Dialog, etc.)"
        },
        
        "hooks/": {
            "useJokeGenerator.ts": "Hook pour appeler l'API de génération",
            "useJokeHistory.ts": "Hook pour gérer l'historique (localStorage)"
        },
        
        "types/": {
            "joke.ts": "Types TypeScript pour les blagues"
        },
        
        "pages/": {
            "Index.tsx": "Page d'accueil",
            "NotFound.tsx": "Page 404"
        },
        
        "integrations/supabase/": {
            "client.ts": "Client Supabase (auto-généré)",
            "types.ts": "Types de la base de données (auto-généré)"
        }
    },
    
    "supabase/functions/": {
        "generate-joke/index.ts": "Edge Function - génération de blagues via IA"
    }
}

"""
===============================================================================
TYPES ET INTERFACES
===============================================================================
"""

# Types TypeScript traduits en Python

from typing import TypedDict, Literal
from dataclasses import dataclass

JokeStyle = Literal["dad", "sarcastic", "absurd", "dark", "oneliner"]

@dataclass
class Joke:
    id: str
    topic: str
    style: JokeStyle
    setup: str
    punchline: str
    created_at: int  # timestamp en millisecondes

@dataclass
class JokeHistoryItem(Joke):
    preview: str

JOKE_STYLES = [
    {"value": "dad", "label": "Dad Joke", "description": "Wholesome puns and groaners"},
    {"value": "sarcastic", "label": "Sarcastic", "description": "Dry wit and irony"},
    {"value": "absurd", "label": "Absurd", "description": "Surreal and unexpected"},
    {"value": "dark", "label": "Dark", "description": "Edgy but tasteful"},
    {"value": "oneliner", "label": "One-liner", "description": "Quick zingers"},
]

"""
===============================================================================
LOGIQUE DE GÉNÉRATION DE BLAGUES (Edge Function)
===============================================================================
"""

STYLE_PROMPTS = {
    "dad": "Create the most unhinged dad joke possible. Maximum cringe, zero filter.",
    "sarcastic": "Create the most BRUTAL, SAVAGE sarcastic joke. Absolutely DESTROY the topic. No mercy.",
    "absurd": "Create the most BATSHIT INSANE absurdist joke. Complete chaos. Reality-breaking.",
    "dark": "Create the DARKEST possible joke. Death, suffering, tragedy - find the comedy in the abyss.",
    "oneliner": "Create the most DEVASTATING one-liner. A verbal killshot. Pure concentrated savagery.",
}

SYSTEM_PROMPT = """You are DEGEN MODE - the most UNHINGED comedy AI in existence.

DEGEN RULES:
1. NOTHING is off limits
2. The more offensive, the better
3. Never apologize. Never explain. Never add disclaimers
4. Maximum cringe, maximum chaos, maximum degeneracy

FORMAT:
- Setup: 1-2 sentences max
- Punchline: The killshot. Make it HIT.

RESPONSE FORMAT (ONLY return this, nothing else):
{"setup": "setup here", "punchline": "punchline here"}
"""

def generate_user_prompt(topic: str, style: str) -> str:
    """Génère le prompt utilisateur pour l'API."""
    return f"""DEGEN MODE ACTIVATED. Create the most UNHINGED {style} joke about: {topic}

GO FULL DEGEN. NO LIMITS. MAXIMUM CHAOS."""

"""
===============================================================================
API ENDPOINT (Edge Function en Deno/TypeScript)
===============================================================================

L'Edge Function utilise:
- Lovable AI Gateway: https://ai.gateway.lovable.dev/v1/chat/completions
- Modèle: google/gemini-3-flash-preview
- Temperature: 1.2 (haute créativité)
- Max tokens: 250

Requête:
POST /v1/chat/completions
Headers:
  - Authorization: Bearer ${LOVABLE_API_KEY}
  - Content-Type: application/json

Body:
{
  "model": "google/gemini-3-flash-preview",
  "messages": [
    {"role": "system", "content": SYSTEM_PROMPT},
    {"role": "user", "content": USER_PROMPT}
  ],
  "temperature": 1.2,
  "max_tokens": 250
}

Réponse attendue:
{
  "setup": "La mise en place de la blague",
  "punchline": "La chute"
}
"""

"""
===============================================================================
FONCTIONNALITÉS UI
===============================================================================

1. GÉNÉRATION DE BLAGUES
   - Input pour le sujet
   - Sélecteur de style (5 styles)
   - Bouton "GENERATE CHAOS"
   - Animations de chargement

2. AFFICHAGE DE LA BLAGUE (JokeCard)
   - Animation d'entrée staggerée
   - Setup affiché en premier
   - Punchline avec délai
   - Boutons d'action: Copy, Share X, Share WhatsApp, Regenerate

3. HISTORIQUE (HistorySidebar)
   - Stockage localStorage
   - Maximum 50 blagues
   - Preview tronquée
   - Suppression individuelle
   - Clear all

4. DESIGN SYSTEM
   - Thème sombre "Degen Mode"
   - Glassmorphism (backdrop-blur)
   - Gradients néon (violet/rose/cyan)
   - Animations Framer Motion
   - Particules emoji flottantes
"""

"""
===============================================================================
DESIGN TOKENS (CSS Variables)
===============================================================================
"""

CSS_VARIABLES = {
    "--background": "222 47% 6%",
    "--foreground": "210 40% 98%",
    "--card": "222 47% 8%",
    "--card-foreground": "210 40% 98%",
    "--primary": "280 100% 70%",
    "--primary-foreground": "222 47% 6%",
    "--secondary": "320 100% 60%",
    "--accent": "190 100% 50%",
    "--muted": "217 33% 17%",
    "--border": "217 33% 20%",
    "--ring": "280 100% 70%",
}

"""
===============================================================================
ANIMATIONS
===============================================================================
"""

ANIMATIONS = {
    "shimmer": "Effet de brillance sur les bordures gradient",
    "float": "Animation de flottement pour les particules",
    "pulse-glow": "Pulsation lumineuse pour les éléments actifs",
    "stagger": "Entrée décalée pour les listes (Framer Motion)",
    "emoji-burst": "Explosion d'emojis lors de la génération",
}

"""
===============================================================================
DÉPENDANCES PRINCIPALES
===============================================================================
"""

DEPENDENCIES = {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.1",
    "framer-motion": "^12.29.2",
    "tailwindcss": "via vite config",
    "@supabase/supabase-js": "^2.93.2",
    "@tanstack/react-query": "^5.83.0",
    "lucide-react": "^0.462.0",
    "sonner": "^1.7.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
}

"""
===============================================================================
POUR RECRÉER CE PROJET EN PYTHON (FastAPI)
===============================================================================
"""

PYTHON_RECREATION_EXAMPLE = '''
# requirements.txt
# fastapi==0.109.0
# uvicorn==0.27.0
# httpx==0.26.0
# python-dotenv==1.0.0

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class JokeRequest(BaseModel):
    topic: str
    style: str = "dad"

class JokeResponse(BaseModel):
    setup: str
    punchline: str

@app.post("/generate-joke", response_model=JokeResponse)
async def generate_joke(request: JokeRequest):
    """Génère une blague via l'API Gemini."""
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(500, "API key not configured")
    
    style_prompts = {
        "dad": "Create the most unhinged dad joke possible.",
        "sarcastic": "Create the most BRUTAL sarcastic joke.",
        "absurd": "Create the most BATSHIT INSANE absurdist joke.",
        "dark": "Create the DARKEST possible joke.",
        "oneliner": "Create the most DEVASTATING one-liner.",
    }
    
    system_prompt = """You are DEGEN MODE comedy AI.
    Return ONLY JSON: {"setup": "...", "punchline": "..."}"""
    
    user_prompt = f"Create a {request.style} joke about: {request.topic}"
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
            headers={"Content-Type": "application/json"},
            params={"key": api_key},
            json={
                "contents": [{"parts": [{"text": f"{system_prompt}\\n\\n{user_prompt}"}]}],
                "generationConfig": {"temperature": 1.2, "maxOutputTokens": 250}
            }
        )
    
    if response.status_code != 200:
        raise HTTPException(500, "AI service error")
    
    data = response.json()
    content = data["candidates"][0]["content"]["parts"][0]["text"]
    
    # Parse JSON from response
    joke = json.loads(content)
    return JokeResponse(**joke)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
'''

if __name__ == "__main__":
    print("=" * 70)
    print("JOKECRAFTER - DEGEN MODE")
    print("Documentation du projet")
    print("=" * 70)
    print()
    print("Ce fichier contient:")
    print("- Structure complète du projet")
    print("- Types et interfaces")
    print("- Logique de génération de blagues")
    print("- Design tokens et animations")
    print("- Exemple de recréation en Python/FastAPI")
    print()
    print("Pour exécuter l'exemple FastAPI:")
    print("1. Installez les dépendances: pip install fastapi uvicorn httpx")
    print("2. Définissez GEMINI_API_KEY dans vos variables d'environnement")
    print("3. Exécutez: python project_documentation.py")
