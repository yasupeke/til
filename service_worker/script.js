if (navigator.serviceWorker) {
  navigator
    .serviceWorker
    .register('./service_worker.js', { scope: '.' })
    .then((registration) => {
      // 登録成功
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    })
    .catch((err) => {
      // 登録失敗 :(
      console.log('ServiceWorker registration failed: ', err);
    });
} else {
  alert('Service Worker未対応');
}
