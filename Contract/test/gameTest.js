const Game = artifacts.require('../contracts/Game.sol')
const truffleAssert = require('truffle-assertions');
var web3 = require('web3');

contract('Game', function (account) {
  let game;

  beforeEach('Setup contract for each test', async function () {
    game = await Game.new();
  })

  it('Success on owner being set in constructor', async function () {
    assert.equal(await game.getOwner(), account[0]);
  })

  it('Failure to start game due to wrong amount of ETH', async function () {
    await truffleAssert.reverts(
      game.startGame(0, { from: account[1], value: web3.utils.toWei(4, 'ether') }),
      truffleAssert.ErrorType.REVERT,
      "You need to use 1 ETH"
    )
  })

  it('End game sets spaceHighscore for player', async function () {
    await game.endGame(0, 300);
    assert.equal(await game.spaceHighscores(account[0]), 300);
  })

  it('End game sets pacmanHighscore for player', async function () {
    await game.endGame(1, 500);
    assert.equal(await game.pacmanHighscores(account[0]), 500);
  })

  it('End game sets snakeHighscore for player', async function () {
    await game.endGame(2, 700);
    assert.equal(await game.snakeHighscores(account[0]), 700);
  })
})
