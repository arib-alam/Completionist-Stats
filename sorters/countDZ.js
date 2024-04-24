/* eslint-disable no-console */

import content from "../content.json" assert { type: "json" };

/**
 * @typedef {object} Data
 * @property {boolean} botOffer
 * @property {User} user
 * @property {string} content
 * @property {string[]} reactions
 */

/**
 * @typedef {object} User
 * @property {string} authorId
 * @property {string} globalName
 * @property {string} displayName
 */

/**
 * @type {Data[]}
 */
const messages = content;

let count = 0;

for (const message of messages) {
  const ping = message.content.includes("368598686013456395");

  if (ping) count++;
}

console.log(count);
