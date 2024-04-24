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

import content from "../content.json" assert { type: "json" };

/**
 * @type {Data[]}
 */
const messages = content;

const woodRoleID = "798632668002386102";
const fruitRoleID = "798632989235740752";
const cannonRoleID = "798633361689018368";

const crateOffers = messages.filter((message) => {
  const includesPing =
    message.content.includes(woodRoleID) ||
    message.content.includes(fruitRoleID) ||
    message.content.includes(cannonRoleID);

  if (includesPing) return true;

  const includesWord =
    message.content.includes("crate") &&
    (message.content.includes(woodRoleID) ||
      message.content.includes(fruitRoleID) ||
      message.content.includes(cannonRoleID));

  const includesSpots = /\d\s*(s($|[^\w])|spots)/.test(message.content);

  return includesWord && includesSpots;
});

let count = 0;

for (const offer of crateOffers) {
  offer.content = offer.content
    .replace(/\n/g, " ")
    .replace(/\d\s*s(pot)?s?/gi, "")
    .replace(/g\d/gi, "");

  //console.log(offer.content);

  const numTextRegexps = [
    new RegExp(`(\\d)[<@&\\w\\s]{0,5}(crate|${woodRoleID})`),
    new RegExp(`(\\d)[<@&\\w\\s]{0,5}(crate|${fruitRoleID})`),
    new RegExp(`(\\d)[<@&\\w\\s]{0,5}(crate|${cannonRoleID})`),

    new RegExp(`(crate|${woodRoleID})[>\\w\\s]{0,5}(\\d)`),
    new RegExp(`(crate|${fruitRoleID})[>\\w\\s]{0,5}(\\d)`),
    new RegExp(`(crate|${cannonRoleID})[>\\w\\s]{0,5}(\\d)`),
  ];

  const numTest = numTextRegexps
    .map((regex) => regex.exec(offer.content))
    .find((e) => e != null);

  if (!numTest) {
    console.log(offer.content, "---", 1);

    count++;
    continue;
  }

  const numRegex = /\d+/g;
  let wordIndex;

  if (offer.content.indexOf("crate") > -1) {
    wordIndex = ["crate", offer.content.indexOf("crate")];
  } else if (offer.content.indexOf(woodRoleID) > -1) {
    wordIndex = [
      `<@&${woodRoleID}>`,
      offer.content.indexOf(`<@&${woodRoleID}>`),
    ];
  } else if (offer.content.indexOf(fruitRoleID) > -1) {
    wordIndex = [
      `<@&${fruitRoleID}>`,
      offer.content.indexOf(`<@&${fruitRoleID}>`),
    ];
  } else if (offer.content.indexOf(`<@&${cannonRoleID}>`) > -1) {
    wordIndex = [
      `<@&${cannonRoleID}>`,
      offer.content.indexOf(`<@&${cannonRoleID}>`),
    ];
  }

  const contentString = offer.content
    .replace(/<(@|@&||#)\d+,?>/g, (match) => match.replace(/./g, "-"))
    .replace(/(x|#)\s*(?=\d)/gi, "")
    .replace(/(?<=\d)\s*(x|#)/gi, "");

  // console.log(offer.content);
  // console.log(contentString);

  const numList = [];
  let numData;

  do {
    numData = numRegex.exec(contentString);

    if (!numData?.[0] || numData[0] > 3) {
      continue;
    } else if (numData?.index > wordIndex[1]) {
      numList.push([
        numData[0],
        Math.abs(wordIndex[1] + wordIndex[0].length - numData.index - 1),
      ]);
    } else {
      numList.push([
        numData[0],
        Math.abs(wordIndex[1] - (numData[0].length + numData.index)),
      ]);
    }
  } while (numData);

  const closestCount = parseInt(
    numList.sort((a, b) => a?.[1] - b?.[1])?.[0]?.[0]
  );

  if (isNaN(closestCount)) {
    count++;
  } else {
    count += closestCount;
  }

  console.log(offer.content, "---", closestCount);
}

console.log(count);
