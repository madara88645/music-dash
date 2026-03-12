# NPM Script Shell Design

## Goal

Windows'ta `npm start` ve `npm test` komutlarinin `\\?\` path formatinda da dogru current directory ile calismasini saglamak.

## Chosen Approach

- Repo kokune `.npmrc` eklenecek.
- Bu dosyada `script-shell=powershell.exe` tanimlanacak.
- `package.json` scriptleri oldugu gibi kalacak.
- Boylece npm scriptleri `cmd.exe` yerine PowerShell ile calisacak ve `\\?\C:\...` current directory problemi asilarak `C:\Windows` fallback'i engellenecek.

## Why This Approach

- Kullanici tarafindaki hatanin kok sebebi dogrudan `cmd.exe` davranisi.
- Mevcut `npm start` ve `npm test` komutlarini degistirmeden duzeltir.
- Diger kod dosyalarina dokunmadan dusuk riskli bir cozum sunar.

## Constraints

- Bu fix Windows odakli bir Game Jam repo pragmatizmi tasir.
- Cozum minimum degisiklikle repo seviyesinde kalmali.
- `package.json` scriptlerini gereksiz path hack'leriyle karmasiklastirmamak gerekiyor.

## Testing Strategy

- Once `.npmrc` dosyasinin gerekli `script-shell` satirini icerdigini dogrulayan failing test yazilacak.
- Test fail ettikten sonra `.npmrc` eklenecek.
- Finalde `npm test` ile config beklentisi ve mevcut testler tekrar calistirilacak.
