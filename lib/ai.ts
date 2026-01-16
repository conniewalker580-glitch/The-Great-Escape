import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
});

const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";

async function hfGenerate(prompt: string) {
    const response = await fetch(HF_API_URL, {
        headers: {
            Authorization: `Bearer ${process.env.HF_API_KEY}`,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            inputs: prompt,
            parameters: {
                max_new_tokens: 2000,
                return_full_text: false,
                temperature: 0.7,
            }
        }),
    });
    const result = await response.json();
    return result[0]?.generated_text || "";
}

export type PlayerStats = {
    level: number;
    puzzleSuccessRate: number; // 0.0 to 1.0
    hintFrequency: number; // Avg hints per room
    tier: string;
};

export async function generateEscapeRoom(theme: string, difficulty: string, stats: PlayerStats) {
    const provider = process.env.AI_PROVIDER || 'huggingface';
    const isOpenAI = provider === 'openai';

    const systemPrompt = `
        You are "The Architect", an advanced Escape Room AI.
        Generate a unique escape room JSON.
        
        Player Profile:
        - Level: ${stats.level} (1-10)
        - Success Rate: ${(stats.puzzleSuccessRate * 100).toFixed(0)}%
        - Avg Hints Used: ${stats.hintFrequency}
        - Tier: ${stats.tier}

        Design Logic:
        - If Success Rate > 80%: Increase puzzle complexity, use abstract logic.
        - If Success Rate < 40%: Simplify logic, provide clearer clues in the description.
        - If High Hint Usage (>2): Ensure the main 'hint' field is very direct.
        - If Tier is 'Elite': Add a bonus 4th puzzle (optional).

        Context:
        - Theme: "${theme}"
        - Difficulty: "${difficulty}"

        CRITICAL: Return ONLY valid JSON.
        
        Structure:
        {
          "title": "Evocative Title",
          "description": "Atmospheric description.",
          "imagePrompt": "Visual description for AI.",
          "puzzles": [
            {
              "id": "gen_p1",
              "question": "Puzzle Text",
              "type": "code" | "choice",
              "options": ["A", "B"] (optional),
              "answer": "Exact string answer",
              "hint": "Clue",
              "solution_explanation": "Why logic"
            }
          ]
        }
        Generate 3-4 puzzles based on logic above.
    `;

    try {
        let content = "";

        if (isOpenAI && process.env.OPENAI_API_KEY) {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "system", content: systemPrompt }],
                max_tokens: 2000,
                temperature: 0.8,
            });
            content = response.choices[0].message.content || "{}";
        } else {
            // Hugging Face Fallback
            const hfPrompt = `[INST] ${systemPrompt} [/INST]`;
            content = await hfGenerate(hfPrompt);
        }

        // Clean up potential markdown
        const cleaner = content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaner);

    } catch (e) {
        console.error("AI Generation Failed:", e);
        // Fallback room if AI completely fails
        return {
            title: "Emergency Backup Protocol",
            description: "The AI signal was lost. You are in a static backup simulation.",
            imagePrompt: "Static glitch screen cyberpunk",
            puzzles: [{
                id: "fallback",
                question: "Enter authorization code 'RESET' to reboot.",
                type: "code",
                answer: "RESET",
                hint: "It is exactly what it says."
            }]
        };
    }
}

export async function getAdaptiveHint(puzzleQuestion: string, userAttempts: string[]) {
    // ... Simplified hint logic for brevity, can expand later
    return "Focus on the patterns in the shadows.";
}
