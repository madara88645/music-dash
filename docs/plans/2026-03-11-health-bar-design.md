# Health Bar Design

## Goal

Oyuna basit ve okunur bir can sistemi eklemek.

## Chosen Approach

- Oyuncu `MAX_PLAYER_HEALTH` ile baslar.
- Guard ile yakin temas halinde can yavas yavas azalir.
- Can `0` oldugunda mevcut `finishRun('caught')` akisi calisir.
- Ekranda mevcut UI diline uyan, screen-space bir `HP` bar gosterilir.
- `resetGame()` her yeni run baslangicinda cani full yapar.

## Why This Approach

- Anlik olum yerine okunur bir risk hissi verir.
- Mevcut oyun akisina minimum mudahale eder.
- Var olan run-over ve restart sistemini bozmadan calisir.
- Jam scope icin yeterince kucuk ve dusuk risklidir.

## Constraints

- Mevcut frontend plain JavaScript oldugu icin cozum `public/game.js` icinde kalacak.
- Ayrik bir oyun-state modulu cikarmak bu tur icin gereksiz.
- Guard listesi su an bos; bu nedenle health sistemi eklenmis olsa da hasar etkisi guardlar aktiflestirilince gorulecek.

## Testing Strategy

- Once `public/game.js` icinde health state, damage fonksiyonu ve render hook'unun varligini dogrulayan hafif bir regression test yazilacak.
- Testin once fail ettigi gorulecek.
- Ardindan minimum implementasyon eklenecek.
- Son olarak `npm test` ve `node --check public/game.js` ile dogrulama alinacak.
