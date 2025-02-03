import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Game2 = () => {
    const [score, setScore] = useState(0);
    const [raindrops, setRaindrops] = useState([]);
    const [bucketPosition, setBucketPosition] = useState(window.innerWidth / 2 - 50);
    const [gameStarted, setGameStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [windowInnerHeight,setWindowInnerHeight] = useState(window.innerHeight);
    
    const createRaindrop = () => {
        const newRaindrop = {
            id: Date.now(),
            x: Math.random() * (window.innerWidth - 100),
            y: 0,
            hasCaught: false,
        };
        setRaindrops((prev) => [...prev, newRaindrop]);
    };
    

    // setting height of drop
    
    useEffect(() => {
        if (!gameStarted || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setRaindrops((prev) =>
                prev.map((drop) => {
                    
                    if (!drop.hasCaught) {
                        
                    }
                    return { ...drop, y: drop.y + 5 };
                })
            );
        }, 30);

        return () => clearInterval(interval);
    }, [gameStarted, timeLeft]);

    //filtering raindrops
    
    useEffect(() => {
        const interval = setInterval(() => {
            setRaindrops((prev) => prev.filter((drop) => drop.y < window.innerHeight));
        }, 100);

        return () => clearInterval(interval);
    }, []);
    
    // handling catched drops
    const catchRaindrop = (id) => {
        // setScore((prevScore)=>prevScore+1);
        setRaindrops((prevRaindrops) => {
            const index = prevRaindrops.findIndex((drop) => drop.id === id && !drop.hasCaught);
            
            
            if (index === -1){
                return prevRaindrops; 
            } 
            setScore((prevScore)=>prevScore+1);
                
            
            const updatedRaindrops = [...prevRaindrops];
            updatedRaindrops[index] = { ...updatedRaindrops[index], hasCaught: true }; // Update only the caught drop
            
            return updatedRaindrops;
        });
    };
    
    
    // constantly creating the rain drops
    useEffect(() => {
        if (!gameStarted || timeLeft <= 0) return;

        const raindropInterval = setInterval(() => {
            createRaindrop();
        }, 500);

        return () => clearInterval(raindropInterval);
    }, [gameStarted, timeLeft]);

    // adding event listerners
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") {
                setBucketPosition((prev) => Math.max(0, prev - 20)); // Move left
                // console.log("Bucket moved left:", bucketPosition - 20);
            } else if (e.key === "ArrowRight") {
                setBucketPosition((prev) => Math.min(window.innerWidth - 100, prev + 20)); // Move right
                // console.log("Bucket moved right:", bucketPosition + 20);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
    
    
    //checking collisions (drop catching)
    
    useEffect(() => {
        if (!gameStarted || timeLeft <= 0) return;
        const checkCollisions = () => {
            raindrops.forEach((drop) => {

                if (drop.hasCaught) return;

                const dropBottom = drop.y + 20; 
                const dropLeft = drop.x;
                const dropRight = drop.x + 20;

                
                const bucketTop  = windowInnerHeight - 100;
                const bucketLeft = bucketPosition;
                const bucketRight = bucketPosition + 100;
               
                if (
                    (dropBottom >= bucketTop) && 
                    dropLeft >= bucketLeft && 
                    dropRight <= bucketRight
                    ) {
                        catchRaindrop(drop.id);
                ;
                }
            });
        };

        const collisionInterval = setInterval(checkCollisions, 100);
        
        return () => clearInterval(collisionInterval);
    }, [gameStarted,timeLeft,bucketPosition]);
    
    
    //handling time left
    useEffect(() => {
        if (!gameStarted || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [gameStarted, timeLeft]);
    
    
    // starting the game
    const startGame = () => {
        setGameStarted(true);
        // console.log("game started");
        setScore(0);
        // console.log("score set to 0");
        setTimeLeft(30);
        // console.log("set time left set to 30");
        setRaindrops([]);
        if(window){
            console.log("window inner height set to " + window.innerHeight);
            setWindowInnerHeight(window.innerHeight);
        }
    };
    
    //resetting the game
    const restartGame = () => {
        setGameStarted(false);
        setScore(0);
        setTimeLeft(30);
        setRaindrops([]);
        setBucketPosition(window.innerWidth / 2 - 50);
        console.log("Game restarted!");
    };

    return (
        <section 
    id="game" 
    className="relative py-16 h-screen bg-cover bg-green-100 bg-center "
>
    {/* Background overlay for opacity */}
    <div className="absolute inset-0  "></div> 

    <div className="relative z-10  text-center">
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