// Initialize Web3
if (window.ethereum) {
    var web3 = new Web3(window.ethereum);
    window.ethereum.enable().catch(console.error);
} else {
    alert("Please install MetaMask!");
}

const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138"; // Replace with your deployed contract address
const contractABI = [[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "artist",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "uri",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ArtCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "ArtTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "artworkApprovals",
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
		"name": "artworks",
		"outputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "artist",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "uri",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "artist",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "uri",
				"type": "string"
			}
		],
		"name": "createArt",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getArt",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "artist",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "uri",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					}
				],
				"internalType": "struct DigitalArtNFT.Art",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "getArtByOwner",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
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
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "ownerArtworks",
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
		"name": "totalArtworks",
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
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferArt",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
];

const contract = new web3.eth.Contract(contractABI, contractAddress);
let currentAccount = null;

// Get current account address
const getCurrentAccount = async () => {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
        currentAccount = accounts[0];
        console.log(`Connected to: ${currentAccount}`);
    } else {
        alert("Please connect to MetaMask.");
    }
};

// Handle creating new art
document.getElementById("createArtBtn").addEventListener("click", async () => {
    const title = document.getElementById("artTitle").value;
    const artist = document.getElementById("artArtist").value;
    const uri = document.getElementById("artURI").value;

    if (title && artist && uri) {
        await getCurrentAccount();
        try {
            await contract.methods.createArt(title, artist, uri).send({ from: currentAccount });
            alert("Art created successfully!");
        } catch (err) {
            console.error("Error creating art:", err);
        }
    } else {
        alert("Please fill out all fields.");
    }
});

// Handle viewing art details
document.getElementById("getArtBtn").addEventListener("click", async () => {
    const tokenId = document.getElementById("tokenId").value;

    if (tokenId) {
        try {
            const art = await contract.methods.getArt(tokenId).call();
            document.getElementById("artTitleDetail").textContent = `Title: ${art.title}`;
            document.getElementById("artArtistDetail").textContent = `Artist: ${art.artist}`;
            document.getElementById("artImage").src = art.uri;
        } catch (err) {
            console.error("Error fetching art:", err);
        }
    } else {
        alert("Please enter a token ID.");
    }
});

// Handle transferring art
document.getElementById("transferArtBtn").addEventListener("click", async () => {
    const tokenId = document.getElementById("transferTokenId").value;
    const toAddress = document.getElementById("transferToAddress").value;

    if (tokenId && toAddress) {
        await getCurrentAccount();
        try {
            await contract.methods.transferArt(toAddress, tokenId).send({ from: currentAccount });
            alert("Art transferred successfully!");
        } catch (err) {
            console.error("Error transferring art:", err);
        }
    } else {
        alert("Please fill out all fields.");
    }
});
