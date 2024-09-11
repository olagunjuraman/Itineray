// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false, },
  modules: [
    '@vite-pwa/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  build: {
    transpile: ['vue-toastification'],
  },
  app: {
    head: {
        link: [    
          {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
          },
            { rel: 'icon', type: 'image/x-icon', href: '/icons/icon-48x48.png' },       
            // { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css'},
            { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/fontawesome.min.css'},
        ],

        script: [          
            // { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js',
            //   async: true,
            //   crossorigin: "anonymous"
            // },
        ],
    },
  },
  pwa: {
    manifest: {
      name: 'Itinerary App',
      short_name: 'Tip',
      description: 'This is a Itinerary application',
      theme_color: '#4A90E2',
      background_color: '#ffffff',
      icons: [
        {
          src: '/icons/icon-48x48.png',
          sizes: '48x48',
          type: 'image/png'
        },
        {
          src: '/icons/icon-144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      // screenshots: [
      //   {
      //     src: '/icons/icon-512x512.png',
      //     sizes: '1920x1080',
      //     type: 'image/png',
      //     form_factor: 'wide' 
      //   },
      //   {
      //     src: '/icons/icon-512x512.png',
      //     sizes: '1080x1920',
      //     type: 'image/png',
      //     form_factor: 'narrow' 
      //   }
      // ]
      
    },
    // workbox : {
    //   navigateFallback : "/"
    // },
    workbox: {
      navigateFallback : "/",
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'pages-cache',
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
          },
        },
        {
          urlPattern: ({ request }) => request.destination === 'image',
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
        {
          urlPattern: ({ request }) => request.destination === 'document',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages',
            networkTimeoutSeconds: 3,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
      ],
    },
    devOptions : {
      enabled : true,
      type : "module"
    },
    registerType: 'autoUpdate',
  }
})
