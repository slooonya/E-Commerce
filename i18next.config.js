const { defineConfig } = require('i18next-cli')

module.exports = defineConfig({
  locales: [
    "en",
    "ru"
  ],
  extract: {
    input: ["./index.html", "./**/*.js"],
    output: "./locales/{{lng}}/{{ns}}.json"
  }
});