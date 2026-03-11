# Music Dash

Game Jam icin hazirlanan, tarayici uzerinden calisan ritim-temali bir gizlilik oyunu ve global leaderboard demosu.

## Neler Var?

- Tek komutla acilan Node.js + Express sunucusu
- Canvas tabanli oynanabilir demo
- Global leaderboard paneli
- `POST /api/scores` ve `GET /api/scores` endpoint'leri
- Game Jam hizina uygun, veriyi bellekte tutan hafif backend

## Hızlı Başlangıç

### Gereksinimler

- Node.js 18+
- npm

### Kurulum

```bash
npm install
```

### Uygulamayı Çalıştırma

```bash
npm start
```

Tarayicida su adresi ac:

```text
http://localhost:3001
```

## Kontroller

- `W A S D`: hareket
- `Scroll`: zoom
- `Left Click`: ritim atisi
- `R`: run'i bastan baslat

## Demo Checklist

Sunumdan once sunlari kontrol et:

- `npm install` bir kez calismis olsun
- `npm start` ile server ayakta olsun
- `http://localhost:3001` aciliyor olsun
- Oyun ekrani ve leaderboard paneli birlikte gorunuyor olsun
- En az bir loot toplanabiliyor olsun
- Yesil cikisa gidince run tamamlanabiliyor olsun
- Isim girip skor submit edilebiliyor olsun
- Leaderboard listesinde yeni skor gorunuyor olsun

## Onerilen Sunum Akisi

1. Oyunu acip tek server uzerinden hem oyun hem leaderboard calistigini goster.
2. Kisa bir run yapip loot topla.
3. Yesil cikisa giderek run'i temiz bitir.
4. Oyuncu adini girip skoru leaderboard'a gonder.
5. Top 10 listesinde skoru goster.

## Teknik Notlar

- Frontend dosyalari `public/` altindadir.
- Backend giris dosyasi `server.js` icindedir.
- Leaderboard verisi bellekte tutulur.
- Server yeniden baslarsa skorlar sifirlanir. Bu davranis Game Jam MVP karari olarak bilincli secildi.

## API Özeti

### `GET /api/scores`

En yuksek 10 skoru buyukten kucuge dondurur.

### `POST /api/scores`

Request body:

```json
{
  "playerName": "Memo",
  "score": 4200
}
```

## Ekip Notu

Bu branch, ekip icin temel calisan demo surumudur. Yeni ozellik acacaksaniz once bu guncel tabandan branch alin.
