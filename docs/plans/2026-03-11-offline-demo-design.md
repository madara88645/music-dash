# Offline Demo Design

## Goal

Leaderboard bagimliligini tamamen kaldirip oyunu 5 dakikalik sunum icin sade bir offline demo haline getirmek.

## Chosen Approach

- Sag taraftaki HTML leaderboard paneli tamamen kaldirilacak.
- `server.js` sadece statik oyun dosyalarini servis eden hafif bir Express sunucusu olarak kalacak.
- `GET /api/scores` ve `POST /api/scores` endpoint'leri silinecek.
- `public/game.js` icindeki leaderboard DOM, fetch, submit ve feedback akislari kaldirilacak.
- `?testMode=1` korunacak; health bar ve guard baskisi bu modda test edilmeye devam edecek.
- Health bar loot kutusunun altinda canvas UI olarak kalacak; panel kalktigi icin artik gorunur olacak.

## Why This Approach

- Sunum icin gereksiz olan online skor altyapisini temizler.
- Health bar gorunurlugu icin ekstra UI hack'i gerektirmez.
- Demo riskini azaltir; network veya skor submit akisina bagli hicbir sey kalmaz.
- Kod tabanini arkadasinin uzerine ekleme yapmasi icin daha temiz hale getirir.

## Constraints

- Oyun plain JavaScript + Canvas oldugu icin degisiklikler agirlikla `public/game.js`, `public/index.html` ve `public/style.css` icinde yapilacak.
- Test mode bozulmamalidir.
- Offline demo sunucusu icin `cors` ve `express.json()` tutulabilir; ama skor store ve endpoint mantigi gereksizdir.

## Testing Strategy

- Once yeni beklentileri ifade eden failing testler yazilacak:
  - `/api/scores` artik bulunmamali
  - Ana HTML'de leaderboard paneli olmamali
  - `public/game.js` icinde leaderboard referanslari kalmamali
  - Health bar state ve render hook'u durmali
- Testlerin beklenen sebeple fail ettigi gorulecek.
- Sonra minimum kod degisikligiyle testler yesile cekilecek.
- Finalde `npm test` ve `node --check public/game.js` ile dogrulama alinacak.
