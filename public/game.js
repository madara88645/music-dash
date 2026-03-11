// ========================================
// SHADOW CORRIDOR - İzometrik Gizlilik Oyunu
// Harita Motoru
// ========================================

(function () {
    'use strict';

    // ---- Tile Types ----
    const TILE = {
        EMPTY: 0,      // Boş alan (karanlık)
        FLOOR: 1,      // Zemin (yürünebilir)
        WALL: 2,       // Duvar
        DOOR: 3,       // Kapı
        VENT: 4,       // Havalandırma kanalı
        LIGHT: 5,      // Aydınlatılmış zemin
        CHECKPOINT: 6, // Kontrol noktası
        EXIT: 7,       // Çıkış
        CRATE: 8,      // Kasa/sandık
        PILLAR: 9,     // Sütun
    };

    // ---- Color Palette ----
    const COLORS = {
        [TILE.EMPTY]:      { top: '#0c0c14', left: '#08080e', right: '#0a0a12' },
        [TILE.FLOOR]:      { top: '#1a1a2e', left: '#141424', right: '#16162a' },
        [TILE.WALL]:       { top: '#3a3a5c', left: '#2a2a44', right: '#323252' },
        [TILE.DOOR]:       { top: '#8b6914', left: '#6b5010', right: '#7a5c12' },
        [TILE.VENT]:       { top: '#1e2e1e', left: '#162416', right: '#1a281a' },
        [TILE.LIGHT]:      { top: '#2a2a48', left: '#20203a', right: '#242440' },
        [TILE.CHECKPOINT]:  { top: '#2e1a1a', left: '#241414', right: '#281616' },
        [TILE.EXIT]:       { top: '#1a2e1a', left: '#142414', right: '#162816' },
        [TILE.CRATE]:      { top: '#4a3a20', left: '#3a2e18', right: '#42341c' },
        [TILE.PILLAR]:     { top: '#4a4a6a', left: '#38384e', right: '#40405c' },
    };

    const WALL_HEIGHT = 22;

    // ---- Map Data (30x30) ----
    // Tüm engeller görünür duvarlar (WALL=2), görünmez engel yok
    // Koridorlar her iki tarafında duvarlarla çevrili
    const MAP = [
        //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // 0
        [2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2], // 1
        [2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2], // 2
        [2, 1, 1, 1, 5, 1, 2, 2, 2, 2, 2, 1, 1, 9, 1, 1, 9, 1, 1, 2, 2, 2, 2, 2, 1, 5, 1, 1, 1, 2], // 3
        [2, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 1, 2], // 4
        [2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2], // 5
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // 6
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // 7
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // 8
        [2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2], // 9
        [2, 5, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 5, 2], // 10
        [2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2], // 11
        [2, 1, 1, 9, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 5, 5, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 9, 1, 1, 2], // 12
        [2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 5, 6, 6, 5, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2], // 13
        [2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 5, 6, 6, 5, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2], // 14
        [2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 5, 5, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2], // 15
        [2, 1, 1, 9, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 9, 1, 1, 2], // 16
        [2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2], // 17
        [2, 5, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 5, 2], // 18
        [2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2], // 19
        [2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2], // 20
        [2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2], // 21
        [2, 2, 2, 2, 2, 3, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 3, 2, 2, 2, 2, 2], // 22
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // 23
        [2, 1, 8, 1, 1, 1, 1, 1, 8, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 8, 1, 1, 1, 1, 1, 8, 1, 2], // 24
        [2, 1, 1, 1, 5, 1, 9, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 9, 1, 5, 1, 1, 1, 2], // 25
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // 26
        [2, 1, 8, 1, 1, 1, 1, 1, 8, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 8, 1, 1, 1, 1, 1, 7, 1, 2], // 27
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // 28
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // 29
    ];

    const MAP_ROWS = MAP.length;
    const MAP_COLS = MAP[0].length;

    // ---- Isometric Config ----
    const TILE_W = 64;  // İzometrik tile genişliği
    const TILE_H = 32;  // İzometrik tile yüksekliği
    const HALF_W = TILE_W / 2;
    const HALF_H = TILE_H / 2;

    // ---- Canvas Setup ----
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const minimapCanvas = document.getElementById('minimap-canvas');
    const minimapCtx = minimapCanvas.getContext('2d');
    const leaderboardElements = {
        currentScore: document.getElementById('leaderboard-current-score'),
        runState: document.getElementById('leaderboard-run-state'),
        playerName: document.getElementById('leaderboard-player-name'),
        submitButton: document.getElementById('leaderboard-submit-button'),
        refreshButton: document.getElementById('leaderboard-refresh-button'),
        feedback: document.getElementById('leaderboard-feedback'),
        list: document.getElementById('leaderboard-list'),
    };
    const scoreFormatter = new Intl.NumberFormat('en-GB');

    let canvasW, canvasH;

    // ---- Camera ----
    const camera = {
        x: 0,
        y: 0,
        zoom: 1,
        targetZoom: 1,
        minZoom: 0.4,
        maxZoom: 2.5,
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
        dragCamStartX: 0,
        dragCamStartY: 0,
    };

    // ---- Animation State ----
    let animTime = 0;
    const lightPulseSpeed = 0.002;
    const particleCount = 60;
    let particles = [];

    // ---- Loot Items (Çalınabilir Eşyalar) ----
    const LOOT_TYPES = {
        DIAMOND:  { name: 'Elmas',       value: 5000, emoji: '💎' },
        VASE:    { name: 'Antik Vazo',   value: 3000, emoji: '🏺' },
        GOLD:    { name: 'Altın Külçe',  value: 2000, emoji: '💰' },
        RUBY:    { name: 'Yakut',        value: 4000, emoji: '💠' },
        PAINTING:{ name: 'Tablo',        value: 3500, emoji: '🖼️' },
    };

    const lootItems = [
        // Sol üst oda (row 1-5, col 1-5)
        { col: 4, row: 2, type: 'DIAMOND',  collected: false },
        { col: 2, row: 4, type: 'VASE',     collected: false },
        // Üst orta salon (row 1-5, col 11-18)
        { col: 14, row: 1, type: 'PAINTING', collected: false },
        { col: 16, row: 5, type: 'GOLD',     collected: false },
        // Sağ üst oda (row 1-5, col 24-28)
        { col: 26, row: 2, type: 'RUBY',     collected: false },
        { col: 25, row: 4, type: 'VASE',     collected: false },
        // Sol orta oda (row 10-18, col 1-5)
        { col: 2, row: 11, type: 'GOLD',     collected: false },
        { col: 4, row: 14, type: 'DIAMOND',  collected: false },
        // Merkez salon (row 10-18, col 11-18)
        { col: 15, row: 12, type: 'DIAMOND', collected: false },
        { col: 14, row: 17, type: 'RUBY',    collected: false },
        // Sağ orta oda (row 10-18, col 24-28)
        { col: 26, row: 11, type: 'PAINTING',collected: false },
        { col: 27, row: 15, type: 'GOLD',    collected: false },
        // Sol alt oda (row 23-28, col 1-9)
        { col: 3, row: 23, type: 'VASE',     collected: false },
        { col: 5, row: 26, type: 'RUBY',     collected: false },
        // Sağ alt oda (row 23-28, col 20-28)
        { col: 22, row: 24, type: 'PAINTING',collected: false },
        { col: 26, row: 26, type: 'DIAMOND', collected: false },
    ];

    let collectedCount = 0;
    let totalValue = 0;
    let sparkles = []; // collection sparkle effects
    let floatingTexts = []; // floating value text
    let escapeComplete = false;
    let leaderboardEntries = [];
    let leaderboardBusy = false;
    let runSubmitted = false;
    const MAX_PLAYER_HEALTH = 100;
    const GUARD_CONTACT_DAMAGE = 0.45;
    let playerHealth = MAX_PLAYER_HEALTH;

    // ---- Player ----
    const player = {
        x: 1.5,        // continuous float position (tile coords)
        y: 1.5,
        speed: 0.06,   // movement speed per frame
        angle: Math.PI * 0.5, // facing angle (radians, 0=right)
        moving: false,
        stepAnim: 0,   // walk animation counter
    };

    const PLAYER_RADIUS = 0.12; // collision hitbox radius (tight fit)
    const LOOT_PICKUP_RADIUS = 0.6; // how close to pick up loot

    const keysDown = {};
    const WALKABLE = [TILE.FLOOR, TILE.DOOR, TILE.VENT, TILE.LIGHT, TILE.CHECKPOINT, TILE.EXIT];

    // ---- Security Guards ----
    const GUARD_DETECT_RANGE = 5;
    const GUARD_CATCH_RANGE = 0.5;
    const GUARD_PATROL_SPEED = 0.025;
    const GUARD_CHASE_SPEED = 0.045;

    const guards = [
        // Güvenlik görevlileri şimdilik devre dışı
        // Geri eklemek için aşağıdaki satırları açın:
        // { x:14.5, y:4.5, angle:0, speed:GUARD_PATROL_SPEED, state:'patrol', waypointIndex:0, waypoints:[{x:14.5,y:4.5},{x:16.5,y:4.5},{x:16.5,y:1.5},{x:14.5,y:1.5}], alertTimer:0, stepAnim:0 },
        // { x:3.5, y:14.5, angle:0, speed:GUARD_PATROL_SPEED, state:'patrol', waypointIndex:0, waypoints:[{x:3.5,y:14.5},{x:3.5,y:11.5},{x:1.5,y:11.5},{x:1.5,y:17.5},{x:3.5,y:17.5}], alertTimer:0, stepAnim:0 },
        // { x:26.5, y:14.5, angle:0, speed:GUARD_PATROL_SPEED, state:'patrol', waypointIndex:0, waypoints:[{x:26.5,y:14.5},{x:26.5,y:17.5},{x:28.5,y:17.5},{x:28.5,y:11.5},{x:26.5,y:11.5}], alertTimer:0, stepAnim:0 },
        // { x:5.5, y:25.5, angle:0, speed:GUARD_PATROL_SPEED, state:'patrol', waypointIndex:0, waypoints:[{x:5.5,y:25.5},{x:8.5,y:25.5},{x:8.5,y:23.5},{x:2.5,y:23.5},{x:2.5,y:25.5}], alertTimer:0, stepAnim:0 },
    ];

    let gameOver = false;
    let gameOverTimer = 0;
    let paused = false;
    let menuVolume = 0.4; // 0-1 volume level
    const MENU_VOL_STEP = 0.05;
    let doorsOpen = true; // doors toggle with beat
    let lastDoorBeat = -1;
    let comboScore = 0;   // builds up when moving, drops when stopped (0-200)
    let upcomingFlashes = [];
    let activeBeats = { pad: 0, hat: 0, kick: 0, bass: 0, snare: 0, perc: 0, arp: 0, lead: 0, crash: 0, fx: 0 };
    let lastBeatTime = 0; // For visual ring shrinking

    // ---- Projectiles System ----
    let projectiles = [];

    // ---- Music System ----
    const BPM = 110;
    const BEAT_INTERVAL = 60 / BPM; // seconds per beat
    const beat = {
        count: 0,       // total beats elapsed
        phase: 0,       // 0-1 progress within current beat
        current: 0,     // beat within 4-beat measure (0-3)
        onBeat: false,  // true on the frame a beat fires
        measure: 0,     // current measure number
        time: 0,        // audio context time
        active: false,  // is music playing
    };

    let audioCtx = null;
    let musicStarted = false;
    let nextBeatTime = 0;
    let masterGain = null;

    function formatScore(value) {
        return scoreFormatter.format(Math.max(0, Math.round(value)));
    }

    function formatHealth(value) {
        return Math.max(0, Math.ceil(value));
    }

    function setLeaderboardFeedback(message, isError) {
        if (!leaderboardElements.feedback) return;
        leaderboardElements.feedback.textContent = message;
        leaderboardElements.feedback.style.color = isError ? '#ff8f8f' : 'rgba(198, 208, 232, 0.78)';
    }

    function renderLeaderboardEntries() {
        if (!leaderboardElements.list) return;
        leaderboardElements.list.innerHTML = '';

        if (leaderboardEntries.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'leaderboard-empty';
            emptyItem.textContent = 'No runs submitted yet.';
            leaderboardElements.list.appendChild(emptyItem);
            return;
        }

        leaderboardEntries.forEach((entry, index) => {
            const item = document.createElement('li');
            const rank = document.createElement('span');
            const name = document.createElement('span');
            const score = document.createElement('span');

            item.className = 'leaderboard-entry';
            rank.className = 'leaderboard-rank';
            rank.textContent = `#${index + 1}`;
            name.className = 'leaderboard-name';
            name.textContent = entry.playerName;
            score.className = 'leaderboard-score';
            score.textContent = formatScore(entry.score);
            item.append(rank, name, score);
            leaderboardElements.list.appendChild(item);
        });
    }

    function canSubmitRun() {
        return !leaderboardBusy && !runSubmitted && totalValue > 0 && (gameOver || escapeComplete);
    }

    function getRunStateText() {
        if (escapeComplete) {
            return runSubmitted
                ? 'Escaped run banked. Press R to start another route.'
                : 'Escape complete. Enter a name and submit this loot haul.';
        }

        if (gameOver) {
            return totalValue > 0
                ? (runSubmitted
                    ? 'Caught, but your loot score is already saved.'
                    : 'Caught with loot. You can still bank this run.')
                : 'Caught empty-handed. Grab loot before your next escape.';
        }

        if (totalValue > 0) {
            return 'You have loot. Reach the green exit to finish the run clean.';
        }

        return 'Collect loot, then escape or survive long enough to bank the run.';
    }

    function updateLeaderboardUI() {
        if (leaderboardElements.currentScore) {
            leaderboardElements.currentScore.textContent = formatScore(totalValue);
        }

        if (leaderboardElements.runState) {
            leaderboardElements.runState.textContent = getRunStateText();
        }

        if (leaderboardElements.submitButton) {
            leaderboardElements.submitButton.disabled = !canSubmitRun();
        }
    }

    async function loadLeaderboard() {
        try {
            const response = await fetch('/api/scores');

            if (!response.ok) {
                throw new Error(`Leaderboard request failed with ${response.status}`);
            }

            leaderboardEntries = await response.json();
            renderLeaderboardEntries();

            if (!runSubmitted) {
                setLeaderboardFeedback('Live top 10 pulled from the shared jam server.', false);
            }
        } catch (error) {
            leaderboardEntries = [];
            renderLeaderboardEntries();
            setLeaderboardFeedback('Could not load the leaderboard right now.', true);
        }
    }

    async function submitCurrentScore() {
        if (!canSubmitRun()) {
            return;
        }

        const playerName = leaderboardElements.playerName
            ? leaderboardElements.playerName.value.trim()
            : '';

        if (!playerName) {
            setLeaderboardFeedback('Add a player name before submitting.', true);
            leaderboardElements.playerName?.focus();
            return;
        }

        leaderboardBusy = true;
        updateLeaderboardUI();
        setLeaderboardFeedback('Submitting run...', false);

        try {
            const response = await fetch('/api/scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    playerName,
                    score: totalValue,
                }),
            });

            if (!response.ok) {
                throw new Error(`Submit failed with ${response.status}`);
            }

            runSubmitted = true;
            await loadLeaderboard();
            setLeaderboardFeedback('Score submitted to the global leaderboard.', false);
        } catch (error) {
            setLeaderboardFeedback('Could not submit this run right now.', true);
        } finally {
            leaderboardBusy = false;
            updateLeaderboardUI();
        }
    }

    function finishRun(outcome) {
        if (gameOver || escapeComplete) return;

        if (outcome === 'escaped') {
            escapeComplete = true;
            showFloatingText(player.x, player.y, 'ESCAPED', '120, 255, 180');
        } else {
            gameOver = true;
        }

        gameOverTimer = 0;
        updateLeaderboardUI();
    }

    function applyPlayerDamage(amount) {
        if (gameOver || escapeComplete) return;

        playerHealth = Math.max(0, playerHealth - amount);

        if (playerHealth <= 0) {
            finishRun('caught');
        }
    }

    function checkExitCondition() {
        if (gameOver || escapeComplete || totalValue <= 0) return;

        const col = Math.floor(player.x);
        const row = Math.floor(player.y);
        const tile = MAP[row]?.[col];

        if (tile === TILE.EXIT) {
            finishRun('escaped');
        }
    }

    function initMusic() {
        if (!musicStarted) {
            musicStarted = true;
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = audioCtx.createGain();
            masterGain.gain.value = menuVolume;
            masterGain.connect(audioCtx.destination);
            nextBeatTime = audioCtx.currentTime + 0.1;
            beat.active = true;
            scheduleBeat();
        }
        // Always try to resume (browser autoplay policy)
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function scheduleBeat() {
        if (!audioCtx || !beat.active) return;

        while (nextBeatTime < audioCtx.currentTime + 0.2) {
            const beatInMeasure = beat.count % 4;
            const measureNum = Math.floor(beat.count / 4);

            // LEVEL 0 (Base Layer): Atmospheric synth pad every 2 measures
            if (beat.count % 8 === 0) {
                playSynthPad(nextBeatTime);
                upcomingFlashes.push({ time: nextBeatTime, type: 'pad' });
            }

            // LEVEL 0 (Base Layer): Continuous Hi-hats (main beat)
            playHiHat(nextBeatTime, 0.3); // On-beat
            upcomingFlashes.push({ time: nextBeatTime, type: 'hat' });

            // LEVEL 1: Energetic 4-on-the-floor Kick
            if (comboScore > 20) {
                playKick(nextBeatTime);
                upcomingFlashes.push({ time: nextBeatTime, type: 'kick' });
            }
            
            // LEVEL 2: Off-beat Hi-hats
            if (comboScore > 40) {
                playHiHat(nextBeatTime + BEAT_INTERVAL / 2, 0.2);
                upcomingFlashes.push({ time: nextBeatTime + BEAT_INTERVAL / 2, type: 'hat' });
            }

            // LEVEL 3: Driving 16th-note Bassline
            if (comboScore > 60) {
                const rootFreq = 55; // A1
                playEnergeticBass(nextBeatTime, rootFreq);
                upcomingFlashes.push({ time: nextBeatTime, type: 'bass' });
                playEnergeticBass(nextBeatTime + BEAT_INTERVAL * 0.25, rootFreq * 1.2);
                upcomingFlashes.push({ time: nextBeatTime + BEAT_INTERVAL * 0.25, type: 'bass' });
                playEnergeticBass(nextBeatTime + BEAT_INTERVAL * 0.5, rootFreq);
                upcomingFlashes.push({ time: nextBeatTime + BEAT_INTERVAL * 0.5, type: 'bass' });
                playEnergeticBass(nextBeatTime + BEAT_INTERVAL * 0.75, rootFreq * 1.5);
                upcomingFlashes.push({ time: nextBeatTime + BEAT_INTERVAL * 0.75, type: 'bass' });
            }

            // LEVEL 4: Punchy Snare/Clap
            if (comboScore > 80) {
                if (beatInMeasure === 1 || beatInMeasure === 3) {
                    playEnergeticSnare(nextBeatTime);
                    upcomingFlashes.push({ time: nextBeatTime, type: 'snare' });
                }
            }

            // LEVEL 5: Syncopated Percussion (Bongos on 16ths)
            if (comboScore > 100) {
                if (beatInMeasure !== 0) {
                    playPerc(nextBeatTime + BEAT_INTERVAL * 0.25, 400);
                    upcomingFlashes.push({ time: nextBeatTime + BEAT_INTERVAL * 0.25, type: 'perc' });
                }
                playPerc(nextBeatTime + BEAT_INTERVAL * 0.75, 300);
                upcomingFlashes.push({ time: nextBeatTime + BEAT_INTERVAL * 0.75, type: 'perc' });
            }

            // LEVEL 6: Fast 16th-note Hi-hats
            if (comboScore > 120) {
                playHiHat(nextBeatTime + BEAT_INTERVAL * 0.25, 0.1);
                playHiHat(nextBeatTime + BEAT_INTERVAL * 0.75, 0.1);
            }

            // LEVEL 7: Arpeggio Synth (Bouncy High Bass)
            if (comboScore > 140) {
                const arpFreq = 110; // A2
                const notes = [arpFreq, arpFreq*1.5, arpFreq*2, arpFreq*1.2];
                const note = notes[beat.count % notes.length];
                playArp(nextBeatTime + BEAT_INTERVAL * 0.5, note);
                upcomingFlashes.push({ time: nextBeatTime + BEAT_INTERVAL * 0.5, type: 'arp' });
            }

            // LEVEL 8: Lead Synth Melody
            if (comboScore > 160) {
                const leadNotes = [440, 554.37, 659.25, 554.37, 880, 659.25, 554.37, 440]; // A4, C#5, E5, A5
                const noteIndex = beat.count % 8;
                if (noteIndex % 2 === 0 || noteIndex === 7) {
                    playLead(nextBeatTime, leadNotes[noteIndex]);
                    upcomingFlashes.push({ time: nextBeatTime, type: 'lead' });
                }
            }

            // LEVEL 9: Crash Cymbal
            if (comboScore > 180) {
                if (beatInMeasure === 0 && measureNum % 2 === 0) {
                    playCrash(nextBeatTime);
                    upcomingFlashes.push({ time: nextBeatTime, type: 'crash' });
                }
            }

            // LEVEL 10 (MAX): Tension / FX Blips
            if (comboScore >= 200) {
                if (beatInMeasure === 3 && measureNum % 2 === 0) {
                    playTensionBlip(nextBeatTime);
                    upcomingFlashes.push({ time: nextBeatTime, type: 'fx' });
                }
            }

            beat.count++;
            nextBeatTime += BEAT_INTERVAL;
        }

        requestAnimationFrame(scheduleBeat);
    }

    function playKick(time) {
        // Sub-bass layer (deep thump)
        const sub = audioCtx.createOscillator();
        const subGain = audioCtx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(60, time);
        sub.frequency.exponentialRampToValueAtTime(25, time + 0.25);
        subGain.gain.setValueAtTime(0.9, time);
        subGain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
        sub.connect(subGain);
        subGain.connect(masterGain);
        sub.start(time);
        sub.stop(time + 0.4);

        // Mid-kick (punch)
        const mid = audioCtx.createOscillator();
        const midGain = audioCtx.createGain();
        mid.type = 'sine';
        mid.frequency.setValueAtTime(180, time);
        mid.frequency.exponentialRampToValueAtTime(30, time + 0.08);
        midGain.gain.setValueAtTime(0.8, time);
        midGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
        mid.connect(midGain);
        midGain.connect(masterGain);
        mid.start(time);
        mid.stop(time + 0.2);

        // Click transient (attack)
        const click = audioCtx.createOscillator();
        const clickGain = audioCtx.createGain();
        click.type = 'square';
        click.frequency.setValueAtTime(1200, time);
        click.frequency.exponentialRampToValueAtTime(200, time + 0.015);
        clickGain.gain.setValueAtTime(0.3, time);
        clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
        click.connect(clickGain);
        clickGain.connect(masterGain);
        click.start(time);
        click.stop(time + 0.03);
    }

    function playEnergeticSnare(time) {
        // Punchy body (sine pitch bend)
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(250, time);
        osc.frequency.exponentialRampToValueAtTime(50, time + 0.1);
        oscGain.gain.setValueAtTime(0.7, time);
        oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start(time);
        osc.stop(time + 0.1);

        // Noise tail
        const bufferSize = audioCtx.sampleRate * 0.2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
        }
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1500;
        
        source.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        source.start(time);
    }

    function playHiHat(time, vol) {
        // Tighter hi-hat envelope
        const bufferSize = audioCtx.sampleRate * 0.05;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
        }
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(vol, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 7000;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        source.start(time);
    }

    function playEnergeticBass(time, freq) {
        // Plucky, driving acid bass synth
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, time);
        
        // Fast decay envelope for punchy 16th notes
        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
        
        // Envelope filter
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, time);
        filter.frequency.exponentialRampToValueAtTime(100, time + 0.1);
        filter.Q.value = 5; // Resonance for acid sound
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        osc.start(time);
        osc.stop(time + 0.2);
    }

    function playSynthPad(time) {
        const freqs = [220, 277.18, 329.63]; // A3, C#4, E4 (A minor)
        freqs.forEach(f => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = f;
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.06, time + 1);
            gain.gain.setValueAtTime(0.06, time + BEAT_INTERVAL * 6);
            gain.gain.linearRampToValueAtTime(0, time + BEAT_INTERVAL * 8);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(time);
            osc.stop(time + BEAT_INTERVAL * 8);
        });
    }

    function playTensionBlip(time) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, time);
        osc.frequency.exponentialRampToValueAtTime(440, time + 0.1);
        gain.gain.setValueAtTime(0.08, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(time);
        osc.stop(time + 0.2);
    }

    function playPerc(time, freq) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.2, time + 0.1);
        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(time);
        osc.stop(time + 0.15);
    }

    function playArp(time, freq) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, time);
        filter.frequency.exponentialRampToValueAtTime(300, time + 0.1);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        osc.start(time);
        osc.stop(time + 0.15);
    }

    function playLead(time, freq) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.2, time + 0.05); // soft attack
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
        
        // Chorus effect with delay (simple)
        const delay = audioCtx.createDelay();
        delay.delayTime.value = 0.02;
        
        osc.connect(gain);
        gain.connect(masterGain);
        gain.connect(delay);
        delay.connect(masterGain);
        
        osc.start(time);
        osc.stop(time + 0.4);
    }

    function playCrash(time) {
        const bufferSize = audioCtx.sampleRate * 1.5;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
        }
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 1.5);
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 4000;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        source.start(time);
    }

    function updateBeat() {
        if (!audioCtx || !beat.active) return;
        const now = audioCtx.currentTime;
        const beatDuration = BEAT_INTERVAL;
        beat.phase = (now % beatDuration) / beatDuration;
        beat.current = Math.floor(beat.count) % 4;
        beat.measure = Math.floor(beat.count / 4);
        beat.time = now;
        beat.onBeat = beat.phase < 0.05;

        // Visual ring timing
        if (beat.phase < 0.05) {
             lastBeatTime = now;
        }

        // Process flashes exactly when they are scheduled to play
        for (let i = upcomingFlashes.length - 1; i >= 0; i--) {
            if (now >= upcomingFlashes[i].time) {
                activeBeats[upcomingFlashes[i].type] = 1.0;
                upcomingFlashes.splice(i, 1);
            }
        }
        
        // Decay active visual beats
        for (let key in activeBeats) {
            activeBeats[key] = Math.max(0, activeBeats[key] - 0.08); // decay rate
        }

        // Toggle doors every 8 beats (when synth pad restarts)
        const doorCycle = Math.floor(beat.count / 8);
        if (doorCycle !== lastDoorBeat) {
            lastDoorBeat = doorCycle;
            doorsOpen = !doorsOpen;
        }
    }

    // ---- Utility: Cart -> Iso ----
    function cartToIso(cx, cy) {
        return {
            x: (cx - cy) * HALF_W,
            y: (cx + cy) * HALF_H,
        };
    }

    function isWalkable(col, row) {
        if (col < 0 || col >= MAP_COLS || row < 0 || row >= MAP_ROWS) return false;
        const tile = MAP[row][col];
        if (tile === TILE.DOOR) return doorsOpen;
        return WALKABLE.includes(tile);
    }

    // ---- Initialize ----
    function init() {
        resize();
        initParticles();

        // Player start position
        player.x = 1.5; player.y = 1.5;

        // Events
        window.addEventListener('resize', resize);
        canvas.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('keydown', (e) => {
            onKeyDown(e);
            initMusic(); // Start music on first interaction
        });
        window.addEventListener('keyup', onKeyUp);
        
        // Mouse click for rhythm combo!
        canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Left click only
                onClick(e);
                initMusic();
            } else if (e.button === 2) { // Right click
                onRightClick(e);
                initMusic();
            }
        });
        
        canvas.addEventListener('contextmenu', e => e.preventDefault()); // Prevent normal right click menu

        // Touch events
        canvas.addEventListener('touchstart', (e) => {
            onTouchStart(e);
            initMusic();
        }, { passive: false });
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd);

        renderLeaderboardEntries();
        updateLeaderboardUI();
        loadLeaderboard();
        requestAnimationFrame(gameLoop);
    }

    function resize() {
        canvasW = window.innerWidth;
        canvasH = window.innerHeight;
        canvas.width = canvasW;
        canvas.height = canvasH;

        // Minimap
        minimapCanvas.width = 180;
        minimapCanvas.height = 180;
    }

    // ---- Particle System (Dust / Atmosphere) ----
    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle());
        }
    }

    function createParticle() {
        return {
            x: Math.random() * 2000 - 500,
            y: Math.random() * 1500 - 300,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.3 + 0.05,
            opacity: Math.random() * 0.3 + 0.1,
            angle: Math.random() * Math.PI * 2,
        };
    }

    function updateParticles(dt) {
        particles.forEach(p => {
            if (p.isScreenSpace) {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.05;
                if (p.life <= 0) p.dead = true;
            } else {
                p.x += Math.cos(p.angle) * p.speed;
                p.y += Math.sin(p.angle) * p.speed;
                p.angle += (Math.random() - 0.5) * 0.02;
                p.opacity += (Math.random() - 0.5) * 0.005;
                p.opacity = Math.max(0.05, Math.min(0.35, p.opacity));

                // Wrap around
                if (p.x < -600) p.x = 2000;
                if (p.x > 2200) p.x = -400;
                if (p.y < -400) p.y = 1600;
                if (p.y > 1700) p.y = -300;
            }
        });
        particles = particles.filter(p => !p.dead);
    }

    // ---- Input Handling ----
    const GAME_KEYS = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];

    function onWheel(e) {
        e.preventDefault();
        const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
        camera.targetZoom = Math.max(camera.minZoom, Math.min(camera.maxZoom, camera.targetZoom + zoomDelta));
    }

    function onKeyDown(e) {
        const key = e.key.toLowerCase();
        keysDown[key] = true;

        // ESC toggles pause menu
        if (e.key === 'Escape') {
            paused = !paused;
            e.preventDefault();
            return;
        }

        // Volume control while paused
        if (paused) {
            if (key === 'd' || key === 'arrowright') {
                menuVolume = Math.min(1, menuVolume + MENU_VOL_STEP);
                if (masterGain) masterGain.gain.value = menuVolume;
                e.preventDefault();
            } else if (key === 'a' || key === 'arrowleft') {
                menuVolume = Math.max(0, menuVolume - MENU_VOL_STEP);
                if (masterGain) masterGain.gain.value = menuVolume;
                e.preventDefault();
            }
            return;
        }

        if (GAME_KEYS.includes(key)) {
            e.preventDefault();
        }
    }

    function onKeyUp(e) {
        const key = e.key.toLowerCase();
        keysDown[key] = false;
    }

    // Clear all keys on window blur (prevents stuck keys)
    window.addEventListener('blur', () => {
        for (const key in keysDown) keysDown[key] = false;
    });

    leaderboardElements.submitButton?.addEventListener('click', () => {
        submitCurrentScore();
    });

    leaderboardElements.refreshButton?.addEventListener('click', () => {
        loadLeaderboard();
    });

    leaderboardElements.playerName?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitCurrentScore();
        }
    });

    let mouseX = 0;
    let mouseY = 0;

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    // Handle rhythmic clicking and shooting
    function onClick(e) {
        if (paused || gameOver || escapeComplete || !audioCtx) return;

        // Player just clicked - Check rhythm absolute time!
        const now = audioCtx.currentTime;
        const beatInterval = BEAT_INTERVAL;
        
        // Find the distance to the closest beat (either the one that just passed, or the upcoming one)
        const timeSinceLastBeat = (now - lastBeatTime) % beatInterval;
        let distanceFromBeat = timeSinceLastBeat;
        
        // If we are closer to the NEXT beat than the LAST beat, use that distance
        if (timeSinceLastBeat > beatInterval / 2) {
            distanceFromBeat = beatInterval - timeSinceLastBeat;
        }

        // 0.2 seconds total tolerance means +/- 0.1 seconds from the exact beat
        const TOLERANCE = 0.1; 

        if (distanceFromBeat <= TOLERANCE) {
            // Perfect!
            comboScore = Math.min(200, comboScore + 8);
            showFloatingText(player.x, player.y, 'PERFECT!', '100, 255, 100');
            
            // Visual feedback on click position
            const rect = canvas.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;
            
            // Add a localized sparkle where clicked
            for (let i = 0; i < 5; i++) {
                sparkles.push({
                    x: cx + (Math.random()-0.5)*20,
                    y: cy + (Math.random()-0.5)*20,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    life: 1.0,
                    size: Math.random() * 3 + 1,
                    color: '100,255,150',
                    isScreenSpace: true // special flag for UI sparkles
                });
            }

        } else {
            // Miss!
            comboScore = Math.max(0, comboScore - 4);
            showFloatingText(player.x, player.y, 'MISS...', '255, 100, 100');
        }
    }

    function onRightClick(e) {
        e.preventDefault(); // Prevent context menu
        if (paused || gameOver || escapeComplete) return;

        // Calculate angle towards mouse
        // We need to convert screen mouse coords back to iso/cartesian angle relative to player
        const cx = canvasW / 2;
        const cy = canvasH / 2;
        
        // Mouse direction in screen space from center of screen (player)
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        
        // Reverse the cartToIso transform roughly to find grid angle
        // isoX = (cartX - cartY) * HALF_W
        // isoY = (cartX + cartY) * HALF_H
        const cartDx = (dx / HALF_W + dy / HALF_H) / 2;
        const cartDy = (dy / HALF_H - dx / HALF_W) / 2;
        
        const shootAngle = Math.atan2(cartDy, cartDx);
        
        // Face player towards shooting angle
        player.angle = shootAngle;

        const comboLevel = comboScore / 200;

        // Shoot basic level 1 laser
        projectiles.push({
            x: player.x,
            y: player.y,
            vx: Math.cos(shootAngle) * 0.15,
            vy: Math.sin(shootAngle) * 0.15,
            life: 60, // frames
            damage: 5, // minimum damage
            level: comboLevel
        });
        
        // Simple shoot sound
        if (audioCtx) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(masterGain.gain.value * 0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        }
    }

    // Touch D-pad state
    let touchDir = null;
    let lastTouchDist = 0;
    function onTouchStart(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            updateTouchDir(e.touches[0]);
        } else if (e.touches.length === 2) {
            lastTouchDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    }

    function onTouchMove(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            updateTouchDir(e.touches[0]);
        } else if (e.touches.length === 2) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const delta = (dist - lastTouchDist) * 0.005;
            camera.targetZoom = Math.max(camera.minZoom, Math.min(camera.maxZoom, camera.targetZoom + delta));
            lastTouchDist = dist;
        }
    }

    function onTouchEnd(e) {
        touchDir = null;
    }

    function updateTouchDir(touch) {
        const cx = canvasW / 2;
        const cy = canvasH / 2;
        const dx = touch.clientX - cx;
        const dy = touch.clientY - cy;
        if (Math.abs(dx) > Math.abs(dy)) {
            touchDir = dx > 0 ? 'd' : 'a';
        } else {
            touchDir = dy > 0 ? 's' : 'w';
        }
    }

    // ---- Player Movement & Logic (360° free movement, isometric) ----
    function updatePlayer(timestamp) {
        // Build movement vector mapped to isometric screen directions
        // In isometric: screen-up = grid(-1,-1), screen-down = grid(+1,+1)
        //               screen-left = grid(-1,+1), screen-right = grid(+1,-1)
        let dx = 0, dy = 0;
        let isInputting = false;

        const w = keysDown['w'] || keysDown['arrowup'] || touchDir === 'w';
        const s = keysDown['s'] || keysDown['arrowdown'] || touchDir === 's';
        const a = keysDown['a'] || keysDown['arrowleft'] || touchDir === 'a';
        const d = keysDown['d'] || keysDown['arrowright'] || touchDir === 'd';

        if (w || s || a || d) isInputting = true;

        // Map to isometric grid movement
        if (w) { dx -= 1; dy -= 1; } // screen up
        if (s) { dx += 1; dy += 1; } // screen down
        if (a) { dx -= 1; dy += 1; } // screen left
        if (d) { dx += 1; dy -= 1; } // screen right

        // Normalize diagonal movement so it's not faster
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len > 0) {
            dx = (dx / len) * player.speed;
            dy = (dy / len) * player.speed;
            player.angle = Math.atan2(dy, dx);
            player.moving = true;
            player.stepAnim += 0.15;
            // Combo points are now awarded exactly on key press, not continuously while moving
        } else {
            player.moving = false;
            // Decay combo slowly when stopped
            comboScore = Math.max(0, comboScore - 0.1);
        }

        if (len === 0) return;

        // Try X movement
        const newX = player.x + dx;
        if (canMoveTo(newX, player.y)) {
            player.x = newX;
        }

        // Try Y movement
        const newY = player.y + dy;
        if (canMoveTo(player.x, newY)) {
            player.y = newY;
        }

        // Check loot collection at current position
        checkLootCollection(player.x, player.y);
        checkExitCondition();
    }

    // Check if player can move to position (sub-tile collision)
    function canMoveTo(px, py) {
        // Check all 4 corners of the player hitbox against walls
        const r = PLAYER_RADIUS;
        const corners = [
            { x: px - r, y: py - r },
            { x: px + r, y: py - r },
            { x: px - r, y: py + r },
            { x: px + r, y: py + r },
        ];
        for (const c of corners) {
            const col = Math.floor(c.x);
            const row = Math.floor(c.y);
            if (!isWalkable(col, row)) return false;
        }
        return true;
    }

    function updateProjectiles() {
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const p = projectiles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.life--;

            // Check walls
            const col = Math.floor(p.x);
            const row = Math.floor(p.y);
            if (!isWalkable(col, row)) {
                // Hit wall spawn sparks
                for(let s=0; s<3; s++) {
                    sparkles.push({
                        x: p.x, y: p.y,
                        vx: (Math.random()-0.5)*0.2, vy: (Math.random()-0.5)*0.2,
                        life: 1.0, size: 1.5, color: '100, 200, 255'
                    });
                }
                projectiles.splice(i, 1);
                continue;
            }

            if (p.life <= 0) {
                projectiles.splice(i, 1);
            }
        }
    }

    function showFloatingText(cx, cy, text, colorStr) {
        const iso = cartToIso(cx, cy);
        floatingTexts.push({
            x: iso.x,
            y: iso.y - 30, // Start slightly above player
            text: text,
            life: 1.0,
            colorStr: colorStr || '255, 255, 255'
        });
    }

    function checkLootCollection(px, py) {
        for (const item of lootItems) {
            if (item.collected) continue;
            // Distance from player center to item center
            const itemCX = item.col + 0.5;
            const itemCY = item.row + 0.5;
            const dist = Math.sqrt((px - itemCX) ** 2 + (py - itemCY) ** 2);
            if (dist < LOOT_PICKUP_RADIUS) {
                item.collected = true;
                collectedCount++;
                totalValue += LOOT_TYPES[item.type].value;
                updateLeaderboardUI();

                // Create sparkles
                const iso = cartToIso(item.col, item.row);
                for (let i = 0; i < 12; i++) {
                    sparkles.push({
                        x: iso.x,
                        y: iso.y + HALF_H,
                        vx: (Math.random() - 0.5) * 4,
                        vy: -Math.random() * 3 - 1,
                        life: 1.0,
                        size: Math.random() * 3 + 1,
                        color: item.type === 'DIAMOND' ? '150,200,255' :
                               item.type === 'RUBY' ? '255,80,80' :
                               item.type === 'GOLD' ? '255,220,80' :
                               item.type === 'PAINTING' ? '200,150,255' :
                               '255,180,100',
                    });
                }

                floatingTexts.push({
                    x: iso.x,
                    y: iso.y,
                    text: `+${LOOT_TYPES[item.type].value} ${LOOT_TYPES[item.type].emoji}`,
                    life: 1.0,
                });
            }
        }
    }

    // ---- Guard AI ----
    function updateGuards() {
        if (gameOver) return;

        for (const g of guards) {
            const distToPlayer = Math.sqrt((g.x - player.x) ** 2 + (g.y - player.y) ** 2);

            // State transitions
            if (g.state === 'patrol' && distToPlayer < GUARD_DETECT_RANGE) {
                // Check line of sight (simple: no wall between guard and player)
                if (hasLineOfSight(g.x, g.y, player.x, player.y)) {
                    g.state = 'chase';
                    g.alertTimer = 180; // frames of chase memory
                }
            } else if (g.state === 'chase') {
                g.alertTimer--;
                if (distToPlayer > GUARD_DETECT_RANGE * 1.5 || g.alertTimer <= 0) {
                    g.state = 'return';
                }
                // Re-detect if in range
                if (distToPlayer < GUARD_DETECT_RANGE && hasLineOfSight(g.x, g.y, player.x, player.y)) {
                    g.alertTimer = 180;
                }
            } else if (g.state === 'return') {
                // Return to nearest waypoint
                const wp = g.waypoints[g.waypointIndex];
                const distToWp = Math.sqrt((g.x - wp.x) ** 2 + (g.y - wp.y) ** 2);
                if (distToWp < 0.3) {
                    g.state = 'patrol';
                }
            }

            // Movement
            let targetX, targetY;
            if (g.state === 'chase') {
                targetX = player.x;
                targetY = player.y;
                g.speed = GUARD_CHASE_SPEED;
            } else if (g.state === 'return') {
                const wp = g.waypoints[g.waypointIndex];
                targetX = wp.x;
                targetY = wp.y;
                g.speed = GUARD_PATROL_SPEED;
            } else {
                // Patrol
                const wp = g.waypoints[g.waypointIndex];
                targetX = wp.x;
                targetY = wp.y;
                g.speed = GUARD_PATROL_SPEED;
                const distToWp = Math.sqrt((g.x - wp.x) ** 2 + (g.y - wp.y) ** 2);
                if (distToWp < 0.2) {
                    g.waypointIndex = (g.waypointIndex + 1) % g.waypoints.length;
                }
            }

            // Move toward target
            const mdx = targetX - g.x;
            const mdy = targetY - g.y;
            const mlen = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mlen > 0.05) {
                const moveX = (mdx / mlen) * g.speed;
                const moveY = (mdy / mlen) * g.speed;
                g.angle = Math.atan2(mdy, mdx);
                g.stepAnim += 0.1;

                // Try movement with collision
                const newGX = g.x + moveX;
                if (guardCanMoveTo(newGX, g.y)) g.x = newGX;
                const newGY = g.y + moveY;
                if (guardCanMoveTo(g.x, newGY)) g.y = newGY;
            }

            // Check if caught player
            if (distToPlayer < GUARD_CATCH_RANGE) {
                applyPlayerDamage(GUARD_CONTACT_DAMAGE);
                break;
            }
        }
    }

    function guardCanMoveTo(px, py) {
        const r = 0.15;
        const corners = [
            { x: px - r, y: py - r },
            { x: px + r, y: py - r },
            { x: px - r, y: py + r },
            { x: px + r, y: py + r },
        ];
        for (const c of corners) {
            const col = Math.floor(c.x);
            const row = Math.floor(c.y);
            if (col < 0 || col >= MAP_COLS || row < 0 || row >= MAP_ROWS) return false;
            const tile = MAP[row][col];
            // Guards can walk on floor tiles but not through walls/crates
            if (![TILE.FLOOR, TILE.DOOR, TILE.LIGHT, TILE.CHECKPOINT, TILE.EXIT].includes(tile)) return false;
        }
        return true;
    }

    function hasLineOfSight(x1, y1, x2, y2) {
        // Raycast in small steps
        const dx = x2 - x1;
        const dy = y2 - y1;
        const steps = Math.ceil(Math.sqrt(dx * dx + dy * dy) * 3);
        for (let i = 1; i < steps; i++) {
            const t = i / steps;
            const cx = x1 + dx * t;
            const cy = y1 + dy * t;
            const col = Math.floor(cx);
            const row = Math.floor(cy);
            if (col < 0 || col >= MAP_COLS || row < 0 || row >= MAP_ROWS) return false;
            const tile = MAP[row][col];
            if (tile === TILE.WALL || tile === TILE.CRATE || tile === TILE.PILLAR) return false;
        }
        return true;
    }

    function resetGame() {
        player.x = 1.5;
        player.y = 1.5;
        gameOver = false;
        escapeComplete = false;
        gameOverTimer = 0;
        playerHealth = MAX_PLAYER_HEALTH;
        collectedCount = 0;
        totalValue = 0;
        comboScore = 0;
        projectiles = [];
        sparkles = [];
        floatingTexts = [];
        upcomingFlashes = [];
        activeBeats = { pad: 0, hat: 0, kick: 0, bass: 0, snare: 0, perc: 0, arp: 0, lead: 0, crash: 0, fx: 0 };
        runSubmitted = false;
        touchDir = null;
        lootItems.forEach((item) => {
            item.collected = false;
        });
        // Reset guards
        guards.forEach(g => {
            g.x = g.waypoints[0].x;
            g.y = g.waypoints[0].y;
            g.waypointIndex = 0;
            g.state = 'patrol';
            g.alertTimer = 0;
        });
        updateLeaderboardUI();
        setLeaderboardFeedback('Fresh run ready. Steal smart and escape green.', false);
    }

    // Camera follows player
    function updateCamera() {
        const playerIso = cartToIso(player.x, player.y);
        const targetCamX = -playerIso.x + canvasW / 2;
        const targetCamY = -playerIso.y + canvasH / 2 - 50;
        camera.x += (targetCamX - camera.x) * 0.08;
        camera.y += (targetCamY - camera.y) * 0.08;
    }

    function updateSparkles() {
        for (let i = sparkles.length - 1; i >= 0; i--) {
            const s = sparkles[i];
            s.x += s.vx;
            s.y += s.vy;
            s.vy += 0.1;
            s.life -= 0.025;
            if (s.life <= 0) sparkles.splice(i, 1);
        }
        for (let i = floatingTexts.length - 1; i >= 0; i--) {
            const ft = floatingTexts[i];
            ft.y -= 0.8;
            ft.life -= 0.015;
            if (ft.life <= 0) floatingTexts.splice(i, 1);
        }
    }

    // ---- Drawing Functions ----

    // Draw isometric diamond (tile top face)
    function drawTileTop(x, y, color) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + HALF_W, y + HALF_H);
        ctx.lineTo(x, y + TILE_H);
        ctx.lineTo(x - HALF_W, y + HALF_H);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    // Draw wall block (top + left face + right face)
    function drawWallBlock(x, y, colors, height) {
        const h = height || WALL_HEIGHT;

        // Left face
        ctx.beginPath();
        ctx.moveTo(x - HALF_W, y + HALF_H);
        ctx.lineTo(x, y + TILE_H);
        ctx.lineTo(x, y + TILE_H - h);
        ctx.lineTo(x - HALF_W, y + HALF_H - h);
        ctx.closePath();
        ctx.fillStyle = colors.left;
        ctx.fill();

        // Right face
        ctx.beginPath();
        ctx.moveTo(x + HALF_W, y + HALF_H);
        ctx.lineTo(x, y + TILE_H);
        ctx.lineTo(x, y + TILE_H - h);
        ctx.lineTo(x + HALF_W, y + HALF_H - h);
        ctx.closePath();
        ctx.fillStyle = colors.right;
        ctx.fill();

        // Top face (elevated)
        ctx.beginPath();
        ctx.moveTo(x, y - h);
        ctx.lineTo(x + HALF_W, y + HALF_H - h);
        ctx.lineTo(x, y + TILE_H - h);
        ctx.lineTo(x - HALF_W, y + HALF_H - h);
        ctx.closePath();
        ctx.fillStyle = colors.top;
        ctx.fill();

        // Subtle edge highlights
        ctx.beginPath();
        ctx.moveTo(x, y - h);
        ctx.lineTo(x + HALF_W, y + HALF_H - h);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y - h);
        ctx.lineTo(x - HALF_W, y + HALF_H - h);
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }

    // Draw crate
    function drawCrate(x, y) {
        const colors = COLORS[TILE.CRATE];
        drawWallBlock(x, y, colors, 14);

        // Cross pattern on top
        const h = 14;
        ctx.strokeStyle = 'rgba(120, 90, 40, 0.5)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(x - HALF_W * 0.4, y + HALF_H * 0.6 - h);
        ctx.lineTo(x + HALF_W * 0.4, y + HALF_H * 1.4 - h);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + HALF_W * 0.4, y + HALF_H * 0.6 - h);
        ctx.lineTo(x - HALF_W * 0.4, y + HALF_H * 1.4 - h);
        ctx.stroke();
    }

    // Draw pillar
    function drawPillar(x, y) {
        const colors = COLORS[TILE.PILLAR];
        drawWallBlock(x, y, colors, 28);

        // Decorative top
        ctx.beginPath();
        ctx.moveTo(x, y - 30);
        ctx.lineTo(x + HALF_W * 0.6, y + HALF_H * 0.6 - 30);
        ctx.lineTo(x, y + TILE_H * 0.6 - 30);
        ctx.lineTo(x - HALF_W * 0.6, y + HALF_H * 0.6 - 30);
        ctx.closePath();
        ctx.fillStyle = '#5a5a7a';
        ctx.fill();
    }

    // Draw door
    function drawDoor(x, y) {
        // Floor underneath
        drawTileTop(x, y, COLORS[TILE.FLOOR].top);

        // Door frame (thinner wall)
        const doorColors = COLORS[TILE.DOOR];

        // Left door post
        ctx.beginPath();
        ctx.moveTo(x - HALF_W, y + HALF_H);
        ctx.lineTo(x - HALF_W * 0.6, y + HALF_H * 0.8);
        ctx.lineTo(x - HALF_W * 0.6, y + HALF_H * 0.8 - 18);
        ctx.lineTo(x - HALF_W, y + HALF_H - 18);
        ctx.closePath();
        ctx.fillStyle = doorColors.left;
        ctx.fill();

        // Right door post
        ctx.beginPath();
        ctx.moveTo(x + HALF_W, y + HALF_H);
        ctx.lineTo(x + HALF_W * 0.6, y + HALF_H * 0.8);
        ctx.lineTo(x + HALF_W * 0.6, y + HALF_H * 0.8 - 18);
        ctx.lineTo(x + HALF_W, y + HALF_H - 18);
        ctx.closePath();
        ctx.fillStyle = doorColors.right;
        ctx.fill();

        // Door arch light
        const pulse = Math.sin(animTime * lightPulseSpeed * 2) * 0.15 + 0.25;
        ctx.beginPath();
        ctx.arc(x, y + HALF_H - 6, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 160, 50, ${pulse})`;
        ctx.fill();
    }

    // Draw checkpoint
    function drawCheckpoint(x, y) {
        drawTileTop(x, y, COLORS[TILE.CHECKPOINT].top);

        // Pulsing red indicator
        const pulse = Math.sin(animTime * lightPulseSpeed * 3) * 0.3 + 0.5;
        const gradient = ctx.createRadialGradient(x, y + HALF_H, 0, x, y + HALF_H, HALF_W * 0.8);
        gradient.addColorStop(0, `rgba(200, 50, 50, ${pulse * 0.4})`);
        gradient.addColorStop(1, 'rgba(200, 50, 50, 0)');

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + HALF_W, y + HALF_H);
        ctx.lineTo(x, y + TILE_H);
        ctx.lineTo(x - HALF_W, y + HALF_H);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    // Draw exit
    function drawExit(x, y) {
        drawTileTop(x, y, COLORS[TILE.EXIT].top);

        // Pulsing green indicator
        const pulse = Math.sin(animTime * lightPulseSpeed * 2.5) * 0.3 + 0.6;
        const gradient = ctx.createRadialGradient(x, y + HALF_H, 0, x, y + HALF_H, HALF_W);
        gradient.addColorStop(0, `rgba(50, 200, 80, ${pulse * 0.5})`);
        gradient.addColorStop(1, 'rgba(50, 200, 80, 0)');

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + HALF_W, y + HALF_H);
        ctx.lineTo(x, y + TILE_H);
        ctx.lineTo(x - HALF_W, y + HALF_H);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Arrow indicator
        ctx.fillStyle = `rgba(50, 200, 80, ${pulse})`;
        ctx.font = '12px Rajdhani';
        ctx.textAlign = 'center';
        ctx.fillText('▲', x, y + HALF_H - 2);
    }

    // Draw light source on floor
    function drawLightFloor(x, y) {
        drawTileTop(x, y, COLORS[TILE.LIGHT].top);

        const pulse = Math.sin(animTime * lightPulseSpeed) * 0.15 + 0.35;
        const gradient = ctx.createRadialGradient(x, y + HALF_H, 0, x, y + HALF_H, HALF_W * 1.5);
        gradient.addColorStop(0, `rgba(180, 160, 100, ${pulse * 0.3})`);
        gradient.addColorStop(0.5, `rgba(120, 110, 70, ${pulse * 0.15})`);
        gradient.addColorStop(1, 'rgba(80, 70, 40, 0)');

        ctx.save();
        ctx.beginPath();
        // extended diamond shape for light spread
        ctx.moveTo(x, y - HALF_H);
        ctx.lineTo(x + TILE_W, y + HALF_H);
        ctx.lineTo(x, y + TILE_H + HALF_H);
        ctx.lineTo(x - TILE_W, y + HALF_H);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
    }

    // Draw beat-synced door
    function drawDoor(x, y) {
        if (doorsOpen) {
            // Open door: green-tinted floor
            drawTileTop(x, y, '#1a2e1a');
            // Green glow
            const glow = Math.sin(animTime * 0.004) * 0.1 + 0.3;
            const grad = ctx.createRadialGradient(x, y + HALF_H, 0, x, y + HALF_H, HALF_W);
            grad.addColorStop(0, `rgba(80, 255, 80, ${glow * 0.3})`);
            grad.addColorStop(1, 'rgba(80, 255, 80, 0)');
            ctx.beginPath();
            ctx.moveTo(x, y); ctx.lineTo(x + HALF_W, y + HALF_H);
            ctx.lineTo(x, y + TILE_H); ctx.lineTo(x - HALF_W, y + HALF_H);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();
        } else {
            // Closed door: yellow barrier wall
            const doorH = 14;
            const pulse = Math.sin(animTime * 0.005) * 0.1 + 0.9;

            // Door top
            ctx.beginPath();
            ctx.moveTo(x, y - doorH);
            ctx.lineTo(x + HALF_W, y + HALF_H - doorH);
            ctx.lineTo(x, y + TILE_H - doorH);
            ctx.lineTo(x - HALF_W, y + HALF_H - doorH);
            ctx.closePath();
            ctx.fillStyle = `rgba(220, 180, 40, ${pulse})`;
            ctx.fill();

            // Door left face
            ctx.beginPath();
            ctx.moveTo(x - HALF_W, y + HALF_H - doorH);
            ctx.lineTo(x, y + TILE_H - doorH);
            ctx.lineTo(x, y + TILE_H);
            ctx.lineTo(x - HALF_W, y + HALF_H);
            ctx.closePath();
            ctx.fillStyle = `rgba(180, 140, 20, ${pulse})`;
            ctx.fill();

            // Door right face
            ctx.beginPath();
            ctx.moveTo(x + HALF_W, y + HALF_H - doorH);
            ctx.lineTo(x, y + TILE_H - doorH);
            ctx.lineTo(x, y + TILE_H);
            ctx.lineTo(x + HALF_W, y + HALF_H);
            ctx.closePath();
            ctx.fillStyle = `rgba(160, 120, 15, ${pulse})`;
            ctx.fill();

            // Warning stripes
            ctx.strokeStyle = `rgba(60, 30, 0, ${pulse * 0.6})`;
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                const stripY = y + HALF_H - doorH + 3 + i * 4;
                ctx.beginPath();
                ctx.moveTo(x - HALF_W + 8, stripY + (i * 2));
                ctx.lineTo(x - 2, stripY + (i * 2) + HALF_H - 4);
                ctx.stroke();
            }

            // Glow effect
            ctx.shadowColor = 'rgba(255, 200, 50, 0.4)';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(x, y - doorH);
            ctx.lineTo(x + HALF_W, y + HALF_H - doorH);
            ctx.lineTo(x, y + TILE_H - doorH);
            ctx.lineTo(x - HALF_W, y + HALF_H - doorH);
            ctx.closePath();
            ctx.strokeStyle = `rgba(255, 220, 80, ${pulse * 0.5})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }

    // Draw vent
    function drawVent(x, y) {
        drawTileTop(x, y, COLORS[TILE.VENT].top);

        // Grate lines
        ctx.strokeStyle = 'rgba(60, 90, 60, 0.5)';
        ctx.lineWidth = 1;
        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.moveTo(x + i * 5 - 5, y + HALF_H + i * 2 - 2);
            ctx.lineTo(x + i * 5 + 5, y + HALF_H + i * 2 + 2);
            ctx.stroke();
        }
    }

    // ---- Draw Loot Items ----
    function drawDiamond(x, y) {
        const bob = Math.sin(animTime * 0.003) * 3;
        const glow = Math.sin(animTime * 0.004) * 0.2 + 0.5;
        const cy = y + HALF_H - 12 + bob;

        // Glow on floor
        const floorGlow = ctx.createRadialGradient(x, y + HALF_H, 0, x, y + HALF_H, HALF_W * 0.8);
        floorGlow.addColorStop(0, `rgba(100, 180, 255, ${glow * 0.25})`);
        floorGlow.addColorStop(1, 'rgba(100, 180, 255, 0)');
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x + HALF_W, y + HALF_H);
        ctx.lineTo(x, y + TILE_H); ctx.lineTo(x - HALF_W, y + HALF_H);
        ctx.closePath();
        ctx.fillStyle = floorGlow;
        ctx.fill();

        // Diamond shape
        ctx.beginPath();
        ctx.moveTo(x, cy - 10);       // top
        ctx.lineTo(x + 7, cy - 3);    // top-right
        ctx.lineTo(x + 5, cy + 4);    // bottom-right
        ctx.lineTo(x, cy + 8);        // bottom
        ctx.lineTo(x - 5, cy + 4);    // bottom-left
        ctx.lineTo(x - 7, cy - 3);    // top-left
        ctx.closePath();

        // Gradient fill
        const dGrad = ctx.createLinearGradient(x - 7, cy - 10, x + 7, cy + 8);
        dGrad.addColorStop(0, '#a0d4ff');
        dGrad.addColorStop(0.3, '#60c0ff');
        dGrad.addColorStop(0.6, '#40a0e0');
        dGrad.addColorStop(1, '#80d0ff');
        ctx.fillStyle = dGrad;
        ctx.fill();
        ctx.strokeStyle = `rgba(200, 230, 255, ${glow})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner facet line
        ctx.beginPath();
        ctx.moveTo(x - 7, cy - 3);
        ctx.lineTo(x, cy);
        ctx.lineTo(x + 7, cy - 3);
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Shine sparkle
        ctx.beginPath();
        ctx.arc(x - 3, cy - 6, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${glow + 0.2})`;
        ctx.fill();
    }

    function drawVase(x, y) {
        const bob = Math.sin(animTime * 0.002 + 1) * 2;
        const glow = Math.sin(animTime * 0.003 + 1) * 0.15 + 0.4;
        const cy = y + HALF_H + bob;

        // Glow on floor
        const floorGlow = ctx.createRadialGradient(x, y + HALF_H, 0, x, y + HALF_H, HALF_W * 0.6);
        floorGlow.addColorStop(0, `rgba(255, 180, 100, ${glow * 0.2})`);
        floorGlow.addColorStop(1, 'rgba(255, 180, 100, 0)');
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x + HALF_W, y + HALF_H);
        ctx.lineTo(x, y + TILE_H); ctx.lineTo(x - HALF_W, y + HALF_H);
        ctx.closePath();
        ctx.fillStyle = floorGlow;
        ctx.fill();

        // Vase body
        ctx.beginPath();
        ctx.moveTo(x - 3, cy - 18);  // rim left
        ctx.lineTo(x + 3, cy - 18);  // rim right
        ctx.lineTo(x + 2, cy - 15);  // neck right
        ctx.lineTo(x + 6, cy - 8);   // shoulder right
        ctx.quadraticCurveTo(x + 8, cy, x + 5, cy + 4);  // belly right
        ctx.lineTo(x + 4, cy + 6);   // base right
        ctx.lineTo(x - 4, cy + 6);   // base left
        ctx.lineTo(x - 5, cy + 4);   // belly left
        ctx.quadraticCurveTo(x - 8, cy, x - 6, cy - 8);  // shoulder left
        ctx.lineTo(x - 2, cy - 15);  // neck left
        ctx.closePath();

        const vGrad = ctx.createLinearGradient(x - 8, cy - 18, x + 8, cy + 6);
        vGrad.addColorStop(0, '#c8a060');
        vGrad.addColorStop(0.4, '#a07838');
        vGrad.addColorStop(0.7, '#8a6428');
        vGrad.addColorStop(1, '#b89050');
        ctx.fillStyle = vGrad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(200, 170, 100, 0.6)';
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // Decorative band
        ctx.beginPath();
        ctx.moveTo(x - 6, cy - 6);
        ctx.lineTo(x + 6, cy - 6);
        ctx.strokeStyle = 'rgba(255, 220, 150, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Highlight
        ctx.beginPath();
        ctx.moveTo(x - 1, cy - 16);
        ctx.lineTo(x + 1, cy - 16);
        ctx.lineTo(x + 4, cy - 4);
        ctx.lineTo(x + 2, cy - 4);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255,255,220,0.15)';
        ctx.fill();
    }

    function drawGold(x, y) {
        const bob = Math.sin(animTime * 0.0025 + 2) * 2;
        const glow = Math.sin(animTime * 0.003 + 2) * 0.2 + 0.5;
        const cy = y + HALF_H + bob;

        // Glow on floor
        const floorGlow = ctx.createRadialGradient(x, y + HALF_H, 0, x, y + HALF_H, HALF_W * 0.7);
        floorGlow.addColorStop(0, `rgba(255, 200, 50, ${glow * 0.2})`);
        floorGlow.addColorStop(1, 'rgba(255, 200, 50, 0)');
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x + HALF_W, y + HALF_H);
        ctx.lineTo(x, y + TILE_H); ctx.lineTo(x - HALF_W, y + HALF_H);
        ctx.closePath();
        ctx.fillStyle = floorGlow;
        ctx.fill();

        // Gold bar (izometrik)
        // Top face
        ctx.beginPath();
        ctx.moveTo(x, cy - 6);
        ctx.lineTo(x + 8, cy - 2);
        ctx.lineTo(x, cy + 2);
        ctx.lineTo(x - 8, cy - 2);
        ctx.closePath();
        ctx.fillStyle = '#ffd700';
        ctx.fill();

        // Left face
        ctx.beginPath();
        ctx.moveTo(x - 8, cy - 2);
        ctx.lineTo(x, cy + 2);
        ctx.lineTo(x, cy + 6);
        ctx.lineTo(x - 8, cy + 2);
        ctx.closePath();
        ctx.fillStyle = '#c4a200';
        ctx.fill();

        // Right face
        ctx.beginPath();
        ctx.moveTo(x + 8, cy - 2);
        ctx.lineTo(x, cy + 2);
        ctx.lineTo(x, cy + 6);
        ctx.lineTo(x + 8, cy + 2);
        ctx.closePath();
        ctx.fillStyle = '#dab800';
        ctx.fill();

        // Shine
        ctx.beginPath();
        ctx.arc(x - 2, cy - 4, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,200,${glow + 0.2})`;
        ctx.fill();

        // Small coins stacked
        for (let i = 0; i < 3; i++) {
            const cx2 = x + 3 + i * 2;
            const cy2 = cy - 8 - i * 2;
            ctx.beginPath();
            ctx.ellipse(cx2, cy2, 3, 1.5, 0, 0, Math.PI * 2);
            ctx.fillStyle = i === 2 ? '#ffe44d' : '#dab800';
            ctx.fill();
            ctx.strokeStyle = 'rgba(180,140,0,0.5)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    }

    function drawRuby(x, y) {
        const bob = Math.sin(animTime * 0.0035 + 3) * 3;
        const glow = Math.sin(animTime * 0.004 + 3) * 0.2 + 0.5;
        const cy = y + HALF_H - 10 + bob;

        // Glow on floor
        const floorGlow = ctx.createRadialGradient(x, y + HALF_H, 0, x, y + HALF_H, HALF_W * 0.7);
        floorGlow.addColorStop(0, `rgba(255, 50, 80, ${glow * 0.25})`);
        floorGlow.addColorStop(1, 'rgba(255, 50, 80, 0)');
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x + HALF_W, y + HALF_H);
        ctx.lineTo(x, y + TILE_H); ctx.lineTo(x - HALF_W, y + HALF_H);
        ctx.closePath();
        ctx.fillStyle = floorGlow;
        ctx.fill();

        // Ruby gem shape (octagon-ish)
        ctx.beginPath();
        ctx.moveTo(x, cy - 8);       // top
        ctx.lineTo(x + 6, cy - 4);   // top-right
        ctx.lineTo(x + 6, cy + 2);   // mid-right
        ctx.lineTo(x, cy + 7);       // bottom
        ctx.lineTo(x - 6, cy + 2);   // mid-left
        ctx.lineTo(x - 6, cy - 4);   // top-left
        ctx.closePath();

        const rGrad = ctx.createLinearGradient(x - 6, cy - 8, x + 6, cy + 7);
        rGrad.addColorStop(0, '#ff4060');
        rGrad.addColorStop(0.4, '#cc2040');
        rGrad.addColorStop(0.7, '#aa1530');
        rGrad.addColorStop(1, '#ff3050');
        ctx.fillStyle = rGrad;
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 150, 150, ${glow})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Inner facets
        ctx.beginPath();
        ctx.moveTo(x - 6, cy - 4);
        ctx.lineTo(x, cy - 1);
        ctx.lineTo(x + 6, cy - 4);
        ctx.strokeStyle = 'rgba(255,200,200,0.3)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, cy - 1);
        ctx.lineTo(x, cy + 7);
        ctx.stroke();

        // Sparkle
        ctx.beginPath();
        ctx.arc(x - 2, cy - 5, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,200,200,${glow + 0.3})`;
        ctx.fill();
    }

    function drawPainting(x, y) {
        const bob = Math.sin(animTime * 0.002 + 4) * 1.5;
        const glow = Math.sin(animTime * 0.003 + 4) * 0.15 + 0.4;
        const cy = y + HALF_H - 14 + bob;

        // Glow on floor
        const floorGlow = ctx.createRadialGradient(x, y + HALF_H, 0, x, y + HALF_H, HALF_W * 0.6);
        floorGlow.addColorStop(0, `rgba(180, 140, 255, ${glow * 0.2})`);
        floorGlow.addColorStop(1, 'rgba(180, 140, 255, 0)');
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x + HALF_W, y + HALF_H);
        ctx.lineTo(x, y + TILE_H); ctx.lineTo(x - HALF_W, y + HALF_H);
        ctx.closePath();
        ctx.fillStyle = floorGlow;
        ctx.fill();

        // Frame
        ctx.fillStyle = '#6a5030';
        ctx.fillRect(x - 9, cy - 2, 18, 16);

        // Canvas (inner)
        const pGrad = ctx.createLinearGradient(x - 7, cy, x + 7, cy + 12);
        pGrad.addColorStop(0, '#2a3a5a');
        pGrad.addColorStop(0.3, '#3a2a4a');
        pGrad.addColorStop(0.6, '#4a3a5a');
        pGrad.addColorStop(1, '#2a2a3a');
        ctx.fillStyle = pGrad;
        ctx.fillRect(x - 7, cy, 14, 12);

        // Simple landscape lines in painting
        ctx.strokeStyle = 'rgba(100, 150, 200, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x - 6, cy + 7);
        ctx.quadraticCurveTo(x - 2, cy + 3, x + 2, cy + 6);
        ctx.quadraticCurveTo(x + 5, cy + 4, x + 6, cy + 5);
        ctx.stroke();

        // Moon in painting
        ctx.beginPath();
        ctx.arc(x + 3, cy + 3, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200, 200, 150, 0.5)';
        ctx.fill();

        // Frame highlight
        ctx.strokeStyle = `rgba(200, 170, 100, ${glow})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 9, cy - 2, 18, 16);
    }

    function drawLootItem(item) {
        if (item.collected) return;

        const iso = cartToIso(item.col, item.row);
        const sx = iso.x;
        const sy = iso.y;

        // Draw floor first
        drawTileTop(sx, sy, COLORS[TILE.FLOOR].top);

        switch (item.type) {
            case 'DIAMOND':  drawDiamond(sx, sy);  break;
            case 'VASE':     drawVase(sx, sy);     break;
            case 'GOLD':     drawGold(sx, sy);     break;
            case 'RUBY':     drawRuby(sx, sy);     break;
            case 'PAINTING': drawPainting(sx, sy); break;
        }
    }

    function renderSparkles() {
        sparkles.forEach(s => {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.color}, ${s.life})`;
            ctx.fill();
        });
    }

    function renderFloatingTexts() {
        floatingTexts.forEach(ft => {
            ctx.save();
            ctx.font = 'bold 14px Rajdhani';
            ctx.textAlign = 'center';
            ctx.fillStyle = `rgba(255, 255, 200, ${ft.life})`;
            ctx.shadowColor = 'rgba(255, 220, 100, 0.8)';
            ctx.shadowBlur = 8;
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.restore();
        });
    }

    // ---- Main Render ----
    function render() {
        // Clear
        ctx.fillStyle = '#06060c';
        ctx.fillRect(0, 0, canvasW, canvasH);

        // Background gradient
        const bgGrad = ctx.createRadialGradient(canvasW / 2, canvasH / 2, 0, canvasW / 2, canvasH / 2, canvasW * 0.7);
        bgGrad.addColorStop(0, '#0e0e1a');
        bgGrad.addColorStop(1, '#04040a');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvasW, canvasH);

        ctx.save();

        // Apply camera transform
        ctx.translate(canvasW / 2, canvasH / 2);
        ctx.scale(camera.zoom, camera.zoom);
        ctx.translate(-canvasW / 2 + camera.x, -canvasH / 2 + camera.y);

        // Draw particles (atmosphere)
        renderParticles();

        // Draw map tiles (painter's algorithm: back to front)
        const playerRow = Math.floor(player.y);
        const playerCol = Math.floor(player.x);
        let playerDrawn = false;

        for (let row = 0; row < MAP_ROWS; row++) {
            for (let col = 0; col < MAP_COLS; col++) {
                const tile = MAP[row][col];
                const iso = cartToIso(col, row);
                const sx = iso.x;
                const sy = iso.y;

                if (tile === TILE.EMPTY) {
                    // Subtle void pattern
                    drawTileTop(sx, sy, COLORS[TILE.EMPTY].top);
                } else {
                    switch (tile) {
                        case TILE.FLOOR:
                            drawTileTop(sx, sy, COLORS[TILE.FLOOR].top);
                            ctx.strokeStyle = 'rgba(100, 100, 180, 0.04)';
                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.moveTo(sx, sy);
                            ctx.lineTo(sx + HALF_W, sy + HALF_H);
                            ctx.lineTo(sx, sy + TILE_H);
                            ctx.lineTo(sx - HALF_W, sy + HALF_H);
                            ctx.closePath();
                            ctx.stroke();
                            break;

                        case TILE.WALL:
                            drawWallBlock(sx, sy, COLORS[TILE.WALL], WALL_HEIGHT);
                            break;

                        case TILE.DOOR:
                            drawDoor(sx, sy);
                            break;

                        case TILE.VENT:
                            drawVent(sx, sy);
                            break;

                        case TILE.LIGHT:
                            drawLightFloor(sx, sy);
                            break;

                        case TILE.CHECKPOINT:
                            drawCheckpoint(sx, sy);
                            break;

                        case TILE.EXIT:
                            drawExit(sx, sy);
                            break;

                        case TILE.CRATE:
                            drawTileTop(sx, sy, COLORS[TILE.FLOOR].top);
                            drawCrate(sx, sy);
                            break;

                        case TILE.PILLAR:
                            drawTileTop(sx, sy, COLORS[TILE.FLOOR].top);
                            drawPillar(sx, sy);
                            break;
                    }

                    // Draw loot items on this tile
                    for (const item of lootItems) {
                        if (!item.collected && item.col === col && item.row === row) {
                            drawLootItem(item);
                        }
                    }
                }

                // Draw player after its own tile (tiles at same row + higher col appear in front)
                if (!playerDrawn && row === playerRow && col === playerCol) {
                    drawPlayer();
                    playerDrawn = true;
                }

                // Draw guards at their tile positions
                for (const g of guards) {
                    const gCol = Math.floor(g.x);
                    const gRow = Math.floor(g.y);
                    if (row === gRow && col === gCol) {
                        drawGuard(g);
                    }
                }
            }
        }

        // Fallback if player hasn't been drawn
        if (!playerDrawn) {
            drawPlayer();
        }

        // Draw basic projectiles
        ctx.save();
        for (const p of projectiles) {
            const iso = cartToIso(p.x, p.y);
            
            ctx.beginPath();
            ctx.arc(iso.x, iso.y - 12, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#ccffff';
            ctx.fill();
            
            // Subtle glow
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 10;
            ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(iso.x, iso.y - 12, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Basic laser line trail
            const tailIso = cartToIso(p.x - p.vx*2, p.y - p.vy*2);
            ctx.beginPath();
            ctx.moveTo(iso.x, iso.y - 12);
            ctx.lineTo(tailIso.x, tailIso.y - 12);
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        ctx.restore();

        // Ambient shadow overlay
        const ambientGrad = ctx.createRadialGradient(
            0, MAP_ROWS * HALF_H, MAP_COLS * HALF_W * 0.3,
            0, MAP_ROWS * HALF_H, MAP_COLS * HALF_W * 1.5
        );
        ambientGrad.addColorStop(0, 'rgba(0,0,0,0)');
        ambientGrad.addColorStop(1, 'rgba(0,0,0,0.4)');
        ctx.fillStyle = ambientGrad;
        ctx.fillRect(-MAP_COLS * TILE_W, -100, MAP_COLS * TILE_W * 3, MAP_ROWS * TILE_H * 2);

        // Render sparkle effects & floating texts
        renderSparkles();
        renderFloatingTexts();

        ctx.restore();

        // Render screen-space UI sparkles (combos)
        renderUISparkles();

        // Render loot counter UI
        renderLootCounter();

        // Render player health UI
        renderHealthBar();

        // Render Music Visualizer
        renderMusicVisualizer();

        // Run-end overlay
        if (escapeComplete) {
            renderVictory();
        } else if (gameOver) {
            renderGameOver();
        }

        // Pause menu overlay
        if (paused) {
            renderPauseMenu();
        }

        // Render minimap
        renderMinimap();

        // Scanline effect (subtle)
        renderScanlines();
    }

    // ---- Draw Player Character ----
    function drawPlayer() {
        const iso = cartToIso(player.x, player.y);
        const px = iso.x;
        const py = iso.y;
        const bob = player.moving ? Math.sin(player.stepAnim * 3) * 2 : 0;
        const baseY = py;

        // Rhythm indicator ring on the ground
        if (audioCtx) {
            const now = audioCtx.currentTime;
            // Time since last beat (0 to 1 progress for BEAT_INTERVAL since hi-hats are now on every main beat)
            const beatInterval = BEAT_INTERVAL;
            const timeSinceBeat = (now - lastBeatTime) % beatInterval;
            
            // Invert progress so the ring shrinks *towards* the beat
            const progress = timeSinceBeat / beatInterval;
            
            // Shrinking ring
            const ringRadius = 15 - progress * 10;
            const ringAlpha = 1.0 - progress;

            ctx.save();
            ctx.beginPath();
            // Isometric circle scaling (ellipse)
            ctx.ellipse(px, baseY + 2, ringRadius, ringRadius * 0.5, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(100, 255, 150, ${ringAlpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            // Static target inner ring
            ctx.beginPath();
            ctx.ellipse(px, baseY + 2, 5, 2.5, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, 0.4)`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
        }

        // Shadow on ground
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.ellipse(px, baseY + 2 + bob, 10 + (comboScore / 20), 5 + (comboScore / 40), 0, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.restore();

        // Combo Visual Evolution Calculations
        const comboLevel = comboScore / 200; // 0.0 to 1.0
        const scale = 1.0 + (comboLevel * 0.4); // Player grows up to 40% larger
        const hoverOffset = comboLevel * 5; // Player hovers slightly when high combo
        
        // Dynamic colors based on combo level
        // 0: Default (Blue/Dark)
        // 0.3: Cyan/Electric
        // 0.6: Purple/Pink Hot
        // 0.9+: Gold/Super
        
        const r1=26, g1=26, b1=46;   // Default body (#1a1a2e)
        const r2=255, g2=200, b2=50; // Max body (Gold)
        const bodyColor = `rgb(${r1 + (r2-r1)*comboLevel}, ${g1 + (g2-g1)*comboLevel}, ${b1 + (b2-b1)*comboLevel})`;

        const er1=100, eg1=200, eb1=255; // Default eyes (Cyan)
        const er2=255, eg2=255, eb2=255; // Max eyes (White/Super)
        const eyeColorRGB = `${Math.floor(er1 + (er2-er1)*comboLevel)}, ${Math.floor(eg1 + (eg2-eg1)*comboLevel)}, ${Math.floor(eb1 + (eb2-eb1)*comboLevel)}`;

        // Draw Combo Aura
        if (comboLevel > 0.2) {
            ctx.save();
            const auraPulse = Math.sin(animTime * 0.01) * 0.2 + 0.8;
            const auraRadius = 15 + (comboLevel * 15 * auraPulse);
            const auraGrad = ctx.createRadialGradient(px, baseY - 10 - hoverOffset, 0, px, baseY - 10 - hoverOffset, auraRadius);
            
            // Hue shifts from 200 (cyan) to 300 (pink) to 50 (gold) based on level
            let auraHue = 200 + (comboLevel * 200); 
            if (auraHue > 360) auraHue -= 360;
            
            auraGrad.addColorStop(0, `hsla(${auraHue}, 100%, 70%, ${comboLevel * 0.6})`);
            auraGrad.addColorStop(1, 'rgba(0,0,0,0)');
            
            ctx.fillStyle = auraGrad;
            // Squish aura for iso perspective
            ctx.beginPath();
            ctx.ellipse(px, baseY - 10 - hoverOffset, auraRadius, auraRadius * 0.7, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Apply scale & hover transform for body rendering
        ctx.save();
        ctx.translate(px, baseY - hoverOffset);
        ctx.scale(scale, scale);
        // We rendered shadow at 'baseY' and translated to 'baseY', so all drawing coordinates 
        // need to be relative to 0 instead of px/baseY.
        
        // Body (Coordinates adjusted to be relative to px, baseY)
        const bodyTop = -22 + bob;
        ctx.beginPath();
        ctx.moveTo(-6, 0);     // bottom-left
        ctx.lineTo(6, 0);     // bottom-right
        ctx.lineTo(5, bodyTop + 10);  // mid-right
        ctx.lineTo(7, bodyTop + 5);   // shoulder right
        ctx.lineTo(4, bodyTop);       // neck right
        ctx.lineTo(-4, bodyTop);       // neck left
        ctx.lineTo(-7, bodyTop + 5);   // shoulder left
        ctx.lineTo(-5, bodyTop + 10);  // mid-left
        ctx.closePath();
        ctx.fillStyle = bodyColor;
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + comboLevel * 0.5})`; // Brighter outline at high combo
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // Belt
        ctx.beginPath();
        ctx.moveTo(-6, bodyTop + 13);
        ctx.lineTo(6, bodyTop + 13);
        ctx.strokeStyle = comboLevel > 0.8 ? '#ff3333' : '#4a4a6a'; // Red belt at max level
        ctx.lineWidth = 2;
        ctx.stroke();

        // Head
        const headY = bodyTop - 5;
        ctx.beginPath();
        ctx.arc(0, headY, 5, 0, Math.PI * 2);
        ctx.fillStyle = bodyColor;
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + comboLevel * 0.5})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // Eyes - use angle for 360° facing
        const eyeDist = 2;
        const eyeOffX = Math.cos(player.angle) * eyeDist;
        const eyeOffY = Math.sin(player.angle) * eyeDist * 0.5; // squish Y for iso

        const eyeGlow = Math.sin(animTime * 0.005) * 0.2 + 0.8;

        // Left eye
        const leX = eyeOffX - Math.sin(player.angle) * 1.5;
        const leY = headY + eyeOffY - Math.cos(player.angle) * 0.8;
        ctx.beginPath();
        ctx.arc(leX, leY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${eyeColorRGB}, ${eyeGlow})`;
        ctx.fill();

        // Right eye
        const reX = eyeOffX + Math.sin(player.angle) * 1.5;
        const reY = headY + eyeOffY + Math.cos(player.angle) * 0.8;
        ctx.beginPath();
        ctx.arc(reX, reY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${eyeColorRGB}, ${eyeGlow})`;
        ctx.fill();

        // Eye glow halo
        ctx.beginPath();
        ctx.arc(eyeOffX, headY + eyeOffY, 6 + (comboLevel * 4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${eyeColorRGB}, ${(eyeGlow * 0.1) + (comboLevel * 0.2)})`;
        ctx.fill();

        // Legs (walking animation)
        if (player.moving) {
            const legSwing = Math.sin(player.stepAnim * 5) * 3;
            ctx.strokeStyle = bodyColor;
            ctx.lineWidth = 3;
            // Left leg
            ctx.beginPath();
            ctx.moveTo(-3, 0);
            ctx.lineTo(-3 + legSwing, 4);
            ctx.stroke();
            // Right leg
            ctx.beginPath();
            ctx.moveTo(3, 0);
            ctx.lineTo(3 - legSwing, 4);
            ctx.stroke();
        }

        ctx.restore(); // Restore from scale & translate
    }

    function renderParticles() {
        particles.forEach(p => {
            if (p.isScreenSpace) return; // handled separately
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(150, 160, 200, ${p.opacity})`;
            ctx.fill();
        });
    }

    function renderUISparkles() {
        sparkles.forEach(s => {
            if (s.isScreenSpace) {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${s.color}, ${s.life})`;
                ctx.fill();
            }
        });
    }

    function renderScanlines() {
        ctx.save();
        ctx.globalAlpha = 0.03;
        for (let y = 0; y < canvasH; y += 3) {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, y, canvasW, 1);
        }
        ctx.restore();
    }

    // ---- Draw Guard ----
    function drawGuard(g) {
        const iso = cartToIso(g.x, g.y);
        const gx = iso.x;
        const gy = iso.y;
        const bob = Math.sin(g.stepAnim * 3) * 1.5;
        const baseY = gy;

        // Vision cone (only when patrolling or chasing)
        const coneLen = g.state === 'chase' ? 80 : 50;
        const coneAngle = g.state === 'chase' ? 0.6 : 0.4;
        const coneColor = g.state === 'chase' ? 'rgba(255,60,60,0.12)' : 'rgba(255,200,50,0.08)';
        const isoAngleX = Math.cos(g.angle) * HALF_W - Math.sin(g.angle) * HALF_W;
        const isoAngleY = Math.cos(g.angle) * HALF_H + Math.sin(g.angle) * HALF_H;
        const dirLen = Math.sqrt(isoAngleX * isoAngleX + isoAngleY * isoAngleY);
        const normX = isoAngleX / dirLen;
        const normY = isoAngleY / dirLen;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(gx, baseY - 10);
        ctx.lineTo(gx + normX * coneLen + normY * coneLen * coneAngle, baseY - 10 + normY * coneLen - normX * coneLen * coneAngle);
        ctx.lineTo(gx + normX * coneLen - normY * coneLen * coneAngle, baseY - 10 + normY * coneLen + normX * coneLen * coneAngle);
        ctx.closePath();
        ctx.fillStyle = coneColor;
        ctx.fill();
        ctx.restore();

        // Shadow
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.ellipse(gx, baseY + 2, 10, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.restore();

        // Body
        const bodyTop = baseY - 22 + bob;
        ctx.beginPath();
        ctx.moveTo(gx - 6, baseY);
        ctx.lineTo(gx + 6, baseY);
        ctx.lineTo(gx + 5, bodyTop + 10);
        ctx.lineTo(gx + 7, bodyTop + 5);
        ctx.lineTo(gx + 4, bodyTop);
        ctx.lineTo(gx - 4, bodyTop);
        ctx.lineTo(gx - 7, bodyTop + 5);
        ctx.lineTo(gx - 5, bodyTop + 10);
        ctx.closePath();
        ctx.fillStyle = g.state === 'chase' ? '#4a1010' : '#2a1a10';
        ctx.fill();
        ctx.strokeStyle = g.state === 'chase' ? 'rgba(255, 80, 80, 0.5)' : 'rgba(200, 150, 80, 0.4)';
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // Belt
        ctx.beginPath();
        ctx.moveTo(gx - 6, bodyTop + 13);
        ctx.lineTo(gx + 6, bodyTop + 13);
        ctx.strokeStyle = '#6a5a3a';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Head
        const headY = bodyTop - 5 + bob;
        ctx.beginPath();
        ctx.arc(gx, headY, 5, 0, Math.PI * 2);
        ctx.fillStyle = g.state === 'chase' ? '#3a1515' : '#2a2015';
        ctx.fill();
        ctx.strokeStyle = g.state === 'chase' ? 'rgba(255, 100, 100, 0.4)' : 'rgba(200, 160, 80, 0.4)';
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // Eyes
        const eyeDist = 2;
        const eyeOffX = Math.cos(g.angle) * eyeDist;
        const eyeOffY = Math.sin(g.angle) * eyeDist * 0.5;
        const eyeColor = g.state === 'chase' ? 'rgba(255, 80, 80, 0.9)' : 'rgba(255, 200, 80, 0.8)';

        ctx.beginPath();
        ctx.arc(gx + eyeOffX - Math.sin(g.angle) * 1.5, headY + eyeOffY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = eyeColor;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(gx + eyeOffX + Math.sin(g.angle) * 1.5, headY + eyeOffY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = eyeColor;
        ctx.fill();

        // Alert indicator
        if (g.state === 'chase') {
            ctx.font = 'bold 14px Orbitron';
            ctx.fillStyle = '#ff4444';
            ctx.textAlign = 'center';
            ctx.fillText('!', gx, headY - 12);
        }

        // Legs
        if (g.speed > 0) {
            const legSwing = Math.sin(g.stepAnim * 5) * 3;
            ctx.strokeStyle = g.state === 'chase' ? '#4a1010' : '#2a1a10';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(gx - 3, baseY);
            ctx.lineTo(gx - 3 + legSwing, baseY + 4);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(gx + 3, baseY);
            ctx.lineTo(gx + 3 - legSwing, baseY + 4);
            ctx.stroke();
        }
    }

    // ---- Game Over Overlay ----
    function renderGameOver() {
        gameOverTimer++;
        const alpha = Math.min(gameOverTimer / 60, 0.75);

        ctx.save();
        ctx.fillStyle = `rgba(80, 0, 0, ${alpha})`;
        ctx.fillRect(0, 0, canvasW, canvasH);

        if (gameOverTimer > 30) {
            ctx.font = 'bold 48px Orbitron';
            ctx.fillStyle = '#ff3333';
            ctx.textAlign = 'center';
            ctx.fillText('RUN BUSTED', canvasW / 2, canvasH / 2 - 30);

            ctx.font = '500 20px Rajdhani';
            ctx.fillStyle = '#ffaaaa';
            ctx.fillText('Press R to restart or bank the run on the leaderboard.', canvasW / 2, canvasH / 2 + 20);

            ctx.font = '500 16px Rajdhani';
            ctx.fillStyle = '#ff8888';
            ctx.fillText(`Loot: ${collectedCount}/${lootItems.length}  |  Score: ${formatScore(totalValue)}`, canvasW / 2, canvasH / 2 + 55);
        }
        ctx.restore();

        if (keysDown['r']) {
            resetGame();
        }
    }

    function renderVictory() {
        gameOverTimer++;
        const alpha = Math.min(gameOverTimer / 60, 0.7);

        ctx.save();
        ctx.fillStyle = `rgba(0, 60, 20, ${alpha})`;
        ctx.fillRect(0, 0, canvasW, canvasH);

        if (gameOverTimer > 20) {
            ctx.font = 'bold 48px Orbitron';
            ctx.fillStyle = '#6fff9a';
            ctx.textAlign = 'center';
            ctx.fillText('ESCAPE CLEAN', canvasW / 2, canvasH / 2 - 30);

            ctx.font = '500 20px Rajdhani';
            ctx.fillStyle = '#d9ffe6';
            ctx.fillText('Submit this run or press R to launch another heist.', canvasW / 2, canvasH / 2 + 20);

            ctx.font = '500 16px Rajdhani';
            ctx.fillStyle = '#9effbf';
            ctx.fillText(`Loot: ${collectedCount}/${lootItems.length}  |  Score: ${formatScore(totalValue)}`, canvasW / 2, canvasH / 2 + 55);
        }

        ctx.restore();

        if (keysDown['r']) {
            resetGame();
        }
    }

    // ---- Pause Menu ----
    function renderPauseMenu() {
        ctx.save();

        // Dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvasW, canvasH);

        const cx = canvasW / 2;
        const cy = canvasH / 2;

        // Menu box
        const boxW = 340;
        const boxH = 260;
        const boxX = cx - boxW / 2;
        const boxY = cy - boxH / 2;

        // Box background with border
        ctx.fillStyle = 'rgba(10, 10, 25, 0.95)';
        ctx.strokeStyle = 'rgba(100, 180, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 12);
        ctx.fill();
        ctx.stroke();

        // Glow border
        ctx.shadowColor = 'rgba(100, 180, 255, 0.2)';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = 'rgba(100, 180, 255, 0.15)';
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Title
        ctx.font = 'bold 28px Orbitron';
        ctx.fillStyle = '#88ccff';
        ctx.textAlign = 'center';
        ctx.fillText('DURAKLATILDI', cx, boxY + 50);

        // Divider line
        ctx.strokeStyle = 'rgba(100, 180, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(boxX + 30, boxY + 70);
        ctx.lineTo(boxX + boxW - 30, boxY + 70);
        ctx.stroke();

        // Volume label
        ctx.font = '500 18px Rajdhani';
        ctx.fillStyle = '#aaccee';
        ctx.textAlign = 'center';
        ctx.fillText('🔊  Ses Seviyesi', cx, boxY + 105);

        // Volume bar background
        const barW = 240;
        const barH = 20;
        const barX = cx - barW / 2;
        const barY = boxY + 118;

        ctx.fillStyle = 'rgba(30, 30, 60, 0.8)';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barW, barH, 6);
        ctx.fill();
        ctx.strokeStyle = 'rgba(100, 180, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Volume bar fill
        const fillW = barW * menuVolume;
        if (fillW > 0) {
            const volGrad = ctx.createLinearGradient(barX, barY, barX + fillW, barY);
            volGrad.addColorStop(0, '#1a5a9a');
            volGrad.addColorStop(1, '#44aaff');
            ctx.fillStyle = volGrad;
            ctx.beginPath();
            ctx.roundRect(barX, barY, fillW, barH, 6);
            ctx.fill();

            // Glow on fill
            ctx.shadowColor = '#44aaff';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // Volume percentage
        ctx.font = 'bold 14px Orbitron';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${Math.round(menuVolume * 100)}%`, cx, barY + 15);

        // Controls hint
        ctx.font = '500 15px Rajdhani';
        ctx.fillStyle = 'rgba(150, 180, 220, 0.7)';
        ctx.fillText('◄ A / D ►  Ses Ayarla', cx, boxY + 175);

        // ESC hint
        ctx.font = '500 14px Rajdhani';
        ctx.fillStyle = 'rgba(120, 150, 200, 0.5)';
        ctx.fillText('ESC  Devam Et', cx, boxY + 220);

        // Animated pulse on border
        const pulse = Math.sin(Date.now() * 0.003) * 0.15 + 0.15;
        ctx.strokeStyle = `rgba(100, 180, 255, ${pulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(boxX - 3, boxY - 3, boxW + 6, boxH + 6, 14);
        ctx.stroke();

        ctx.restore();
    }

    // ---- Loot Counter UI ----
    function renderLootCounter() {
        const x = canvasW - 200;
        const y = 20;
        const w = 180;
        const h = 85;

        ctx.save();
        ctx.fillStyle = 'rgba(10, 10, 25, 0.85)';
        ctx.strokeStyle = 'rgba(100, 140, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 8);
        ctx.fill();
        ctx.stroke();

        ctx.font = '600 11px Orbitron';
        ctx.fillStyle = 'rgba(100, 140, 255, 0.6)';
        ctx.textAlign = 'left';
        ctx.fillText('LOOT BAG', x + 12, y + 18);

        ctx.font = 'bold 22px Rajdhani';
        ctx.fillStyle = collectedCount > 0 ? '#ffd700' : '#6a6a8a';
        ctx.fillText(`${collectedCount} / ${lootItems.length}`, x + 12, y + 44);

        ctx.font = '500 14px Rajdhani';
        ctx.fillStyle = totalValue > 0 ? '#80ff80' : '#4a4a6a';
        ctx.fillText(`VALUE ${formatScore(totalValue)}`, x + 12, y + 64);

        const barX = x + 12;
        const barY = y + 70;
        const barW = w - 24;
        const barH = 4;
        const progress = lootItems.length > 0 ? collectedCount / lootItems.length : 0;

        ctx.fillStyle = 'rgba(50, 50, 80, 0.5)';
        ctx.fillRect(barX, barY, barW, barH);

        if (progress > 0) {
            const pGrad = ctx.createLinearGradient(barX, barY, barX + barW * progress, barY);
            pGrad.addColorStop(0, '#ffd700');
            pGrad.addColorStop(1, '#ff8c00');
            ctx.fillStyle = pGrad;
            ctx.fillRect(barX, barY, barW * progress, barH);
        }

        ctx.restore();
    }

    function renderHealthBar() {
        const x = canvasW - 200;
        const y = 112;
        const w = 180;
        const h = 54;
        const ratio = MAX_PLAYER_HEALTH > 0 ? playerHealth / MAX_PLAYER_HEALTH : 0;

        ctx.save();
        ctx.fillStyle = 'rgba(10, 10, 25, 0.85)';
        ctx.strokeStyle = 'rgba(255, 120, 120, 0.28)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 8);
        ctx.fill();
        ctx.stroke();

        ctx.font = '600 11px Orbitron';
        ctx.fillStyle = 'rgba(255, 140, 140, 0.72)';
        ctx.textAlign = 'left';
        ctx.fillText('HP', x + 12, y + 18);

        ctx.font = 'bold 22px Rajdhani';
        ctx.fillStyle = ratio > 0.4 ? '#ff9f7f' : '#ff5a5a';
        ctx.fillText(`${formatHealth(playerHealth)} / ${MAX_PLAYER_HEALTH}`, x + 12, y + 40);

        const barX = x + 12;
        const barY = y + 44;
        const barW = w - 24;
        const barH = 6;

        ctx.fillStyle = 'rgba(60, 25, 32, 0.9)';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barW, barH, 4);
        ctx.fill();

        if (ratio > 0) {
            const fillW = barW * ratio;
            const healthGrad = ctx.createLinearGradient(barX, barY, barX + fillW, barY);
            healthGrad.addColorStop(0, '#ff4d4d');
            healthGrad.addColorStop(0.55, '#ffb347');
            healthGrad.addColorStop(1, '#8cff7a');
            ctx.fillStyle = healthGrad;
            ctx.beginPath();
            ctx.roundRect(barX, barY, fillW, barH, 4);
            ctx.fill();
        }

        ctx.restore();
    }

    // ---- Live Music Visualizer UI ----
    function renderMusicVisualizer() {
        if (!audioCtx) return;

        const x = 20;
        const y = 20;
        const w = 420; // Expanded width to fit 10 columns
        const h = 80;

        ctx.save();
        // Background
        ctx.fillStyle = 'rgba(20, 20, 30, 0.8)';
        ctx.strokeStyle = `rgba(80, 100, 150, ${0.3 + comboScore / 200})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 8);
        ctx.fill();
        ctx.stroke();

        // Title
        ctx.font = 'bold 12px Rajdhani';
        ctx.fillStyle = '#aaa';
        ctx.textAlign = 'left';
        ctx.fillText('LIVE BEAT MATRIX', x + 15, y + 20);

        // Level indicator
        const level = Math.floor(comboScore / 20);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + comboScore / 200})`;
        ctx.textAlign = 'right';
        ctx.font = 'bold 12px Orbitron';
        ctx.fillText(`LVL ${level}/10`, x + w - 15, y + 20);

        // Columns config
        const instruments = [
            { id: 'pad', name: 'PAD', color: '#b48cff' },
            { id: 'hat', name: 'HAT', color: '#ffffff' },
            { id: 'kick', name: 'KICK', color: '#ff4444' },
            { id: 'bass', name: 'BASS', color: '#44ff44' },
            { id: 'snare', name: 'SNARE', color: '#ffdd44' },
            { id: 'perc', name: 'PERC', color: '#ff8844' },
            { id: 'arp', name: 'ARP', color: '#44ffff' },
            { id: 'lead', name: 'LEAD', color: '#ff44ff' },
            { id: 'crash', name: 'CRASH', color: '#ffffaa' },
            { id: 'fx', name: 'FX', color: '#4444ff' }
        ];

        const barW = 30;
        const startX = x + 13;
        const startY = y + 65;

        // Draw each column
        instruments.forEach((inst, i) => {
            const bx = startX + i * 40;
            const val = activeBeats[inst.id];
            
            // Background slot
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(bx, startY - 30, barW, 30);
            
            // Active flashing bar
            if (val > 0) {
                const barH = Math.max(2, 30 * val);
                ctx.fillStyle = inst.color;
                ctx.fillRect(bx, startY - barH, barW, barH);
                
                // Glow effect based on intensity
                ctx.shadowColor = inst.color;
                ctx.shadowBlur = 15 * val;
                ctx.fillRect(bx, startY - barH, barW, barH);
                ctx.shadowBlur = 0;
            }

            // Label at bottom
            ctx.font = '10px Roboto';
            ctx.fillStyle = val > 0.1 ? inst.color : '#666';
            ctx.textAlign = 'center';
            ctx.fillText(inst.name, bx + barW/2, startY + 12);
        });

        // Combo bar at the very bottom edge of the box
        const comboW = (comboScore / 200) * (w - 10);
        ctx.fillStyle = `hsl(${comboScore * 0.75}, 100%, 50%)`;
        ctx.fillRect(x + 5, y + h - 4, comboW, 2);

        ctx.restore();
    }

    // ---- Minimap ----
    function renderMinimap() {
        const mw = minimapCanvas.width;
        const mh = minimapCanvas.height;
        const cellW = mw / MAP_COLS;
        const cellH = mh / MAP_ROWS;

        minimapCtx.fillStyle = '#08080e';
        minimapCtx.fillRect(0, 0, mw, mh);

        const minimapColors = {
            [TILE.EMPTY]:      '#0c0c14',
            [TILE.FLOOR]:      '#1a1a30',
            [TILE.WALL]:       '#4a4a6a',
            [TILE.DOOR]:       '#8b7020',
            [TILE.VENT]:       '#2a3a2a',
            [TILE.LIGHT]:      '#3a3a55',
            [TILE.CHECKPOINT]:  '#5a2020',
            [TILE.EXIT]:       '#205a30',
            [TILE.CRATE]:      '#5a4a2a',
            [TILE.PILLAR]:     '#5a5a7a',
        };

        for (let row = 0; row < MAP_ROWS; row++) {
            for (let col = 0; col < MAP_COLS; col++) {
                const tile = MAP[row][col];
                minimapCtx.fillStyle = minimapColors[tile] || '#0c0c14';
                minimapCtx.fillRect(col * cellW, row * cellH, cellW, cellH);
            }
        }

        // Viewport indicator
        const viewLeft = (-camera.x + canvasW / 2 * (1 - 1 / camera.zoom));
        const viewTop = (-camera.y + canvasH / 2 * (1 - 1 / camera.zoom));
        const viewW = canvasW / camera.zoom;
        const viewH = canvasH / camera.zoom;

        // Loot items on minimap
        for (const item of lootItems) {
            if (item.collected) continue;
            minimapCtx.fillStyle = '#ffd700';
            minimapCtx.beginPath();
            minimapCtx.arc(item.col * cellW + cellW / 2, item.row * cellH + cellH / 2, 2, 0, Math.PI * 2);
            minimapCtx.fill();
        }

        // Guards on minimap
        for (const g of guards) {
            const gColor = g.state === 'chase' ? '#ff3333' : '#ff8844';
            minimapCtx.fillStyle = gColor;
            minimapCtx.beginPath();
            minimapCtx.arc(g.x * cellW, g.y * cellH, 2.5, 0, Math.PI * 2);
            minimapCtx.fill();
            // Vision range indicator
            if (g.state === 'chase') {
                minimapCtx.strokeStyle = 'rgba(255, 50, 50, 0.3)';
                minimapCtx.lineWidth = 0.5;
                minimapCtx.beginPath();
                minimapCtx.arc(g.x * cellW, g.y * cellH, GUARD_DETECT_RANGE * cellW * 0.5, 0, Math.PI * 2);
                minimapCtx.stroke();
            }
        }

        // Player on minimap
        minimapCtx.fillStyle = '#50c8ff';
        minimapCtx.beginPath();
        minimapCtx.arc(player.x * cellW + cellW / 2, player.y * cellH + cellH / 2, 3.5, 0, Math.PI * 2);
        minimapCtx.fill();
        minimapCtx.fillStyle = 'rgba(80, 200, 255, 0.3)';
        minimapCtx.beginPath();
        minimapCtx.arc(player.x * cellW + cellW / 2, player.y * cellH + cellH / 2, 6, 0, Math.PI * 2);
        minimapCtx.fill();
    }

    // ---- Game Loop ----
    function gameLoop(timestamp) {
        animTime = timestamp;

        // Smooth zoom
        camera.zoom += (camera.targetZoom - camera.zoom) * 0.1;

        // Update beat
        updateBeat();

        // Update player & guards only if not paused
        if (!paused && !gameOver && !escapeComplete) {
            updatePlayer(timestamp);
            updateProjectiles();
        }
        if (!paused && !escapeComplete) {
            updateGuards();
        }

        // Camera follows player
        updateCamera();

        // Update particles
        updateParticles(16);

        // Update sparkles
        updateSparkles();

        // Render
        render();

        requestAnimationFrame(gameLoop);
    }

    // ---- Start ----
    init();
})();
