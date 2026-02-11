// ---------- ELEMENTS ----------
const circle = document.getElementById("circle");
const scoreText = document.getElementById("score");

// Pages
const gamePage = document.getElementById("gamePage");
const multiplyPage = document.getElementById("multiplyPage");
const upgradesPage = document.getElementById("upgradesPage");
const leaderboardsPage = document.getElementById("leaderboardsPage");

// Left buttons
const toMainBtn = document.getElementById("toMainBtn");
const toMultiplyBtn = document.getElementById("toMultiplyBtn");
const toUpgradesBtn = document.getElementById("toUpgradesBtn");
const toLeaderboardsBtn = document.getElementById("toLeaderboardsBtn");

// Multiplier page
const multiplierInput = document.getElementById("multiplierInput");
const multiplyBtn = document.getElementById("multiplyBtn");
const randomBox = document.getElementById("randomBox");

// Cooldown popup
const cooldownPopup = document.getElementById("cooldownPopup");
const closePopupBtn = document.getElementById("closePopupBtn");

// Upgrade system
const upgradeBtn = document.getElementById("upgradeBtn");
const upgradeLevelText = document.getElementById("upgradeLevel");
const currentPointsText = document.getElementById("currentPoints");
const upgradePriceText = document.querySelector("#upgradeBox p:nth-child(3)");

// Ascend button
const ascendBtn = document.createElement("button");
ascendBtn.id = "ascendBtn";
ascendBtn.textContent = "ASCEND";
ascendBtn.style.padding = "10px 20px";
ascendBtn.style.fontSize = "18px";
ascendBtn.style.cursor = "pointer";
ascendBtn.style.backgroundColor = "#28a745";
ascendBtn.style.color = "white";
ascendBtn.style.border = "none";
ascendBtn.style.borderRadius = "8px";
ascendBtn.style.marginLeft = "10px";
ascendBtn.style.display = "none";
upgradeBtn.parentNode.appendChild(ascendBtn);

// Blue Ball
const blueBallBtn = document.getElementById("blueBallBtn");
const blueBallPriceText = document.getElementById("blueBallPrice");

// Music
const bgMusic = document.getElementById("bgMusic");
let musicStarted = false;

// ---------- LEADERBOARDS ----------
const applyBtn = document.getElementById("applyBtn");
const applyPopup = document.getElementById("applyPopup");
const submitNameBtn = document.getElementById("submitNameBtn");
const closePopupBtnLeader = document.getElementById("closePopupBtnLeader");
const playerNameInput = document.getElementById("playerName");
const leaderboardTableBody = document.querySelector("#leaderboardTable tbody");

// ---------- VARIABLES ----------
let points = 0;
let clickMultiplier = 1;
let upgradeLevel = 1;
let upgradePrice = 100;

let ascendStage = 0; // 0 = none, 1 = first, 2 = second
let levelCap = 5;

const PRICE_MULTIPLIER = 3;

let blueBallPrice = 1000;
let blueBallOwned = false;

// Circle sizes
const normalSize = 80;
const bigSize = normalSize * 2;

// Cooldown
let isCooldownActive = false;
const cooldownTime = 40000;

// Leaderboard data
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
let playerName = localStorage.getItem("playerName") || null;

// ---------- FUNCTIONS ----------
function updateScores() {
    scoreText.textContent = "points = " + points;
    currentPointsText.textContent = "Points = " + points;
    updatePlayerLeaderboard();
}

function moveCircleRandomly() {
    const leftMargin = 160; 
    const topMargin = 120;

    const rand = Math.random();

    if (blueBallOwned && rand < 0.05) {
        circle.style.backgroundColor = "blue";
        circle.style.width = normalSize * 3 + "px";
        circle.style.height = normalSize * 3 + "px";
        circle.dataset.bonus = "blue";
    } else if (rand < 0.15) {
        circle.style.backgroundColor = "yellow";
        circle.style.width = bigSize + "px";
        circle.style.height = bigSize + "px";
        circle.dataset.bonus = "true";
    } else {
        circle.style.backgroundColor = "red";
        circle.style.width = normalSize + "px";
        circle.style.height = normalSize + "px";
        circle.dataset.bonus = "false";
    }

    const maxX = window.innerWidth - circle.offsetWidth;
    const maxY = window.innerHeight - circle.offsetHeight;
    const minX = leftMargin;
    const minY = topMargin;

    circle.style.left = Math.random() * (maxX - minX) + minX + "px";
    circle.style.top = Math.random() * (maxY - minY) + minY + "px";
}

// ---------- PAGE SWITCHING ----------
function showGame() {
    gamePage.style.display = "block";
    multiplyPage.style.display = "none";
    upgradesPage.style.display = "none";
    leaderboardsPage.style.display = "none";
    document.getElementById("blueBallBox").style.display = "none";
    scoreText.style.display = "block";
}
function showMultiply() {
    gamePage.style.display = "none";
    multiplyPage.style.display = "block";
    upgradesPage.style.display = "none";
    leaderboardsPage.style.display = "none";
    document.getElementById("blueBallBox").style.display = "none";
    scoreText.style.display = "block";
}
function showUpgrades() {
    gamePage.style.display = "none";
    multiplyPage.style.display = "none";
    upgradesPage.style.display = "block";
    leaderboardsPage.style.display = "none";
    document.getElementById("blueBallBox").style.display = "block";
    scoreText.style.display = "block";
}
function showLeaderboards() {
    gamePage.style.display = "none";
    multiplyPage.style.display = "none";
    upgradesPage.style.display = "none";
    leaderboardsPage.style.display = "block";
    document.getElementById("blueBallBox").style.display = "none";
    scoreText.style.display = "none";
    renderLeaderboard();
}

toMainBtn.addEventListener("click", showGame);
toMultiplyBtn.addEventListener("click", showMultiply);
toUpgradesBtn.addEventListener("click", showUpgrades);
toLeaderboardsBtn.addEventListener("click", showLeaderboards);

// ---------- CIRCLE ----------
circle.addEventListener("click", () => {
    if (!musicStarted) {
        bgMusic.play().catch(() => {});
        musicStarted = true;
    }

    if (circle.dataset.bonus === "blue") {
        points *= 2;
        blueBallOwned = false;
        updateScores();
        moveCircleRandomly();
        return;
    }

    const base = circle.dataset.bonus === "true" ? 5 : 1;
    points += base * clickMultiplier;
    updateScores();
    moveCircleRandomly();
});

// ---------- UPGRADE ----------
upgradeBtn.addEventListener("click", () => {
    if (points < upgradePrice) return;
    if (ascendStage < 2 && upgradeLevel >= levelCap) return;

    points -= upgradePrice;
    clickMultiplier *= 2;
    upgradeLevel++;
    upgradePrice = Math.floor(upgradePrice * PRICE_MULTIPLIER);

    upgradeLevelText.textContent = upgradeLevel;
    upgradePriceText.textContent = "Price: " + upgradePrice;
    updateScores();

    if (
        (ascendStage === 0 && upgradeLevel === 5) ||
        (ascendStage === 1 && upgradeLevel === 10)
    ) {
        ascendBtn.style.display = "inline-block";
    }
});

// ---------- ASCEND ----------
ascendBtn.addEventListener("click", () => {
    if (
        (ascendStage === 0 && upgradeLevel !== 5) ||
        (ascendStage === 1 && upgradeLevel !== 10)
    ) return;

    ascendStage++;
    upgradeLevel = 1;
    clickMultiplier = 1;
    upgradePrice = 100;

    if (ascendStage === 1) levelCap = 10;
    else if (ascendStage === 2) levelCap = Infinity;

    upgradeLevelText.textContent = upgradeLevel;
    upgradePriceText.textContent = "Price: " + upgradePrice;
    updateScores();
    ascendBtn.style.display = "none";
});

// ---------- BLUE BALL ----------
blueBallBtn.addEventListener("click", () => {
    if (points >= blueBallPrice && !blueBallOwned) {
        points -= blueBallPrice;
        blueBallOwned = true;
        blueBallPrice *= 2;
        blueBallPriceText.textContent = blueBallPrice;
        updateScores();
    }
});

// ---------- MULTIPLIER ----------
multiplierInput.addEventListener("input", () => {
    multiplyBtn.style.display =
        points > 20 && /^[2-9]$/.test(multiplierInput.value)
            ? "inline-block"
            : "none";
});

multiplyBtn.addEventListener("click", () => {
    if (isCooldownActive) {
        cooldownPopup.style.display = "flex";
        return;
    }

    const chosen = parseInt(multiplierInput.value);
    const final = Math.random() < 0.55 ? chosen - 1 : chosen + 1;

    randomBox.textContent = final;
    randomBox.style.display = "block";

    points = final >= chosen
        ? Math.round(points * (chosen / 2))
        : Math.floor(points / chosen);

    updateScores();
    multiplierInput.value = "";
    multiplyBtn.style.display = "none";

    isCooldownActive = true;
    setTimeout(() => isCooldownActive = false, cooldownTime);
});

// ---------- POPUP ----------
closePopupBtn.addEventListener("click", () => {
    cooldownPopup.style.display = "none";
});

// ---------- LEADERBOARDS ----------
applyBtn.addEventListener("click", () => {
    if (playerName) return alert("You already applied!");
    applyPopup.style.display = "block";
});

closePopupBtnLeader.addEventListener("click", () => {
    applyPopup.style.display = "none";
});

submitNameBtn.addEventListener("click", () => {
    const name = playerNameInput.value.trim();
    if (!name) return alert("Enter a valid name!");
    if (leaderboard.find(e => e.name === name)) return alert("This name is already on the leaderboard!");

    playerName = name;
    localStorage.setItem("playerName", playerName);

    leaderboard.push({ name: playerName, points: points });
    leaderboard.sort((a, b) => b.points - a.points);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    playerNameInput.value = "";
    applyPopup.style.display = "none";
    renderLeaderboard();
});

function renderLeaderboard() {
    // sort descending by points
    leaderboard.sort((a, b) => b.points - a.points);

    leaderboardTableBody.innerHTML = "";
    leaderboard.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${entry.name}</td><td>${entry.points}</td>`;
        leaderboardTableBody.appendChild(row);
    });
}

function updatePlayerLeaderboard() {
    if (!playerName) return;
    const entry = leaderboard.find(e => e.name === playerName);
    if (entry) {
        entry.points = points;
        leaderboard.sort((a, b) => b.points - a.points);
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
        renderLeaderboard();
    }
}

// ---------- INIT ----------
moveCircleRandomly();
updateScores();
showGame();
cooldownPopup.style.display = "none";
