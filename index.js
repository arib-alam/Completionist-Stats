/* eslint-disable no-console */

import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

import { Client, GatewayIntentBits, Events } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, //Access to retrieve guilds
    GatewayIntentBits.GuildMembers, //Access to retrieve members
    GatewayIntentBits.GuildMessages, //Access to retrieve messages
    GatewayIntentBits.MessageContent, //Access to message content
    GatewayIntentBits.GuildPresences,
  ],
});

(async () => {
  client.login(process.env.DISCORD_TOKEN);
})();

client.once(Events.ClientReady, async (client) => {
  // eslint-disable-next-line no-console
  console.log(`${client.user.tag} is now online!`);
});

client.once(Events.ClientReady, async (client) => {
  const completionistsGuild = await client.guilds.fetch("797876494185529344");
  const users = completionistsGuild.members.cache;
  const roles = completionistsGuild.roles.cache;

  /**
   * @type {import('discord.js').TextChannel}
   */
  const captainedOffers = await completionistsGuild.channels.fetch(
    "1036270838363734036"
  );
  /**
   * @type {import('discord.js').TextChannel}
   */
  const nonCaptainedOffers = await completionistsGuild.channels.fetch(
    "854516883024773130"
  );

  const messagesList = [];

  /**
   * @type {import("discord.js").Message[]}
   */
  let fetchedMessage;

  let count = 0;

  let oldestId = "1199297840862736506";

  do {
    console.log("Count:", count++);

    fetchedMessage = await captainedOffers.messages
      .fetch({
        limit: 100,
        after: oldestId,
      })
      .then((messages) => {
        oldestId = messages.first().id;
        return messages.reverse().toJSON();
      });

    for (const message of fetchedMessage) {
      if (message.author.bot) {
        if (!message.embeds[0]) continue;

        const offerEmbed = message.embeds[0].toJSON();

        if (!offerEmbed.footer?.icon_url) continue;

        const username = offerEmbed.footer.text;

        const userReference = users.find(
          (user) =>
            user.nickname === username ||
            user.user.username === username ||
            user.user.globalName === username ||
            user.user.displayName === username
        );

        const pings = message.content.match(/(?<=<@&)\d+(?=>)/g);

        let content = offerEmbed.description
          .replace("## ", "")
          .replace(/\n/g, " ")
          .replace(/’/g, "'");

        if (pings) {
          for (const ping of pings) {
            const role = roles.get(ping);
            if (!role) continue;

            content = content.replace(role.name, role);
          }
        }

        const reactions = message.reactions.cache.toJSON();

        messagesList.push({
          botOffer: true,
          user: {
            authorId: userReference?.user?.id,
            globalName: userReference?.user?.globalName,
            displayName: userReference?.user?.displayName,
          },
          content: content.toLowerCase(),
          reactions: reactions.map((reaction) => reaction.emoji.name),
        });

        continue;
      }

      const reactions = message.reactions.cache.toJSON();

      messagesList.push({
        botOffer: false,
        user: {
          authorId: message.author.id,
          globalName: message.author.globalName,
          displayName: message.author.displayName,
        },
        content: message.content
          .toLowerCase()
          .replace("## ", "")
          .replace(/\n/g, " ")
          .replace(/’/g, "'"),
        reactions: reactions.map((reaction) => reaction.emoji.name),
      });
    }
  } while (fetchedMessage.length === 100);

  oldestId = "1199297840862736506";

  do {
    console.log("Count:", count++);

    fetchedMessage = await nonCaptainedOffers.messages
      .fetch({
        limit: 100,
        after: oldestId,
      })
      .then((messages) => {
        oldestId = messages.first().id;
        return messages.reverse().toJSON();
      });

    for (const message of fetchedMessage) {
      if (message.author.bot) {
        if (!message.embeds[0]) continue;

        const offerEmbed = message.embeds[0].toJSON();

        if (!offerEmbed.footer?.icon_url) continue;

        const username = offerEmbed.footer.text;

        const userReference = users.find(
          (user) =>
            user.nickname === username ||
            user.user.username === username ||
            user.user.globalName === username ||
            user.user.displayName === username
        );

        const pings = message.content.match(/(?<=<@&)\d+(?=>)/g);

        let content = offerEmbed.description
          .replace("## ", "")
          .replace(/\n/g, " ")
          .replace(/’/g, "'");

        if (pings) {
          for (const ping of pings) {
            const role = roles.get(ping);
            if (!role) continue;

            content = content.replace(role.name, role);
          }
        }

        const reactions = message.reactions.cache.toJSON();

        messagesList.push({
          botOffer: true,
          user: {
            authorId: userReference?.user?.id,
            globalName: userReference?.user?.globalName,
            displayName: userReference?.user?.displayName,
          },
          content: content,
          reactions: reactions.map((reaction) => reaction.emoji.name),
        });

        continue;
      }

      const reactions = message.reactions.cache.toJSON();

      messagesList.push({
        botOffer: false,
        user: {
          authorId: message.author.id,
          globalName: message.author.globalName,
          displayName: message.author.displayName,
        },
        content: message.content
          .replace("## ", "")
          .replace(/\n/g, " ")
          .replace(/’/g, "'"),
        reactions: reactions.map((reaction) => reaction.emoji.name),
      });
    }
  } while (fetchedMessage.length === 100);

  // console.log(messagesList);

  fs.writeFile(
    "content.json",
    JSON.stringify(messagesList, null, 2),
    (error) => {
      if (error) throw error;
    }
  );
});
