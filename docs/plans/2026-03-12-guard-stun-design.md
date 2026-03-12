# Guard Stun Design

## Goal

Oyunda baslangictan itibaren iki guard bulundurmak ve sag tik atislarini guard'lari oldurmeyen, belli vurus sayisinda gecici stun yaratan bir sisteme donusturmek.

## Chosen Approach

- Normal mod artik iki guard ile baslayacak.
- Sag tik atisi cooldown'li olacak; oyuncu spam atis yapamayacak.
- Her guard sag tik mermisinden belirli sayida hit aldiginda `stunned` state'ine girecek.
- Stun sirasinda guard hareket etmeyecek ve oyuncuya hasar vermeyecek.
- Stun bitince guard `return/patrol` akisina geri donecek; guard tamamen ölmeyecek.
- Test mode korunacak; fakat o da stun sistemiyle ayni guard altyapisini kullanacak.

## Why This Approach

- Sag tik sonunda anlamli bir stealth/combat araci olur.
- Guard'lari oldurmemek oyunun baskisini korur.
- Cooldown, oyuncunun tek frame'de asiri fazla mermi atmasini engeller.
- Mevcut guard state machine'i uzerine minimum eklemeyle kurulabilir.

## Recommended Tuning

- Normal mod guard sayisi: `2`
- Stun esigi: `3 hit`
- Stun suresi: `3 saniye`
- Sag tik cooldown: `350ms`

## Constraints

- Cozum plain JavaScript kod tabaninda kalmali.
- Mevcut health bar, miss damage ve test mode bozulmamali.
- Guard death state eklenmeyecek; sadece stun olacak.

## Testing Strategy

- Once helper testleri ile su beklentiler fail ettirilecek:
  - normal modda 2 guard load olur
  - hit sayaci stun esiginde resetlenip `stunned` doner
  - shot cooldown helper'i dogru karar verir
- Source-level test ile `public/game.js` icinde stun ve cooldown marker'lari aranacak.
- Sonra minimum implementasyon eklenecek.
- Finalde `npm test` ve `node --check public/game.js` ile dogrulama alinacak.
