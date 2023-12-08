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

web3.eth.handleRevert = true;

const game = new web3.eth.Contract(gameABI, gameAddress);

var player = localStorage.getItem('player');

function init() {


	var ctx;
	var turn = [];

	var xV = [-1, 0, 1, 0];
	var yV = [0, -1, 0, 1];
	var queue = [];

	var elements = 1;
	var map = [];

	var X = 5 + (Math.random() * (90 - 10)) | 0;
	var Y = 5 + (Math.random() * (60 - 10)) | 0;

	var direction = Math.random() * 3 | 0;

	var interval = 0;

	var score = 0;
	var inc_score = 50;

	var sum = 0, easy = 0;

	var i, dir;

	var canvas = document.createElement('canvas');

	for (i = 0; i < 90; i++) {
		map[i] = [];
	}

	canvas.setAttribute('width', 90 * 10);
	canvas.setAttribute('height', 60 * 10);

	ctx = canvas.getContext('2d');

	document.body.appendChild(canvas);

	function placeFood() {

		var x, y;

		do {
			x = Math.random() * 90 | 0;
			y = Math.random() * 60 | 0;
		} while (map[x][y]);

		map[x][y] = 1;
		ctx.fillStyle = "white"
		ctx.fillRect(x * 10 + 1, y * 10 + 1, 10 - 2, 10 - 2);
	}
	placeFood();


	async function clock() {

		if (easy) {
			X = (X + 90) % 90;
			Y = (Y + 60) % 60;
		}

		--inc_score;

		if (turn.length) {
			dir = turn.pop();
			if ((dir % 2) !== (direction % 2)) {
				direction = dir;
			}
		}

		if (

			(easy || (0 <= X && 0 <= Y && X < 90 && Y < 60))


			&& 2 !== map[X][Y]) {

			if (1 === map[X][Y]) {
				score += Math.max(5, inc_score);
				inc_score = 50;
				placeFood();
				elements++;
			}

			ctx.fillStyle = "red"
			ctx.fillRect(X * 10, Y * 10, 10 - 1, 10 - 1);
			map[X][Y] = 2;
			queue.unshift([X, Y]);

			X += xV[direction];
			Y += yV[direction];

			if (elements < queue.length) {
				dir = queue.pop()

				map[dir[0]][dir[1]] = 0;
				ctx.clearRect(dir[0] * 10, dir[1] * 10, 10, 10);
			}

		} else if (!turn.length) {

			try {
				const accoounts = await web3.eth.getAccounts();

				await game.methods.endGame(Number(2), score).send({ from: accoounts[player] });
			} catch (error) {
				alert("Error adding to leaderboard");
				console.error(error);
			}

			if (confirm("You lost! Play again? Your Score is " + score)) {

				try {
					const accoounts = await web3.eth.getAccounts();

					await game.methods.startGame(2).send({ from: accoounts[player], value: web3.utils.toWei(1, 'ether') });

					ctx.clearRect(0, 0, 900, 600);

					queue = [];

					elements = 1;
					map = [];

					X = 5 + (Math.random() * (90 - 10)) | 0;
					Y = 5 + (Math.random() * (60 - 10)) | 0;

					direction = Math.random() * 3 | 0;

					score = 0;
					inc_score = 50;

					for (i = 0; i < 90; i++) {
						map[i] = [];
					}

					placeFood();
				} catch (error) {
					console.log(error);
				}

			} else {
				window.clearInterval(interval);
				window.location = "../index.html";
			}
		}

	}

	interval = window.setInterval(clock, 60);

	document.onkeydown = function (e) {

		var code = e.keyCode - 37;

		/*
		 * 0: left
		 * 1: up
		 * 2: right
		 * 3: down
		 **/
		if (0 <= code && code < 4 && code !== turn[0]) {
			turn.unshift(code);
		} else if (-5 == code) {

			if (interval) {
				window.clearInterval(interval);
				interval = null;
			} else {
				interval = window.setInterval(clock, 60);
			}

		} else {
			dir = sum + code;
			if (dir == 44 || dir == 94 || dir == 126 || dir == 171) {
				sum += code
			} else if (dir === 218) easy = 1;
		}
	}
}