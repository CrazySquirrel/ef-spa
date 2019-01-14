const chromeBrowserSettings = {
  browserName: 'chrome',
  calibrate: true,
  compositeImage: true,
  screenshotMode: 'viewport',
};

const iPadUserAgent = [
  'Mozilla/5.0',
  '(iPad; CPU OS 10_2_1 like Mac OS X)',
  'AppleWebKit/602.4.6',
  '(KHTML, like Gecko)',
  'Version/10.0',
  'Mobile/14D27',
  'Safari/602.1'
].join(' ');

const iPhoneUserAgent = [
  'Mozilla/5.0',
  '(iPhone; CPU iPhone OS 10_1_1 like Mac OS X)',
  'AppleWebKit/602.2.14',
  '(KHTML, like Gecko)',
  'Version/10.0',
  'Mobile/14B100',
  'Safari/602.1'
].join(' ');

module.exports = {
  'chrome': {
    desiredCapabilities: {
      ...chromeBrowserSettings,
      windowSize: '1280x1024',
      meta: {
        platform: 'desktop'
      }
    }
  },
  'ipad-portrait': {
    desiredCapabilities: {
      ...chromeBrowserSettings,
      orientation: 'portrait',
      meta: {
        platform: 'touch-pad'
      },
      'goog:chromeOptions': {
        mobileEmulation: {
          deviceMetrics: {
            width: 768,
            height: 1024,
            pixelRatio: 2.0
          },
          userAgent: iPadUserAgent
        }
      }
    }
  },
  'ipad-landscape': {
    desiredCapabilities: {
      ...chromeBrowserSettings,
      orientation: 'landscape',
      meta: {
        platform: 'touch-pad'
      },
      'goog:chromeOptions': {
        mobileEmulation: {
          deviceMetrics: {
            width: 1024,
            height: 768,
            pixelRatio: 2.0
          },
          userAgent: iPadUserAgent
        }
      }
    }
  },
  'iphone-portrait': {
    desiredCapabilities: {
      ...chromeBrowserSettings,
      orientation: 'portrait',
      meta: {
        platform: 'touch-phone'
      },
      'goog:chromeOptions': {
        mobileEmulation: {
          deviceMetrics: {
            width: 320,
            height: 568,
            pixelRatio: 2.0
          },
          userAgent: iPhoneUserAgent
        }
      }
    }
  },
  'iphone-landscape': {
    desiredCapabilities: {
      ...chromeBrowserSettings,
      orientation: 'landscape',
      meta: {
        platform: 'touch-phone'
      },
      'goog:chromeOptions': {
        mobileEmulation: {
          deviceMetrics: {
            width: 568,
            height: 320,
            pixelRatio: 2.0
          },
          userAgent: iPhoneUserAgent
        }
      }
    }
  }
};