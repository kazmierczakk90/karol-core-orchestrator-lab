
# KAROL-CORE – Komendy Uruchamiania Systemu

## 1. Podstawowe uruchomienie

### Windows:
```bat
start karol-core.exe
```

### Linux/macOS:
```sh
./karol-core.exe
```

---

## 2. Tryby działania

### Tryb standardowy:
```sh
./karol-core.exe --mode=standard
```

### Tryb narracyjny (np. pitch/inwestorzy):
```sh
./karol-core.exe --mode=narrative --agent=pitch
```

### Tryb introspekcji (audyt, refleksja):
```sh
./karol-core.exe --mode=reflective --trace-level=deep
```

### Tryb developerski (debugging):
```sh
./karol-core.exe --debug --log-level=trace
```

---

## 3. Agenci i intencje

### Mentor:
```sh
./karol-core.exe --agent=mentor --intent=guide
```

### Fighter:
```sh
./karol-core.exe --agent=fighter --intent=act-fast
```

### Silnik decyzyjny tylko (bez UI):
```sh
python core/rdzen/fuko_engine.py --headless
```

---

## 4. Synchronizacja i dziedziczenie

### Wymuszenie synchronizacji:
```sh
./karol-core.exe --sync=force
```

### Dziedziczenie stylu:
```sh
./karol-core.exe --inherit-from=dziedzictwo/agent_fingerprint.key
```

---

## 5. Głos i mikroserwisy

### TTS:
```sh
python voice/coqui/tts_server.py --model=karol --lang=PL
```

### STT:
```sh
python voice/input_pl/voice_recognizer.py --activate-word="Karol"
```

---

## 6. REST/API (przykład)

```sh
curl -X POST http://localhost:8787/decision \
     -H "Content-Type: application/json" \
     -d '{"intent": "pause_then_reflect", "agent": "mentor"}'
```

---

## 7. CLI Systemowe

| Komenda               | Funkcja                                       |
|-----------------------|-----------------------------------------------|
| `karol status`        | Pokazuje aktualny rytm, styl i agent aktywny |
| `karol sync`          | Synchronizuje decyzje i pamięć                |
| `karol export style`  | Eksportuje styl agenta                        |
| `karol trace on`      | Włącza pełny ślad decyzji                     |
| `karol pause`         | Wstrzymuje podejmowanie decyzji              |
| `karol audit now`     | Uruchamia audyt stylu                        |
