// src/utils/sound.js

// Simple synthesizer for game sounds (No external assets needed!)
export const playSound = (type) => {
    // Check if browser supports AudioContext
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const a = new AudioContext();
    const t = a.currentTime;

    if (type === 'score') {
        // Happy major chord arpeggio
        [0, 4, 7].forEach((offset, i) => { 
            const o = a.createOscillator(); 
            const g = a.createGain(); 
            o.connect(g); 
            g.connect(a.destination); 
            o.type = 'sine'; 
            o.frequency.value = 523.25 * Math.pow(2, offset/12); // C5 Major
            
            g.gain.setValueAtTime(0.1, t); 
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.6); 
            
            o.start(t + i*0.05); 
            o.stop(t + 1.0); 
        });
    } 
    else if (type === 'connect') {
        // Short "snap" sound
        const o = a.createOscillator(); 
        const g = a.createGain(); 
        o.connect(g); 
        g.connect(a.destination); 
        
        o.frequency.setValueAtTime(400, t); 
        o.frequency.exponentialRampToValueAtTime(100, t + 0.1); 
        
        g.gain.setValueAtTime(0.1, t); 
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.1); 
        
        o.start(); 
        o.stop(t + 0.1);
    } 
    else if (type === 'win') {
        // Victory fanfare
        const o = a.createOscillator(); 
        const g = a.createGain(); 
        o.connect(g); 
        g.connect(a.destination); 
        o.type = 'triangle'; 
        
        o.frequency.setValueAtTime(200, t); 
        o.frequency.linearRampToValueAtTime(600, t+0.5); 
        
        g.gain.setValueAtTime(0.2, t); 
        g.gain.linearRampToValueAtTime(0, t+2); 
        
        o.start(); 
        o.stop(t+2);
    }
    else if (type === 'roll') {
        // Dice shake noise
        for(let i=0; i<5; i++) { 
            const o = a.createOscillator(); 
            const g = a.createGain(); 
            o.connect(g); 
            g.connect(a.destination); 
            o.type='square'; 
            o.frequency.value = 150 + Math.random()*50; 
            g.gain.setValueAtTime(0.05, t + i*0.06); 
            g.gain.exponentialRampToValueAtTime(0.001, t + i*0.06 + 0.05); 
            o.start(t + i*0.06); 
            o.stop(t + i*0.06 + 0.05); 
        }
    }
};