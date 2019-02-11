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
     * @param {boolean} short get short summary (default: false).
     * @returns {Promise<string>} a promise to receive the readme summary.
     */
    static fromUrl(url, short=false) {
        return fetchReadmeFile(url).then(response => response.text()).then(response => {
            return this.fromMarkdownText(response, short);
        }).catch(error => console.log(error));
    }

    /**
     * Summarize markdown readme file from a given text string
     * @param {string} text readme file as string.
     * @param {boolean} short get short summary (default: false).
     * @returns {Promise<string>} a promise to receive the readme summary.
     */
    static fromMarkdownText(text, short=false) {
        // remove badges and comments
        let cleanReadme = removeEmptyLines(removeComments(removeBadges(String(text))));

        // convert titles to sections
        cleanReadme = sectionizeMarkdown(cleanReadme);

        // add section to the end of the file
        cleanReadme = cleanReadme.concat(`\n${SECTION}`);

        // trim all text between the two first headlines
        cleanReadme = cleanReadme.replace(new RegExp(`^${SECTION}(.+?)${SECTION}.*$`, 'gsm'), '$1').trim();

        // remove markdown from the description
        let longDescription = removeMarkdown(cleanReadme);
        let shortDescription = longDescription.replace(/(^.+[\n\.]).*$/, '$1');

        return (short ? shortDescription : longDescription).trim('\n').trim('\r');
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
    return text.replace(/\[.*\]\(.*\)/gm, ''); 
}

function removeComments(text) {
    return text.replace(/<!--.*-->/gm, ''); 
}

function removeEmptyLines(text) {
    return text.replace(/^\s*[\r\n]/gm, ''); 
}

function removeMarkdown(text) {
    return text.replace(/(?:__|[*#])|\[(.*?)\]\(.*?\)/gm, '$1'); 
}

function sectionizeMarkdown(text) {
    return text.replace(/^#+.*$/gm, SECTION); 
}

module.exports.ReadmeSummarizer = ReadmeSummarizer;