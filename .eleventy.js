const fs = require("fs")
const Image = require("@11ty/eleventy-img")
const filters = require('./src/_11ty/filters')
const shortcodes = require('./src/_11ty/shortcodes')


module.exports = function(eleventyConfig) {
  // Filters
  Object.keys(filters).forEach(filterName => {
    eleventyConfig.addFilter(filterName, filters[filterName])
  })

  // Shortcodes
  Object.keys(shortcodes).forEach(shortcodeName => {
    eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName])
  })

  // navigation
  eleventyConfig.addPlugin( require('@11ty/eleventy-navigation') );

  // PassthroughCopy
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("./src/images");
  eleventyConfig.addPassthroughCopy("./src/fonts");
  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/js");
  eleventyConfig.addPassthroughCopy("./src/robots.txt");

  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('_site/404.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });

 
  eleventyConfig.addExtension("scss", {
    outputFileExtension: 'css',
    compile: async function (inputContent) {
			let result = sass.compileString(inputContent);

			// This is the render function, `data` is the full data cascade
			return async (data) => {
				return result.css
			}
		},
  })


  // Watch Folderss
  eleventyConfig.addWatchTarget('./src/scss/');
  eleventyConfig.addWatchTarget('./src/js/');


  // 11ty defaults
  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      // "liquid"
    ],
    pathPrefix: "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
