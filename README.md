# Music Dash

Game Jam icin hazirlanan, tarayici uzerinden calisan ritim-temali bir gizlilik oyunu demosu.

## Neler Var?

- Tek komutla acilan Node.js + Express sunucusu
- Canvas tabanli oynanabilir oyun
- Ekranda gorunen loot ve health bar HUD'i
- `?testMode=1` ile guard ve HP testi
- Sunum odakli, offline calisan sade demo

## Hizli Baslangic

### Gereksinimler

- Node.js 18+
- npm

### Kurulum

```bash
npm install
```

### Uygulamayi Calistirma

```bash
npm start
```

Tarayicida su adresi ac:

```text
http://localhost:3001
```

Health bar ve guard baskisini hizli denemek icin test modu:

```text
http://localhost:3001/?testMode=1
```

## Kontroller

- `W A S D`: hareket
- `Scroll`: zoom
- `Left Click`: ritim atisi
- `R`: run'i bastan baslat
- `Esc`: duraklat

## Demo Checklist

Sunumdan once sunlari kontrol et:

- `npm install` bir kez calismis olsun
- `npm start` ile server ayakta olsun
- `http://localhost:3001` aciliyor olsun
- Sag ustte loot kutusu ve health bar gorunuyor olsun
- En az bir loot toplanabiliyor olsun
- Yesil cikisa gidince run tamamlanabiliyor olsun
- `http://localhost:3001/?testMode=1` acilinca guard aktif olsun
- Guard temasta HP bar dusuyor olsun

## Onerilen Sunum Akisi

1. Oyunu acip sahnenin ve kontrollerin calistigini goster.
2. Kisa bir run yapip loot topla.
3. Sag ustte loot ve health bar bilgisini goster.
4. Istersen test mode'a gecip guard temasinda HP'nin dustugunu goster.
5. Run'i yeniden baslatip temiz bir kacisla demoyu kapat.

## Teknik Notlar

- Frontend dosyalari `public/` altindadir.
- Backend giris dosyasi `server.js` icindedir.
- Demo tamamen offline calisir.
- `?testMode=1` modu, health sistemi ve guard davranisini hizli test etmek icindir.

## Ekip Notu

Bu branch ekip icin temel calisan demo surumudur. Yeni ozellik acacaksaniz once bu guncel tabandan branch alin.
