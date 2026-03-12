# Rhythm Miss Damage Design

## Goal

Oyuncu ritmi kacirdiginda sabit miktarda can kaybetmesini saglamak.

## Chosen Approach

- Ritim tiklamasi `public/game.js` icindeki `onClick` fonksiyonunda kalacak.
- Yeni bir sabit miss hasar degeri eklenecek.
- `MISS...` branch'inde mevcut combo cezasi korunacak.
- Ayni branch'e sabit HP cezasi olarak `applyPlayerDamage(...)` cagrisi eklenecek.
- Guard temasindan gelen surekli hasar sistemi aynen korunacak.

## Why This Approach

- Oyun davranisini kullanicinin beklentisine en dogrudan sekilde yaklastirir.
- Mevcut can sistemi ve game over akisina minimum mudahale eder.
- Demo oncesi risk dusuktur; yeni state, UI veya network davranisi gerektirmez.

## Constraints

- Plain JavaScript kod tabaninda cozum `public/game.js` icinde minimum degisiklikle kalmali.
- Miss cezasi sabit olacak; biriken ceza veya combo'ya gore degisen hasar bu turde olmayacak.
- Health bar ve test mode bozulmamalidir.

## Testing Strategy

- Once source-level failing test yazilacak.
- Test, miss branch'inde sabit hasar sabiti ve `applyPlayerDamage(...)` cagrisi bekleyecek.
- Test fail ettikten sonra minimum implementasyon eklenecek.
- Finalde `npm test` ve `node --check public/game.js` ile dogrulama alinacak.
