const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const {
  interface,
  bytecode
} = require('../compile');

// before each usecase we need to get accounts & deploy the contract

let accounts;
let lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode
    })
    .send({
      from: accounts[0],
      gas: '1000000'
    })
})


describe('Lottery', () => {
  // test the contract is deployed successfully
  it('Deploys a contract', () => {
    assert.ok(lottery.options.address);
  })

  // test if player can enter lottery
  it('one player can join lottery', async () => {
    await lottery.methods
      .enter()
      .send({
        from: accounts[1],
        value: web3.utils.toWei('0.011', 'ether')
      })

    const players = await lottery.methods.getPlayers().call();
    assert.strictEqual(1, players.length, 'More than one player are in');
    assert.strictEqual(accounts[1], players[0], 'Joined player is not the actual one');
  })

  it('two players can join lottery', async () => {
    await lottery.methods
      .enter()
      .send({
        from: accounts[1],
        value: web3.utils.toWei('0.011', 'ether')
      });

    await lottery.methods
      .enter()
      .send({
        from: accounts[2],
        value: web3.utils.toWei('0.03', 'ether')
      });

    const players = await lottery.methods.getPlayers().call();
    assert.strictEqual(2, players.length, 'Players are not equal 2');
    assert.strictEqual(accounts[1], players[0], 'First player did not joined the lottery');
    assert.strictEqual(accounts[2], players[1], 'Second player did not joined the lottery');
  })

// test failuer if amount of ether was not suffecient to enter
  it('requires a specific amount of wei to enter the lottery', async () => {
    try {
      await lottery.methods
      .enter()
      .send({
        from: accounts[1],
        value: 2
      });

      assert(false);
    } catch (error) {
      assert(error);
    }
  })

  it('allows only manager to call pickWinner func', async () => {
    try {
      await lottery.methods
      .pickWinner()
      .send({
        from: accounts[1],
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  })

  it('sends money to winner and reset players', async () => {
    await lottery.methods
      .enter()
      .send({
        from: accounts[1],
        value: web3.utils.toWei('2', 'ether')
      });

    const balanceBefore = await web3.eth.getBalance(accounts[1]);

    await lottery.methods
      .pickWinner()
      .send({
        from: accounts[0]
      });

    const balanceAfter = await web3.eth.getBalance(accounts[1]);
  
    const diff = balanceAfter - balanceBefore;
    assert(diff > web3.utils.toWei('1.8', 'ether'));

    const players = await lottery.methods.getPlayers().call();
    assert.strictEqual(0, players.length);
  })
})