// WitDriver
// ==========
//
// A wrapper class for the Wit Webservice (https://wit.ai/docs/http/20160330 ).
//
import request from 'request-promise';

const baseURL = 'https://api.wit.ai';
const apiVersion = '20160330';
const intentEndpoint = '/message';
const messageEndpoint = '/messages/';

class WitDriver {
    // ## Constructor
    // ### Parameters
    // - **options** - _Object_ - Configuration object.
    //   - **id** - _string_ - A wit app ID.
    //   - **serverToken** - _string_ - The Server Access Token for that wit app.
    constructor(options) {
        const {
            id,
            serverToken
        } = options;

        if (!id || !serverToken) {
            throw new Error(
                'WitDriver could not be instantiated. Missing required options.'
            );
        }

        this.queryURL = `${baseURL}${intentEndpoint}?v=${apiVersion}`;
        this.messageInfoURL = messageId =>
            `${baseURL}${messageEndpoint}${messageId}/?v=${apiVersion}`;
        this.requestHeaders = {
            Authorization: `Bearer ${serverToken}`,
            Accept: `application/vnd.wit.${apiVersion}+json`
        };
    }

    // ### Methods
    //
    // #### query
    // ##### Parameters
    // - **text** - _string_ - a text query to send to the Wit webservice.
    // - **n** - _number_ - The number of n-best outcomes you want to get back. default is 1
    //
    // ##### return
    // Returns a Promise that returns the parsed object from the webservice.
    // See https://wit.ai/docs/http/20160330#get-intent-via-text-link
    query(text = '', n = 1) {
        const url = `${this.queryURL}&q=${encodeURIComponent(text)}&n=${n}`;
        return request({
            url,
            headers: this.requestHeaders
        }).then(body => JSON.parse(body));
    }

    // #### getMessage
    // ##### Parameters
    // - **id** - _string_ - the id of the message you want to inspect on wit
    //
    // ##### return
    // Returns a Promise that returns the parsed object from the webservice.
    // See: https://wit.ai/docs/http/20160330#get-message-link
    getMessage(id) {
        const url = this.messageInfoURL(id);
        return request({
            url,
            headers: this.requestHeaders
        }).then(body => JSON.parse(body));
    }
}

// ## Examples
// ```javascript
// const options = {
//     id: 'YOUR_WIT_ID',
//     serverToken: 'YOUR_WIT_TOKEN'
// };
// const wit = new WitDriver(options);
// luis.query('Hi')
//     .then(result => {
//         const {
//             _text,
//             outcomes
//         } = result;
//         console.log(_text); // 'Hi'
//         console.log(outcomes.length); // 1
//     });
// ```
// See [test/wit.js](https://github.com/fczuardi/calamars/blob/master/test/wit.js) for more examples.
export { WitDriver };
