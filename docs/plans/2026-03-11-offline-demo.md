# Offline Demo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Global leaderboard'i projeden tamamen kaldirip health bar'i gorunur kalan, test mode'u korunan offline demo surumu cikarmak.

**Architecture:** Express sunucusu sadece `public/` altindaki statik oyun dosyalarini servis edecek. Oyun arayuzunden leaderboard paneli ve skor akislari silinecek; health bar mevcut canvas HUD icinde korunacak ve sag ustte tek basina gorunecek.

**Tech Stack:** Node.js, Express, plain JavaScript, HTML5 Canvas, Node.js test runner

---

### Task 1: Offline demo beklentilerini testlere yaz

**Files:**
- Modify: `test/server.test.js`
- Modify: `test/game-ui.test.js`

**Step 1: Write the failing tests**

- `GET /` yanitinda `game-canvas` bulunsun ama leaderboard paneli bulunmasin.
- `/api/scores` istegi artik 404 donsun.
- `public/game.js` icinde leaderboard DOM/fetch/submit referanslari bulunmasin.
- Health bar marker'lari bulunmaya devam etsin.

**Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL because leaderboard halen projede mevcut.

### Task 2: Leaderboard UI ve oyun bagimliliklarini kaldir

**Files:**
- Modify: `public/index.html`
- Modify: `public/style.css`
- Modify: `public/game.js`

**Step 1: Write minimal implementation**

- HTML leaderboard panelini sil.
- CSS leaderboard stillerini sil.
- `public/game.js` icinden leaderboard state, DOM referanslari, fetch/submit fonksiyonlari ve ilgili event listener'lari sil.
- Game over / victory / test mode metinlerinde leaderboard referanslarini temizle.
- Health bar render zincirini aynen koru.

**Step 2: Run tests to verify they pass**

Run: `npm test`
Expected: previously failing UI/source tests PASS.

### Task 3: Server'i offline demo moduna indir

**Files:**
- Modify: `server.js`
- Modify: `test/server.test.js`

**Step 1: Write minimal implementation**

- Skor store yardimcilari ve `/api/scores` endpoint'lerini sil.
- Sunucuyu statik dosya servis edecek kadar sade bir hale getir.
- JSON parse error handler'ini, eger artik bir API kullanmiyorsa, kaldir.
- Log mesajini leaderboard yerine oyun sunucusunu tarif edecek sekilde guncelle.

**Step 2: Run tests to verify they pass**

Run: `npm test`
Expected: `/` testi PASS, `/api/scores` 404 testi PASS.

### Task 4: README'yi offline demo olarak guncelle

**Files:**
- Modify: `README.md`

**Step 1: Update docs**

- Proje tanimini offline demo olarak sadeleştir.
- Leaderboard ve API bolumlerini kaldir.
- Demo checklist'i health bar ve test mode odakli guncelle.

**Step 2: Run full verification**

Run: `npm test`
Expected: PASS

Run: `node --check public/game.js`
Expected: PASS
