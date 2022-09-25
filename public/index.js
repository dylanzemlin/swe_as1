$(document).ready(() => {
	// Get Tweets
	$("#get_tweets").click(() => {
		$.ajax({
			url: "/tweets",
			type: "GET",
			success: (data) => {
				// Set modal title
				$("#modal_tweets_title").text("All Tweets");

				// Empty the table body
				$("#tweets_table_body").empty();

				// Add the tweets to the body of the table
				for (let i = 0; i < data.length; i++) {
					$("#tweets_table_body").append(
						`<tr>
							<td>${data[i].id}</td>
							<td>${data[i].created_at}</td>
							<td>${data[i].text}</td>
						</tr>`
					);
				}

				// Show the tweet modal
				$("#modal_tweets").modal({
					show: true
				});
			}
		});
	});

	// Get Specific Tweet
	$("#get_tweet").click(() => {
		const id = $("#get_tweet_id").val();
		if (!id || id == "") {
			return;
		}

		$.ajax({
			url: `/tweets/${id}`,
			type: "GET",
			success: (data) => {
				// Set modal title
				$("#modal_tweets_title").text(`Tweet: ${id}`);

				// Empty the table body
				$("#tweets_table_body").empty();

				// Add the tweet to the body of the table
				$("#tweets_table_body").append(
					`<tr>
						<td>${data.id}</td>
						<td>${data.created_at}</td>
						<td>${data.text}</td>
					</tr>`
				);

				// Show the tweet modal
				$("#modal_tweets").modal({
					show: true
				});
			}
		});
	});

	// Delete Specific Tweet
	$("#delete_tweet").click(() => {
		const id = $("#delete_tweet_id").val();
		if (!id || id == "") {
			return;
		}

		$.ajax({
			url: `/tweets/${id}`,
			type: "DELETE",
			success: () => {
				toastr.success(`Successfully deleted tweet: ${id}`, 'Tweet Deleted');
			},
			error: (data) => {
				toastr.error(data.responseJSON.error, 'Failed');
			}
		});
	});

	// Create New Tweet
	$("#create_tweet").click(() => {
		const id = $("#create_tweet_id").val();
		const text = $("#create_tweet_text").val();
		if (!id || id == "" || !text || text == "") {
			return;
		}

		$.ajax({
			url: `/tweets`,
			type: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			data: JSON.stringify({
				id: id,
				text: text
			}),
			success: () => {
				toastr.success(`Successfully created tweet: ${id}`, 'Tweet Created');
			},
			error: (data) => {
				toastr.error(data.responseJSON.error, 'Failed');
			}
		});
	});

	// Get Users
	$("#get_users").click(() => {
		$.ajax({
			url: "/users",
			type: "GET",
			success: (data) => {
				// Set modal title
				$("#modal_users_title").text("All Users");

				// Empty the table body
				$("#users_table_body").empty();

				// Add the users to the body of the table
				for (let i = 0; i < data.length; i++) {
					$("#users_table_body").append(
						`<tr>
							<td>${data[i].id}</td>
							<td>${data[i].name}</td>
							<td>${data[i].screen_name}</td>
						</tr>`
					);
				}

				// Show the user modal
				$("#modal_users").modal({
					show: true
				});
			}
		});
	});

	// Update User Name
	$("#update_name").click(() => {
		const name = $("#update_original_name").val();
		const screen_name = $("#update_screen_name").val();
		if (!name || name == "" || !screen_name || screen_name == "") {
			return;
		}

		$.ajax({
			url: `/users`,
			type: "PATCH",
			data: JSON.stringify({
				name,
				screen_name
			}),
			headers: {
				"Content-Type": "application/json"
			},
			success: () => {
				toastr.success(`Successfully updated name`, 'Name Updated');
			},
			error: (data) => {
				toastr.error(data.responseJSON.error, 'Failed');
			}
		});
	});
});