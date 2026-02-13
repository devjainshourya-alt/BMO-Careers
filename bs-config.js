/**
 * Browser-Sync config for reliable file watching and live reload.
 * Using a config file avoids Windows shell quoting issues with globs
 * and ensures node_modules is never watched.
 */
module.exports = {
  server: {
    baseDir: ["."],
    index: "index.html",
    directory: false,
    serveStaticOptions: {
      index: "index.html",
    },
  },
  startPath: "/",
  files: [
    "index.html",
    "styles.css",
    "**/*.html",
    "**/*.css",
    "**/*.js",
    "assets/**/*",
  ],
  watchOptions: {
    ignored: "node_modules",
  },
  ignore: ["node_modules/**"],
};
