module.exports = {
  "presets": [["latest-node", { "target": "current" }]],
  "plugins": [
    [
      "module-resolver",
      {
        "root": ["./src"],
        "alias": {
          "@components": "./components",
          "@views": "./views",
          "@styles": "./styles"
        }
      }
    ]
  ]
}