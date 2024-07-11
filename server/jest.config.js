const path = require('node:path');

require('dotenv').config({ path: path.join(__dirname, './config.env') });

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
