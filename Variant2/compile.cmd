del CuTranspilePOC2.*
:: ignore compilation errors from _DOpusDefinitions.d.ts at the moment
:: run in sub-shell
:: because tsc exits the shell itself when it finds errors
cmd.exe /c "npx tsc --target es3 --lib es5,scripthost --out CuTranspilePOC2.js --declaration index.ts ID_Validators.ts StringValidator.ts"
copy CuTranspilePOC2.js "%HOMEDRIVE%%HOMEPATH%\AppData\Roaming\GPSoftware\Directory Opus\Script AddIns\"
del CuTranspilePOC2.d.ts
pause
