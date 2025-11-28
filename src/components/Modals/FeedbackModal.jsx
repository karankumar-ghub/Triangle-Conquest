import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const FeedbackModal = ({ onClose, user }) => {
    const [msg, setMsg] = useState('');
    const [contact, setContact] = useState(''); // <--- NEW STATE
    const [status, setStatus] = useState('idle'); // idle | sending | success | error

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!msg.trim()) return;
        
        setStatus('sending');
        try {
            await addDoc(collection(db, "feedback"), {
                uid: user.uid,
                // Use the typed contact info, OR their profile name, OR Anonymous
                name: contact.trim() || user.displayName || 'Anonymous', 
                message: msg,
                timestamp: Date.now()
            });
            setStatus('success');
            setTimeout(onClose, 2500); // Increased time slightly so they can read the message
        } catch (error) {
            console.error("Feedback error:", error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
                
                <h2 className="text-xl font-bold text-white mb-2 font-orbitron">FEEDBACK & REPORTS</h2>
                <p className="text-xs text-slate-500 mb-6">Help us improve the system.</p>

                {/* --- NEW SUCCESS MESSAGE --- */}
                {status === 'success' && (
                    <div className="text-center py-8 text-green-400 font-bold animate-bounce flex flex-col gap-2">
                        <span className="text-4xl">💌</span>
                        <span>THANKS! WE RECEIVED YOUR MESSAGE.</span>
                    </div>
                )}

                {/* ERROR MESSAGE */}
                {status === 'error' && (
                    <div className="text-center py-8 text-red-400 font-bold animate-pulse flex flex-col gap-2">
                        <span className="text-4xl">⚠️</span>
                        <span>TRANSMISSION FAILED</span>
                        <span className="text-xs font-mono text-slate-400">Check your connection.</span>
                    </div>
                )}

                {/* FORM */}
                {(status === 'idle' || status === 'sending') && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        
                        {/* --- NEW OPTIONAL INPUT --- */}
                        <input
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                            placeholder="Your Name or Email (Optional)"
                        />

                        <textarea
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-blue-500 min-h-[120px] resize-none"
                            placeholder="What's on your mind?"
                            autoFocus
                        />
                        
                        <button 
                            type="submit" 
                            disabled={status === 'sending' || !msg.trim()}
                            className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-white border border-white/10 transition-colors disabled:opacity-50 flex justify-center mt-2"
                        >
                            {status === 'sending' ? (
                                <span className="animate-pulse">SENDING...</span>
                            ) : (
                                'SEND FEEDBACK'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FeedbackModal;