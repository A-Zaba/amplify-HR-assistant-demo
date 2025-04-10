import { configureAutoTrack } from 'aws-amplify/analytics';

configureAutoTrack({
  // Enable auto tracking
  enable: true,
  // Track page event data
  type: 'event',
  // Optional: Configure session timeout
  options: {
    // Events to track
    events: ['click'],
    // OPTIONAL, the prefix of the selectors. By default, this is 'data-amplify-analytics-'
    // Per https://www.w3schools.com/tags/att_global_data.asp, always start
    // the prefix with 'data' to avoid collisions with the user agent
    selectorPrefix: 'data-amplify-analytics-'
  }
});
