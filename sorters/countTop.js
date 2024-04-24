/* eslint-disable no-console */

/**
 * @typedef {object} User
 * @property {string} authorId
 * @property {string} globalName
 * @property {string} displayName
 */

/**
 * @typedef {object} Data
 * @property {boolean} botOffer
 * @property {User} user
 * @property {string} content
 * @property {string[]} reactions
 */

import content from "../content.json" assert { type: "json" };

/**
 * @type {Data[]} 
 */
const messages = content;

const offers = {};

for (const message of messages) {
  const modRoleID = "866385229861748766";
  const includesPing =
    /<@&\d+>/.test(message.content) && !message.content.includes(modRoleID);

  const includesSpots =
    /\d\s*(s($|[^\w])|spots)/.test(message.content.toLowerCase()) &&
    message.content.length > 5;

  if (message.botOffer || includesPing || includesSpots) {
    if (offers?.[message.user.globalName]) {
      offers[message.user.globalName]++;
    } else {
      offers[message.user.globalName] = 1;
    }
  }
}

const tempArr = [];
for (const offer in offers) {
  tempArr.push([offer, offers[offer]]);
}

console.log(
  tempArr.sort((a, b) => {
    if (a[1] > b[1]) {
      return -1;
    } else if (a[1] < b[1]) {
      return 1;
    } else {
      return 0;
    }
  })
);
