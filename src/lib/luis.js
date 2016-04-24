import request from 'request-promise';

const previewBaseURL = 'https://api.projectoxford.ai/luis/v1/application/preview';

class LuisDriver {
    constructor(options) {
        const {
            id,
            subscriptionKey
        } = options;

        if (!id || !subscriptionKey) {
            throw new Error(
                'LuisDriver could not be instantiated. Missing required options.'
            )
        }

        this.brainURL = `${previewBaseURL}?id=${id}&subscription-key=${subscriptionKey}`;
    }

    query(text) {
        const url = `${this.brainURL}&q=${text}`;
        return request(url).then(body => (JSON.parse(body)));
    }
}

export default LuisDriver;
