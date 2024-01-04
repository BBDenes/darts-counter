class Player{
    constructor(name, gameType){
        this.name = name;
        this.gameType = gameType;
        this.sets = this.gameType=="cricket" ? null : 0;
        this.legs = this.gameType=="cricket" ? null : 0;
        this.score = this.gameType == "cricket"? 0 : Number(this.gameType);
        this.round = [];
        this.sectors = this.gameType == "cricket"? {} : null;
        this.throwNumber = 0;
        this.throws = [];
        this.checkout = [];
    }

    dart(v){
        if (this.gameType == "cricket") {
            Cricket.dart(this, v);
            return;
        }
        this.round.push(v);

        if (this.score - this.#eval() < 171 || this.score <171) {
            this.getCheckout(this.score - this.#eval());
        }

        if (this.#eval() > this.score || this.#eval()+1 == this.score) { //bust
            this.throws.push(toNum(this.round));
            this.round = [];
            nextPlayer();
            return;
        }

        if(this.#eval() == this.score ){ //pontosan annyi
            if (this.round[this.round.length-1][0] == "d" || (this.round[this.round.length-1].split(" ")[0] == "bull" && this.round[this.round.length-1].split(" ")[1] == "inner")) { //megdobta
                winLeg(this);
                nextPlayer()
                this.throws.push(toNum(this.round));
                this.round = [];
                return;
            }else{
                nextPlayer();
                this.throws.push(toNum(this.round));
                this.round = [];
                return
            }
        }
        if (this.round.length == 3) { // megdobta a 3 nyilat
            this.score -= this.#eval();
            nextPlayer();
            this.throws.push(toNum(this.round));
            this.round = [];
            return
        }
    }

    resetScore(){
        // this.score = this.gameType == "cricket"? null : Number(this.gameType);
        this.score = Number(this.gameType);
    }
    resetLegs(){
        this.legs = 0
    }

    #eval(){
        let sum = 0;
        for (let i = 0; i < this.round.length; i++) {
            const point = this.round[i].split(" ");
            switch (point[0]) {
                case "miss":
                    sum += 0;
                break;
                case "bull":
                    sum += point[1] == "inner" ? 50:25
                break;
                case "t":
                    sum += Number(point[1]) *3;
                break;
                case "d":
                    sum += Number(point[1]) *2;   
                break
                default:
                    sum+= Number(point[1]);
                break;
            }
            
        }
        return sum;
    }

    getCheckout(score){
        let ind = currentPlayerIndex;
        if (score < 171) {
            let len = 0;
            let string = "";
            if (checkout.hasOwnProperty(String(score))) {
                string =  checkout[String(score)].join(" ");
            }
            this.checkout = string;
            refreshCheckout();
        }else{
            return
        }
    }

    isWinning(){
        let count = 0;
        for (const score in this.sectors) {
            if (this.sectors[score] >= 3) {
                count ++;
            }
        }
        if (count == 7) {
            return true;
        } else {
            return false;
        }
    }

    avg1(){
        let avg = 0;
        let copy = this.throws.flat();
        let sum = 0;
        copy.forEach( num => {
            sum += num;
        })
        if (isNaN(Math.floor((sum/copy.length) *100)/100)) {
            return "-"
        }else{
            return Math.floor((sum/copy.length) *100)/100;
        }
    }
    
    avg3(){
        if (isNaN(this.avg1()*3)) {
            return "-"
        }else{
            return this.avg1()*3
        }

    }

    avgTemplate(){
        return(`
        <tr class="${this.name}">
        <th class="name">${this.name}</th>
        <th class="1dartAvg">${this.avg1()}</th>
        <th class = "3dartAvg">${this.avg3()}</th>
        </tr>`)
    }

    //todo: 
    /* 
        Lehessen állítani ki kezdjen
        Körök végén nem váltja át a kezdő játékost
        Számok "miss"-t adjanak
        Egyesével vonja le az egyes dobások értékét
        kb.9 nyíl után nem vált játékost = 
        cricket max. 20 kör
        cricket reset
        név nélküli ember

        (A táblának lehet olyan kéne keresni ahol kicsit vastagabb a tripla és dupla szektor)
        (nagyobb eredményjelző)
          
    */

}
