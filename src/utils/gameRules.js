// src/utils/gameRules.js

export const checkMoveValidity = (p1, p2, lines, maxDist) => {
    // 1. Check Distance
    const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
    if (dist > maxDist) return false;

    // 2. Check if Line Exists (Bidirectional)
    const exists = lines.some(l => 
        (l.p1 === p1.id && l.p2 === p2.id) || 
        (l.p1 === p2.id && l.p2 === p1.id)
    );
    if (exists) return false;

    return true;
};

export const findNewTriangles = (p1, p2, currentLines, currentTriangles, turn) => {
    const newTris = [];
    const neighbors = currentLines
        .filter(l => l.p1 === p1.id || l.p2 === p1.id)
        .map(l => (l.p1 === p1.id ? l.p2 : l.p1));

    neighbors.forEach(nId => {
        if (nId === p2.id) return;
        
        const isConnected = currentLines.some(l => 
            (l.p1 === p2.id && l.p2 === nId) || 
            (l.p1 === nId && l.p2 === p2.id)
        );

        if (isConnected) {
            const tIds = [p1.id, p2.id, nId].sort((a,b) => a-b);
            const exists = currentTriangles.some(t => {
                const eIds = [t.p1, t.p2, t.p3].sort((a,b) => a-b);
                return eIds[0] === tIds[0] && eIds[1] === tIds[1] && eIds[2] === tIds[2];
            });

            if (!exists) {
                newTris.push({ p1: tIds[0], p2: tIds[1], p3: tIds[2], player: turn });
            }
        }
    });

    return newTris;
};

export const isGameFinished = (dots, lines, maxDist) => {
    // REMOVED THE OPTIMIZATION LINE HERE TO PREVENT BUGS
    
    // Check every possible pair of dots
    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            const p1 = dots[i];
            const p2 = dots[j];
            
            // If at least ONE valid move exists, the game is NOT over.
            if (checkMoveValidity(p1, p2, lines, maxDist)) {
                return false; 
            }
        }
    }
    // If no valid moves were found after checking all pairs:
    return true;
};