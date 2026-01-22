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

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  const result = await openai.responses.create({
    model: "gpt-5-mini",
    input:
      "You are a translator. If the text is in English, translate it to Mandarin Chinese. If the text is in Mandarin Chinese, translate it to English. Only output the translated message. Text:\n\n" +
      message.content,
    reasoning: { effort: "minimal" },
  });

  try {
    await message.reply(result.output_text);
  } catch (error) {
    console.error("Error replying to message:", error);
  }
});

client.login(process.env.BOT_TOKEN);
