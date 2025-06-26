import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Box } from "@mui/material";

// Dixy should know who needs to roll and say it. now about bets and lastBet, the prize pool.. etc

const DixyDiceAssistant = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const diceRef = useRef(null);
    const animationIdRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);

    const [isStarted, setIsStarted] = useState(false);
    const [isRolling, setIsRolling] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(0);
    const [minValue, setMinValue] = useState(1);
    const [maxValue, setMaxValue] = useState(6);
    const [currentNumbers, setCurrentNumbers] = useState([1, 2, 3, 4, 5, 6]);
    const [isChangingNumbers, setIsChangingNumbers] = useState(false);

    const messages = [
        "Hi there! I'm Dixy, your friendly dice assistant! 🎲✨ Place a Bet or Roll the dice",
        "Need help making a decision? Just give me a roll! 🎯",
        "I'm feeling lucky today! Want to test your luck? 🍀",
        "I can show any numbers you want! Just set my range! 🎯",
        "I love spinning around! It makes me feel dizzy but happy! 😵‍💫",
        "Want to play a game? I'm always ready to roll! 🎮",
        "I may be square, but I'm not boring! 📦✨",
        "Every roll is a new adventure! Where will we land? 🗺️",
        "My numbers are dancing! Watch them change! 💃"
    ];

    const [speechText, setSpeechText] = useState(messages[0]);

    useEffect(() => {
        if (!isStarted) return;

        initThreeJS();

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            if (rendererRef.current && mountRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement);
                rendererRef.current.dispose();
            }
        };
    }, [isStarted]);

    const initThreeJS = () => {
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }

        // Store refs
        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        // Create dice
        createDice(scene);

        // Position camera
        camera.position.set(5, 3, 8);
        camera.lookAt(0, 0, 0);

        // Start animation loop
        animate();

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    };

    const createDiceFace = (number) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Face background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 256, 256);

        // Face border
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 8;
        ctx.strokeRect(4, 4, 248, 248);

        // Draw number
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 120px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(number.toString(), 128, 128);

        const texture = new THREE.CanvasTexture(canvas);
        return new THREE.MeshLambertMaterial({ map: texture });
    };

    const updateDiceNumbers = (numbers) => {
        if (!diceRef.current) return;

        const materials = numbers.map(num => createDiceFace(num));
        diceRef.current.material = materials;
    };

    const createDice = (scene) => {
        const geometry = new THREE.BoxGeometry(2, 2, 2);

        // Create initial materials with current numbers
        const materials = currentNumbers.map(num => createDiceFace(num));

        const dice = new THREE.Mesh(geometry, materials);
        dice.castShadow = true;
        dice.position.y = 1;
        scene.add(dice);

        diceRef.current = dice;
    };

    const idleAnimation = () => {
        if (!diceRef.current) return;
        const time = Date.now() * 0.001;
        diceRef.current.position.y = 1 + Math.sin(time * 2) * 0.1;
        diceRef.current.rotation.y += 0.005;
    };

    const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);

        if (!isRolling) {
            idleAnimation();
        }

        if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
    };

    const generateRandomNumbers = () => {
        const numbers = [];
        for (let i = 0; i < 6; i++) {
            numbers.push(Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);
        }
        return numbers;
    };

    const updateRange = () => {
        if (minValue >= maxValue) {
            setSpeechText("Oops! Min value should be less than max value! 🤔");
            return;
        }

        const newNumbers = generateRandomNumbers();
        setCurrentNumbers(newNumbers);
        updateDiceNumbers(newNumbers);
        setSpeechText(`Great! Now I can show numbers from ${minValue} to ${maxValue}! 🎯✨`);
    };

    const changeNumbers = () => {
        if (isChangingNumbers) return;

        setIsChangingNumbers(true);
        setSpeechText("Watch my numbers dance! 💃🎲");

        let changeCount = 0;
        const maxChanges = 100;

        const numberChangeInterval = setInterval(() => {
            const newNumbers = generateRandomNumbers();
            setCurrentNumbers(newNumbers);
            updateDiceNumbers(newNumbers);

            changeCount++;
            if (changeCount >= maxChanges) {
                clearInterval(numberChangeInterval);
                setIsChangingNumbers(false);
                setSpeechText(`My new numbers are ready! Range: ${minValue}-${maxValue} 🎯`);
            }
        }, 150);
    };

    const rollDice = () => {
        if (isRolling || !diceRef.current) return;

        setIsRolling(true);
        setSpeechText("Here I go! Rolling, rolling, rolling... 🎲");

        const startTime = Date.now();
        const duration = 10000;

        const initialRotationX = diceRef.current.rotation.x;
        const initialRotationY = diceRef.current.rotation.y;
        const initialRotationZ = diceRef.current.rotation.z;

        const targetRotationX = initialRotationX + Math.PI * 4 + Math.random() * Math.PI * 2;
        const targetRotationY = initialRotationY + Math.PI * 4 + Math.random() * Math.PI * 2;
        const targetRotationZ = initialRotationZ + Math.PI * 4 + Math.random() * Math.PI * 2;

        const rollAnimation = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            if (diceRef.current) {
                diceRef.current.rotation.x = initialRotationX + (targetRotationX - initialRotationX) * easeProgress;
                diceRef.current.rotation.y = initialRotationY + (targetRotationY - initialRotationY) * easeProgress;
                diceRef.current.rotation.z = initialRotationZ + (targetRotationZ - initialRotationZ) * easeProgress;
                diceRef.current.position.y = 1 + Math.sin(progress * Math.PI * 6) * 0.5;
            }

            if (progress < 1) {
                requestAnimationFrame(rollAnimation);
            } else {
                setIsRolling(false);
                const result = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
                setSpeechText(`🎲 I rolled a ${result}! How's that for luck? ✨`);
            }
        };

        rollAnimation();
    };

    const bounceAnimation = () => {
        if (!diceRef.current) return;

        const startTime = Date.now();
        const duration = 1500;

        const bounce = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress < 1 && diceRef.current) {
                const bounceHeight = Math.abs(Math.sin(progress * Math.PI * 3)) * 2;
                diceRef.current.position.y = 1 + bounceHeight;
                requestAnimationFrame(bounce);
            }
        };

        bounce();
        setSpeechText("Wheee! Look at me bounce! I feel like I'm flying! 🦘✨");
    };

    const spinAnimation = () => {
        if (!diceRef.current) return;

        const startTime = Date.now();
        const duration = 3000;
        const initialRotationY = diceRef.current.rotation.y;

        const spin = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress < 1 && diceRef.current) {
                diceRef.current.rotation.y = initialRotationY + progress * Math.PI * 6;
                requestAnimationFrame(spin);
            }
        };

        spin();
        setSpeechText("Spinning around and around! I'm getting dizzy but it's so much fun! 🌪️😵‍💫");
    };

    const changeMessage = () => {
        const nextIndex = (currentMessage + 1) % messages.length;
        setCurrentMessage(nextIndex);
        setSpeechText(messages[nextIndex]);
    };

    const startExperience = () => {
        setIsStarted(true);
    };

    const styles = {
        container: {
            position: 'relative',
            width: '100vw',
            height: '100vh',
            //   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: "'Comic Sans MS', cursive, sans-serif",
            overflow: 'hidden'
        },
        intro: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'white',
            zIndex: 1000,
            background: 'rgba(0,0,0,0.7)',
            padding: '30px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)'
        },
        introTitle: {
            fontSize: '3em',
            margin: 0,
            textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 200%',
            animation: 'gradientShift 3s ease infinite'
        },
        introText: {
            fontSize: '1.2em',
            margin: '20px 0'
        },
        ui: {
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 100,
            color: 'black   ',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        },
        speechBubble: {
            position: 'absolute',
            top: '50%',
            left: '20px',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '20px',
            borderRadius: '20px',
            border: '3px solid #4a90e2',
            maxWidth: '300px',
            fontSize: '16px',
            color: '#333',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            zIndex: 100,
            transition: 'all 0.3s ease'
        },
        speechBubbleArrow: {
            position: 'absolute',
            right: '-15px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderLeft: '15px solid #4a90e2',
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent'
        },
        controls: {
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '15px',
            zIndex: 100,
            flexWrap: 'wrap',
            justifyContent: 'center'
        },
        rangeControls: {
            position: 'absolute',
            top: '20px',
            right: '20px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '15px',
            borderRadius: '15px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: 100,
            flexWrap: 'wrap'
        },
        rangeGroup: {
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
        },
        label: {
            fontWeight: 'bold',
            color: '#333',
            fontSize: '14px'
        },
        input: {
            width: '60px',
            padding: '8px',
            border: '2px solid #4a90e2',
            borderRadius: '8px',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: 'bold'
        },
        smallButton: {
            padding: '8px 16px',
            background: 'linear-gradient(145deg, #4a90e2, #357abd)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
        },
        button: {
            padding: '12px 24px',
            background: 'linear-gradient(145deg, #ff6b6b, #ee5a52)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
        },
        canvasContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
        }
    };

    return (
        <div style={styles.container}>
            <style>
                {`
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            background: linear-gradient(145deg, #ff5252, #e53e3e);
          }
          
          button:active {
            transform: translateY(0);
          }
        `}
            </style>

            {!isStarted ? (
                <div style={styles.intro}>
                    <h1 style={styles.introTitle}>Meet Dixy!</h1>
                    <p style={styles.introText}>Your friendly dice assistant is ready to help!</p>
                    <button style={styles.button} onClick={startExperience}>
                        Let's Roll! 🎲
                    </button>
                </div>
            ) : (
                <>
                    <div style={styles.ui}>
                        <h2>🎲 Dixy is your Dice Assistant</h2>
                        <p>Find a game, place a bet, roll a number</p>
                    </div>

                    <div style={styles.speechBubble}>
                        <p>{speechText}</p>
                        <div style={styles.speechBubbleArrow}></div>
                    </div>
{/* 
                    <div style={styles.rangeControls}>
                        <div style={styles.rangeGroup}>
                            <label style={styles.label}>Min: </label>
                            <input
                                type="number"
                                value={minValue}
                                onChange={(e) => setMinValue(parseInt(e.target.value) || 1)}
                                style={styles.input}
                                min="1"
                                max="999"
                            />
                        </div>
                        <div style={styles.rangeGroup}>
                            <label style={styles.label}>Max: </label>
                            <input
                                type="number"
                                value={maxValue}
                                onChange={(e) => setMaxValue(parseInt(e.target.value) || 6)}
                                style={styles.input}
                                min="2"
                                max="999"
                            />
                        </div>
                        <button style={styles.smallButton} onClick={updateRange}>
                            🎯 Update Range
                        </button>
                    </div> */}

                    <Box>
                        <div style={styles.controls}>
                            <button style={styles.button} onClick={changeNumbers} disabled={isRolling}>
                                💸 BET
                            </button>
                            <button style={styles.button} onClick={rollDice} disabled={isChangingNumbers}>
                                🎲 ROLL
                            </button>

                        </div>
                    </Box>
                    {/* <div style={styles.controls}>
                        <button style={styles.button} onClick={rollDice} disabled={isRolling}>
                            🎲 Roll Me!
                        </button>
                        <button style={styles.button} onClick={bounceAnimation}>
                            🦘 Make Me Bounce!
                        </button>
                        <button style={styles.button} onClick={spinAnimation}>
                            🌪️ Spin Me Around!
                        </button>
                        <button style={styles.button} onClick={changeNumbers} disabled={isChangingNumbers}>
                            🎲 Change Numbers!
                        </button>
                        <button style={styles.button} onClick={changeMessage}>
                            💬 Say Something!
                        </button>
                    </div> */}

                    <div ref={mountRef} style={styles.canvasContainer} />
                </>
            )}
        </div>
    );
};

export default DixyDiceAssistant;