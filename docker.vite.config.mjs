import originalConfig from './vite.config.js'
export default {
  ...originalConfig,
  server: {
    ...originalConfig.server,
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: { usePolling: true, interval: 500 },
    proxy: Object.fromEntries(
      Object.entries(originalConfig.server.proxy).map(([route, options]) => [
        route, options.target === 'http://127.0.0.1:8000'
          ? { ...options, target: 'http://backend:8000' } : options
      ])
    )
  }
}