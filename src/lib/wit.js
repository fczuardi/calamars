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
            `${baseURL}${messageEndpoint}${messageId}?v=${apiVersion}`;
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
    // - **verbose** - _boolean_ - if the response should include extra info,
    // like start/end of the entities
    // - **n** - _number_ - The number of n-best outcomes you want to get back. default is 1
    //
    // ##### return
    // Returns a Promise that returns the parsed object from the webservice.
    // See https://wit.ai/docs/http/20160330#get-intent-via-text-link
    query(text = '', verbose = false, n = 1) {
        const url = `${this.queryURL}&q=${encodeURIComponent(text)}&verbose=${verbose}&n=${n}`;
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
//
// ## Static Methods
//
// #### getEntity
// Gets the first entityName found.
//
// ##### Parameters
// - **outcomes** - _object_ - an outcomes object returned by wit.ai API call
// - **entityName** - _string_ - the name of the entity you look for
//
// ##### return
// Returns an entity object or null
const getEntity = (outcomes, entityName) => {
    try {
        return outcomes.entities[entityName][0];
    } catch (e) {
        return null;
    }
};

// #### getEntities
// Gets all entities of name entityName.
//
// ##### Parameters
// - **outcomes** - _object_ - an outcomes object returned by wit.ai API call
// - **entityName** - _string_ - the name of the entity you look for
//
// ##### return
// Returns an array of entities or null
const getEntities = (outcomes, entityName) => {
    try {
        return outcomes.entities[entityName];
    } catch (e) {
        return null;
    }
};

WitDriver.getEntity = getEntities;

// #### getEntityValue
// ##### Parameters
// - **outcomes** - _object_ - an outcomes object returned by wit.ai API call
// - **entityName** - _string_ - the name of the entity you look for
//
// ##### return
// Returns the value of the entity you look for or null
WitDriver.getEntityValue = (outcomes, entityName) => {
    try {
        return getEntity(outcomes, entityName).value;
    } catch (e) {
        return null;
    }
};

// #### getEntityMeta
// ##### Parameters
// - **entity** - _object_ - an entity object
//
// ##### return
// Returns the metadata of the entity you look for or null
WitDriver.getEntityMeta = (entity) => {
    try {
        return JSON.parse(entity.metadata);
    } catch (e) {
        return null;
    }
};
export { WitDriver };
