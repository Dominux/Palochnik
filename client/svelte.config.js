import adapter from '@sveltejs/adapter-static'

export default {
  kit: {
    adapter: adapter({
      fallback: 'index.html', // Required for SPA mode
    }),
    serviceWorker: {
      register: false, // Let the Vite PWA plugin handle it
    },
  },
}
