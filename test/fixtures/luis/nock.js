import nock from 'nock';
import { previewApiPath } from 'lib/luis';
import emptyResponse from './empty.json';
import hiResponse from './hi.json';

const fake = [
    {
        path: previewApiPath,
        verb: 'GET',
        query: qs => (qs.q === ''),
        reply: [
            200,
            emptyResponse
        ]
    },
    {
        path: previewApiPath,
        verb: 'GET',
        query: qs => (qs.q === 'Hi'),
        reply: [
            200,
            hiResponse
        ]
    }
];

const fakeScope = (url) => {
    const scope = nock(url);
    fake.forEach((endpoint) => {
        const { path, verb, query, reply } = endpoint;
        scope.intercept(path, verb)
            .query(query)
            .reply(...reply);
    });
    return scope;
};
export default fakeScope;
