import { Client, MessageAttachment } from "discord.js";
import { createGorilla } from "./createGorilla";
import { config } from "dotenv";

config();

const client = new Client();
const prefix = process.env.PREFIX;
const token = process.env.TOKEN;

client.on("ready", async () => {
	await client.user.setPresence({
		activity: {
			name: "🦍 Gorilla Spinaton",
			type: "COMPETING",
		},
		afk: false,
		shardID: 0,
		status: "dnd",
	});
	console.log("[GORILLA]: ready!");
});

client.on("message", async (message) => {
	if (
		!message.guild ||
		message.author.bot ||
		!message.content ||
		!message.content.startsWith(prefix)
	)
		return;

	const args = message.content.slice(prefix.length).trim().split(" ");
	const command = args.shift();

	if (command === "goril") {
		const content = args.join(" ");
		if (!content)
			return await message.channel.send(
				"Specify the content to be written on gif.",
			);

		message.channel.startTyping();

		const msg = await message.channel.send("Creating gif, please wait...");

		const buffer = await createGorilla(content);
		const attachment = new MessageAttachment(buffer, `${content}.gif`);

		await msg.delete();
		await message.channel.send(
			"🦍 Here is your spinning gorilla!",
			attachment,
		);

		message.channel.stopTyping();
	}
});

client.login(token);
