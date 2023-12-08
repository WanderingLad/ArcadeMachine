// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract Game {
    address payable owner;

    mapping(address => uint256) public spaceHighscores;
    mapping(address => uint256) public pacmanHighscores;
    mapping(address => uint256) public snakeHighscores;

    event startedGame(address player, bool paid, uint256 game);
    event endedGame(address player, uint256 score);

    constructor() {
        owner = payable(msg.sender); // 'msg.sender' is sender of current call, contract deployer for a constructor
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    function startGame(uint256 game) public payable {
        require(msg.value == 1 ether, "1ETH required");
        owner.transfer(msg.value);
        emit startedGame(msg.sender, true, game);
    }

    function endGame(uint256 game, uint256 score) public {
        if (game == 0) {
            if (score > spaceHighscores[msg.sender]) {
                spaceHighscores[msg.sender] = score;
            }
        } else if (game == 1) {
            if (score > pacmanHighscores[msg.sender]) {
                pacmanHighscores[msg.sender] = score;
            }
        } else if (game == 2) {
            if (score > snakeHighscores[msg.sender]) {
                snakeHighscores[msg.sender] = score;
            }
        }
        emit endedGame(msg.sender, score);
    }
}
