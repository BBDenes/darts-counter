class Cricket{
    constructor(players){
        this.players = players
        this.init()
        this.roundCount = 0;
        this.allClaimedSectors = {"20":[], "19":[], "18":[], "17":[], "16":[], "15":[], "bull":[],}; 
    }

    init(){
        const table = document.querySelector(".playersTable");
        
        const header = `
        <tr class="headers">
        <th></th>
        <th class="header" id="setTypeHeader">${gameHeaderText(setType)}</th>
        <th class="header">20</th>
        <th class="header">19</th>
        <th class="header">18</th>
        <th class="header">17</th>
        <th class="header">16</th>
        <th class="header">15</th>
        <th class="header">Bull</th>
        <th class="header" id="score">Score</th>
        <th class="blank"></th>
        </tr>`
        table.innerHTML = header;
        for (const element of document.getElementsByClassName("header")) {
            element.style.minWidth = '3rem';
        }
        document.getElementById("setTypeHeader").style.minWidth = "15rem"

        for (const player of this.players) {
            player.sectors = {"20":0, "19":0, "18":0, "17":0, "16":0, "15":0, "bull":0}
            table.innerHTML += this.#playerTemplate(player)
        }
        document.querySelector(".player").getElementsByTagName("td")[0].innerHTML += `<div class="current"><svg width="100%" height="100%" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="#000" d="M134.745 22.098c-4.538-.146-9.08 1.43-14.893 7.243-5.586 5.586-11.841 21.725-15.248 35.992-.234.979-.444 1.907-.654 2.836l114.254 105.338c-7.18-28.538-17.555-59.985-29.848-86.75-11.673-25.418-25.249-46.657-37.514-57.024-6.132-5.183-11.56-7.488-16.097-7.635zM92.528 82.122L82.124 92.526 243.58 267.651l24.072-24.072L92.528 82.122zm-24.357 21.826c-.929.21-1.857.42-2.836.654-14.267 3.407-30.406 9.662-35.993 15.248-5.813 5.813-7.39 10.355-7.244 14.893.147 4.538 2.452 9.965 7.635 16.098 10.367 12.265 31.608 25.842 57.025 37.515 26.766 12.293 58.211 22.669 86.749 29.848L68.17 103.948zM280.899 255.79l-25.107 25.107 73.265 79.469 31.31-31.31L280.9 255.79zm92.715 85.476l-32.346 32.344 2.07 2.246c.061.058 4.419 4.224 10.585 6.28 6.208 2.069 12.71 2.88 21.902-6.313 9.192-9.192 8.38-15.694 6.31-21.902-2.057-6.174-6.235-10.54-6.283-10.59l-2.238-2.065zm20.172 41.059a46.23 46.23 0 0 1-5.233 6.226 46.241 46.241 0 0 1-6.226 5.235L489.91 489.91l-96.125-107.586z"/></svg></div>`;
        refreshAvg();

    }

    #playerTemplate(player){
        return (`<tr class="player" id=${player.name.replace(" ", "_")}>
        <td></td>
        <td class="name ${player.name}"><h2>${player.name}</h2></td>
        <td class="cell" ><p id="20" class="20_${player.name.replace(" ", "_")}">${player.sectors["20"]}</p></td>
        <td class="cell" ><p id="19" class="19_${player.name.replace(" ", "_")}">${player.sectors["19"]}</p></td>
        <td class="cell" ><p id="18" class="18_${player.name.replace(" ", "_")}">${player.sectors["18"]}</p></td>
        <td class="cell" ><p id="17" class="17_${player.name.replace(" ", "_")}">${player.sectors["17"]}</p></td>
        <td class="cell" ><p id="16" class="16_${player.name.replace(" ", "_")}">${player.sectors["16"]}</p></td>
        <td class="cell" ><p id="15" class="15_${player.name.replace(" ", "_")}">${player.sectors["15"]}</p></td>
        <td class="cell" ><p id="bull" class="bull_${player.name.replace(" ", "_")}">${player.sectors['bull']}</p></td>
        <td class="extra cell"><h3 id="extra${player.name.replace(" ", "_")}">${player.score}</h3></td>
        </tr>`)
    }

    static dart(player, v){
        if(v.split(" ")[0] == "bull"){
            var [type, value] = v.split(" ").reverse();
        }else{
            var [type, value] = v.split(" ");
        }
        let addValue = 0;

        if (!player.sectors.hasOwnProperty(value)) {
            player.round.push(v)
            if (player.round.length == 3) {
                nextPlayer();
                player.round = [];
            }
            return;
        }

        switch (type) {
            case "outer":
                addValue = 1;
                break;
            case "inner":
                addValue = 2;
                break;
            case "t":
                addValue = 3;
                break;
            case "d":
                addValue = 2;
                break;
                
            default:
                addValue = 1;
                break;
        }
        
        let point = value == "bull" ? 25 : value;

        if (player.sectors[String(value)] < 3 && player.sectors[String(value)] + addValue >= 3) {
            player.score += (player.sectors[String(value)]+addValue - 3) * Number(point);
            gameLogic.allClaimedSectors[String(value)].push(player.name)
        }
        
        if (player.sectors[String(value)] >= 3 && gameLogic.canAwardPoint(player.name, String(value))) {
            player.score += addValue * Number(point)
           if (!gameLogic.allClaimedSectors[value].includes(player.name)) {
             gameLogic.allClaimedSectors[String(value)].push(player.name)
           }
    
        }
        player.sectors[String(value)] += addValue;
        player.round.push(v);
        if (player.round.length == 3) {
            nextPlayer();
            player.throws.push(player.round);
            player.round = [];
        }
        if (player.isWinning()) {
            winGame(player);
            return;
        }
        gameLogic.refresh();
        
    }
    
    refresh(){
        const table = document.querySelector(".playersTable");
        for (const player of this.players) {
            const playerRow = table.querySelector(`#${player.name.replace(" ", "_")}`)
            for (const sector in player.sectors) {
                const cell = playerRow.querySelector(`#${CSS.escape(sector)}`);
                if (!cell) {
                    return;
                }
                cell.innerHTML = Math.min(3, player.sectors[sector]);
                cell.parentElement.style.backgroundColor = player.sectors[sector] >= 3 ? "red" : player.sectors[sector] == 2 ? "orange" : "greenyellow"
            }
            console.log(player.score);
            playerRow.querySelector(`#extra${player.name}`).innerHTML = player.score;
            
        }
        refreshAvg();
    }

    undo(player){
        const pop = player.round.pop().split(" ");
        const value = pop[1];
        switch (pop[0]) {
            case "t":
                player.sectors[String(value)]-= 3;
                break;
            case "d":
                player.sectors[String(value)]-= 2;
                break;
                
            default:
                player.sectors[String(value)]-= 1;
                break;
        }
        if (player.sectors[String(value)] < 3) {
            if (this.allClaimedSectors[value].includes(player.name)) {
                const popped =this.allClaimedSectors[value].splice(this.allClaimedSectors[value].indexOf(player.name), 1);
                console.log(popped)
            }
        }
        refreshRoundPoints(player);
        gameLogic.refresh();
    }

    canAwardPoint(player, sector){
        if (this.allClaimedSectors[sector].length == 0) { //senki se dobta meg
            return true
        }else{ //valaki megdobta
            if (this.allClaimedSectors[sector].length == 1 && this.allClaimedSectors[sector].includes(player)) { // csak mi dobtuk meg
                return true
            }else{
                return false
            }
        }
    }

    

}