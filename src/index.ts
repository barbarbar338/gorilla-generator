import { Client, MessageAttachment } from "discord.js";
import { createGorilla } from "./createGorilla";
import { config } from "dotenv";
import { bargs } from "bargs";

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

	const split = message.content.slice(prefix.length).trim().split(" ");
	const command = split.shift();
	const args = bargs(
		[
			{
				name: "content",
				type: String,
				default: true,
			},
			{
				name: "gif",
				type: Number,
				aliases: ["g", "i", "idx", "index"],
			},
		],
		split,
	);

	if (command === "gorilla") {
		const { content, gif } = args;
		if (!content)
			return await message.channel.send(
				"Specify the content to be written on gif.",
			);
		if (gif && gif !== 1 && gif !== 2)
			return await message.channel.send(
				"Specify a valid gif id. Available ids: `1, 2`",
			);

		await message.channel.send("Creating gif, please wait...");

		const buffer = await createGorilla(
			content as string,
			gif ? (gif as 1 | 2) : 1,
		);
		const attachment = new MessageAttachment(buffer, `${content}.gif`);

		await message.channel.send(
			"🦍 Here is your spinning gorilla!",
			attachment,
		);
	}
});

client.login(token);
