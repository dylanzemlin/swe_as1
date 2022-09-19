import express from "express";
import fs from "fs";

const app = express();
let data: any | undefined = undefined;

app.get("/", (req, res) => {
	return res.sendFile(`${__dirname}/index.html`);
});

app.get("/raw", (req, res) => {
	return res.json(data);
});

app.get("/tweets", (req, res) => {
	return res.json(data.map((tweet: any) => {
		return {
			created_at: tweet.created_at,
			text: tweet.text
		}
	}))
});

app.listen(3000, () => {
	console.log(`Listening at: http://127.0.0.1:3000/`);
	const input = fs.readFileSync(`${__dirname}/favs.json`, "utf8");
	try {
		data = JSON.parse(input);
	} catch (e) {
		console.error(e);
	}
});