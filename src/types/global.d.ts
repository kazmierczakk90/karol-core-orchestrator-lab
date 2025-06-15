declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      target?: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

export {};