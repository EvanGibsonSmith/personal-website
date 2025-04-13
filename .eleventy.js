const markdownIt = require("markdown-it"); // Use markdown-it for additional features
const markdownItPrism = require("markdown-it-prism");
const markdownItFootnote = require("markdown-it-footnote"); // Import markdown-it-footnote
const stripHtml = async (html) => {
  const mod = await import("string-strip-html");
  return mod.stripHtml(html);
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi.getFilteredByTag("blog");
  });
  
  eleventyConfig.addFilter("stripHtml", function (value) {
    return stripHtml(value).result;
  });

  let options = {
    html: true,
    breaks: true,
    linkify: true,
  };

  eleventyConfig.setLibrary("md", markdownIt(options).use(markdownItFootnote));
  eleventyConfig.amendLibrary("md", (mdLib) => mdLib.enable("code"));
  eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownItPrism));

  eleventyConfig.addPassthroughCopy("videos");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");
  
  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "md", "njk"],
  };
};
