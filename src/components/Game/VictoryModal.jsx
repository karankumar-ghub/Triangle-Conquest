import React from 'react';

const VictoryModal = ({ scores, winner, onRestart, p1Name, p2Name }) => {
    // If winner is passed as ID (1 or 2), resolve to name
    // If no specific winner logic passed, calculate from score
    let winnerText = "IT'S A TIE!";
    let winnerColor = "text-white";

    if (winner === 1 || (!winner && scores[1] > scores[2])) {
        winnerText = `${p1Name || "BLUE"} WINS!`;
        winnerColor = "text-blue-400";
    } else if (winner === 2 || (!winner && scores[2] > scores[1])) {
        winnerText = `${p2Name || "GREEN"} WINS!`;
        winnerColor = "text-green-400";
    }

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1e293b] p-8 rounded-3xl border border-white/10 shadow-2xl max-w-sm w-full text-center transform animate-bounce-in">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className={`text-3xl font-black mb-6 uppercase tracking-tight ${winnerColor}`}>
                    {winnerText}
                </h2>

                <div className="flex justify-center gap-8 mb-8 bg-black/20 p-4 rounded-xl">
                    <div className="flex flex-col items-center w-24">
                        <span className="text-[10px] font-bold text-blue-400 mb-1 truncate max-w-full">{p1Name || "BLUE"}</span>
                        <span className="text-3xl font-black text-white">{scores[1]}</span>
                    </div>
                    <div className="w-px bg-white/10"></div>
                    <div className="flex flex-col items-center w-24">
                        <span className="text-[10px] font-bold text-green-400 mb-1 truncate max-w-full">{p2Name || "GREEN"}</span>
                        <span className="text-3xl font-black text-white">{scores[2]}</span>
                    </div>
                </div>

                <button 
                    onClick={onRestart}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl font-bold text-white shadow-lg hover:scale-105 transition-transform"
                >
                    PLAY AGAIN
                </button>
            </div>
        </div>
    );
};

export default VictoryModal;