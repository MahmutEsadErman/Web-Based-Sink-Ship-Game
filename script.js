class Inventory {
    constructor() {
        this.counter = 10;
        this.ships = {
                "Battleship": 1,
                "Cruiser": 2,
                "Destroyer": 3,
                "Submarine": 4
            }
    }

    removeShip(type) {
        if (this.ships[type] > 0) {
            this.ships[type]--;
            this.counter--;
        }
        if (this.counter == 0) {
            document.getElementById('btn_play').disabled = false;
        }
        
        return this.ships[type];
    }
    addShip(type) {
        if (this.ships[type] == 0) {
            horizontal = document.getElementsByClassName(type.toLowerCase()+'h')[0];
            vertical = document.getElementsByClassName(type.toLowerCase()+'v')[0];
            
            horizontal.style.backgroundColor = 'white';
            vertical.style.backgroundColor = 'white';
            enableCell(horizontal);
            enableCell(vertical);
            this.counter++;
        }
        this.ships[type]++;
    }
    getShipCount(type) {
        return this.ships[type];
    }
}


function init() {
    const header = document.createElement('header');
    const headerLimiter = document.createElement('div');
    headerLimiter.className = 'limiter';
    
    const title = document.createElement('h1');
    title.textContent = 'Sink Ship';
    
    const author = document.createTextNode('by Mahmut Esad Erman');
    
    const musicButton = document.createElement('button');
    musicButton.id = 'music_control';
    musicButton.className = 'music_control';
    musicButton.innerHTML = '🎵';
    musicButton.title = 'Music On/Off';
    
    const backgroundMusic = new Audio('assets/sounds/background_music.mp3');
    backgroundMusic.volume = 0.3;
    let isMusicPlaying = false;
    
    musicButton.addEventListener('click', () => {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            musicButton.style.backgroundColor = '#ccc';
        } else {
            backgroundMusic.play();
            musicButton.style.backgroundColor = '#4CAF50';
        }
        isMusicPlaying = !isMusicPlaying;
    });
    
    headerLimiter.appendChild(title);
    headerLimiter.appendChild(author);
    headerLimiter.appendChild(musicButton);
    header.appendChild(headerLimiter);
    document.body.appendChild(header);

    const main = document.createElement('main');
    const mainLimiter = document.createElement('div');
    mainLimiter.className = 'limiter';

    const controls = document.createElement('div');
    controls.className = 'controls';
    const control = document.createElement('div');
    control.className = 'control';
    
    const buildButton = document.createElement('button');
    buildButton.id = 'btn_build';
    buildButton.textContent = 'Build';
    buildButton.addEventListener('click', buildGame);

    const autoplaceButton = document.createElement('button');
    autoplaceButton.id = 'btn_autoplace';
    autoplaceButton.textContent = 'Auto Place';
    autoplaceButton.addEventListener('click', autoPlaceShips);
    
    const playButton = document.createElement('button');
    playButton.id = 'btn_play';
    playButton.textContent = 'Play';
    playButton.addEventListener('click', playGame);
    playButton.disabled = true;

    const textDisplay = document.createElement('div');
    textDisplay.id = 'text_display';
    textDisplay.className = 'text_display';
    
    control.appendChild(buildButton);
    control.appendChild(autoplaceButton);
    control.appendChild(playButton);
    controls.appendChild(control);
    controls.appendChild(textDisplay);
    mainLimiter.appendChild(controls);

    const fields = document.createElement('div');
    fields.className = 'fields';

    const playerField = document.createElement('div');
    playerField.id = 'playerfield';
    playerField.className = 'field';

    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        playerField.appendChild(cell);
    }

    const computerField = document.createElement('div');
    computerField.id = 'computerfield';
    computerField.className = 'field';

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    ['Number', '', '', 'Type', 'Size'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    const ships = [
        { number: 1, type: 'Battleship', size: 5 },
        { number: 2, type: 'Cruiser', size: 4 },
        { number: 3, type: 'Destroyer', size: 3 },
        { number: 4, type: 'Submarine', size: 2 }
    ];

    ships.forEach(ship => {
        const row = document.createElement('tr');
        
        const numberCell = document.createElement('td');
        numberCell.className = 'number';
        numberCell.textContent = ship.number;
        
        const battleshiph = document.createElement('td');
        battleshiph.className = `${ship.type.toLowerCase()}h`;
        
        const battleshipv = document.createElement('td');
        battleshipv.className = `${ship.type.toLowerCase()}v`;
        
        const description = document.createElement('td');
        description.className = 'description';
        description.textContent = ship.type;
        
        const size = document.createElement('td');
        size.className = 'size';
        size.textContent = ship.size;

        battleshiph.addEventListener('click', () => {
            selectShip(ship, 'h');
        });

        battleshipv.addEventListener('click', () => {
            selectShip(ship, 'v');
        });

        row.appendChild(numberCell);
        row.appendChild(battleshiph);
        row.appendChild(battleshipv);
        row.appendChild(description);
        row.appendChild(size);
        
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    computerField.appendChild(table);

    fields.appendChild(playerField);
    fields.appendChild(computerField);
    mainLimiter.appendChild(fields);
    main.appendChild(mainLimiter);
    document.body.appendChild(main);

    const footer = document.createElement('footer');
    const footerLimiter = document.createElement('div');
    footerLimiter.className = 'limiter';
    footer.appendChild(footerLimiter);
    document.body.appendChild(footer);
}

function selectShip(ship, direction) {
    const playerField = document.getElementById('playerfield');
    const fieldLength = 10;
    let j = 0;
    
    for (let i = 0; i < playerField.children.length; i++) {
        const cell = playerField.children[i];
        if (i % fieldLength === 0) {
            j++;
        }
        if (direction === 'v' && j < (fieldLength - ship.size + 2)  && isCellLegal(ship.size, direction, i)) {
            cell.style.backgroundColor = 'lightgreen';
            cell.addEventListener('click', () => placeShip(ship, direction, i));
        }
        else if (direction === 'h' && (i % fieldLength) < (fieldLength - ship.size + 1) && isCellLegal(ship.size, direction, i)) {
            cell.style.backgroundColor = 'lightgreen';
            cell.addEventListener('click', () => placeShip(ship, direction, i));
        }
        else {
            cell.style.backgroundColor = 'white';
        }
    }
}

function placeShip(ship, direction, x) {
    const playerField = document.getElementById('playerfield');
    const fieldLength = 10;
    
    for (let i = 0; i < playerField.children.length; i++) {
        const cell = playerField.children[i];
        cell.style.backgroundColor = 'white';
        const replacement = cell.cloneNode(true); 
        playerField.replaceChild(replacement, cell);
    }

    if (direction === 'h') {
        playerField.children[x].className = 'cell shipLeft';
        for (let i = 1; i < ship.size-1; i++) {
            playerField.children[x + i].className = 'cell shipHorizontalBody';
        }
        playerField.children[x + (ship.size-1)].className = 'cell shipRight';
        for (let i = 0; i < ship.size; i++) {
            OccupiedCells.push(x + i);
            playerField.children[x + i].addEventListener('click', () => removeShip(range(x, x+ship.size), ship));
        }

    }
    else if (direction === 'v') {
        playerField.children[x].className = 'cell shipUp';
        for (let i = 1; i < ship.size-1; i++) {
            playerField.children[x + i*fieldLength].className = 'cell shipVerticalBody';            
        }
        playerField.children[x + (ship.size-1)*fieldLength].className = 'cell shipDown';
        
        for (let i = 0; i < ship.size; i++) {
            OccupiedCells.push(x + i*fieldLength);
            playerField.children[x + i*fieldLength].addEventListener('click', () => removeShip(range(x, x+ship.size*fieldLength, fieldLength), ship));
        }
    }
    
    const count = playerInventory.removeShip(ship.type);
    if (count === 0) {
       horizontal = document.getElementsByClassName(ship.type.toLowerCase()+'h')[0];
       vertical = document.getElementsByClassName(ship.type.toLowerCase()+'v')[0];
        
       horizontal.style.backgroundColor = 'gray';
       vertical.style.backgroundColor = 'gray';
       horizontal.replaceWith(horizontal.cloneNode(true));
       vertical.replaceWith(vertical.cloneNode(true));
    }

}

function isCellLegal(ship_size, direction, point){
    if(direction === 'h'){
        for(let i=-1; i<ship_size+1; i++){
            if (point+i <= 99 && point+i >= 0) {
                if(OccupiedCells.includes(point+i)){
                    return false;
                }
            }
        }
        for(let i=0; i<ship_size; i++){
            if (point+i <= 99 && point+i >= 0) {
                if(OccupiedCells.includes(point+i) || OccupiedCells.includes(point-10+i) || OccupiedCells.includes(point+10+i)){
                    return false;
                }
            }
        }
        return true;
    }
    else if(direction === 'v'){
        for(let i=-1; i<ship_size+1; i++){
            if (point+i*10 <= 99 && point+i*10 >= 0) {
                if(OccupiedCells.includes(point+i*10)){
                    return false;
                }
            }
        }
        for(let i=0; i<ship_size; i++){
            if (point+i*10 <= 99 && point+i*10 >= 0) {
                if(OccupiedCells.includes(point+i*10) || OccupiedCells.includes(point-1+i*10) || OccupiedCells.includes(point+1+i*10)){
                    return false;
                }
            }
        }
        return true;
    }
}

function range(start, end, step = 1) {
    const result = [];
    for (let i = start; i < end; i += step) {
        result.push(i);
    }
    return result;
}

function removeShip(ship_pos, ship) { 
    const playerField = document.getElementById('playerfield');
    
    for (let i = 0; i < ship_pos.length; i++) {
        const cell = playerField.children[ship_pos[i]];
        OccupiedCells.splice(OccupiedCells.indexOf(ship_pos[i]), 1);
        cell.className = 'cell';
        const replacement = cell.cloneNode(true);
        playerField.replaceChild(replacement, cell);
    }
    if (playerInventory.getShipCount(ship.type) == 0) {
        horizontal = document.getElementsByClassName(ship.type.toLowerCase()+'h')[0];
        vertical = document.getElementsByClassName(ship.type.toLowerCase()+'v')[0];
        horizontal.style.backgroundColor = 'white';
        vertical.style.backgroundColor = 'white';
        horizontal.addEventListener('click', () => selectShip(ship, 'h'));
        vertical.addEventListener('click', () => selectShip(ship, 'v'));
    }
    playerInventory.addShip(ship.type);
}

function buildGame() {
    OccupiedCells = [];
    playerInventory = new Inventory();
    document.body.innerHTML = '';
    init()
}

function autoPlaceShips() {
    const tbody = document.querySelector('#computerfield table tbody');
    const fieldLength = 10;

    // Get all ships from the table
    for (let i = 0; i < tbody.children.length; i++) {
        const row = tbody.children[i];
        const type = row.children[3].textContent;
        const size = parseInt(row.children[4].textContent);
        const count = playerInventory.ships[type];

        // Place each ship of this type
        for (let j = 0; j < count; j++) {
            let placed = false;
            
            while (!placed) {
                // Randomly choose direction and position
                const direction = Math.random() < 0.5 ? 'h' : 'v';
                let x;
                
                if (direction === 'h') {
                    // For horizontal ships, ensure x is within bounds
                    x = Math.floor(Math.random() * (fieldLength - size + 1)) + 
                        Math.floor(Math.random() * fieldLength) * fieldLength;
                } else {
                    // For vertical ships, ensure y is within bounds
                    const maxY = fieldLength - size + 1;
                    const y = Math.floor(Math.random() * maxY);
                    x = y * fieldLength + Math.floor(Math.random() * fieldLength);
                }

                // Check if placement is legal
                if (isCellLegal(size, direction, x)) {
                    placeShip({type: type, size: size}, direction, x);
                    placed = true;
                }
            }
        }
    }
    
}

async function playGame() {
    const computerField = document.getElementById('computerfield');
    computerField.innerHTML = '';
    const playerField = document.getElementById('playerfield');

    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        computerField.appendChild(cell);
        cell.addEventListener('click', () => shoot(i));
    }

    for (let i = 0; i < 100; i++) {
        const cell = playerField.children[i];
        cell.style.backgroundColor = 'rgba(39, 119, 239, 0.74)';
        if (!OccupiedCells.includes(i)) {
            cell.style.backgroundPosition = '-100% 0%';
        }
    }

    hitCounter = 0;
    disableComputerField();
    const response = await gameManager.startGame();
    if (response && response.success) {
        enableComputerField();
    }
    else {
        updateTextDisplay(response.statusText);
    }
}

function disableCell(cell) {
    cell.style.pointerEvents = 'none';
}

function enableCell(cell) {
    cell.style.pointerEvents = 'auto';
}

function disableComputerField() {
    const computerField = document.getElementById('computerfield');
    for (let i = 0; i < 100; i++) {
        const cell = computerField.children[i];
        cell.style.pointerEvents = 'none';
    }
}

function enableComputerField() {
    const computerField = document.getElementById('computerfield');
    for (let i = 0; i < 100; i++) {
        const cell = computerField.children[i];
        cell.style.pointerEvents = 'auto';
    }
}

function updateTextDisplay(text) {
    document.getElementById('text_display').textContent = text;
}

async function shoot(i) {
    const x = i % 10;
    const y = Math.floor(i / 10);
    const computerField = document.getElementById('computerfield');
    const cell = computerField.children[i];
    cell.style.backgroundColor = 'orange';
    cell.style.backgroundPosition = '-200% 0%';
    disableCell(cell);
    const response = await gameManager.shoot(x, y);
    if (response && response.success && response.result == 0) {
        cell.style.backgroundColor = 'rgba(39, 119, 239, 0.74)';
        cell.style.backgroundPosition = '-100% 0%';
        const sound = new Audio('assets/sounds/miss.mp3');
        sound.play();
        disableComputerField();
        getShotCoordinates();
    } else if (response && response.success && response.result == 1) {
        hitCounter++;
        const sound = new Audio('assets/sounds/hit.mp3');
        sound.play();
        cell.style.backgroundColor = 'darkred';
    } else if (response && response.success && response.result == 2) {
        hitCounter++;
        const sound = new Audio('assets/sounds/sink.mp3');
        sound.play();
    }
    if (hitCounter == OccupiedCells.length) {
        gameOver('Win');
        return;
    }
}

async function getShotCoordinates() {
    const playerField = document.getElementById('playerfield');
    const coordinates = await gameManager.getShotCoordinates();
    if (coordinates && coordinates.success) {
        const x = coordinates.x;
        const y = coordinates.y;
        if (OccupiedCells.includes(y*10+x)) {
            const cell = playerField.children[y*10+x];
            cell.style.backgroundColor = 'darkred';
            cell.style.backgroundPosition = '-200% 0%';
            enemyHitCounter++;
            const sound = new Audio('assets/sounds/hit.mp3');
            sound.play();
            if (enemyHitCounter == OccupiedCells.length) {
                gameOver('Lose');
                await gameManager.sendResult(2)
                return;
            }
            await gameManager.sendResult(1);
            getShotCoordinates();
        }
        else {
            const sound = new Audio('assets/sounds/miss.mp3');
            sound.play();
            const cell = playerField.children[y*10+x];
            cell.style.backgroundColor = 'rgb(21, 55, 106)';
            cell.style.backgroundPosition = '-100% 0%';
            await gameManager.sendResult(0);
            enableComputerField();
        }
    }
}

function gameOver(result) {
    // Create splash screen
    const splashScreen = document.createElement('div');
    splashScreen.className = 'splash-screen';
    
    const message = document.createElement('h2');
    message.className = 'game-over-message';
    message.textContent = result === 'Win' ? 'Congratulations! You Won!' : 'Sorry, You Lost!';
    
    const newGameButton = document.createElement('button');
    newGameButton.className = 'new-game-button';
    newGameButton.textContent = 'New Game';
    newGameButton.addEventListener('click', () => {
        // Remove splash screen
        document.body.removeChild(splashScreen);
        // Reset game
        buildGame();
        // Reset music control
        const musicButton = document.getElementById('music_control');
        if (musicButton) {
            musicButton.style.backgroundColor = '#ccc';
        }
        // Reset counters
        hitCounter = 0;
        enemyHitCounter = 0;
        // Enable game fields
        enableComputerField();
        enablePlayerField();
    });
    
    splashScreen.appendChild(message);
    splashScreen.appendChild(newGameButton);
    document.body.appendChild(splashScreen);
    
    // Play sound effects
    if (result === 'Win') {
        const winSound = new Audio('assets/sounds/win.mp3');
        winSound.play();
    } else {
        const loseSound = new Audio('assets/sounds/lose.mp3');
        loseSound.play();
    }
    
    disableComputerField();
    disablePlayerField();
}

// Yeni fonksiyon: Oyuncu alanını devre dışı bırakma
function disablePlayerField() {
    const playerField = document.getElementById('playerfield');
    for (let i = 0; i < 100; i++) {
        const cell = playerField.children[i];
        cell.style.pointerEvents = 'none';
    }
}

// Yeni fonksiyon: Oyuncu alanını etkinleştirme
function enablePlayerField() {
    const playerField = document.getElementById('playerfield');
    for (let i = 0; i < 100; i++) {
        const cell = playerField.children[i];
        cell.style.pointerEvents = 'auto';
    }
}

class GameManager {
    constructor() {
        this.baseUrl = 'https://www2.hs-esslingen.de/~melcher/it/sinkship/';
        this.token = null;
        this.userId = 'maerit03';
    }

    async makeRequest(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = `${this.baseUrl}?request=${endpoint}&${queryString}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            updateTextDisplay(data.statusText);
            return data;
            } catch (error) {
                updateTextDisplay(error);
            return null;
        }
    }

    async startGame() {
        const response = await this.makeRequest('start', { userid: this.userId });
        if (response && response.success) {
            this.token = response.token;
            return response;
        }
        return null;
    }

    async getStatus() {
        return await this.makeRequest('status');
    }

    async shoot(x, y) {
        if (!this.token) {
            console.error('Game not started!');
            return null;
        }
        return await this.makeRequest('shoot', { 
            token: this.token,
            x: x,
            y: y
        });
    }

    async getShotCoordinates() {
        if (!this.token) {
            console.error('Game not started!');
            return null;
        }
        return await this.makeRequest('getshotcoordinates', { token: this.token });
    }

    async sendResult(result) {
        if (!this.token) {
            console.error('Game not started!');
            return null;
        }
        return await this.makeRequest('sendingresult', { 
            token: this.token,
            result: result
        });
    }
}

// main
let enemyHitCounter = 0;
let hitCounter = 0;
let OccupiedCells = [];
let playerInventory = new Inventory();
document.addEventListener('DOMContentLoaded', init);
const gameManager = new GameManager();
