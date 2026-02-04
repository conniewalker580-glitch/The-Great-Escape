/**
 * QuizPanel Component
 * Created by C.S. Walker
 * 
 * Displays the room's quiz question and answer options.
 * Handles the submission and visual feedback for correct/incorrect answers.
 */

import { useState, useEffect } from 'react';
import useGameStore from '../../store/gameStore';
import './QuizPanel.css';

const QuizPanel = () => {
    const { currentRoom, foundClues, submitAnswer, gameState } = useGameStore();
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect'

    // Reset state when currentRoom changes
    useEffect(() => {
        setSelectedAnswer(null);
        setFeedback(null);
    }, [currentRoom]);

    if (!currentRoom || !currentRoom.quiz) return null;

    const { question, options } = currentRoom.quiz;
    const canSubmit = foundClues.length > 0 && selectedAnswer !== null;

    const handleSubmit = async () => {
        if (!canSubmit || isSubmitting) return;

        setIsSubmitting(true);
        const isCorrect = submitAnswer(selectedAnswer);

        setFeedback(isCorrect ? 'correct' : 'incorrect');

        setTimeout(() => {
            setIsSubmitting(false);
            if (!isCorrect) {
                setFeedback(null);
            }
        }, 2000);
    };

    return (
        <div className={`quiz-panel quiz-panel--${feedback}`}>
            <div className="quiz-panel__header">
                <span className="quiz-panel__icon">❓</span>
                <h3 className="quiz-panel__question">{question}</h3>
            </div>

            <div className="quiz-panel__options">
                {options.map((option, index) => (
                    <button
                        key={index}
                        className={`quiz-panel__option ${selectedAnswer === option ? 'selected' : ''}`}
                        onClick={() => !isSubmitting && setSelectedAnswer(option)}
                        disabled={isSubmitting}
                    >
                        <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                        <span className="option-text">{option}</span>
                    </button>
                ))}
            </div>

            <div className="quiz-panel__footer">
                {!canSubmit && foundClues.length === 0 && (
                    <p className="quiz-panel__hint">
                        Find at least one clue in the room to unlock submission
                    </p>
                )}

                <button
                    className={`quiz-panel__submit ${canSubmit ? 'enabled' : 'disabled'}`}
                    onClick={handleSubmit}
                    disabled={!canSubmit || isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="loader"></span>
                    ) : (
                        feedback === 'correct' ? 'EXCELLENT' : 'SUBMIT ANSWER'
                    )}
                </button>
            </div>

            {feedback && (
                <div className={`quiz-panel__feedback quiz-panel__feedback--${feedback}`}>
                    {feedback === 'correct' ? (
                        <div className="feedback-content">
                            <span className="feedback-icon">✨</span>
                            <span className="feedback-text">Correct! Room Unlocked!</span>
                        </div>
                    ) : (
                        <div className="feedback-content">
                            <span className="feedback-icon">❌</span>
                            <span className="feedback-text">Incorrect. Try again using the clues!</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuizPanel;
