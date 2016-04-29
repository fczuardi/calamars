// LuisDriver
// ==========
//
// A wrapper class for the LUIS Webservice (https://www.luis.ai/ ).
//
import request from 'request-promise';

const previewBaseURL = 'https://api.projectoxford.ai';
const previewApiPath = '/luis/v1/application/preview';
const previewURL = previewBaseURL + previewApiPath;

class LuisDriver {
    // ## Constructor
    // ### Parameters
    // - **options** - _Object_ - Configuration object.
    //   - **id** - _string_ - A LUIS app ID.
    //   - **subscriptionKey** - _string_ - A LUIS subscription key.
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

    // ### Methods
    //
    // #### query
    // ##### Parameters
    // - **text** - _string_ - a text query to send to the LUIS webservice.
    //
    // ##### return
    // Returns a Promise that returns the parsed object from the webservice.
    query(text = '') {
        const url = `${this.brainURL}&q=${text}`;
        return request(url).then(body => JSON.parse(body));
    }
}

// ## Examples
// ```javascript
// const options = {
//     id: 'YOUR_LUIS_ID',
//     subscriptionKey: 'YOUR_SUBSCRIPTION_KEY'
// };
// const luis = new LuisDriver(options);
// luis.query('Hi')
//     .then(result => {
//         const {
//             intent,
//             score
//         } = result.topScoringIntent;
//         console.log(result.query); // 'Hi'
//         console.log(intent); // 'None'
//         console.log(score); // 0.9042053
//     });
// ```
// See [test/luis.js](https://github.com/fczuardi/calamars/blob/master/test/luis.js) for more examples.
export { previewBaseURL, previewApiPath, LuisDriver };
