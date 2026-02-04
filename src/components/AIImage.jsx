import { useState, useEffect } from 'react';
import aiService from '../services/aiService';
import './AIImage.css';

/**
 * AIImage Component
 * Purpose: Generates and displays an image from Hugging Face based on a prompt.
 * Falls back to an Unsplash URL or placeholder if generation fails.
 */
const AIImage = ({
    prompt,
    type = 'item',
    fallbackUrl,
    alt = 'AI Generated content',
    className = '',
    onLoadComplete
}) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchImage = async () => {
            if (!prompt) {
                setImageUrl(fallbackUrl);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(false);

            try {
                // Check if we already have a generated URL cached for this session?
                // For now, just generate.
                const generatedUrl = await aiService.generateVisual(prompt, type);

                if (isMounted) {
                    if (generatedUrl) {
                        setImageUrl(generatedUrl);
                        if (onLoadComplete) onLoadComplete(generatedUrl);
                    } else {
                        setImageUrl(fallbackUrl);
                        setError(true);
                    }
                    setLoading(false);
                }
            } catch (err) {
                console.error("AIImage Fetch Error:", err);
                if (isMounted) {
                    setImageUrl(fallbackUrl);
                    setError(true);
                    setLoading(false);
                }
            }
        };

        fetchImage();

        return () => {
            isMounted = false;
        };
    }, [prompt, type, fallbackUrl]);

    return (
        <div className={`ai-image-container ${loading ? 'is-loading' : ''} ${className}`}>
            {loading && (
                <div className="ai-image-loader">
                    <div className="shimmer"></div>
                    <span className="loader-text">Generating...</span>
                </div>
            )}

            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={alt}
                    className={`ai-image-content ${loading ? 'hidden' : 'visible'}`}
                    onLoad={() => setLoading(false)}
                />
            )}

            {!loading && !imageUrl && error && (
                <div className="ai-image-error">
                    <span>⚠️ Failed to load visual</span>
                </div>
            )}
        </div>
    );
};

export default AIImage;
