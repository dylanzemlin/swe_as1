import express from "express";
import fs from "fs";
import path from "path";

// Create express application using json parsing and a public folder
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// Read in favs.json
let data: any[] | undefined = undefined;
const favs = fs.readFileSync(`${__dirname}/favs.json`, "utf8");
try {
  data = JSON.parse(favs);
} catch (e) {
  console.error(e);
}

// Serve index.html on the route '/'
app.get("/", (_, res) => {
	return res.sendFile(path.join(__dirname, "..", "src/index.html"));
});

/**
 * Gets all tweets and extracts specific fields (id, created_at, text)
 * Returns:
 * 	- 200: A list of tweets
 */
app.get("/tweets", (_, res) => {
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
app.get("/users", (_, res) => {
	// Map each tweet to acquire a list of users, 
	// then filter out users to ensure there are no duplicates
	return res.json(data?.map((tweet: any) => {
		if (tweet.user == null) {
			return undefined;
		}

		return {
			id: tweet.user?.id,
			name: tweet.user?.name,
			screen_name: tweet.user?.screen_name
		}
	}).filter((user: any, index: number, self: any) => {
		return self.findIndex((u: any) => u.id === user.id) === index;
	}));
});

/**
 * Creates a new tweet given a id and text
 * Returns:
 *  - 200: The new tweet (id, created_at, text)
 *  - 400: The body was invalid (no id or text)
 */
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
		created_at: new Date().toISOString()
	});

	return res.status(201).end();
});

/**
 * Updates a users screen name given a name and new screen name
 * Returns:
 * 	- 200: The user was updated successfully
 * 	- 400: Invalid body (no new_name field)
 */
app.patch("/users", (req, res) => {
	if (!req.body.screen_name || !req.body.name) {
		return res.status(400).json({ error: "invalid_body" });
	}

	if(!data?.some(tweet => tweet.user?.name == req.body.name)) {
		return res.status(404).json({ error: "no_user_found" });
	}

	data?.forEach((tweet: any) => {
		if (tweet.user.name == req.body.name) {
			tweet.user.screen_name = req.body.screen_name;
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

// Listen on port 3000 and log the url
app.listen(3000, () => {
	console.log(`Listening at: http://127.0.0.1:3000/`);
});