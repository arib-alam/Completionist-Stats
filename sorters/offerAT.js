/* eslint-disable no-console */

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
 * @type {Data}
 */
import content from "../content.json" assert { type: "json" };

const messages = content;

let count = 0;

for (const message of messages) {
  const includesPing = message.content.includes("1090040299314745406");

  const includesWord =
    message.content.includes("ancient") && message.content.includes("meg");
  const includesSpots = /\d\s*(s($|[^\w])|spots)/.test(message.content);

  if (includesPing || (includesWord && includesSpots)) count++;
}

console.log(count);
