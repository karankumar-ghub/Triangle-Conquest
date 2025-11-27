import React, { useState, useEffect } from 'react';
import GameBoard from './components/Game/GameBoard';
import Lobby from './components/Screens/Lobby';
import ProfileSetup from './components/Screens/ProfileSetup';
import { auth } from './lib/firebase';
import { signInAnonymously } from 'firebase/auth';

function App() {
    const [gameId, setGameId] = useState(null);
    const [isLocal, setIsLocal] = useState(false);
    const [user, setUser] = useState(null);
    const [isProfileSet, setIsProfileSet] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false); // <--- NEW STATE

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('game');
        if (id) setGameId(id);

        signInAnonymously(auth).then(creds => {
            setUser(creds.user);
            if (creds.user.displayName) setIsProfileSet(true);
        });
    }, []);

    if (!user) return <div className="h-screen bg-slate-900 flex items-center justify-center text-blue-500 animate-pulse font-orbitron">INITIALIZING UPLINK...</div>;

    // SHOW PROFILE SETUP (Initial OR Editing)
    if (!isProfileSet || isEditingProfile) {
        return (
            <ProfileSetup 
                user={user} 
                onComplete={() => {
                    setIsProfileSet(true);
                    setIsEditingProfile(false);
                }} 
            />
        );
    }

    if (isLocal) return <GameBoard gameId={null} user={user} />;
    if (gameId) return <GameBoard gameId={gameId} user={user} />;

    return (
        <Lobby 
            user={user} 
            onJoin={(id) => setGameId(id)} 
            onStartLocal={() => setIsLocal(true)}
            onEditProfile={() => setIsEditingProfile(true)} // <--- Pass the edit handler
        />
    );
}

export default App;