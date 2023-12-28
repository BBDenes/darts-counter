class Cricket{
    constructor(players){
        this.players = players
        this.init()
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
        document.querySelector(".player").getElementsByTagName("td")[0].innerHTML += `<div class="current"></div>`;
        
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
    
    refresh(){
        const table = document.querySelector(".playersTable");
        for (const player of this.players) {
            const playerRow = table.querySelector(`#${player.name.replace(" ", "_")}`)
            for (const sector in player.sectors) {
                const cell = playerRow.querySelector(`#${CSS.escape(sector)}`);
                cell.innerHTML = Math.min(3, player.sectors[sector]);
                cell.parentElement.style.backgroundColor = player.sectors[sector] == 3 ? "red" : player.sectors[sector] == 2 ? "orange" : "greenyellow"
            }
            playerRow.querySelector(`#extra${player.name}`).innerHTML = player.score;
        }
    }

    static dart(player){
        return;
    }

    /*TODO:
         score count
         winning screen
         test
         maybe save players
    */
}