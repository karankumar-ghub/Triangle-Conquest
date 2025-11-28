import React from 'react';

const HowToPlayModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
                
                <h2 className="text-2xl font-bold text-blue-400 mb-6 font-orbitron tracking-wide text-center">MISSION BRIEFING</h2>
                
                <div className="space-y-6 text-sm text-slate-300">
                    <div className="flex gap-4 items-start">
                        <div className="bg-blue-500/20 p-3 rounded-lg text-2xl">🎲</div>
                        <div>
                            <h3 className="font-bold text-white mb-1">1. Roll & Move</h3>
                            <p>Roll the dice to get action points. Each point lets you draw <b>one line</b> between dots.</p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="bg-green-500/20 p-3 rounded-lg text-2xl">📐</div>
                        <div>
                            <h3 className="font-bold text-white mb-1">2. Form Triangles</h3>
                            <p>Connect dots to form triangles. Each triangle gives you <b>1 Point</b>.</p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="bg-purple-500/20 p-3 rounded-lg text-2xl">⚔️</div>
                        <div>
                            <h3 className="font-bold text-white mb-1">3. Capture Territory</h3>
                            <p>Strategy is key! Block your opponent and claim the most triangles to win.</p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={onClose}
                    className="w-full mt-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-white shadow-lg hover:scale-[1.02] transition-transform"
                >
                    UNDERSTOOD
                </button>
            </div>
        </div>
    );
};

export default HowToPlayModal;