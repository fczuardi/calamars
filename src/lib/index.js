// Calamars
// ========
//
// An alpha quality, under heavy development, proto-frramework for building
// conversational applications.
//
// This library is a collection of different helper functions and classes,
// currently there are 4 main components:
//
// - [facebook.js](./facebook.html)
//   - a webserver/botserver to be used with the Facebook Messenger API
// - [router.js](./router.html)
//   - a helper function to create question → answers mappings
// - [wit.js](./wit.html)
//   - a driver for the wit.ai webservice
// - [luis.js](./luis.html)
//   - a driver for the LUIS webservice
//
// ---
//
// Source
// ------
export { version } from '../../package.json';
export {
    createRouter,
    createExactMatchRouter,
    createRegexRouter,
    createRegexFunctionRouter
} from './router';
export {
    LuisDriver,
    previewBaseURL,
    previewApiPath
} from './luis';
export {
    WitDriver
} from './wit';
export {
    FacebookMessengerBot
} from './facebook';
export {
    calamarMessageFormat
} from './calamar';
export {
    default as ContextSet
} from './contextSet';
export {
    default as #3ContextSet
} from './s3ContextSet.js';
