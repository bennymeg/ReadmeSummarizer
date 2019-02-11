const ReadmeSummarizer = require('../index').ReadmeSummarizer;
const testResources = require('./test-resources');
const assert = require('chai').assert;

describe('Readme Summarizer', () => {
    let expectedShortDescription = testResources.expectedShortDescription;
    let expectedLongDescription = testResources.expectedLongDescription;

    describe('From text', () => {
        let readme = testResources.readme;

        it('should summarize readme to a long description from text', () => {
            let description = ReadmeSummarizer.fromMarkdownText(readme);
            assert.equal(description, expectedLongDescription);
        });

        it('should summarize readme to a short description from text', () => {
            let description = ReadmeSummarizer.fromMarkdownText(readme, true);
            assert.equal(description, expectedShortDescription);
        });
    });

    describe('From URL', () => {
        let url = testResources.readmeUrl;

        it('should summarize readme to a long description from url', () => {
            ReadmeSummarizer.fromUrl(url).then((result) => {
                assert.equal(result, expectedLongDescription);
            }).catch(() => {
                assert.fail();
            });
        });

        it('should summarize readme to a short description from url', () => {
            ReadmeSummarizer.fromUrl(url, true).then((result) => {
                assert.equal(result, expectedShortDescription);
            }).catch(() => {
                assert.fail();
            });
        });
    });
});