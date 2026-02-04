import { HfInference } from '@huggingface/inference';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize APIs with environment variables
// Note: In a production app, these should be handled via a secure backend
const hf = new HfInference(import.meta.env.VITE_HF_TOKEN);
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
                enhancedPrompt = `${prompt}, photorealistic escape room background, high detail, atmospheric lighting, 4k, cinematic composition`;
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
                Create a JSON configuration for an escape room with the theme: "${theme}".
                The configuration MUST follow this exact structure:
                {
                    "name": "Room Name",
                    "objective": "A short, mysterious objective",
                    "ambientColor": "#hexColor",
                    "atmosphere": "dark/neon/warm/space",
                    "quiz": {
                        "question": "A puzzle question based on the room's clues",
                        "correctAnswer": "The answer",
                        "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
                    },
                    "hotspots": [
                        {
                            "id": "unique-id",
                            "label": "Item Name",
                            "icon": "emoji",
                            "clue": "A hint or piece of information found here",
                            "description": "Short description of the item",
                            "collectible": true,
                            "glowColor": "#hexColor",
                            "position": [x, y, z] // For 3D space, coordinates between -10 and 10
                        }
                    ],
                    "hints": ["Hint 1", "Hint 2", "Hint 3"]
                }
                Provide ONLY the JSON string. Ensure there are 3-4 hotspots and 3 hints.
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
    }
};

export default aiService;
