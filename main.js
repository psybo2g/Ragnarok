// Global variables
let peer = null;
let connection = null;
let isHost = false;

// Screen elements
const menuScreen = document.getElementById('menu');
const hostScreen = document.getElementById('hostScreen');
const joinScreen = document.getElementById('joinScreen');
const gameScreen = document.getElementById('gameScreen');

// Button elements
const hostBtn = document.getElementById('hostBtn');
const joinBtn = document.getElementById('joinBtn');
const copyBtn = document.getElementById('copyBtn');
const connectBtn = document.getElementById('connectBtn');
const cancelHost = document.getElementById('cancelHost');
const cancelJoin = document.getElementById('cancelJoin');
const startGame = document.getElementById('startGame');

// Input/Display elements
const hostPeerIdInput = document.getElementById('hostPeerId');
const joinPeerIdInput = document.getElementById('joinPeerId');
const hostStatus = document.getElementById('hostStatus');
const joinStatus = document.getElementById('joinStatus');

// Screen navigation
function showScreen(screen) {
    [menuScreen, hostScreen, joinScreen, gameScreen].forEach(s => s.classList.add('hidden'));
    screen.classList.remove('hidden');
}

// Host game
hostBtn.addEventListener('click', () => {
    isHost = true;
    peer = new Peer();
    
    peer.on('open', (id) => {
        hostPeerIdInput.value = id;
        showScreen(hostScreen);
        console.log('Host Peer ID:', id);
    });
    
    peer.on('connection', (conn) => {
        connection = conn;
        setupConnection();
        hostStatus.textContent = 'Player connected!';
        setTimeout(() => showScreen(gameScreen), 1000);
    });
    
    peer.on('error', (err) => {
        console.error('Peer error:', err);
        hostStatus.textContent = 'Error: ' + err.type;
    });
});

// Join game
joinBtn.addEventListener('click', () => {
    isHost = false;
    showScreen(joinScreen);
});

connectBtn.addEventListener('click', () => {
    const remotePeerId = joinPeerIdInput.value.trim();
    
    if (!remotePeerId) {
        joinStatus.textContent = 'Please enter a Peer ID';
        return;
    }
    
    peer = new Peer();
    
    peer.on('open', () => {
        joinStatus.textContent = 'Connecting...';
        connection = peer.connect(remotePeerId);
        setupConnection();
    });
    
    peer.on('error', (err) => {
        console.error('Peer error:', err);
        joinStatus.textContent = 'Error: Could not connect';
    });
});

// Setup connection handlers
function setupConnection() {
    connection.on('open', () => {
        console.log('Connection established!');
        showScreen(gameScreen);
    });
    
    connection.on('data', (data) => {
        console.log('Received data:', data);
        handleReceivedData(data);
    });
    
    connection.on('close', () => {
        console.log('Connection closed');
        alert('Connection lost!');
        resetGame();
    });
    
    connection.on('error', (err) => {
        console.error('Connection error:', err);
    });
}

// Send data to the other player
function sendData(data) {
    if (connection && connection.open) {
        connection.send(data);
    }
}

// Handle received data
function handleReceivedData(data) {
    // YOU WILL HANDLE THIS IN YOUR PHASER GAME
    // Example: Update enemy position, game state, etc.
    // This is where you'll sync your game data
}

// Copy Peer ID
copyBtn.addEventListener('click', () => {
    hostPeerIdInput.select();
    document.execCommand('copy');
    copyBtn.textContent = 'Copied!';
    setTimeout(() => copyBtn.textContent = 'Copy', 2000);
});

// Cancel buttons
cancelHost.addEventListener('click', resetGame);
cancelJoin.addEventListener('click', resetGame);

// Start game button
startGame.addEventListener('click', () => {
    // INITIALIZE YOUR PHASER GAME HERE
    initGame();
});

// Reset/cleanup
function resetGame() {
    if (connection) connection.close();
    if (peer) peer.destroy();
    connection = null;
    peer = null;
    isHost = false;
    showScreen(menuScreen);
    joinPeerIdInput.value = '';
    hostPeerIdInput.value = '';
    hostStatus.textContent = 'Waiting for connection...';
    joinStatus.textContent = '';
}

// Initialize your game
function initGame() {
    console.log('Game starting...');
    // THIS IS WHERE YOU'LL CREATE YOUR PHASER GAME
    // Example:
    // const config = {
    //     type: Phaser.AUTO,
    //     parent: 'gameContainer',
    //     width: 800,
    //     height: 600,
    //     scene: YourGameScene
    // };
    // const game = new Phaser.Game(config);
}

// Export these for use in your Phaser game
window.multiplayerConnection = {
    sendData: sendData,
    isHost: () => isHost,
    isConnected: () => connection && connection.open
};