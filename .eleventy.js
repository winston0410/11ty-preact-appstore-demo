const htmlmin = require("html-minifier");
// const pluginPWA = require("eleventy-plugin-pwa");

module.exports = (eleventyConfig) => {

  eleventyConfig.addPassthroughCopy({
    './static/font': 'font'
  });
  eleventyConfig.addPassthroughCopy({
    './static/favicon': 'favicon'
  });
  eleventyConfig.addPassthroughCopy({
    './static/images': 'images'
  });

  eleventyConfig.addPairedNunjucksAsyncShortcode("postcss", require("./utils/transform-css"));

  // eleventyConfig.addPlugin(pluginPWA, {
  // swSrc: "./static/js/service-worker/sw.js"
  // });
  //
  // eleventyConfig.addPassthroughCopy({
  //   './node_modules/workbox-sw/build/workbox-sw.js': './static/js/service-worker/workbox-sw.js'
  // });
  //
  // eleventyConfig.addPassthroughCopy({
  //   './node_modules/workbox-routing/build/workbox-routing.prod.js': './static/js/service-worker/workbox-routing.prod.js'
  // });
  //
  // eleventyConfig.addPassthroughCopy({
  //   './node_modules/workbox-precaching/build/workbox-precaching.prod.js': './static/js/service-worker/workbox-precaching.prod.js'
  // });
  //
  // eleventyConfig.addPassthroughCopy({
  //   './node_modules/workbox-core/build/workbox-core.prod.js': './static/js/service-worker/workbox-core.prod.js'
  // });
  //
  // eleventyConfig.addPassthroughCopy({
  //   './node_modules/workbox-google-analytics/build/workbox-offline-ga.prod.js': './static/js/service-worker/workbox-offline-ga.prod.js'
  // });
  //
  // eleventyConfig.addPassthroughCopy({
  //   './node_modules/workbox-background-sync/build/workbox-background-sync.prod.js': './static/js/service-worker/workbox-background-sync.prod.js'
  // });
  //
  // eleventyConfig.addPassthroughCopy({
  //   './node_modules/workbox-strategies/build/workbox-strategies.prod.js': './static/js/service-worker/workbox-strategies.prod.js'
  // });

  eleventyConfig.setBrowserSyncConfig({
    snippetOptions: {
      rule: {
        match: /<\/head>/i,
        fn: function(snippet, match) {
          return snippet + match;
        }
      }
    }
  });

  eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath.endsWith(".html")) {

      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });

  return {
    dir: {
      input: 'views',
      includes: '_includes',
      output: 'dist',
      data: '_data'
    },
    passthroughFileCopy: true,
    templateFormats: ['njk'],
    htmlTemplateEngine: 'njk'
  }
}
