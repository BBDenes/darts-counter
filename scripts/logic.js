let inGame = true;
let points = [];
let tempPoint;

function throwDart(v){
    if(!inGame) return;
    game[currentPlayerIndex].dart(v)
    
    refreshRoundPoints(game[currentPlayerIndex])
}

