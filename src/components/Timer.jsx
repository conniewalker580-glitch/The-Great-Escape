import { useEffect, useRef } from 'react';
import useGameStore from '../store/gameStore';
import './Timer.css';

const Timer = () => {
    const { timerStarted, elapsedTime, updateElapsedTime, gameState } = useGameStore();
    const startTimeRef = useRef(null);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        if (timerStarted && !gameState.escaped) {
            startTimeRef.current = Date.now() - elapsedTime * 1000;

            const updateTimer = () => {
                const now = Date.now();
                const elapsed = Math.floor((now - startTimeRef.current) / 1000);
                updateElapsedTime(elapsed);
                animationFrameRef.current = requestAnimationFrame(updateTimer);
            };

            animationFrameRef.current = requestAnimationFrame(updateTimer);

            return () => {
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
            };
        }
    }, [timerStarted, gameState.escaped, updateElapsedTime, elapsedTime]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="timer">
            <div className="timer-icon">⏱️</div>
            <div className="timer-display">{formatTime(elapsedTime)}</div>
        </div>
    );
};

export default Timer;
