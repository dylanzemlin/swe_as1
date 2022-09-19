import express from "express";
import path from "path";

const app = express();

app.get("/", (req, res) => {
	return res.sendFile(`${__dirname}/index.html`);
});

app.listen(3000, () => {
	console.log(`Listening at: http://127.0.0.1:3000/`);
});