# Guard Stun Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Iki guardli baslangic, sag tik cooldown ve guard stun davranisini oyuna eklemek.

**Architecture:** Guard tanimlari ve saf davranis yardimcilari `public/game-helpers.js` icinde tutulacak. Runtime entegrasyonu `public/game.js` icinde yapilacak; projectile-gard collision, `stunned` state ve shot cooldown burada baglanacak.

**Tech Stack:** Plain JavaScript, HTML5 Canvas, Node.js test runner

---

### Task 1: Yeni davranis beklentilerini testlerde yaz

**Files:**
- Modify: `test/game-helpers.test.js`
- Modify: `test/game-ui.test.js`

**Step 1: Write the failing tests**

- Normal modda `buildGuardLoadout` iki guard dondursun.
- `registerGuardHit` hit sayisini biriktirsin ve esikte stun dondursun.
- `canFireShot` cooldown karari versin.
- `public/game.js` icinde stun/cooldown sabitleri ve marker'lari bulunsun.

**Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL because helper fonksiyonlari ve yeni davranis henuz yok.

### Task 2: Helper katmanini ekle

**Files:**
- Modify: `public/game-helpers.js`
- Test: `test/game-helpers.test.js`

**Step 1: Write minimal implementation**

- Normal mod icin 2 guard tanimi ekle.
- Test mode icin 2 guardli test loadout'u duzenle.
- `registerGuardHit(...)` helper'ini ekle.
- `canFireShot(...)` helper'ini ekle.

**Step 2: Run tests to verify helper expectations pass**

Run: `npm test`
Expected: helper testleri yesile donmeye baslar, source marker testi halen kirmizi olabilir.

### Task 3: Runtime stun ve cooldown entegrasyonu

**Files:**
- Modify: `public/game.js`
- Optionally modify: `public/index.html`

**Step 1: Write minimal implementation**

- `GUARD_HITS_TO_STUN`, `GUARD_STUN_DURATION_SECONDS`, `SHOT_COOLDOWN_MS` sabitlerini ekle.
- Sag tikta cooldown kontrolu ekle.
- Projectile-guard collision bagla.
- `3 hit` sonra guard'i `stunned` state'ine al.
- `stunned` durumda guard hareket ve hasar vermesin.
- Reset akisinda guard hit/stun state'lerini sifirla.
- Gerekirse kontrol metnini `Right Click` atis olacak sekilde guncelle.

**Step 2: Run tests to verify they pass**

Run: `npm test`
Expected: PASS

### Task 4: Final verification

**Files:**
- Modify only if needed

**Step 1: Run syntax check**

Run: `node --check public/game.js`
Expected: PASS

**Step 2: Re-run full tests**

Run: `npm test`
Expected: PASS
