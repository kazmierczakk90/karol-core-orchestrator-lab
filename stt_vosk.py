
import sys
import json
import queue
import sounddevice as sd
from vosk import Model, KaldiRecognizer

q = queue.Queue()

def callback(indata, frames, time, status):
    if status:
        print(status, file=sys.stderr)
    q.put(bytes(indata))

def listen_and_transcribe(lang_model_path="voice/vosk-model-en"):
    print("Initializing STT...")
    model = Model(lang_model_path)
    recognizer = KaldiRecognizer(model, 16000)

    with sd.RawInputStream(samplerate=16000, blocksize=8000, dtype='int16',
                           channels=1, callback=callback):
        print("Listening... Press Ctrl+C to stop.")
        while True:
            data = q.get()
            if recognizer.AcceptWaveform(data):
                result = recognizer.Result()
                print("Transcribed:", json.loads(result)['text'])

if __name__ == "__main__":
    listen_and_transcribe()
