import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

let data: any[] | undefined = undefined;

app.get("/", (req, res) => {
	return res.sendFile(`${__dirname}/index.html`);
});

app.get("/raw", (req, res) => {
	return res.json(data);
});

/**
 * Gets all tweets and extracts specific fields (id, created_at, text)
 * Returns:
 * 	- 200: A list of tweets
 */
app.get("/tweets", (req, res) => {
	return res.json(data?.map((tweet: any) => {
		return {
			id: tweet.id,
			created_at: tweet.created_at,
			text: tweet.text
		}
	}))
});

/**
 * Gets a tweet given a specific id
 * Returns:
 *  - 200: The tweet (id, created_at, text)
 *  - 404: no_tweet_found error
 */
app.get("/tweets/:id", (req, res) => {
	if (data?.findIndex(tweet => tweet.id == req.params.id) == -1) {
		return res.status(404).json({ error: "no_tweet_found", message: "No tweet found with that id" });
	}

	return res.json(data?.map(tweet => {
		return {
			id: tweet.id,
			created_at: tweet.created_at,
			text: tweet.text
		}
	}).find(x => x.id == req.params.id)); // do a non-typed compare to avoid int == string comparision
});

/**
 * Gets a list of users and extracts specific fields (id, name, screen_name)
 * Returns:
 *  - 200: The list of users
 */
app.get("/users", (req, res) => {
	// Map each tweet to acquire a list of users, 
	// then filter out users to ensure there are no duplicates
	return res.json(data?.map((tweet: any) => {
		return {
			id: tweet.user.id,
			name: tweet.user.name,
			screen_name: tweet.user.screen_name
		}
	}).filter((user: any, index: number, self: any) => {
		return self.findIndex((u: any) => u.id === user.id) === index;
	}));
});

app.post("/tweets", (req, res) => {
	if (!req.body.text || !req.body.id) {
		return res.status(400).json({ error: "invalid_body" });
	}

	if (data?.findIndex(tweet => tweet.id == req.body.id) != -1) {
		return res.status(400).json({ error: "invalid_id" });
	}

	data?.push({
		text: req.body.text,
		id: req.body.id,
	});

	return res.status(201).end();
});

app.patch("/users/:name", (req, res) => {
	if (!req.body.new_name	) {
		return res.status(400).json({ error: "invalid_body" });
	}

	data?.forEach((tweet: any) => {
		if (tweet.user.screen_name == req.params.name) {
			tweet.user.name = req.body.name;
		}
	});

	return res.status(204).end();
});

/**
 * Deletes a tweet given an id
 * Returns:
 *  - 200: The Deleted Tweet
 *  - 404: no_tweet_found error
 */
app.delete("/tweets/:id", (req, res) => {
	if (data?.findIndex(tweet => tweet.id == req.params.id) == -1) {
		return res.status(404).json({ error: "no_tweet_found" });
	}

	const tweet = data?.find(tweet => tweet.id == req.params.id)
	data = data?.filter(tweet => tweet.id != req.params.id);
	return res.json(tweet);
})

app.listen(3000, () => {
	console.log(`Listening at: http://127.0.0.1:3000/`);
	const input = fs.readFileSync(`${__dirname}/favs.json`, "utf8");
	try {
		data = JSON.parse(input);
	} catch (e) {
		console.error(e);
	}
});