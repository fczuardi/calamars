// Calamars
// ========
//
// An alpha quality, under heavy development, proto-frramework for building
// conversational applications.
//
// This library is a collection of different helper functions and classes,
// currently there are 2 main components:
//
// - [router.js](./router.html)
//   - a helper function to create input > output mappings
// - [luis.js](./luis.html)
//   - a driver for the LUIS webservice
//
// ---
//
// Source
// ------
export { version } from '../../package.json';
export * from './router';
export * from './luis';
