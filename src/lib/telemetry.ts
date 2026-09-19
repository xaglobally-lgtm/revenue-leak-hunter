// Lightweight client telemetry + error logging.
// Events are stored server-side in the audit log (POST /api/v1/analytics/event).
export function trackEvent(name: string, properties?: Record<string, unknown>): void {
  try {
    fetch('/api/v1/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: name, properties: properties || {} }),
    }).catch(() => {
      // Fire-and-forget: never let telemetry break the app.
    });
  } catch {
    // ignore
  }
}

export function initErrorTracking(): () => void {
  const onError = (event: ErrorEvent) => {
    trackEvent('client_error', {
      message: event.message || 'Unknown error',
      source: event.filename || '',
      line: event.lineno || 0,
      col: event.colno || 0,
    });
  };

  const onRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    trackEvent('client_error', {
      message: reason && typeof reason === 'object' ? String(reason.message || reason) : String(reason),
      source: 'unhandledrejection',
    });
  };

  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);
  return () => {
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onRejection);
  };
}