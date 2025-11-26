import React from 'react';

const VictoryModal = ({ scores, onRestart }) => {
    const p1Win = scores[1] > scores[2];
    const isTie = scores[1] === scores[2];
    
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1e293b] p-8 rounded-3xl border border-white/10 shadow-2xl max-w-sm w-full text-center transform animate-bounce-in">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className={`text-3xl font-black mb-6 ${isTie ? 'text-white' : p1Win ? 'text-blue-400' : 'text-green-400'}`}>
                    {isTie ? "IT'S A TIE!" : (p1Win ? "BLUE WINS!" : "GREEN WINS!")}
                </h2>

                <div className="flex justify-center gap-8 mb-8 bg-black/20 p-4 rounded-xl">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-blue-400 mb-1">BLUE</span>
                        <span className="text-3xl font-black">{scores[1]}</span>
                    </div>
                    <div className="w-px bg-white/10"></div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-green-400 mb-1">GREEN</span>
                        <span className="text-3xl font-black">{scores[2]}</span>
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