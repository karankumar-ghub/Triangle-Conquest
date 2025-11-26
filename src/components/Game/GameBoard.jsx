import React, { useRef, useState, useEffect } from 'react';
import { useGameLogic } from '../../hooks/useGameLogic';
import VictoryModal from './VictoryModal';
import WaitingRoom from '../Screens/WaitingRoom';

const GameBoard = ({ gameId, user }) => {
    const canvasRef = useRef(null);
    const { gameState, diceValue, isRolling, handleRoll, interaction, myRole, toast, timeLeft, handleExit } = useGameLogic(canvasRef, gameId, user);
    
    // Smooth Dice Logic
    const [diceRotation, setDiceRotation] = useState({ x: 0, y: 0 });
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            const initialMap = { 1: { x: 0, y: 0 }, 2: { x: 0, y: -90 }, 3: { x: 0, y: 180 }, 4: { x: 0, y: 90 }, 5: { x: -90, y: 0 }, 6: { x: 90, y: 0 } };
            setDiceRotation(initialMap[diceValue] || {x:0, y:0});
            return;
        }
        const targetMap = { 1: { x: 0, y: 0 }, 2: { x: 0, y: -90 }, 3: { x: 0, y: 180 }, 4: { x: 0, y: 90 }, 5: { x: -90, y: 0 }, 6: { x: 90, y: 0 } };
        const target = targetMap[diceValue];
        setDiceRotation(prev => ({
            x: prev.x + 720 + (target.x - (prev.x % 360)),
            y: prev.y + 720 + (target.y - (prev.y % 360))
        }));
    }, [diceValue]);

    if (gameId && gameState.status === 'waiting' && myRole === 1) {
        return <WaitingRoom gameId={gameId} />;
    }

    return (
        <div className="flex flex-col h-screen w-full bg-[#0f172a] text-white font-sans overflow-hidden select-none relative">
            
            {/* --- TOAST --- */}
            {toast && (
                <div key={toast.id} className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce pointer-events-none">
                    <div className="bg-slate-900/90 text-red-400 px-6 py-3 rounded-full border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.4)] backdrop-blur-md font-bold tracking-widest text-sm flex items-center gap-3 whitespace-nowrap">
                        <span className="text-xl">⚠️</span> {toast.msg}
                    </div>
                </div>
            )}

            {/* --- HEADER --- */}
            <div className="flex justify-between items-center p-4 h-16 bg-slate-900/50 backdrop-blur-md z-10 shrink-0">
                {/* NEW: EXIT BUTTON HANDLES FORFEIT */}
                <button onClick={handleExit} className="text-red-400 border border-red-500/30 px-4 py-1 rounded-full text-xs font-bold hover:bg-red-500/10 transition-colors">
                    EXIT
                </button>
                
                <div className="text-center relative">
                    <div className="text-[10px] text-slate-500 tracking-widest uppercase">Current Turn</div>
                    <h1 className={`text-xl font-black tracking-widest ${gameState.turn === 1 ? "text-blue-400" : "text-green-400"} animate-pulse`}>
                        {gameState.turn === 1 ? "BLUE" : "GREEN"}
                    </h1>
                    
                    {/* NEW: TIMER WARNING */}
                    {gameId && gameState.status === 'playing' && (
                        <div className={`absolute -right-20 top-0 text-xs font-mono font-bold px-2 py-1 rounded border ${timeLeft < 10 ? 'text-red-500 border-red-500 bg-red-900/20 animate-pulse' : 'text-slate-400 border-slate-700'}`}>
                            {timeLeft}s
                        </div>
                    )}
                </div>

                <div className="w-16 text-right text-xs text-slate-500">
                    {gameId ? "ONLINE" : "LOCAL"}
                </div>
            </div>

            {/* --- GAME AREA --- */}
            <div className="flex-1 w-full flex items-center justify-center p-4 overflow-hidden">
                <div className="w-full h-full max-w-[600px] max-h-[600px] flex items-center justify-center">
                    <canvas 
                        ref={canvasRef} 
                        className="bg-slate-900/50 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm cursor-crosshair touch-none"
                        onMouseDown={interaction.onDown}
                        onMouseMove={interaction.onMove}
                        onMouseUp={interaction.onUp}
                        onMouseLeave={interaction.onUp}
                        onTouchStart={interaction.onDown}
                        onTouchMove={interaction.onMove}
                        onTouchEnd={interaction.onUp}
                    />
                </div>
            </div>

            {/* --- CONTROLS --- */}
            <div className="h-32 bg-slate-900/80 p-4 flex items-center justify-between gap-4 max-w-2xl mx-auto w-full rounded-t-3xl border-t border-white/10 backdrop-blur-lg mb-0 shrink-0 safe-area-bottom">
                
                {/* Player 1 Card + Warnings */}
                <div className={`flex-1 h-full rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative ${gameState.turn === 1 ? 'bg-blue-600/20 border-2 border-blue-500' : 'bg-white/5 border border-white/5 grayscale opacity-50'}`}>
                    <span className="text-2xl mb-1">🤖</span>
                    <span className="text-[10px] font-bold text-blue-300">PLAYER 1</span>
                    <span className="text-3xl font-black text-white">{gameState.scores[1]}</span>
                    {/* Warnings P1 */}
                    <div className="absolute top-2 right-2 flex gap-1">
                        {[...Array(gameState.warnings?.[1] || 0)].map((_, i) => (
                            <div key={i} className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        ))}
                    </div>
                </div>

                {/* 3D Dice */}
                <div className="flex flex-col items-center justify-center w-24 relative z-20">
                    <div 
                        className={`perspective-container cursor-pointer transition-transform ${gameState.moves > 0 ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                        onClick={handleRoll}
                    >
                        <div className="dice-3d" style={{ transform: `rotateX(${diceRotation.x}deg) rotateY(${diceRotation.y}deg)` }}>
                            <div className="face f1">1</div><div className="face f2">2</div><div className="face f3">3</div>
                            <div className="face f4">4</div><div className="face f5">5</div><div className="face f6">6</div>
                        </div>
                    </div>
                    
                    <div className={`absolute -top-3 px-3 py-1 rounded-full text-[10px] font-bold border shadow-lg whitespace-nowrap z-30 transition-colors ${gameState.moves > 0 ? 'bg-slate-800 text-white border-slate-600' : 'bg-yellow-400 text-black border-yellow-600 animate-bounce'}`}>
                        {gameState.moves === 0 ? "TAP TO ROLL" : `${gameState.moves} MOVES LEFT`}
                    </div>
                    
                    <div className="absolute -bottom-6 text-[9px] text-slate-600 font-mono hidden md:block">
                        [SPACE]
                    </div>
                </div>

                {/* Player 2 Card + Warnings */}
                <div className={`flex-1 h-full rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative ${gameState.turn === 2 ? 'bg-green-600/20 border-2 border-green-500' : 'bg-white/5 border border-white/5 grayscale opacity-50'}`}>
                    <span className="text-2xl mb-1">👽</span>
                    <span className="text-[10px] font-bold text-green-300">PLAYER 2</span>
                    <span className="text-3xl font-black text-white">{gameState.scores[2]}</span>
                    {/* Warnings P2 */}
                    <div className="absolute top-2 right-2 flex gap-1">
                        {[...Array(gameState.warnings?.[2] || 0)].map((_, i) => (
                            <div key={i} className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Victory Modal */}
            {gameState.status === 'finished' && (
                <VictoryModal 
                    scores={gameState.scores} 
                    winner={gameState.winner} // Pass winner prop if needed for custom message
                    onRestart={() => window.location.href='/'} 
                />
            )}  
        </div>
    );
};

export default GameBoard;