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
        <td><div class="current"><svg width="100%" height="100%" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="#000" d="M134.745 22.098c-4.538-.146-9.08 1.43-14.893 7.243-5.586 5.586-11.841 21.725-15.248 35.992-.234.979-.444 1.907-.654 2.836l114.254 105.338c-7.18-28.538-17.555-59.985-29.848-86.75-11.673-25.418-25.249-46.657-37.514-57.024-6.132-5.183-11.56-7.488-16.097-7.635zM92.528 82.122L82.124 92.526 243.58 267.651l24.072-24.072L92.528 82.122zm-24.357 21.826c-.929.21-1.857.42-2.836.654-14.267 3.407-30.406 9.662-35.993 15.248-5.813 5.813-7.39 10.355-7.244 14.893.147 4.538 2.452 9.965 7.635 16.098 10.367 12.265 31.608 25.842 57.025 37.515 26.766 12.293 58.211 22.669 86.749 29.848L68.17 103.948zM280.899 255.79l-25.107 25.107 73.265 79.469 31.31-31.31L280.9 255.79zm92.715 85.476l-32.346 32.344 2.07 2.246c.061.058 4.419 4.224 10.585 6.28 6.208 2.069 12.71 2.88 21.902-6.313 9.192-9.192 8.38-15.694 6.31-21.902-2.057-6.174-6.235-10.54-6.283-10.59l-2.238-2.065zm20.172 41.059a46.23 46.23 0 0 1-5.233 6.226 46.241 46.241 0 0 1-6.226 5.235L489.91 489.91l-96.125-107.586z"/></svg></div></td>
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

function resetLeg() {
    for (const player of game) {
        player.resetScore();
    }
}

function resetSet() {
    for (const player of game) {
        player.resetScore()
        player.resetLegs();
    }
}
