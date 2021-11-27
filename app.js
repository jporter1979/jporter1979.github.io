const enableButton = document.getElementById('enable-button');
const ethAmountButton = document.getElementById('eth-amount-button');
const startLotteryButton = document.getElementById('start-lottery-button');
const poolBalance = document.getElementById('pool');
const lotteryState = document.getElementById('state');
const lotteryWinner = document.getElementById('winner');
const lotteryAddress = '0xeD951573076D0848A3Ff41Bc4d9760A49AF1Fdb2';
const lotteryABI = [
	{
		"inputs": [],
		"name": "enter",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_random",
				"type": "address"
			}
		],
		"name": "initialize",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"name": "performUpkeep",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "randomness",
				"type": "uint256"
			}
		],
		"name": "pickWinner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_duration",
				"type": "uint256"
			}
		],
		"name": "startNewLottery",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stopLottery",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"name": "checkUpkeep",
		"outputs": [
			{
				"internalType": "bool",
				"name": "upkeepNeeded",
				"type": "bool"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "duration",
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
		"inputs": [],
		"name": "getPlayers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPool",
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
		"inputs": [],
		"name": "getWinner",
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
		"inputs": [],
		"name": "lastTimeStamp",
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
		"inputs": [],
		"name": "lottery_state",
		"outputs": [
			{
				"internalType": "enum Lottery.LOTTERY_STATE",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "players",
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
		"inputs": [],
		"name": "random",
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
		"inputs": [],
		"name": "timeExpired",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "winner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

window.addEventListener('load', async (event) => {
    var web3 = new Web3();
    const balance = await readLotteryPoolBalance();
    ethBalance = web3.utils.fromWei(balance, 'ether');
    poolBalance.innerHTML = ethBalance;
    const state = await readLotteryState();
    if(state == 0){
        lotteryState.innerHTML = 'Lottery Open';
    }
    else if(state == 1){
        lotteryState.innerHTML = 'Lottery Closed';
    }
    else{
        lotteryState.innerHTML = 'Lottery Drawing';
    }
    const winner = await getLotteryWinner();
    if(winner != '0x0000000000000000000000000000000000000000'){
        lotteryWinner.innerHTML = "The winner is " + winner.substring(0,5) + "..." + winner.substring(38,42);
    }
  })

enableButton.onclick = async () => {
    if(typeof window.ethereum !== 'undefined'){
        await ethereum.request({ method: 'eth_requestAccounts' });
    }
    else{
        alert("Metamask is not available...Please install it to continue");
    }
}

ethAmountButton.onclick = async () => {
    const inputValue = document.getElementById('eth-amount').value;
    var web3 = new Web3();
    web3.setProvider(window.ethereum);
    var accounts = await web3.eth.getAccounts();
    const weiBalance = await web3.eth.getBalance(accounts[0]);
    const ethBalance = web3.utils.fromWei(weiBalance, 'ether');
    const state = await readLotteryState();
    if(state == 1){
        alert("The lottery is closed you cannot enter!");
    }
    else if(state == 2){
        alert("The lottery is drawing you cannot enter!");
    }
    else{
        if(inputValue <= ethBalance){
            const lottery = new web3.eth.Contract(lotteryABI, lotteryAddress);
            lottery.setProvider(window.ethereum);
            const weiValue = web3.utils.toWei(inputValue, 'ether');
            await lottery.methods.enter().send({from: accounts[0], value: weiValue});
        }
        else{
            alert("Your wallet balance (" + ethBalance + " ETH) is too low!");
        }  
    }
    
}

startLotteryButton.onclick = async () =>{
	var web3 = new Web3();
    web3.setProvider(window.ethereum);
    var accounts = await web3.eth.getAccounts();
	var owner = await getOwner();
	if(owner != accounts[0]){
		alert("You are not authorized to start a new lottery!");
	}
	else{
		const state = await readLotteryState();
		if(state == 0){
			alert("The lottery is already started!")
		}
		else if(state == 2){
			alert("The lottery is currently drawing, you cannot start a new lottery!")
		}
		else{
			var web3 = new Web3();
    		web3.setProvider(window.ethereum);
			const lottery = new web3.eth.Contract(lotteryABI, lotteryAddress);
            lottery.setProvider(window.ethereum);
			const duration = document.getElementById('start-lottery').value;
			await lottery.methods.startNewLottery(duration).send({from: accounts[0]});
		}
	}
}

async function readLotteryPoolBalance(){
    var web3 = new Web3();
    web3.setProvider(window.ethereum);
    const lottery = new web3.eth.Contract(lotteryABI, lotteryAddress);
    lottery.setProvider(window.ethereum);
    var balance = await lottery.methods.getPool().call();
    return balance;
}

async function readLotteryState(){
    var web3 = new Web3();
    web3.setProvider(window.ethereum);
    const lottery = new web3.eth.Contract(lotteryABI, lotteryAddress);
    lottery.setProvider(window.ethereum);
    var state = await lottery.methods.lottery_state().call();
    return state;
}

async function getLotteryWinner(){
    var web3 = new Web3();
    web3.setProvider(window.ethereum);
    const lottery = new web3.eth.Contract(lotteryABI, lotteryAddress);
    lottery.setProvider(window.ethereum);
    var winner = await lottery.methods.winner().call();
    return winner;
}

async function getOwner(){
	var web3 = new Web3();
    web3.setProvider(window.ethereum);
	const lottery = new web3.eth.Contract(lotteryABI, lotteryAddress);
	lottery.setProvider(window.ethereum);
	var owner = await lottery.methods.owner().call();
	return owner;
}