import { record } from 'aws-amplify/analytics';

interface AnalyticsEvent {
  name: string;
  attributes: Record<string, string | number | boolean>;
}

export class Analytics {
  static async trackPageView(page: string, userId?: string) {
    try {
      await record({
        name: 'PAGE_VIEW',
        attributes: {
          page,
          userType: userId ? 'authenticated' : 'guest',
          userId: userId || 'anonymous',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error recording page view:', error);
    }
  }

  static async trackAuthEvent(eventType: 'SIGN_IN' | 'SIGN_OUT', userId?: string) {
    try {
      await record({
        name: `USER_${eventType}`,
        attributes: {
          userId: userId || 'anonymous',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error(`Error recording ${eventType} event:`, error);
    }
  }
}
