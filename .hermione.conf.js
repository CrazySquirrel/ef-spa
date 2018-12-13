module.exports = {
  sets: {
    common: {
      files: [
        'tests/common/*.hermione.js'
      ]
    },

    desktop: {
      files: [
        'tests/common/*.hermione.js',
        'tests/desktop/*.hermione.js'
      ]
    }
  },

  browsers: {
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome' // this browser should be installed on your OS
      }
    }
  }
};