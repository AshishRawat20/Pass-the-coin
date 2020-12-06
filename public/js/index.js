var coins = [
    [],
    [],
    [],
    []
]

var comp = [0,0];
var p = [0,0];
var coins_count = [];
var compMove = false;
var button = document.getElementsByTagName("button")[0];
var boxes = [[],[],[],[]];
var prev_l = -1;
var prev_b = -1;
var k = 0;
var comp_from = document.getElementById("computer_from");
var comp_to = document.getElementById("computer_to");
var play_from = document.getElementById("player_from");
var play_to = document.getElementById("player_to");
var win = document.getElementById("win");

for(let lev=0; lev<4; lev++) {
    for(let no=0; no<=lev; no++) {
        boxes[lev][no] = document.getElementById(String(lev) + String(no));
    }
}

const update_html = () => {
    for(let i=0;i<coins.length;i++){
        for(let j = 0; j<coins[i].length; j++) {
            boxes[i][j].innerHTML = coins[i][j];
        }
    }
}

const gameStart = () =>{
    win.style.display = "none";
    prev_b = -1;
    prev_l = -1;
    let sum = 0;
    comp_from.innerHTML = "-";
    comp_to.innerHTML = "-";
    play_from.innerHTML = "-";
    play_to.innerHTML = "-";
    for(let i=0;i<4;i++){
        for(let j=0;j<=i;j++){
            let rand = Math.floor(Math.random()*2) + 1;
            sum += rand;
            coins[i][j] = rand;
        }
        coins_count[i] = sum;
        sum = 0;
    }
    for(let i=0;i<4;i++){
        if(coins_count[i]%2 !== 0){
            k ^= i;
        }
    }
    console.log(k);
    if(k !== 0){
        coins[k][0] += 1;
        coins_count[k] += 1;
        k = 0;
    }
    update_html();
    console.log(coins)
}

const move_coin = async (x, y) => {
    console.log(x, y)
    for(let i=0; i<=x; i++) {
        if(coins[x][i] > 0) {

            coins[x][i]--;
            coins[y][0]++;

            coins_count[x]--;
            coins_count[y]++;

            boxes[x][i].classList.toggle("selected");

            await sleep(500);

            boxes[y][0].classList.toggle("selected");


            comp_from.innerHTML = String(x) + "." + String(i);
            comp_to.innerHTML = String(y) + ".0";

            await sleep(1000);

            prev_l = -1;
            prev_b = -1;

            update_html();

            console.log(coins_count);
            
            if(coins_count[1] + coins_count[2] + coins_count[3] === 0) {
                console.log("Computer Wins")
                win.style.display = "block";
            }

            boxes[x][i].classList.toggle("selected");
            boxes[y][0].classList.toggle("selected");

            compMove = false;
                        
            break;
        }
    }
}

const sleep = (time) => new Promise((resolve,reject) => setTimeout(resolve,time));

const computer_move = () => {
    console.log("computer")
    compMove = true;
    if(coins_count[k] > 0) move_coin(k, 0);
    else {
        if(k == 1) move_coin(3, 2);
        else if(k == 2) move_coin(3, 1);
        else move_coin(2, 1);
    }
    
    k = 0;
}

for(let lev=0; lev<4; lev++) {
    for(let no=0; no<=lev; no++) {
        let box = boxes[lev][no];
        box.addEventListener("mouseenter",() =>{
            if(!compMove){
                if((prev_l < 0 && coins[lev][no] > 0 && lev > 0) || prev_l > lev) {
                    box.style.border = "5px solid  rgb(29, 49, 49)";
                }    
            }
        })
        box.addEventListener("mouseleave",() =>{
            box.style.border = "5px solid black";
        })
        box.addEventListener("click",async () =>{
            if(!compMove){
                if(prev_l < 0) {
                    // First click
                    if(lev > 0 && coins[lev][no] > 0) {
                        // Make lev and no selected
                        box.classList.toggle("selected");
                        prev_l = lev;
                        prev_b = no;
                    }
                }
                else {
                    // second click
                    if(lev < prev_l) {
                        // Make prev_l and prev_b unselected
    
                        box.classList.toggle("selected");
                        coins[prev_l][prev_b]--;
                        coins[lev][no]++;
        
                        coins_count[prev_l]--;
                        coins_count[lev]++;
        
                        k ^= lev;
                        k ^= prev_l;
    
                        play_from.innerHTML = String(prev_l) + "." + String(prev_b);
                        play_to.innerHTML = String(lev) + "." + String(no);
        
                        await sleep(500);
                        
                        box.classList.toggle("selected");
    
                        boxes[prev_l][prev_b].classList.toggle("selected");
                        
                        update_html();
                        computer_move();
                    }
                }    
            }
        })
    }
}

button.addEventListener("click",() =>{
    gameStart();
})

gameStart();