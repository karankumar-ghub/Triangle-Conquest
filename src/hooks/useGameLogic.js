import { useEffect, useRef, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { checkMoveValidity, findNewTriangles, isGameFinished } from '../utils/gameRules';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/sound';

export const useGameLogic = (canvasRef, gameId, user) => {
    // --- STATE ---
    const [gameState, setGameState] = useState({
        lines: [],
        triangles: [],
        moves: 0,
        turn: 1, // 1 = Blue, 2 = Green
        scores: { 1: 0, 2: 0 },
        lastRoll: 0,
        status: 'waiting'
    });
    const [diceValue, setDiceValue] = useState(1);
    const [isRolling, setIsRolling] = useState(false);
    const [myRole, setMyRole] = useState(null);
    const [toast, setToast] = useState(null); 

    // --- REFS ---
    const dotsRef = useRef([]);
    const ctxRef = useRef(null);
    const paramsRef = useRef({ size: 0, margin: 40, rows: 6, cols: 6 });
    const dragStateRef = useRef({
        isDragging: false,
        startDot: null,
        currentPos: { x: 0, y: 0 },
        hoverDot: null
    });
    const isOnline = !!gameId;

    // --- HELPER: SHOW TOAST ---
    const showToast = (msg, type = 'error') => {
        setToast({ msg, type, id: Date.now() });
        if (type === 'error') playSound('connect');
        setTimeout(() => setToast(null), 2500);
    };

    // --- FIREBASE SYNC ---
    useEffect(() => {
        if (!isOnline || !gameId) return;

        const unsub = onSnapshot(doc(db, "games", gameId), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setGameState(prev => ({ ...prev, ...data }));
                if (data.lastRoll) setDiceValue(data.lastRoll);

                // Determine Role
                if (user && data.host?.uid === user.uid) setMyRole(1);
                else if (user && data.guest?.uid === user.uid) setMyRole(2);
            }
        });
        return () => unsub();
    }, [gameId, user, isOnline]);

    // --- NEW: AUTO-JOIN LOGIC ---
    // This fixes the issue where Player 1 stays stuck on "Waiting"
    useEffect(() => {
        if (!isOnline || !gameId || !user) return;
        
        // If the game is waiting, and I am NOT the host, and there is no guest yet...
        // Then I must be the guest! Join the game.
        if (gameState.status === 'waiting' && gameState.host?.uid && gameState.host.uid !== user.uid && !gameState.guest) {
            const joinGame = async () => {
                console.log("Guest joining...");
                await updateDoc(doc(db, "games", gameId), {
                    guest: {
                        uid: user.uid,
                        name: user.displayName || 'Guest',
                        photo: user.photoURL
                    },
                    status: 'playing' // This triggers Player 1 to close the waiting screen
                });
            };
            joinGame();
        }
    }, [gameId, user, isOnline, gameState.status, gameState.host, gameState.guest]);


    // --- CANVAS SETUP & RENDER LOOP ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        ctxRef.current = canvas.getContext('2d');

        const resize = () => {
            if (!canvas.parentElement) return;
            const parent = canvas.parentElement;
            const size = Math.min(parent.clientWidth, parent.clientHeight);
            const dpr = window.devicePixelRatio || 1;

            canvas.width = size * dpr;
            canvas.height = size * dpr;
            canvas.style.width = `${size}px`;
            canvas.style.height = `${size}px`;

            ctxRef.current.scale(dpr, dpr);
            paramsRef.current.size = size;

            generateDots(size);
        };

        window.addEventListener('resize', resize);
        resize();

        let animationFrameId;
        const render = () => {
            drawBoard();
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [gameState]); 

    // --- HELPERS ---
    const generateDots = (size) => {
        const { rows, cols, margin } = paramsRef.current;
        const colStep = (size - margin * 2) / (cols - 1);
        const rowStep = (size - margin * 2) / (rows - 1);
        const newDots = [];
        let idCounter = 0;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let x = margin + (c * colStep);
                if (r % 2 !== 0) x += colStep / 2;
                if (r % 2 !== 0 && c === cols - 1) continue;
                let y = margin + (r * rowStep);
                newDots.push({ x, y, id: idCounter++ });
            }
        }
        dotsRef.current = newDots;
    };

    const getDotAt = (x, y) => {
        const { size, cols, margin } = paramsRef.current;
        const colStep = (size - margin * 2) / (cols - 1);
        const hitRadius = colStep * 0.4;
        return dotsRef.current.find(d => Math.hypot(d.x - x, d.y - y) < hitRadius);
    };

    // --- ACTIONS ---
    const handleRoll = async () => {
        if (gameState.moves > 0) return showToast(`You have ${gameState.moves} moves left!`);
        if (isOnline && gameState.turn !== myRole) return showToast("Wait for your turn!");
        if (isRolling) return; 

        playSound('roll');
        setIsRolling(true);

        const roll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(roll); // Visual update immediately

        setTimeout(async () => {
            setIsRolling(false);
            if (isOnline) {
                await updateDoc(doc(db, "games", gameId), { lastRoll: roll, moves: roll });
            } else {
                setGameState(prev => ({ ...prev, moves: roll, lastRoll: roll }));
            }
        }, 1000);
    };

    const handleMove = async (p1, p2) => {
        if (gameState.moves <= 0) return showToast("Roll the dice first!");
        if (isOnline && gameState.turn !== myRole) return showToast("Not your turn!");

        const { size, cols, margin } = paramsRef.current;
        const colStep = (size - margin * 2) / (cols - 1);
        const maxDist = colStep * 1.6;

        if (!checkMoveValidity(p1, p2, gameState.lines, maxDist)) return;

        const newLine = { p1: p1.id, p2: p2.id, player: gameState.turn };
        const nextLines = [...gameState.lines, newLine];
        const newTriangles = findNewTriangles(p1, p2, nextLines, gameState.triangles, gameState.turn);

        const nextTrianglesList = [...gameState.triangles, ...newTriangles];
        let nextMoves = gameState.moves - 1;
        let nextTurn = gameState.turn;
        const nextScores = { ...gameState.scores };

        if (newTriangles.length > 0) {
            nextScores[gameState.turn] += newTriangles.length;
            playSound('score');
            
            // Confetti
            const rect = canvasRef.current.getBoundingClientRect();
            const midX = (rect.left + rect.width / 2) / window.innerWidth;
            const midY = (rect.top + rect.height / 2) / window.innerHeight;
            confetti({
                particleCount: 50 * newTriangles.length,
                spread: 60,
                origin: { x: midX, y: midY },
                colors: gameState.turn === 1 ? ['#3b82f6', '#60a5fa'] : ['#22c55e', '#4ade80']
            });
        } else {
            playSound('connect');
        }

        if (nextMoves === 0) {
            nextTurn = gameState.turn === 1 ? 2 : 1;
        }

        let status = gameState.status;
        if (isGameFinished(dotsRef.current, nextLines, maxDist)) {
            status = 'finished';
            playSound('win');
        }
        
        const updates = {
            lines: nextLines,
            triangles: nextTrianglesList,
            moves: nextMoves,
            scores: nextScores,
            turn: nextTurn,
            status: status
        };

        if (isOnline) {
            await updateDoc(doc(db, "games", gameId), updates);
        } else {
            setGameState(prev => ({ ...prev, ...updates }));
        }
    };

    // --- DRAWING ---
    const drawBoard = () => {
        const ctx = ctxRef.current;
        const { size } = paramsRef.current;
        if (!ctx) return;

        ctx.clearRect(0, 0, size, size);

        // Triangles
        gameState.triangles.forEach(t => {
            const p1 = dotsRef.current[t.p1];
            const p2 = dotsRef.current[t.p2];
            const p3 = dotsRef.current[t.p3];
            if(!p1 || !p2 || !p3) return;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.fillStyle = t.player === 1 ? 'rgba(96, 165, 250, 0.25)' : 'rgba(34, 197, 94, 0.25)';
            ctx.fill();
        });

        // Lines
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        gameState.lines.forEach(l => {
            const p1 = dotsRef.current[l.p1];
            const p2 = dotsRef.current[l.p2];
            if(!p1 || !p2) return;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = l.player === 1 ? '#60a5fa' : '#4ade80';
            ctx.stroke();
        });

        // Dots
        dotsRef.current.forEach(d => {
            ctx.beginPath();
            ctx.arc(d.x, d.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#334155';
            ctx.fill();
        });

        // Interaction Layer
        const { isDragging, startDot, currentPos, hoverDot } = dragStateRef.current;
        
        if (hoverDot) {
            ctx.beginPath();
            ctx.arc(hoverDot.x, hoverDot.y, 10, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
        }

        if (isDragging && startDot) {
            ctx.beginPath();
            ctx.moveTo(startDot.x, startDot.y);
            const targetX = hoverDot ? hoverDot.x : currentPos.x;
            const targetY = hoverDot ? hoverDot.y : currentPos.y;
            ctx.lineTo(targetX, targetY);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    };

    // --- INPUT HANDLERS ---
    const interaction = {
        onDown: (e) => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            const x = ((clientX - rect.left) * (canvasRef.current.width / rect.width)) / dpr;
            const y = ((clientY - rect.top) * (canvasRef.current.height / rect.height)) / dpr;

            const dot = getDotAt(x, y);
            if (dot) {
                dragStateRef.current = {
                    isDragging: true,
                    startDot: dot,
                    currentPos: { x, y },
                    hoverDot: dot
                };
            }
        },
        onMove: (e) => {
            if (!dragStateRef.current.isDragging || !canvasRef.current) return;
            if(e.touches) e.preventDefault(); 

            const rect = canvasRef.current.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const x = ((clientX - rect.left) * (canvasRef.current.width / rect.width)) / dpr;
            const y = ((clientY - rect.top) * (canvasRef.current.height / rect.height)) / dpr;

            dragStateRef.current.currentPos = { x, y };
            dragStateRef.current.hoverDot = getDotAt(x, y);
        },
        onUp: () => {
            const { isDragging, startDot, hoverDot } = dragStateRef.current;
            if (isDragging && startDot && hoverDot && startDot.id !== hoverDot.id) {
                handleMove(startDot, hoverDot);
            }
            dragStateRef.current = { isDragging: false, startDot: null, currentPos: { x: 0, y: 0 }, hoverDot: null };
        }
    };

    // --- KEYBOARD LISTENER ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                handleRoll();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState.moves, gameState.turn, myRole, isRolling, isOnline]);

    return { gameState, diceValue, isRolling, handleRoll, interaction, myRole, toast };
};