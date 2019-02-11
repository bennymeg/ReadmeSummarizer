// const isMd = require('is-md');
const dynamicFetch = require('./dynamic/node-fetch').fetch;

/**
 * Readme Summarizer
 * @author Benny Megidish
 */
class ReadmeSummarizer {
    constructor() {}
    
    /**
     * Summarize markdown readme file from a given URL
     * @param {string} url readme file URL.
     * @param {boolean} short get short summary (default: true).
     * @returns {Promise<string>} a promise to receive the readme summary.
     */
    static fromUrl(url, short=true) {
        return fetchReadmeFile(url)
            .then(response => response.text())
            .then(response => {
                return this.fromMarkdownText(response, short);
            }).catch(error => console.log(error));
    }

    /**
     * Summarize markdown readme file from a given text string
     * @param {string} text readme file as string.
     * @param {boolean} short get short summary (default: true).
     * @returns {Promise<string>} a promise to receive the readme summary.
     */
    static fromMarkdownText(text, short=true) {
        // remove badges and comments
        let cleanReadme = removeComments(removeBadges(String(text)));

        // convert titles to sections
        cleanReadme = sectionizeMarkdown(cleanReadme);

        // add section to the end of the file
        cleanReadme = cleanReadme.concat(`\n${SECTION}`);

        // trim all text between the two first headlines
        cleanReadme = cleanReadme.replace(new RegExp(`^${SECTION}(.+?)${SECTION}.*$`, 'gsm'), '$1').trim();

        // remove markdown from the description
        let longDescription = removeMarkdown(cleanReadme);

        // get the first line
        let shortDescriptionMatch = longDescription.match(new RegExp('^(.+)(\n|\.\s+).*$', 'm'));
        let shortDescription = shortDescriptionMatch ? shortDescriptionMatch[1] : longDescription;
        // let shortDescriptionMatch = longDescription.replace(/[\n]+/g, '. ').split(/\.\s/);
        // let shortDescription = shortDescriptionMatch[0];

        return removeEmptyLines(short ? shortDescription : longDescription);
    }
}

const SECTION = '#SECTION';

function fetchReadmeFile(url) {
    // if (!isMd(url)) {
    //     return new Promise((resolve, reject) => {
    //         reject("url does not directs to a markdown file");
    //     });
    // }

    return dynamicFetch(url); 
}

function removeBadges(text) {
    // remove all badges which ar not part of a sentence
    return text.replace(/^\s*\[!.*\]\(.*\)/gm, ''); 
}

function removeComments(text) {
    // remove comments from the text
    return text.replace(/<!--.*-->/gm, ''); 
}

function removeEmptyLines(text) {
    // remove all the empty lines from the text
    return text.replace(/^\s*[\r\n]/gm, '').trim('\n').trim('\r'); 
}

function removeMarkdown(text) {
    // strip the text from markdown symbols, convert link and inline badges to text
    return text.replace(/(?:__|[*#`])|\[!\[(.*?)\]\(.*?\)\]\(.*?\)|\[(.*?)\]\(.*?\)/gm, '$1'); 
}

function sectionizeMarkdown(text) {
    // convert all the titles and subtitles to known section title
    return text.replace(/^#+.*$/gm, SECTION); 
}

module.exports.ReadmeSummarizer = ReadmeSummarizer;