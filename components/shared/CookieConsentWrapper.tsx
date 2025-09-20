'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import CookieConsent from './CookieConsent';

interface Props {
  children?: ReactNode;
  language?: 'en' | 'de';
}

interface State {
  hasError: boolean;
}

class CookieConsentErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Cookie consent error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Fail silently - don't show cookie banner if there's an error
      return null;
    }

    return <CookieConsent language={this.props.language} />;
  }
}

export default function CookieConsentWrapper({ language = 'en' }: { language?: 'en' | 'de' }) {
  return (
    <CookieConsentErrorBoundary language={language}>
      <CookieConsent language={language} />
    </CookieConsentErrorBoundary>
  );
}