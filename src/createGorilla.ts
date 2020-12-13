import * as GIFEncoder from "gifencoder";
import { Canvas, Image, registerFont } from "canvas";
import { readdirSync, readFileSync } from "fs";
import { resolve as resolvePath } from "path";

registerFont(resolvePath("src", "assets", "font.ttf"), {
	family: "Gorilla",
});

export async function createGorilla(content: string): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const encoder = new GIFEncoder(600, 338);
		const image = new Image();
		const canvas = new Canvas(600, 338);
		const ctx = canvas.getContext("2d");
		const stream = encoder.createReadStream();
		const buffs = [];

		stream.on("data", (chunk) => {
			buffs.push(chunk);
		});
		stream.on("end", () => {
			const buffer = Buffer.concat(buffs);
			resolve(buffer);
		});
		stream.on("error", reject);

		encoder.start();
		encoder.setRepeat(0);
		encoder.setDelay(100);
		encoder.setQuality(10);

		readdirSync(resolvePath("src", "assets", "frames"))
			.sort((a, b) => {
				const aNumber = parseInt(a);
				const bNumber = parseInt(b);
				return aNumber - bNumber;
			})
			.map((frame) =>
				readFileSync(resolvePath("src", "assets", "frames", frame)),
			)
			.forEach((frame) => {
				image.src = frame;
				ctx.drawImage(image, 0, 0, 600, 338);
				ctx.fillStyle = "#fff";
				ctx.fillRect(50, 270, 500, 50);
				ctx.fillStyle = "#000";
				ctx.textAlign = "center";
				ctx.font = "15px Gorilla";
				ctx.fillText(content, 300, 300);
				encoder.addFrame(ctx);
			});

		encoder.finish();
	});
}
