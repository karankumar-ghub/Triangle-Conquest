import React, { useState, useEffect } from 'react';
import GameBoard from './components/Game/GameBoard';
import Lobby from './components/Screens/Lobby';
import { auth } from './lib/firebase';
import { signInAnonymously } from 'firebase/auth';

function App() {
    const [gameId, setGameId] = useState(null);
    const [isLocal, setIsLocal] = useState(false); // <--- New State
    const [user, setUser] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('game');
        if (id) setGameId(id);

        signInAnonymously(auth).then(creds => setUser(creds.user));
    }, []);

    if (!user) return <div className="h-screen bg-slate-900 flex items-center justify-center text-blue-500">Loading...</div>;

    // 1. Local Game Mode
    if (isLocal) {
        return <GameBoard gameId={null} user={user} />;
    }

    // 2. Online Game Mode
    if (gameId) {
        return <GameBoard gameId={gameId} user={user} />;
    }

    // 3. Lobby
    return (
        <Lobby 
            user={user} 
            onJoin={(id) => setGameId(id)} 
            onStartLocal={() => setIsLocal(true)} 
        />
    );
}

export default App;