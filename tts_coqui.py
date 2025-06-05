
from TTS.api import TTS
import sys

# Initialize TTS (offline, pre-trained)
tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC", progress_bar=False, gpu=False)

def speak(text, output_path="output.wav"):
    print(f"Generating voice for: {text}")
    tts.tts_to_file(text=text, file_path=output_path)
    print(f"Saved to: {output_path}")

if __name__ == "__main__":
    input_text = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "Hello from Karol-Core!"
    speak(input_text)
