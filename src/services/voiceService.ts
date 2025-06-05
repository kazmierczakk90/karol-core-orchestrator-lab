
export class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'pl-PL';
    }
  }

  async requestMicrophoneAccess(): Promise<boolean> {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (error) {
      console.error('Microphone access denied:', error);
      return false;
    }
  }

  startListening(
    onResult: (text: string, isFinal: boolean) => void,
    onError: (error: string) => void
  ): boolean {
    if (!this.recognition) {
      onError('Speech recognition not supported');
      return false;
    }

    if (this.isListening) {
      return false;
    }

    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      onResult(finalTranscript || interimTranscript, !!finalTranscript);
    };

    this.recognition.onerror = (event) => {
      onError(`Speech recognition error: ${event.error}`);
    };

    this.recognition.start();
    this.isListening = true;
    return true;
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text: string, voice?: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pl-PL';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    if (voice) {
      const voices = this.synthesis.getVoices();
      const selectedVoice = voices.find(v => v.name.includes(voice));
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    this.synthesis.speak(utterance);
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

export const voiceService = new VoiceService();
