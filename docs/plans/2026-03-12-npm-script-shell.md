# NPM Script Shell Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Windows Codex terminalinde `npm start` ve `npm test` komutlarinin yanlis working directory'ye dusmeden calismasini saglamak.

**Architecture:** Cozum repo kokundeki `.npmrc` dosyasina alinacak. NPM script shell'i `powershell.exe` olarak ayarlanacak ve mevcut `package.json` scriptleri korunacak.

**Tech Stack:** npm config, PowerShell, Node.js test runner

---

### Task 1: `.npmrc` beklentisini testte yaz

**Files:**
- Create: `test/npm-config.test.js`

**Step 1: Write the failing test**

- Repo kokundeki `.npmrc` dosyasini oku.
- `script-shell=powershell.exe` satirini bekle.

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because `.npmrc` henuz yok.

### Task 2: Minimal config fixini ekle

**Files:**
- Create: `.npmrc`

**Step 1: Write minimal implementation**

- Tek satirlik `script-shell=powershell.exe` ekle.

**Step 2: Run tests to verify they pass**

Run: `npm test`
Expected: PASS

### Task 3: Final verification

**Files:**
- Modify only if needed

**Step 1: Re-run full tests**

Run: `npm test`
Expected: PASS

**Step 2: Verify npm config value**

Run: `npm config get script-shell`
Expected: `powershell.exe`
