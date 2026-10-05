self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event) {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {
      title: 'Kamba Angola',
      body: event.data ? event.data.text() : 'Tens uma nova notificação.'
    };
  }

  const title = data.title || 'Kamba Angola';

  const options = {
    body: data.body || 'Tens uma nova notificação.',
    icon: data.icon || '/Kamba-Angola/icon-192.png',
    badge: data.badge || '/Kamba-Angola/icon-192.png',
    data: {
      url: data.url || '/Kamba-Angola/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const url = event.notification.data &&
              event.notification.data.url
              ? event.notification.data.url
              : '/Kamba-Angola/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function(clientList) {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
