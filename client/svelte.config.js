import adapter from '@sveltejs/adapter-static'

const dev = process.env.NODE_ENV === 'development'

export default {
  kit: {
    adapter: adapter({
      fallback: 'index.html', // Required for SPA mode
    }),
    serviceWorker: {
      register: false, // Let the Vite PWA plugin handle it
    },
    paths: {
      base: dev ? '' : '/Palochnik',
      relative: true, // Forces relative links for assets
    },
    appDir: 'internal',
  },
}
