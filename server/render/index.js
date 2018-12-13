'use strict';

const FS = require('fs');
const PATH = require('path');

// Get static path
const STATIC = __dirname + '/../../build';

// Get json serialize
const serialize = require('serialize-javascript');

// Import react decencies
const {createElement: h} = require('react');
const {renderToString} = require('react-dom/server');
const {StaticRouter} = require('react-router-dom');
const {createStore} = require('redux');
const {Provider} = require('react-redux');

// React server side render method
function render({url, searchText, csrf}) {
  // Clear server bundle cache
  delete require.cache[require.resolve(STATIC + '/server/index.js')];
  // Get server bundle
  const App = require(STATIC + '/server/index.js').default;
  // Create react store
  const store = createStore(
      (state) => JSON.parse(JSON.stringify(state)),
      {
        location: url,
        csrf
      }
  );
  // Create context object
  const context = {};
  // Render react app
  const result = renderToString(
      h(
          Provider,
          {store},
          h(
              StaticRouter,
              {
                location: url,
                context
              },
              h(App)
          )
      )
  );
  // Return current context, store and app html
  return {context, store, result};
}

// Export express subroutines
module.exports = (APP, RAVEN) => {
  // Use server side rendering as fallback for all routs
  APP.get('*', (req, res) => {
    try {
      // Server side render
      const {context, result, store} = render({
        csrf: req.csrfToken()
      });

      if (context.url) {
        // If context contains redirect, go ot it
        res.redirect(302, context.url);
      } else {
        // Render html
        Promise.all(
            [
              'static/index.html',
              'static/inline.css',
              'static/inline.js'
            ].map(file => {
              // Get bundles
              return new Promise((_resolve) => {
                return FS.readFile(
                    PATH.resolve(STATIC, file), 'utf8',
                    (err, out) => err ? _resolve('') : _resolve(out)
                );
              });
            })
        ).then(([
          HTML,
          INLINE_STYLE,
          INLINE_SCRIPT
        ]) => {
          // Replace placeholders in html template
          const html = HTML
          .replace(
              /%INLINE_STYLE%/ig,
              INLINE_STYLE
          )
          .replace(
              /%INLINE_SCRIPT%/ig,
              INLINE_SCRIPT
          )
          .replace(
              /%APP%/ig,
              result
          )
          .replace(
              /%PRELOADED_STATE%/ig,
              serialize(store.getState())
          );
          // Response rendered html
          res.set('content-type', 'text/html');
          res.send(html);
        });
      }
    } catch (e) {
      RAVEN.captureException(e);

      res.writeHead(500);
      res.end();
    }
  });
};
