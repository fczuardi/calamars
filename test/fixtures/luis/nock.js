import nock from 'nock';
import { previewApiPath } from 'lib/luis';
import emptyResponse from './empty.json';
import hiResponse from './hi.json';
import goodbyeResponse from './goodbye.json';
import foobarResponse from './foobar.json';

const repeatLimit = 100000;
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
    },
    {
        path: previewApiPath,
        verb: 'GET',
        query: qs => (qs.q === 'Good Bye!'),
        reply: [
            200,
            goodbyeResponse
        ]
    },
    {
        path: previewApiPath,
        verb: 'GET',
        query: qs => (qs.q === 'Foobar'),
        reply: [
            200,
            foobarResponse
        ]
    }
];

const fakeScope = url => {
    const scope = nock(url);
    fake.forEach(endpoint => {
        const { path, verb, query, reply } = endpoint;
        scope.intercept(path, verb)
            .times(repeatLimit)
            .query(query)
            .reply(...reply);
    });
    return scope;
};
export default fakeScope;
