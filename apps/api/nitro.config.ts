// https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",
  preset: 'heroku',
  routeRules: {
    '/api/**': {
      cors: true,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': '*',
        'access-control-allow-headers': '*'
      }
    }
  }
});
