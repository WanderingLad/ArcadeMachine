const gameAddress = '0x2101f60e3AC140F8A77E3e17C0CB053a65317d11';

const gameABI = [
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

const game = new web3.eth.Contract(gameABI, gameAddress);

var spaceLeaderboard = new Map()
spaceLeaderboard.set('Filler', 0);

var pacmanLeaderboard = new Map()
pacmanLeaderboard.set('Filler', 0);

var snakeLeaderboard = new Map()
snakeLeaderboard.set('Filler', 0);

async function startSpace(x) {
    if (x == '') {
        alert("Please enter a player number");
        return;
    }
    try {
        const accoounts = await web3.eth.getAccounts();
        await game.methods.startGame(0).send({ from: accoounts[x], value: web3.utils.toWei(1, 'ether') });
        localStorage.setItem('player', x);
        window.location = 'space/space.html';
    } catch (error) {
        alert("Error in starting game, make sure you have the required ETH");
        console.log(error);
    }
}

async function startPacman(x) {
    if (x == '') {
        alert("Please enter a player number");
        return;
    }
    try {
        const accoounts = await web3.eth.getAccounts();
        await game.methods.startGame(1).send({ from: accoounts[x], value: web3.utils.toWei(1, 'ether') });
        localStorage.setItem('player', x);
        window.location = 'pacman/pacman.html';
    } catch (error) {
        alert("Error in starting game, make sure you have the required ETH");
        console.log(error);
    }
}

async function startSnake(x) {
    if (x == '') {
        alert("Please enter a player number");
        return;
    }
    try {
        const accoounts = await web3.eth.getAccounts();
        await game.methods.startGame(2).send({ from: accoounts[x], value: web3.utils.toWei(1, 'ether') });
        localStorage.setItem('player', x);
        window.location = 'snake/snake.html';
    } catch (error) {
        alert("Error in starting game, make sure you have the required ETH");
        console.log(error);
    }
}
async function leaderBoard(x) {
    if (x == 'Space') {
        document.getElementById("space-list-tab").classList.toggle("d-none");
        document.getElementById("spaceLeaderboard").classList.toggle("d-none");
        document.getElementById("spaceLeaderboardList").innerHTML = '';

        const accoounts = await web3.eth.getAccounts();

        for (const account of accoounts) {
            var y = await game.methods.spaceHighscores(account).call();
            if (Number(y) > 0) {
                spaceLeaderboard.set(account, Number(y));
            }
        }

        spaceLeaderboard = new Map([...spaceLeaderboard.entries()].sort((a, b) => b[1] - a[1]));

        if (spaceLeaderboard.size > 10) {
            spaceLeaderboard.delete(Array.from(spaceLeaderboard.keys()).pop());
        }

        spaceLeaderboard.forEach((x, y) => {
            var entry = document.createElement("li");
            var text = document.createElement("h5");
            entry.appendChild(text);
            text.textContent = y + ": " + x;
            document.getElementById("spaceLeaderboardList").appendChild(entry);
        });

    } else if (x == "Pacman") {
        document.getElementById("pacman-list-tab").classList.toggle("d-none");
        document.getElementById("pacmanLeaderboard").classList.toggle("d-none");
        document.getElementById("pacmanLeaderboardList").innerHTML = '';

        const accoounts = await web3.eth.getAccounts();

        for (const account of accoounts) {
            var y = await game.methods.pacmanHighscores(account).call();
            if (Number(y) > 0) {
                pacmanLeaderboard.set(account, Number(y));
            }
        }

        pacmanLeaderboard = new Map([...pacmanLeaderboard.entries()].sort((a, b) => b[1] - a[1]));

        if (pacmanLeaderboard.size > 10) {
            pacmanLeaderboard.delete(Array.from(pacmanLeaderboard.keys()).pop());
        }

        pacmanLeaderboard.forEach((x, y) => {
            var entry = document.createElement("li");
            var text = document.createElement("h5");
            entry.appendChild(text);
            text.textContent = y + ": " + x;
            document.getElementById("pacmanLeaderboardList").appendChild(entry);
        });

    } else if (x == "Snake") {
        document.getElementById("snake-list-tab").classList.toggle("d-none");
        document.getElementById("snakeLeaderboard").classList.toggle("d-none");
        document.getElementById("snakeLeaderboardList").innerHTML = '';

        const accoounts = await web3.eth.getAccounts();

        for (const account of accoounts) {
            var y = await game.methods.snakeHighscores(account).call();
            if (Number(y) > 0) {
                snakeLeaderboard.set(account, Number(y));
            }
        }

        snakeLeaderboard = new Map([...snakeLeaderboard.entries()].sort((a, b) => b[1] - a[1]));

        if (snakeLeaderboard.size > 10) {
            snakeLeaderboard.delete(Array.from(snakeLeaderboard.keys()).pop());
        }

        snakeLeaderboard.forEach((x, y) => {
            var entry = document.createElement("li");
            var text = document.createElement("h5");
            entry.appendChild(text);
            text.textContent = y + ": " + x;
            document.getElementById("snakeLeaderboardList").appendChild(entry);
        });

    }
}

function back(x) {
    if (x == "Space") {
        document.getElementById("space-list-tab").classList.toggle("d-none");
        document.getElementById("spaceLeaderboard").classList.toggle("d-none");
    } else if (x == "Pacman") {
        document.getElementById("pacman-list-tab").classList.toggle("d-none");
        document.getElementById("pacmanLeaderboard").classList.toggle("d-none");
    } else if (x == "Snake") {
        document.getElementById("snake-list-tab").classList.toggle("d-none");
        document.getElementById("snakeLeaderboard").classList.toggle("d-none");
    }
}