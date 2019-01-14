declare const target: string;

if (target === 'client' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
      console.log('Hooray. Registration successful, scope is:', registration.scope);
    })
    .catch((error) => {
      console.log('Whoops. Service worker registration failed, error:', error);
    });
  });
}
