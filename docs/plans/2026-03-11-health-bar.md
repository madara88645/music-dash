# Health Bar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Oyuna guard temasi ile azalan bir can sistemi ve ekranda gorunen bir HP bar eklemek.

**Architecture:** Saglik state'i dogrudan `public/game.js` icinde tutulacak. Guard temasinda mevcut anlik yakalanma davranisi yerine hasar uygulanacak ve screen-space UI render zincirine yeni bir health bar eklenecek.

**Tech Stack:** Plain JavaScript, HTML5 Canvas, Node.js test runner

---

### Task 1: Health regression testini yaz

**Files:**
- Create: `test/game-ui.test.js`

**Step 1: Write the failing test**

`public/game.js` kaynagini okuyup su marker'lari bekleyen bir test yaz:
- `MAX_PLAYER_HEALTH`
- `playerHealth`
- `applyPlayerDamage`
- `renderHealthBar`
- `renderHealthBar()` render hook'u

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because health system does not exist yet.

### Task 2: Minimal health systemi ekle

**Files:**
- Modify: `public/game.js`

**Step 1: Write minimal implementation**

- Sabit health degerlerini ekle
- Oyuncu health state'ini ekle
- `applyPlayerDamage(amount)` fonksiyonunu ekle
- Guard temasinda anlik `finishRun('caught')` yerine hasar uygula
- `resetGame()` icinde cani sifirla
- `renderHealthBar()` fonksiyonunu ekle
- `render()` icinde health bar'i ciz

**Step 2: Run test to verify it passes**

Run: `npm test`
Expected: PASS

### Task 3: Syntax ve final verification

**Files:**
- Modify: `public/game.js` only if needed

**Step 1: Run syntax check**

Run: `node --check public/game.js`
Expected: PASS

**Step 2: Run full tests again**

Run: `npm test`
Expected: PASS
