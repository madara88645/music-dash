# Test Mode Design

## Goal

Health bar sistemini bozmayacak sekilde test etmeyi kolaylastiran ayri bir oyun modu eklemek.

## Root Cause

- Guard'lar normal modda tamamen kapali oldugu icin can sistemi pratikte gorunmuyor.
- Mevcut temas hasari frame-rate'e bagli oldugu icin farkli makinelerde farkli hizda can eksiliyor.
- Mevcut test yalnizca source marker'larini kontrol ediyor, davranisi garanti etmiyor.

## Chosen Approach

- URL query param ile acilan ayri test modu eklenecek: `?testMode=1`
- Guard loadout ve health helper davranislari saf fonksiyonlara alinacak
- Normal modda guard listesi bos kalacak
- Test modunda spawn'a yakin en az bir guard aktif olacak
- Temas hasari saniye bazli hesaplanacak

## Why This Approach

- Normal demo akisini bozmaz
- Arkadasin da ayni branch'te kolayca test eder
- Node testleri saf helper fonksiyonlar uzerinden gercek davranisi dogrular
- FPS farklarindan kaynakli tutarsizligi azaltir

## User Flow

- Normal demo: `http://localhost:3001`
- Test modu: `http://localhost:3001/?testMode=1`

Test modunda oyuncu yakinda bir guard ile hizlica karsilasir ve HP bar davranisi gozle gorulebilir.
