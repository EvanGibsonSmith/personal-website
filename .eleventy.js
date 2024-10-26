const markdownIt = require("markdown-it"); // use markdown it for additional features
const markdownItPrism = require("markdown-it-prism");

module.exports = function (eleventyConfig) {
    let options = {
		html: true,
		breaks: true,
		linkify: true,
	};

	eleventyConfig.setLibrary("md", markdownIt(options));
    eleventyConfig.amendLibrary("md", (mdLib) => mdLib.enable("code"));
    eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownItPrism));

    // Input directory: src
    // Output directory: _site
    eleventyConfig.addPassthroughCopy("videos"); 
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("images");

    return {
        pathPrefix: "evangibsonsmith.com/",
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",     
        templateFormats: ["html", "md", "njk"],
    };
};