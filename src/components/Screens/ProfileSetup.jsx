import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth';

const AVATARS = ['🤖', '👽', '👻', '🤡', '💩', '👹', '🤠', '👾', '🦊', '🐯', '🐼', '🦄'];

const ProfileSetup = ({ user, onComplete }) => {
    // PRE-FILL DATA if editing
    const [name, setName] = useState(user.displayName || '');
    const [selectedAvatar, setSelectedAvatar] = useState(user.photoURL || AVATARS[0]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        
        setLoading(true);
        try {
            await updateProfile(user, {
                displayName: name.trim(),
                photoURL: selectedAvatar
            });
            onComplete();
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-4 font-sans">
            <div className="glass p-8 rounded-3xl w-full max-w-md border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
                <h2 className="text-2xl font-bold mb-6 text-center font-orbitron text-blue-400">IDENTITY SETUP</h2>
                
                {/* Avatar Selection */}
                <div className="mb-8">
                    <p className="text-xs text-slate-400 mb-3 text-center uppercase tracking-widest">Select Avatar</p>
                    <div className="grid grid-cols-4 gap-3">
                        {AVATARS.map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => setSelectedAvatar(emoji)}
                                className={`text-3xl p-3 rounded-xl transition-all ${selectedAvatar === emoji ? 'bg-blue-600 shadow-lg scale-110' : 'bg-slate-800 hover:bg-slate-700'}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Name Input */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <p className="text-xs text-slate-400 mb-2 uppercase tracking-widest">Codename</p>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name..."
                            maxLength={12}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-center text-lg font-bold outline-none focus:border-blue-500 transition-colors"
                            autoFocus
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={!name.trim() || loading}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${!name.trim() ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-linear-to-r from-blue-600 to-purple-600 hover:scale-[1.02] text-white'}`}
                    >
                        {loading ? 'INITIALIZING...' : 'ENTER SYSTEM'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetup;