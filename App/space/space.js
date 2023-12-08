const gameAddress = '0x2101f60e3AC140F8A77E3e17C0CB053a65317d11';

var gameABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "score",
                "type": "uint256"
            }
        ],
        "name": "endedGame",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "game",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "score",
                "type": "uint256"
            }
        ],
        "name": "endGame",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "paid",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "game",
                "type": "uint256"
            }
        ],
        "name": "startedGame",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "game",
                "type": "uint256"
            }
        ],
        "name": "startGame",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getOwner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "pacmanHighscores",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "snakeHighscores",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "spaceHighscores",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const web3 = new Web3('http://localhost:7545');

web3.eth.handleRevert = true;

const game = new web3.eth.Contract(gameABI, gameAddress);

var myGamePiece;
var myObstacles = [];
var myScore;
var pause = false;
var hit = false;
var player = localStorage.getItem('player');

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 900;
        this.canvas.height = 600;
        this.canvas.classList.add("mt-3");
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.frameNo = 0;
        if (this.interval > 0) {
            return;
        } else {
            this.interval = setInterval(updateGameArea, 15);
        }
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function () {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitTop();
        this.hitBottom();
    }
    this.hitTop = function () {
        if (this.y < 0) {
            this.y = 0;
            this.gravitySpeed = 0;
        }
    }
    this.hitBottom = function () {
        var rockbottom = myGameArea.canvas.height - this.height;

        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

async function updateGameArea() {
    if (!pause) {
        var x, gap, minGap, maxGap;
        for (i = 0; i < myObstacles.length; i += 1) {
            if (myGamePiece.crashWith(myObstacles[i])) {
                await pieceHit();
                return;
            }
        }
        myGameArea.clear();
        myGameArea.frameNo += 1;
        if (myGameArea.frameNo == 1 || everyinterval(21)) {
            x = myGameArea.canvas.width;
            minGap = -25;
            maxGap = myGameArea.canvas.height;
            gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
            myObstacles.push(new component(50, 50, "gray", x, gap));
        }
        for (i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].x += -1;
            myObstacles[i].update();
        }
        myScore.text = "SCORE: " + myGameArea.frameNo;
        myScore.update();
        myGamePiece.newPos();
        myGamePiece.update();
    }
    else {
        return;
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}

async function pieceHit() {
    if (!hit) {
        hit = true;
        clearInterval(myGameArea.canvas.interval);
        $("#staticBackdrop").modal("show");
        pause = true;
        score = myScore.text.split(" ").pop();
        try {
            await addToLeaderboard();
        } catch (error) {
            console.error(error);
        }
    } else {
        return;
    }

}

async function startGame() {
    pause = false;
    hit = false;
    myGamePiece = new component(30, 30, "red", 10, 120);
    myGamePiece.gravity = 0.07;
    myScore = new component("30px", "Consolas", "white", 350, 40, "text");
    myGameArea.start();
}

async function endGame() {
    document.body.removeChild(document.querySelector("canvas"));
    myObstacles = []
    window.location = '../index.html'
}

async function addToLeaderboard() {
    const accoounts = await web3.eth.getAccounts();
    try {
        await game.methods.endGame(Number(0), Number(score)).send({ from: accoounts[player] });
    } catch (error) {
        alert("Error adding to leaderboard");
        console.error(error);
    }
    return;
}

async function resetGame() {
    try {
        await smartResetGame();
        document.body.removeChild(document.querySelector("canvas"));
        myObstacles = [];
        $("#staticBackdrop").modal("hide");
        pause = false;
        hit = false;
        myGamePiece = new component(30, 30, "red", 10, 120);
        myGamePiece.gravity = 0.07;
        myScore = new component("30px", "Consolas", "white", 350, 40, "text");
        myGameArea.start();
    } catch (error) {
        alert("Error in resetting game, make sure you 1 ETH");
        document.body.removeChild(document.querySelector("canvas"));
        myObstacles = [];
        $("#staticBackdrop").modal("hide");
    }
}

async function smartResetGame() {
    const accoounts = await web3.eth.getAccounts();
    await game.methods.startGame(0).send({ from: accoounts[player], value: web3.utils.toWei(1, 'ether') });
    return;
}

function setPlayer(x) {
    player = x;
    console.log(player);
}

document.addEventListener('keydown', function (event) {
    if (event.key == "ArrowUp") {
        accelerate(-0.1);
    }
    else if (event.key == "ArrowDown") {
        accelerate(0.05);
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key == "ArrowUp") {
        accelerate(0.06);
    }
});