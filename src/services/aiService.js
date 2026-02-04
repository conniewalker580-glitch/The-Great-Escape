import { HfInference } from '@huggingface/inference';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize APIs with environment variables
// Note: In a production app, these should be handled via a secure backend
const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_TOKEN || import.meta.env.VITE_HF_TOKEN);
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * AI Service for The Great Escape
 * Handles visual generation and interactive content creation
 */
export const aiService = {
    /**
     * Generates an image using Hugging Face
     * @param {string} prompt - Description of the image
     * @param {string} type - 'room', 'panorama', or 'item'
     */
    generateVisual: async (prompt, type = 'room') => {
        try {
            let enhancedPrompt = prompt;
            if (type === 'panorama') {
                enhancedPrompt = `${prompt}, 360 degree equirectangular panorama, VR environment, seamless, wide angle, photorealistic, high resolution, 8k`;
            } else if (type === 'room') {
                enhancedPrompt = `${prompt}, interior view of a highly detailed room, filled with interactive objects like bookshelves, a clock on the wall, a notepad and pen on a desk, a coffee cup, atmospheric lighting, soft shadows, cinematic composition, photorealistic, 4k, architectural photography style`;
            } else if (type === 'item') {
                enhancedPrompt = `${prompt}, isolated object, professional product photography, plain dark background, high detail, macro, 4k`;
            }

            const response = await hf.textToImage({
                model: 'black-forest-labs/FLUX.1-dev', // Using a high-quality model
                inputs: enhancedPrompt,
                parameters: {
                    negative_prompt: 'blurry, distorted, low quality, people, text, watermark, signature, multiple items, messy',
                }
            });

            return URL.createObjectURL(response);
        } catch (error) {
            console.error(`Error generating ${type} visual:`, error);
            return null;
        }
    },

    /**
     * Generates room metadata (hotspots, clues, quiz) using Google Gemini
     * @param {string} theme - Theme of the room (e.g., "Medieval Dungeon")
     */
    generateRoomContent: async (theme) => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
                Create a JSON configuration for a highly immersive, narrative-driven escape room with the theme: "${theme}".
                
                STORYTELLING AND DESIGN RULES:
                1. NARRATIVE OBJECTIVE: The 'objective' must be written as a story or mission (e.g., "Mrs. Potts needs to retrieve a family heirloom from the wall safe before the dinner party. Help her piece together the 4-digit code her husband hid around the study.")
                2. ENVIRONMENTAL CLUES: Instead of direct questions, frame the 'quiz.question' as a narrative challenge (e.g., "What is the final sequence Mrs. Potts needs for the safe?").
                3. INTERACTIVE ITEMS: The 'hotspots' should be realistic objects found in the room (e.g., "Bookshelf", "Grandfather Clock", "Spilled Coffee Cup", "Leather Notepad").
                4. EMBEDDED CLUES: Each hotspot description and clue should feel like a discovery (e.g., "A note tucked under the coffee cup reads 'The first digit is the hour the clock stopped'").
                5. PUZZLE FLOW: Ensure the clues from the 3-4 hotspots logically lead to the 'correctAnswer'.

                The configuration MUST follow this exact structure:
                {
                    "name": "Intriguing Room Name",
                    "objective": "A story-driven mission statement that establishes a character or urgent need",
                    "ambientColor": "#hexColor",
                    "atmosphere": "mysterious/cozy/industrial/tense",
                    "quiz": {
                        "question": "A narrative-styled challenge that requires the found clues",
                        "correctAnswer": "The answer",
                        "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
                    },
                    "hotspots": [
                        {
                            "id": "unique-id",
                            "label": "Object Name (e.g., Mahogany Desk)",
                            "icon": "emoji related to object",
                            "clue": "A narrative clue found on/in this object",
                            "description": "Atmospheric description of what the user sees when clicking",
                            "collectible": true,
                            "glowColor": "#hexColor",
                            "position": [x, y, z]
                        }
                    ],
                    "hints": ["Story-based nudge 1", "Specific clue reminder 2", "The direct logical link 3"]
                }
                Provide ONLY the JSON string. Ensure there are exactly 4 hotspots and 3 hints.
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            // Clean up Markdown formatting if Gemini adds it
            const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error('Error generating room content:', error);
            return null;
        }
    },
    /**
     * Narrates text using the browser's TTS engine (simulating AI voice)
     * @param {string} text - The text to speak
     */
    speak: (text) => {
        if (!('speechSynthesis' in window)) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Try to find a high-quality "AI-like" voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v =>
            v.name.includes('Google') || v.name.includes('Natural') || v.lang.startsWith('en-GB')
        );

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.pitch = 1.0;
        utterance.rate = 0.9; // Slightly slower for better clarity and mystery
        utterance.volume = 1.0;

        window.speechSynthesis.speak(utterance);
    }
};

export default aiService;
