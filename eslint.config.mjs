export default [
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        // Node.js globals
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        console: "readonly",
        // Browser globals
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        location: "readonly",
        fetch: "readonly",
        XMLHttpRequest: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        clearTimeout: "readonly",
        clearInterval: "readonly"
      }
    },
    rules: {
      "new-cap": 0,
      "comma-dangle": ["error", "only-multiline"]
    }
  }
];
