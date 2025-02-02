import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

const Game2 = () => {
    const [score, setScore] = useState(0);
    const [raindrops, setRaindrops] = useState([]);
    const [bucketPosition, setBucketPosition] = useState(window.innerWidth / 2 - 50);
    const [gameStarted, setGameStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);

    const createRaindrop = useCallback(() => {
        const newRaindrop = {
            id: Date.now(),
            x: Math.random() * (window.innerWidth - 100),
            y: 0,
        };
        setRaindrops(prev => [...prev, newRaindrop]);
    }, []);

    // Update raindrop positions
    useEffect(() => {
        if (!gameStarted || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setRaindrops(prev => 
                prev
                    .map(drop => ({
                        ...drop,
                        y: drop.y + 5
                    }))
                    .filter(drop => drop.y < window.innerHeight) // Remove drops that are off screen
            );
        }, 30);

        return () => clearInterval(interval);
    }, [gameStarted, timeLeft]);

    // Handle keyboard input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") {
                setBucketPosition(prev => Math.max(0, prev - 20));
            } else if (e.key === "ArrowRight") {
                setBucketPosition(prev => Math.min(window.innerWidth - 100, prev + 20));
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Check collisions and update score
    useEffect(() => {
        if (!gameStarted || timeLeft <= 0) return;

        const checkCollisions = () => {
            const bucketTop = window.innerHeight - 100;
            const bucketLeft = bucketPosition;
            const bucketRight = bucketPosition + 100;

            setRaindrops(prev => {
                let scoreIncrement = 0;
                const updatedDrops = prev.filter(drop => {
                    const dropBottom = drop.y + 20;
                    const dropLeft = drop.x;
                    const dropRight = drop.x + 20;

                    // Check if drop is caught by bucket
                    if (dropBottom >= bucketTop && 
                        dropLeft >= bucketLeft && 
                        dropRight <= bucketRight) {
                        scoreIncrement++;
                        return false; // Remove caught drops
                    }
                    return true; // Keep uncaught drops
                });

                if (scoreIncrement > 0) {
                    setScore(s => s + scoreIncrement);
                }
                return updatedDrops;
            });
        };

        const collisionInterval = setInterval(checkCollisions, 50);
        return () => clearInterval(collisionInterval);
    }, [bucketPosition, gameStarted, timeLeft]);

    // Create new raindrops
    useEffect(() => {
        if (!gameStarted || timeLeft <= 0) return;

        const interval = setInterval(createRaindrop, 500);
        return () => clearInterval(interval);
    }, [gameStarted, timeLeft, createRaindrop]);

    // Game timer
    useEffect(() => {
        if (!gameStarted || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [gameStarted, timeLeft]);

    const startGame = () => {
        setGameStarted(true);
        setScore(0);
        setTimeLeft(30);
        setRaindrops([]);
    };

    const restartGame = () => {
        setGameStarted(false);
        setScore(0);
        setTimeLeft(30);
        setRaindrops([]);
        setBucketPosition(window.innerWidth / 2 - 50);
    };

    return (
        <section className="relative py-16 h-screen bg-cover bg-green-100 bg-center">
            <div className="relative z-10 text-center">
                <h2 className="text-4xl font-bold mb-8">Catch the Raindrop</h2>

                {!gameStarted ? (
                    <>
                        <p className="text-xl mb-4">Score: {score}</p>
                        <button
                            onClick={startGame}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow-lg hover:bg-green-700"
                        >
                            Start Game
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text-xl mb-4">Score: {score}</p>
                        <p className="text-xl mb-4">Time Left: {timeLeft} seconds</p>
                        <div className="relative h-96 w-full overflow-hidden">
                            {raindrops.map((drop) => (
                                <motion.div
                                    key={drop.id}
                                    initial={{ y: 0 }}
                                    animate={{ y: drop.y }}
                                    transition={{ type: "tween" }}
                                    className="absolute"
                                    style={{ left: drop.x }}
                                >
                                    💧
                                </motion.div>
                            ))}

                            <motion.div
                                className="absolute bottom-0 w-20 h-20 bg-blue-500 rounded-lg cursor-pointer flex items-center justify-center"
                                style={{ left: bucketPosition }}
                                animate={{ left: bucketPosition }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                🪣
                            </motion.div>
                        </div>
                        <p className="text-lg mt-4">Use the left and right arrow keys to move the bucket!</p>
                        {timeLeft <= 0 && (
                            <p className="text-2xl font-bold mt-4">Game Over! Final Score: {score}</p>
                        )}
                        <button
                            onClick={restartGame}
                            className="mt-4 px-6 py-3 cursor bg-red-600 text-white rounded-lg font-semibold shadow-lg hover:bg-red-700"
                        >
                            Restart Game
                        </button>
                    </>
                )}
            </div>
        </section>
    );
};

export default Game2;