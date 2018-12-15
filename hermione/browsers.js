module.exports = {
  'chrome': {
    desiredCapabilities: {
      browserName: 'chrome',
      calibrate: true,
      compositeImage: true,
      screenshotMode: 'viewport',
      windowSize: '1280x1024',
      meta: {
        platform: 'desktop'
      }
    }
  },
  'ipad-portrait': {
    desiredCapabilities: {
      browserName: 'chrome',
      calibrate: true,
      compositeImage: true,
      screenshotMode: 'viewport',
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
          userAgent: [
            'Mozilla/5.0',
            '(iPad; CPU OS 10_2_1 like Mac OS X)',
            'AppleWebKit/602.4.6',
            '(KHTML, like Gecko)',
            'Version/10.0',
            'Mobile/14D27',
            'Safari/602.1'
          ].join(' ')
        }
      }
    }
  },
  'ipad-landscape': {
    desiredCapabilities: {
      browserName: 'chrome',
      calibrate: true,
      compositeImage: true,
      screenshotMode: 'viewport',
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
          userAgent: [
            'Mozilla/5.0',
            '(iPad; CPU OS 10_2_1 like Mac OS X)',
            'AppleWebKit/602.4.6',
            '(KHTML, like Gecko)',
            'Version/10.0',
            'Mobile/14D27',
            'Safari/602.1'
          ].join(' ')
        }
      }
    }
  },
  'iphone-portrait': {
    desiredCapabilities: {
      browserName: 'chrome',
      calibrate: true,
      compositeImage: true,
      screenshotMode: 'viewport',
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
          userAgent: [
            'Mozilla/5.0',
            '(iPhone; CPU iPhone OS 10_1_1 like Mac OS X)',
            'AppleWebKit/602.2.14',
            '(KHTML, like Gecko)',
            'Version/10.0',
            'Mobile/14B100',
            'Safari/602.1'
          ].join(' ')
        }
      }
    }
  },
  'iphone-landscape': {
    desiredCapabilities: {
      browserName: 'chrome',
      calibrate: true,
      compositeImage: true,
      screenshotMode: 'viewport',
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
          userAgent: [
            'Mozilla/5.0',
            '(iPhone; CPU iPhone OS 10_1_1 like Mac OS X)',
            'AppleWebKit/602.2.14',
            '(KHTML, like Gecko)',
            'Version/10.0',
            'Mobile/14B100',
            'Safari/602.1'
          ].join(' ')
        }
      }
    }
  }
};