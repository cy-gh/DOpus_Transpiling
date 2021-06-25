del CuTranspilePOC1.*
:: run in sub-shell
:: because tsc exits the shell itself when it finds errors
cmd.exe /c "npx tsc --target es3 --lib es5,scripthost --out CuTranspilePOC1.js --declaration BaseClass.ts MyInterface.ts index.ts"
copy CuTranspilePOC1.js "%HOMEDRIVE%%HOMEPATH%\AppData\Roaming\GPSoftware\Directory Opus\Script AddIns"
del CuTranspilePOC1.d.ts
pause
