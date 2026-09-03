import posthog from 'posthog-js';

export const POSTHOG_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_POSTHOG_KEY) ||
  'phc_pp2bEHBZdi6iA3BJ6XvPfaxXjNULCy4j88hJiaHoPZtc';

export const POSTHOG_HOST =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_POSTHOG_HOST) ||
  'https://eu.i.posthog.com';

let isInitialized = false;

export const initPostHog = (): void => {
  if (isInitialized || typeof window === 'undefined') return;

  if (POSTHOG_KEY) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false, // Explicitly tracked on SPA route transitions
      capture_pageleave: true,
      autocapture: true,
      session_recording: {
        maskAllInputs: false,
        maskInputOptions: {
          password: true,
        },
      },
      loaded: () => {
        if (import.meta.env.DEV) {
          console.log('[PostHog] Initialized on EU Cloud:', POSTHOG_HOST);
        }
      },
    });
    isInitialized = true;
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>): void => {
  try {
    if (isInitialized) {
      posthog.capture(eventName, properties);
    }
  } catch (err) {
    console.warn('[PostHog] Event capture failed:', err);
  }
};

export const identifyUser = (distinctId: string, userProperties?: Record<string, any>): void => {
  try {
    if (isInitialized) {
      posthog.identify(distinctId, userProperties);
    }
  } catch (err) {
    console.warn('[PostHog] Identify failed:', err);
  }
};

export const resetUser = (): void => {
  try {
    if (isInitialized) {
      posthog.reset();
    }
  } catch (err) {
    console.warn('[PostHog] Reset failed:', err);
  }
};

export default posthog;
