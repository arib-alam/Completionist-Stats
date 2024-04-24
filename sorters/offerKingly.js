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

const kinglyRoleID = "1200988242909073629";

const crateOffers = messages.filter((message) => {
  const includesPing = message.content.includes(kinglyRoleID);

  if (includesPing) return true;

  const includesWord =
    message.content.includes("kingly") &&
    message.content.includes(kinglyRoleID);

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
    new RegExp(`(\\d)[<@&\\w\\s]{0,5}(kingly|${kinglyRoleID})`),

    new RegExp(`(kingly|${kinglyRoleID})[>\\w\\s]{0,5}(\\d)`),
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

  if (offer.content.indexOf("kingly") > -1) {
    wordIndex = ["kingly", offer.content.indexOf("kingly")];
  } else if (offer.content.indexOf(kinglyRoleID) > -1) {
    wordIndex = [
      `<@&${kinglyRoleID}>`,
      offer.content.indexOf(`<@&${kinglyRoleID}>`),
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

    if (!numData?.[0]) {
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
