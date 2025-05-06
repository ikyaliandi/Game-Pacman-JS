const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animation");
const ghostFrames = document.getElementById("ghosts");

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;
let lives = 3;
let ghostCount = 4;
let ghostImageLocations = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 },
];

// Game variables
let fps = 30;
let pacman;
let oneBlockSize = 20;
let score = 0;
let ghosts = [];
let wallSpaceWidth = oneBlockSize / 1.6;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";

// we now create the map of the walls,
// if 1 wall, if 0 not wall
// 21 columns // 23 rows
let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let randomTargetsForGhosts = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    {
        x: (map[0].length - 2) * oneBlockSize,
        y: (map.length - 2) * oneBlockSize,
    },
];

// for (let i = 0; i < map.length; i++) {
//     for (let j = 0; j < map[0].length; j++) {
//         map[i][j] = 2;
//     }
// }

let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 5
    );
};

let gameLoop = () => {
    update();
    draw();
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

let restartPacmanAndGhosts = () => {
    createNewPacman();
    createGhosts();
};

let onGhostCollision = () => {
    lives--;
    if (lives === 0) {
        clearInterval(gameInterval); // Hentikan game loop
        setTimeout(showGameOverPopup, 500); // Tampilkan pop-up Game Over
    } else {
        restartPacmanAndGhosts();
    }
};


let showGameOverPopup = () => {
    // Membuat elemen overlay gelap
    let overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    overlay.style.zIndex = "998";
    overlay.style.transition = "opacity 0.5s";
    document.body.appendChild(overlay);

    // Membuat elemen pop-up
    let popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%) scale(0)";
    popup.style.padding = "30px";
    popup.style.backgroundColor = "white";
    popup.style.borderRadius = "20px";
    popup.style.boxShadow = "0 15px 25px rgba(0, 0, 0, 0.5)";
    popup.style.textAlign = "center";
    popup.style.zIndex = "999";
    popup.style.width = "80%";
    popup.style.maxWidth = "600px";
    popup.style.transition = "transform 0.5s";
    popup.style.fontFamily = "'Arial', sans-serif";

    // Animasi pop-up saat muncul
    setTimeout(() => {
        popup.style.transform = "translate(-50%, -50%) scale(1)";
    }, 100);

    // Isi pop-up
    let message = document.createElement("h2");
    message.innerText = "Game Over!";
    message.style.color = "#FF4C4C";
    message.style.fontSize = "36px";
    message.style.marginBottom = "10px";
    message.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.3)";
    popup.appendChild(message);

    // Tambahkan kata-kata motivasi
    let motivationalText1 = document.createElement("p");
    motivationalText1.innerText = `"Gagal sekali bukan berarti gagal selamanya. Bangkit lagi dan buktikan bahwa kamu lebih kuat dari rintangan ini."`;
    motivationalText1.style.fontSize = "18px";
    motivationalText1.style.color = "#333";
    motivationalText1.style.marginTop = "10px";
    motivationalText1.style.lineHeight = "1.5";
    popup.appendChild(motivationalText1);

    // Tambahkan ayat Al-Qur'an
    let motivationalText2 = document.createElement("p");
    motivationalText2.innerText = `"Maka sesungguhnya bersama kesulitan ada kemudahan."`;
    motivationalText2.style.fontSize = "18px";
    motivationalText2.style.fontWeight = "bold";
    motivationalText2.style.color = "#333";
    motivationalText2.style.marginTop = "10px";
    motivationalText2.style.lineHeight = "1.5";
    popup.appendChild(motivationalText2);

    // Tambahkan sumber ayat (bold)
    let surahReference = document.createElement("p");
    surahReference.innerText = "(QS. Al-Insyirah: 5)";
    surahReference.style.fontSize = "16px";
    surahReference.style.fontWeight = "bold"; // Membuat teks menjadi bold
    surahReference.style.color = "#333";
    surahReference.style.marginTop = "-10px"; // Memberikan sedikit jarak ke atas agar lebih dekat dengan ayat
    popup.appendChild(surahReference);

    // Tombol Restart
    let restartButton = document.createElement("button");
    restartButton.innerText = "Coba Lagi";
    restartButton.style.marginTop = "20px";
    restartButton.style.padding = "10px 20px";
    restartButton.style.backgroundColor = "#FF4C4C";
    restartButton.style.color = "white";
    restartButton.style.border = "none";
    restartButton.style.borderRadius = "10px";
    restartButton.style.cursor = "pointer";
    restartButton.style.fontSize = "18px";
    restartButton.style.boxShadow = "0 5px 15px rgba(255, 76, 76, 0.4)";
    restartButton.style.transition = "transform 0.3s";
    
    // Animasi hover pada tombol
    restartButton.onmouseover = () => {
        restartButton.style.transform = "scale(1.1)";
    };
    restartButton.onmouseout = () => {
        restartButton.style.transform = "scale(1)";
    };

    // Fungsi tombol untuk restart
    restartButton.onclick = () => {
        window.location.reload();
    };

    popup.appendChild(restartButton);
    document.body.appendChild(popup);
};



let checkWinCondition = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 2) {
                return false;
            }
        }
    }
    return true;
};

let showWinPopup = () => {
    // Membuat elemen overlay transparan
    let overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(255, 255, 255, 0.19)"; // Warna transparan background
    overlay.style.zIndex = "998";
    overlay.style.transition = "opacity 0.5s";
    document.body.appendChild(overlay);

    // Membuat elemen pop-up
    let popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%) scale(0)";
    popup.style.padding = "30px";
    popup.style.backgroundColor = "#fff8dc"; // Warna krem keemasan
    popup.style.borderRadius = "20px";
    popup.style.boxShadow = "0 15px 25px rgba(255, 215, 0, 0.7)";
    popup.style.textAlign = "center";
    popup.style.zIndex = "999";
    popup.style.width = "80%";
    popup.style.maxWidth = "600px";
    popup.style.transition = "transform 0.5s";
    popup.style.fontFamily = "'Arial', sans-serif";

    // Animasi pop-up saat muncul
    setTimeout(() => {
        popup.style.transform = "translate(-50%, -50%) scale(1)";
    }, 100);

    // Tambahkan ikon trofi
    let trophyIcon = document.createElement("div");
    trophyIcon.innerHTML = "🏆";
    trophyIcon.style.fontSize = "50px";
    trophyIcon.style.marginBottom = "10px";
    popup.appendChild(trophyIcon);

    // Isi pop-up
    let message = document.createElement("h2");
    message.innerText = "Selamat! Kamu Menang!";
    message.style.color = "#DAA520";
    message.style.fontSize = "36px";
    message.style.marginBottom = "10px";
    message.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.3)";
    popup.appendChild(message);

    // Tambahkan kata-kata apresiasi
    let appreciationText = document.createElement("p");
    appreciationText.innerHTML = `"Kemenangan bukan alasan untuk menyombongkan diri, tapi kesempatan untuk bersyukur dan tetap rendah hati."`;
    appreciationText.style.fontSize = "18px";
    appreciationText.style.color = "#333";
    appreciationText.style.marginTop = "10px";
    appreciationText.style.lineHeight = "1.5";
    popup.appendChild(appreciationText);

    // Tambahkan ayat Al-Qur'an
    let quranVerse = document.createElement("p");
    quranVerse.innerHTML = `"Dan janganlah kamu berjalan di muka bumi ini dengan sombong, karena sesungguhnya kamu sekali-kali tidak dapat menembus bumi dan tidak akan sampai setinggi gunung." <br><strong>(QS. Al-Isra’: 37)</strong>`;
    quranVerse.style.fontSize = "16px";
    quranVerse.style.color = "#555";
    quranVerse.style.marginTop = "10px";
    quranVerse.style.lineHeight = "1.5";
    popup.appendChild(quranVerse);

    // Tombol Restart
    let restartButton = document.createElement("button");
    restartButton.innerText = "Main Lagi";
    restartButton.style.marginTop = "20px";
    restartButton.style.padding = "10px 20px";
    restartButton.style.backgroundColor = "#DAA520";
    restartButton.style.color = "white";
    restartButton.style.border = "none";
    restartButton.style.borderRadius = "10px";
    restartButton.style.cursor = "pointer";
    restartButton.style.fontSize = "18px";
    restartButton.style.boxShadow = "0 5px 15px rgba(255, 215, 0, 0.4)";
    restartButton.style.transition = "transform 0.3s";

    // Animasi hover pada tombol
    restartButton.onmouseover = () => {
        restartButton.style.transform = "scale(1.1)";
    };
    restartButton.onmouseout = () => {
        restartButton.style.transform = "scale(1)";
    };

    // Fungsi tombol untuk restart
    restartButton.onclick = () => {
        window.location.reload();
    };

    popup.appendChild(restartButton);
    document.body.appendChild(popup);
};


let update = () => {
    pacman.moveProcess();
    pacman.eat();
    updateGhosts();
    if (pacman.checkGhostCollision(ghosts)) {
        onGhostCollision();
    }
    
    // Cek apakah semua poin sudah diambil
    if (checkWinCondition()) {
        clearInterval(gameInterval); // Hentikan game loop
        setTimeout(showWinPopup, 500); // Tampilkan pop-up
    }
};


let drawFoods = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 2) {
                createRect(
                    j * oneBlockSize + oneBlockSize / 3,
                    i * oneBlockSize + oneBlockSize / 3,
                    oneBlockSize / 3,
                    oneBlockSize / 3,
                    "#FEB897"
                );
            }
        }
    }
};

let drawRemainingLives = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Lives: ", 220, oneBlockSize * (map.length + 1));

    for (let i = 0; i < lives; i++) {
        canvasContext.drawImage(
            pacmanFrames,
            2 * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            350 + i * oneBlockSize,
            oneBlockSize * map.length + 2,
            oneBlockSize,
            oneBlockSize
        );
    }
};

let drawScore = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "Score: " + score,
        0,
        oneBlockSize * (map.length + 1)
    );
};

let draw = () => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    createRect(0, 0, canvas.width, canvas.height, "black");
    drawWalls();
    drawFoods();
    drawGhosts();
    pacman.draw();
    drawScore();
    drawRemainingLives();
};

let drawWalls = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) {
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    "#342DCA"
                );
                if (j > 0 && map[i][j - 1] == 1) {
                    createRect(
                        j * oneBlockSize,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (i < map.length - 1 && map[i + 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }

                if (i > 0 && map[i - 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }
            }
        }
    }
};

let createGhosts = () => {
    ghosts = [];
    for (let i = 0; i < ghostCount * 2; i++) {
        let newGhost = new Ghost(
            9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostImageLocations[i % 4].x,
            ghostImageLocations[i % 4].y,
            124,
            116,
            6 + i
        );
        ghosts.push(newGhost);
    }
};

createNewPacman();
createGhosts();
gameLoop();

window.addEventListener("keydown", (event) => {
    let k = event.keyCode;
    setTimeout(() => {
        if (k == 37 || k == 65) {
            // left arrow or a
            pacman.nextDirection = DIRECTION_LEFT;
        } else if (k == 38 || k == 87) {
            // up arrow or w
            pacman.nextDirection = DIRECTION_UP;
        } else if (k == 39 || k == 68) {
            // right arrow or d
            pacman.nextDirection = DIRECTION_RIGHT;
        } else if (k == 40 || k == 83) {
            // bottom arrow or s
            pacman.nextDirection = DIRECTION_BOTTOM;
        }
    }, 1);
});