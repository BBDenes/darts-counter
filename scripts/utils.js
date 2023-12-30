let players = [

]

let game = [

]

let currentPlayerIndex = 0;



function parseURL(url){
    const raw =  url.split("&");
    const gameType = raw[0].slice(1, raw[0].length).split("=")[1];
    console.log(gameType)
    const setType = {type: raw[1].split("=")[1].split("+")[0], amount: Number(raw[1].split("=")[1].split("+")[1])};
    const legType = {type: raw[2].split("=")[1].split("+")[0], amount: Number(raw[2].split("=")[1].split("+")[1])};
    // if (raw[3] == undefined) {
    //     raw[3] = "players=Player1%2FPlayer2%2FPlayer3"
    // }
    const rawPlayers = raw[3].split("=")[1].split("%2F");
    const playerList = rawPlayers.map(element => {
        return element.replace("+", " ");
    });
    return {gameType, setType, legType, playerList};
}

function template(player){
    return(
        `<tr class="player" id=${player.name.replace(" ", "_")}>
        <td><div class="current"></div></td>
        <td class="name"><h2 >${player.name}</h2></td>
        <td class="set"><p class="set${player.name.replace(" ", "_")}">${player.sets}</p></td>
        <td class="leg"><p class="leg${player.name.replace(" ", "_")}">${player.legs}</p></td>
        <td class="score"><h3 id="score${player.name.replace(" ", "_")}">${player.score}</h3></td>
        <td> <h3 class="checkout">t20</h3> </td>
        </tr>`
    );
}

function refreshRoundPoints(player) {
    document.getElementById('currentPoints').innerHTML = player.round.join(", ")
}

function undo(){
    const player = game[currentPlayerIndex]; 
    if (gameType == "cricket") {
        gameLogic.undo(player);
        return;
    }
    game[currentPlayerIndex].round.pop();
    refreshRoundPoints(game[currentPlayerIndex])
}

function nextPlayer() {
    // const rowHeight = document.querySelector(".row").getBoundingClientRect().height;
    // const div = document.querySelector(".current");

    // div.style.translateY()
    if (gameType != "cricket") {
        refreshNormal(setType)
    }else{
        gameLogic.refresh();
    }

    currentPlayerIndex++;
    if (currentPlayerIndex >= game.length) {
        currentPlayerIndex = 0;
    }
    console.log(game[currentPlayerIndex])

    const box = document.querySelector(".current")
    box.classList.add("anim");
    const rowHeight = document.querySelector(".player").getBoundingClientRect().height;
    console.log(currentPlayerIndex * rowHeight);
    box.style.transform = `translateY(${currentPlayerIndex * rowHeight}px)`;
    
    if (game[currentPlayerIndex].score <171) {
        game[currentPlayerIndex].getCheckout(game[currentPlayerIndex].score);
    }

}

function winLeg(winner) {
    if (legType.type == 'f') {
        if (winner.legs + 1 == legType.amount) {
            winSet(winner);
            return;
        }
        winner.legs++;
    }else if(legType.type == 'b'){
        winner.legs++;
        let legsPlayed = 0
        game.forEach(player => {legsPlayed += Number(player.legs)});
        let remainingLegs = legType.amount - legsPlayed;
        if (winner.legs == legType.amount || (winner.legs > remainingLegs && checkDraw("legs"))) {
            
            winSet(winner);
            return;
        }
        if (legsPlayed == legType.amount) {
            if (checkDraw("legs")) {
                winSet(checkDraw("legs"));
            }
        }
    }

    for (const player of game) {
        player.resetScore();
    }
}

function winSet(winner) {
    if (setType.type == 'f') {
        if (winner.sets + 1 == setType.amount) {
            winGame(winner);
            return;
        }
        winner.sets++;
    }else if(setType.type == 'b'){
        let remainingSets = setType.amount - setsPlayed;
        if (winner.sets +1 == setType.amount || winner.sets + 1 > remainingSets) {
            winGame(winner);
            return;
        }
        winner.sets++;
        
    }
    
    for (const player of game) {
        player.resetScore()
        player.resetLegs();
    }
}

function checkDraw(type){
    const winners = [];
    let max = 0;
    for (const player of game) {
        if (player[type] > max) {
            max = player[type];
        }
    }
    for (const player of game) {
        if (player[type] == max) {
            winners.push(player)
        }
    }
    if (winners.length == 1) {
        console.log("Winner: ", winners[0]);
        return winners[0];
    }else{
        console.log("draw")
        return null
    }
}

function winGame(winner){
    const winnerContainer = document.querySelector(".winnerContainer");
    const winnerText = document.querySelector(".winnerPlayer")
    winnerContainer.style.display = "flex";
    winnerText.innerHTML = winner.name;
    inGame = false
}

function toNum(array){
    let throws = []
    for (const t of array) {
        if(t.split(" ")[0] == "t") throws.push( 3*Number(t.split(" ")[1]))
        else if(t.split(" ")[0] == "d") throws.push( 2*Number(t.split(" ")[1]))
        else if(t.split(" ")[0] == "s") throws.push( Number(t.split(" ")[1]))
        else if(t.split(" ")[0] == "bull"){
            if (t.split(" ")[1] == "inner") {
                throws.push(50)
            }else{
                throws.push(25)
            }
        } 
    }
    return throws;
}

function refreshAvg(){
    const body = document.querySelector(".avgBody");
    body.innerHTML = "";
    for (const player of game) {
        body.innerHTML += player.avgTemplate()
    }
}
