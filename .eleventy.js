const htmlmin = require("html-minifier");

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

  eleventyConfig.setBrowserSyncConfig({
    // scripts in body conflict with Turbolinks
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
