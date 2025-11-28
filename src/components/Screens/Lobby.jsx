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

            <h1 className="text-4xl font-bold text-blue-500 font-orbitron tracking-widest text-center animate-float">
                TRIANGLE<br/>CONQUEST
            </h1>
            
            <div className="flex flex-col gap-4 w-full max-w-xs z-10">
                <button 
                    onClick={createGame}
                    className="w-full py-4 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-3"
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

            {/* --- NEW: DEVELOPER CREDITS WITH SVG LOGOS --- */}
            <div className="absolute bottom-6 flex flex-col items-center gap-3">
                <div className="text-xs text-slate-500 font-mono tracking-wide">
                    Developed by <a href="#" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">Karan Kumar</a>
                </div>
                
                <div className="flex gap-6 items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                    
                    {/* GitHub Logo */}
                    <a href="https://github.com/karankumar-ghub" target="_blank" rel="noreferrer" className="text-white hover:text-gray-300 hover:scale-110 transition-transform">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                    </a>

                    {/* LinkedIn Logo */}
                    <a href="https://t.me/KaranDRajput" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 hover:scale-110 transition-transform">
                         <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.78754 14.0196C5.83131 14.0344 5.87549 14.0448 5.91963 14.0512C5.96777 14.1644 6.02996 14.3107 6.10252 14.4818C6.27959 14.8994 6.51818 15.4643 6.76446 16.0535C7.2667 17.2552 7.77332 18.4939 7.88521 18.8485C8.02372 19.2868 8.17013 19.5848 8.32996 19.7883C8.4126 19.8935 8.50819 19.9853 8.62003 20.0549C8.67633 20.0899 8.7358 20.1186 8.79788 20.14C8.80062 20.141 8.80335 20.1419 8.80608 20.1428C9.1261 20.2636 9.41786 20.2133 9.60053 20.1518C9.69827 20.1188 9.77735 20.0791 9.8334 20.0469C9.86198 20.0304 9.88612 20.0151 9.90538 20.0021L9.90992 19.9991L12.7361 18.2366L16.0007 20.7394C16.0488 20.7763 16.1014 20.8073 16.157 20.8316C16.5492 21.0027 16.929 21.0624 17.2862 21.0136C17.6429 20.9649 17.926 20.8151 18.1368 20.6464C18.3432 20.4813 18.4832 20.2963 18.5703 20.1589C18.6148 20.0887 18.6482 20.0266 18.6718 19.9791C18.6836 19.9552 18.6931 19.9346 18.7005 19.9181L18.7099 19.8963L18.7135 19.8877L18.715 19.8841L18.7156 19.8824L18.7163 19.8808C18.7334 19.8379 18.7466 19.7935 18.7556 19.7482L21.7358 4.72274C21.7453 4.67469 21.7501 4.62581 21.7501 4.57682C21.7501 4.13681 21.5843 3.71841 21.1945 3.46452C20.8613 3.24752 20.4901 3.23818 20.2556 3.25598C20.0025 3.27519 19.7688 3.33766 19.612 3.38757C19.5304 3.41355 19.4619 3.43861 19.4126 3.45773C19.3878 3.46734 19.3675 3.47559 19.3523 3.48188L19.341 3.48666L2.62725 10.0432L2.62509 10.044C2.61444 10.0479 2.60076 10.053 2.58451 10.0593C2.55215 10.0719 2.50878 10.0896 2.45813 10.1126C2.35935 10.1574 2.22077 10.2273 2.07856 10.3247C1.85137 10.4803 1.32888 10.9064 1.41686 11.6097C1.48705 12.1708 1.87143 12.5154 2.10562 12.6811C2.23421 12.7721 2.35638 12.8371 2.44535 12.8795C2.48662 12.8991 2.57232 12.9339 2.6095 12.9491L2.61889 12.9529L5.78754 14.0196ZM19.9259 4.86786L19.9236 4.86888C19.9152 4.8725 19.9069 4.87596 19.8984 4.87928L3.1644 11.4438C3.15566 11.4472 3.14686 11.4505 3.138 11.4536L3.12869 11.4571C3.11798 11.4613 3.09996 11.4686 3.07734 11.4788C3.06451 11.4846 3.05112 11.491 3.03747 11.4978C3.05622 11.5084 3.07417 11.5175 3.09012 11.5251C3.10543 11.5324 3.11711 11.5374 3.1235 11.54L6.26613 12.598C6.32365 12.6174 6.37727 12.643 6.42649 12.674L16.8033 6.59948L16.813 6.59374C16.8205 6.58927 16.8305 6.58353 16.8424 6.5768C16.866 6.56345 16.8984 6.54568 16.937 6.52603C17.009 6.48938 17.1243 6.43497 17.2541 6.39485C17.3444 6.36692 17.6109 6.28823 17.899 6.38064C18.0768 6.43767 18.2609 6.56028 18.3807 6.76798C18.4401 6.87117 18.4718 6.97483 18.4872 7.06972C18.528 7.2192 18.5215 7.36681 18.4896 7.49424C18.4208 7.76875 18.228 7.98287 18.0525 8.14665C17.9021 8.28706 15.9567 10.1629 14.0376 12.0147C13.0805 12.9381 12.1333 13.8525 11.4252 14.5359L10.9602 14.9849L16.8321 19.4867C16.9668 19.5349 17.0464 19.5325 17.0832 19.5274C17.1271 19.5214 17.163 19.5045 17.1997 19.4752C17.2407 19.4424 17.2766 19.398 17.3034 19.3557L17.3045 19.354L20.195 4.78102C20.1521 4.79133 20.1087 4.80361 20.0669 4.81691C20.0196 4.83198 19.9805 4.84634 19.9547 4.85637C19.9418 4.86134 19.9326 4.86511 19.9276 4.86719L19.9259 4.86786ZM11.4646 17.2618L10.2931 16.3636L10.0093 18.1693L11.4646 17.2618ZM9.21846 14.5814L10.3834 13.4567C11.0915 12.7732 12.0389 11.8588 12.9961 10.9352L13.9686 9.997L7.44853 13.8138L7.48351 13.8963C7.66121 14.3154 7.90087 14.8827 8.14845 15.4751C8.33358 15.918 8.52717 16.3844 8.70349 16.8162L8.98653 15.0158C9.01381 14.8422 9.09861 14.692 9.21846 14.5814Z"></path> 
                        </svg>
                    </a>

                    {/* Instagram Logo */}
                    <a href="https://www.instagram.com/karan.creats/" target="_blank" rel="noreferrer" className="text-pink-500 hover:text-pink-400 hover:scale-110 transition-transform">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.488 2h-.173zm0 2h.172c-2.444 0-2.79.013-3.81.059-.974.045-1.504.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.63c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                    </a>
                </div>
                
                <div className="text-[9px] text-slate-700 font-mono mt-2">
                    v1.3.0 Stable Release
                </div>
            </div>

        </div>
    );
};

export default Lobby;


