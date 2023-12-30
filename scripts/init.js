const {gameType, legType, setType, playerList} = parseURL(decodeURI(window.location.search));

// let gameType = "501";
// let set = {type: "b", amount: 3};
// let leg = {type: "b", amount: 3};
let gameLogic = initPlayers();

function initPlayers(){
    console.log(legType);
    for (const player of playerList) {
        players.push(new Player(player, gameType));
    }
    if(players.length == 0){
        const p1 = new Player("Player1", gameType);
        const p2 = new Player("Player2", gameType);
        players = [p1, p2];
    }
    game = players;

    if (gameType == "cricket") {
        const cricket = new Cricket(game);
        return cricket;
    }
    console.log(setType)
    refreshNormal(setType);
    
}

function refreshNormal(setType) {
    const playersTable = document.getElementsByClassName('playersTable')[0];
    playersTable.innerHTML = `<tr class="headers">
    <th></th>
    <th class="header" id="setTypeHeader">${gameHeaderText(setType)}</th>
    <th class="header" id="setsHeader">Sets</th>
    <th class="header" id="legsHeader">Legs</th>
    <th class="blank"></th>
    </tr>`;
    for (const player of game) {
        playersTable.innerHTML += template(player)
    }
    const currBoxes = playersTable.getElementsByClassName("current")
    for (const box of currBoxes) {
        if (box.parentNode.parentNode.id != players[0].name) {
            // box.parentNode.removeChild(box)
            box.style.display = "none"
        }
        box.classList.remove("anim");   
        const rowHeight = document.querySelector(".player").getBoundingClientRect().height;
        box.style.transform = `translateY(${currentPlayerIndex * rowHeight}px)`;
    }

    refreshAvg();
    for (const player of game) {
        player.getCheckout(player.score)
    }

}

function gameHeaderText(setType) {
    if (setType.type == "f") {
        return `First to ${setType.amount} sets`
    }
    else if (setType.type == "b") {
        return `Best of ${setType.amount} sets`
    }else if(setType.type = "none"){
        return `No sets`
    }
}


