import request from 'request-promise';

const brainURL = process.env.LUIS_APP_URL;

const query = (text) => {
    const url = `${brainURL}&q=${text}`;
    return request(url).then(body => (JSON.parse(body)));
};

export {
    brainURL,
    query
};
