const nextCoreWebVitals = require("eslint-config-next/core-web-vitals");

module.exports = [
  ...nextCoreWebVitals,
  {
    ignores: [".next/**", "node_modules/**", "dist/**", "coverage/**"],
  },
];
