// WitDriver
// ==========
//
// A wrapper class for the Wit Webservice (https://wit.ai/docs/http/20160330 ).
//
import request from 'request-promise';

const baseURL = 'https://api.wit.ai';
const apiVersion = '20160330';
const messageEndpoint = '/message';

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

        this.brainURL = `${baseURL}${messageEndpoint}?v=${apiVersion}`;
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
    //
    // ##### return
    // Returns a Promise that returns the parsed object from the webservice.
    query(text = '') {
        const url = `${this.brainURL}&q=${encodeURIComponent(text)}`;
        return request({
            url: url,
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
