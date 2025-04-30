'use client';

import React from 'react';
import ErrorDisplay from './ErrorDisplay';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: '',
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo: errorInfo.componentStack || '',
    });

    // Log the error to your error tracking service
    this.logError(error, errorInfo);
  }

  logError = (error: Error, errorInfo: React.ErrorInfo) => {
    // In production, send to your error tracking service
    if (process.env.NODE_ENV === 'production') {
      const errorData = {
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
        errorInfo: errorInfo.componentStack,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      };

      // Send to your error tracking endpoint
      fetch('https://topdoctorlist.com/api/error-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      }).catch(console.error);
    } else {
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
    }
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      return (
        <ErrorDisplay 
          error={this.state.error}
          errorInfo={isDevelopment ? this.state.errorInfo : undefined}
          resetError={() => this.setState({ hasError: false, error: null, errorInfo: '' })}
        />
      );
    }

    return this.props.children;
  }
}