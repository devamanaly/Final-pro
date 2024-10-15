document.addEventListener('DOMContentLoaded', async () => {
    const contractAddress = '0xAd86632c0B918d983eb2515c9B67dF27cB7919b3';
    const contractABI = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "depositor",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "bytes32",
                    "name": "commitment",
                    "type": "bytes32"
                }
            ],
            "name": "DepositMade",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "mixCount",
                    "type": "uint256"
                }
            ],
            "name": "MixExecuted",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "WithdrawalMade",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "THRESHOLD",
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
                    "internalType": "bytes32",
                    "name": "image",
                    "type": "bytes32"
                }
            ],
            "name": "deposit",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "name": "deposits",
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
            "name": "getBalance",
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
            "name": "getWaitingUsers",
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
            "name": "nonce",
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
                    "internalType": "bytes32",
                    "name": "preimage",
                    "type": "bytes32"
                },
                {
                    "internalType": "address payable",
                    "name": "recipient",
                    "type": "address"
                }
            ],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]; // Your contract's ABI

    let accounts;
    let mixerContract;

    function getBlockie(address) {
        if (blockies) {
            return blockies.create({ seed: address, size: 8, scale: 16 }).toDataURL();
        } else {
            throw new Error('Blockies is not defined.');
        }
    }

    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            accounts = await web3.eth.getAccounts();
            mixerContract = new web3.eth.Contract(contractABI, contractAddress);
            const totalUsers = await mixerContract.methods.getWaitingUsers().call();
            const balance = await mixerContract.methods.getBalance().call();


            document.getElementById('registeredUsers').innerText = `Registered Users: ${totalUsers} \n ${10 - totalUsers} more users needed to start mixer.`;
            document.getElementById('contractBalance').innerText = `Contract Balance: ${parseFloat(balance).toFixed(4)} wei`;
            updateUI();
        } catch (error) {
            console.error('User denied account access...', error);
        }
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    document.getElementById('connectButton').addEventListener('click', async () => {
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            accounts = await web3.eth.getAccounts();
            updateUI();
        } catch (error) {
            console.error('User denied account access...', error);
        }
    });

    document.getElementById('depositForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const depositValue = document.getElementById('depositValue').value;
        const depositSecret = document.getElementById('depositSecret').value;
        const depositHash = web3.utils.sha3(depositSecret);

        try {
            await mixerContract.methods.deposit(depositHash)
                .send({ from: accounts[0], value: web3.utils.toWei(depositValue, 'ether') });
                const totalUsers = await mixerContract.methods.getWaitingUsers().call();
                const balance = await mixerContract.methods.getBalance().call();
    
    
                document.getElementById('registeredUsers').innerText = `Registered Users: ${totalUsers} \n ${10 - totalUsers} more users needed to start mixer.`;
                document.getElementById('contractBalance').innerText = `Contract Balance: ${parseFloat(balance).toFixed(4)} ETH`;
            alert('Deposit was successful!');
        } catch (error) {
            console.error('Error during deposit:', error);
            alert('Deposit failed!');
        }
    });

    document.getElementById('withdrawForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const withdrawSecret = document.getElementById('withdrawSecret').value;
        const withdrawHash = web3.utils.sha3(withdrawSecret);

        try {
            await mixerContract.methods.withdraw(withdrawHash, accounts[0])
                .send({ from: accounts[0] });
            console.log(accounts);
            alert('Withdrawal was successful!');
        } catch (error) {
            console.error('Error during withdrawal:', error);
            alert('withdrawal failed!');
        }
    });

      // Function to update the UI with connected wallet details
    // Function to update the UI with connected wallet details
    function updateUI() {
        if (accounts && accounts.length > 0) {
            // Remove the connect button and show the forms
            document.getElementById('connectButton').style.display = 'none';
            document.getElementById('walletInfo').classList.remove('hidden');
            document.getElementById('depositForm').style.display = 'block';
            document.getElementById('withdrawForm').style.display = 'block';

            // Display connected wallet address
            const walletAddressElement = document.getElementById('walletAddress');
            const account = accounts[0];
            walletAddressElement.innerText = `Wallet Address: ${account}`;

            // Display wallet balance
            updateBalance(account);

            // Generate and display wallet blockie image
            const blockieImage = getBlockie(account);
            document.getElementById('walletBlockie').style.backgroundImage = `url(${blockieImage})`;
        }
    }

    // Function to fetch and update the wallet's balance
    async function updateBalance(account) {
        const balance = await web3.eth.getBalance(account);
        const ethBalance = web3.utils.fromWei(balance, 'ether');
        document.getElementById('walletBalance').innerText = `Wallet Balance: ${parseFloat(ethBalance).toFixed(4)} ETH`;
    }

    // Function to generate a blockie image URL
    function getBlockie(address) {
        return blockies.create({ seed: address, size: 8, scale: 16 }).toDataURL();
    }
});