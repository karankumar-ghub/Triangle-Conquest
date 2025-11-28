import React, { useState } from 'react';

const WaitingRoom = ({ gameId, onCopy }) => {
    const [copied, setCopied] = useState(false);
    const url = `${window.location.origin}/?game=${gameId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-4 font-sans">
            <div className="glass p-8 rounded-3xl text-center max-w-sm w-full border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
                <div className="animate-pulse mb-4 text-blue-400 text-4xl">📡</div>
                <h2 className="text-xl font-bold mb-2 tracking-widest font-orbitron">UPLINK ESTABLISHED</h2>
                
                {/* --- NEW: INSTRUCTIONS --- */}
                <div className="bg-black/30 rounded-xl p-4 mb-6 text-left space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">How to Connect:</p>
                    <div className="flex items-center gap-3 text-xs text-slate-300">
                        <span className="bg-blue-500/20 text-blue-300 w-5 h-5 flex items-center justify-center rounded-full font-bold">1</span>
                        <span>Copy the link below</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-300">
                        <span className="bg-blue-500/20 text-blue-300 w-5 h-5 flex items-center justify-center rounded-full font-bold">2</span>
                        <span>Send it to a friend</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-300">
                        <span className="bg-blue-500/20 text-blue-300 w-5 h-5 flex items-center justify-center rounded-full font-bold">3</span>
                        <span>Wait for them to join!</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl w-fit mx-auto mb-6 shadow-inner">
                    <img src={qrCodeUrl} alt="Scan to Join" className="w-24 h-24" />
                </div>
                
                <div className="flex gap-2 mb-6 w-full">
                    <input 
                        readOnly 
                        value={url} 
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-xs text-slate-300 outline-none font-mono truncate"
                    />
                    <button 
                        onClick={handleCopy} 
                        className={`px-4 rounded-lg font-bold text-xs transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-500'}`}
                    >
                        {copied ? 'COPIED' : 'COPY'}
                    </button>
                </div>
                
                <button 
                    onClick={() => window.location.href='/'} 
                    className="text-xs text-red-500/50 hover:text-red-400 tracking-widest uppercase"
                >
                    Cancel Mission
                </button>
            </div>
        </div>
    );
};

export default WaitingRoom;