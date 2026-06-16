interface TurnstileRenderOptions {
  sitekey: string
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
  size?: 'normal' | 'compact' | 'invisible'
  theme?: 'light' | 'dark' | 'auto'
  action?: string
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileRenderOptions) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
      execute: (widgetId: string) => void
    }
  }
}

export {}
