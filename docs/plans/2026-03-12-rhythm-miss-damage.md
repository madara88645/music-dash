# Rhythm Miss Damage Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ritim kacirildiginda oyuncuya sabit HP cezasi uygulamak.

**Architecture:** Mevcut tiklama ritim kontrolu `public/game.js` icinde kalacak. Miss durumunda combo cezasinin yanina sabit can cezasi eklenerek mevcut health ve game over akisi yeniden kullanilacak.

**Tech Stack:** Plain JavaScript, HTML5 Canvas, Node.js test runner

---

### Task 1: Miss hasari beklentisini testte yaz

**Files:**
- Modify: `test/game-ui.test.js`

**Step 1: Write the failing test**

- `public/game.js` icinde sabit miss hasari sabiti oldugunu dogrula.
- `MISS...` branch'inde `applyPlayerDamage(...)` cagrisi oldugunu dogrula.

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because miss branch'i henuz can dusurmuyor.

### Task 2: Minimal miss damage implementasyonu

**Files:**
- Modify: `public/game.js`

**Step 1: Write minimal implementation**

- `MISS_CLICK_DAMAGE` benzeri sabit bir deger ekle.
- `onClick` icindeki miss branch'inde combo azaltimini koru.
- Ayni branch'e `applyPlayerDamage(MISS_CLICK_DAMAGE)` ekle.

**Step 2: Run tests to verify they pass**

Run: `npm test`
Expected: PASS

### Task 3: Final verification

**Files:**
- Modify: `public/game.js` only if needed

**Step 1: Run syntax check**

Run: `node --check public/game.js`
Expected: PASS

**Step 2: Run full tests again**

Run: `npm test`
Expected: PASS
