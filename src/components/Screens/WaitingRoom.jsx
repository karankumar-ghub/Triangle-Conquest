import React, { useState } from 'react';

const WaitingRoom = ({ gameId, onCopy }) => {
    const [copied, setCopied] = useState(false);
    const url = `${window.location.origin}/?game=${gameId}`;
    
    // Use a reliable public API for QR Code to avoid package issues
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-4">
            <div className="glass p-8 rounded-3xl text-center max-w-sm w-full border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
                <div className="animate-pulse mb-4 text-blue-400 text-4xl">📡</div>
                <h2 className="text-xl font-bold mb-2 tracking-widest font-orbitron">AWAITING PLAYER</h2>
                <p className="text-slate-500 text-xs mb-8 font-sans">Scan QR or share uplink code</p>
                
                <div className="bg-white p-4 rounded-xl w-fit mx-auto mb-8 shadow-inner">
                    <img src={qrCodeUrl} alt="Scan to Join" className="w-32 h-32" />
                </div>
                
                <div className="flex gap-2 mb-8 w-full">
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
                    Abort Session
                </button>
            </div>
        </div>
    );
};

export default WaitingRoom;