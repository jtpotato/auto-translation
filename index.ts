import { Client, GatewayIntentBits } from "discord.js";
import OpenAI from "openai";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_KEY,
});

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

const translationGuide = `堂主 - temple guardian
区长 - group leader
人才 - coordinator
道亲 - Daokin
佛堂 - prayer hall
班期 - schedule
礼节 - propriety
点佛灯 - lighting holy lamps
献供 - present offerings
庆祝 - celebration
办道 - blessing
三宝 - 3 treasures
结缘 - sermon
表文 - dragon scroll
讲圆 - speaker
天帝 - Tiandi
弥勒道场 - MLDC
后学 - me`;

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  const result = await openai.responses.create({
    model: "openai/gpt-5.4-nano",
    input:
      "You are a translator. If the text is in English, translate it to Mandarin Chinese. If the text is in Mandarin Chinese, translate it to English. Only output the translated message. Adhere to the given translations in this guide - you may encounter text in its traditional form, which is equivalent to the simplified form, or you may encounter typos that are phonetically similar. Do not translate names - transliterate only, out of respect.\n" +
      translationGuide +
      "\n\nText:\n" +
      message.content,
    reasoning: {
      effort: "minimal",
    },
  });

  try {
    // If the translation is too long, it may exceed Discord's message character limit. In that case, we can split the message into multiple parts and send them separately.
    const maxLength = 2000; // Discord's message character limit
    if (result.output_text.length > maxLength) {
      const parts = [];
      for (let i = 0; i < result.output_text.length; i += maxLength) {
        parts.push(result.output_text.slice(i, i + maxLength));
      }
      for (const part of parts) {
        await message.reply(part);
      }
    } else {
      await message.reply(result.output_text);
    }
  } catch (error) {
    console.error("Error replying to message:", error);
  }
});

client.login(process.env.BOT_TOKEN);
