import request from 'request-promise';

const previewBaseURL = 'https://api.projectoxford.ai';
const previewApiPath = '/luis/v1/application/preview';
const previewURL = previewBaseURL + previewApiPath;

class LuisDriver {
    constructor(options) {
        const {
            id,
            subscriptionKey
        } = options;

        if (!id || !subscriptionKey) {
            throw new Error(
                'LuisDriver could not be instantiated. Missing required options.'
            );
        }

        this.brainURL = `${previewURL}?id=${id}&subscription-key=${subscriptionKey}`;
    }

    query(text = '') {
        const url = `${this.brainURL}&q=${text}`;
        return request(url).then(body => JSON.parse(body));
    }
}

export { previewBaseURL, previewApiPath, LuisDriver };
