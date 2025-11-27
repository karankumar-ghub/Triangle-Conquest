import React from 'react';
import { db, auth } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const Lobby = ({ user, onJoin, onStartLocal, onEditProfile }) => {
    
    const createGame = async () => {
        const newId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const initialState = {
            host: { 
                uid: user.uid, 
                name: user.displayName || 'Host',
                photo: user.photoURL || '👤' 
            },
            guest: null,
            status: 'waiting',
            lines: [],
            triangles: [],
            moves: 0,
            turn: 1,
            scores: { 1: 0, 2: 0 }
        };

        await setDoc(doc(db, 'games', newId), initialState);
        const url = new URL(window.location);
        url.searchParams.set('game', newId);
        window.history.pushState({}, '', url);
        onJoin(newId);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white gap-6 font-sans relative">
            
            {/* CLICKABLE PROFILE BADGE */}
            <div 
                onClick={onEditProfile}
                className="absolute top-8 right-8 flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/10 hover:scale-105 transition-all group"
                title="Edit Profile"
            >
                <span className="text-xl">{user.photoURL}</span>
                <span className="font-bold text-sm text-blue-200">{user.displayName}</span>
                <span className="text-xs text-slate-500 group-hover:text-white ml-2">✎</span>
            </div>

            <h1 className="text-4xl font-bold text-blue-500 font-orbitron tracking-widest text-center">
                TRIANGLE<br/>CONQUEST
            </h1>
            
            <div className="flex flex-col gap-4 w-full max-w-xs">
                <button 
                    onClick={createGame}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-3"
                >
                    <span>🌍</span> CREATE ONLINE GAME
                </button>

                <button 
                    onClick={onStartLocal}
                    className="w-full py-4 bg-slate-800 border border-white/10 rounded-xl font-bold shadow-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-3"
                >
                    <span>📱</span> LOCAL PASS & PLAY
                </button>
            </div>

            <p className="text-slate-500 text-xs mt-4">v1.2.0 Beta</p>
        </div>
    );
};

export default Lobby;