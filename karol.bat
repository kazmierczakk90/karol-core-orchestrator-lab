
@echo off
echo ================================
echo     KAROL-CORE TERMINAL (WIN)
echo ================================
echo Wybierz tryb uruchomienia:
echo 1) Standard
echo 2) Narracyjny (pitch)
echo 3) Refleksyjny (audyt)
echo 4) Debug (deweloperski)
echo 5) Agent: Mentor
echo 6) Agent: Fighter
echo 7) Synchronizacja
echo 8) Audyt teraz
echo 9) Wyjście
set /p choice=Twój wybór:

if "%choice%"=="1" (
    start karol-core.exe --mode=standard
) else if "%choice%"=="2" (
    start karol-core.exe --mode=narrative --agent=pitch
) else if "%choice%"=="3" (
    start karol-core.exe --mode=reflective --trace-level=deep
) else if "%choice%"=="4" (
    start karol-core.exe --debug --log-level=trace
) else if "%choice%"=="5" (
    start karol-core.exe --agent=mentor --intent=guide
) else if "%choice%"=="6" (
    start karol-core.exe --agent=fighter --intent=act-fast
) else if "%choice%"=="7" (
    start karol-core.exe --sync=force
) else if "%choice%"=="8" (
    echo Uruchamianie audytu stylu...
    karol audit now
) else if "%choice%"=="9" (
    echo Zamykam Karol-Core Terminal...
    exit
) else (
    echo Nieprawidlowy wybor. Sprobuj ponownie.
)

pause
