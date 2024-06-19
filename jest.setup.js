// jest.setup.js
// Polyfill for TextEncoder and TextDecoder (for Node.js 11 and above)
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
