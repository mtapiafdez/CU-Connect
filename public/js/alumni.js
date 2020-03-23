/* ==================================================
                EVENT REQUEST PAGE
================================================== */
// Cancel Event Request Async Function
const cancelRequest = async btn => {
	const reqEventId = btn.parentNode.querySelector("[name=reqEventId]").value;
	const csrf = btn.parentNode.querySelector("[name=_csrf").value;

	const requestedEventElement = btn.closest(".request-event-item");

	try {
		const result = await fetch(`/delete-requested/${reqEventId}`, {
			method: "DELETE",
			headers: {
				"csrf-token": csrf
			}
		});
		const data = await result.json();

		if (data.message === "SUCCESS") {
			requestedEventElement.parentNode.removeChild(requestedEventElement);
		} else {
			alert("Issue Canceling Event Request");
		}
	} catch (err) {
		console.log(err);
	}
};

/* ==================================================
                CONNECTION PAGE
================================================== */
// Search For Connection - Connect Page
const searchConnection = async () => {
	const nameFilter = $("#nameFilter").val();
	const classYear = $("#classYear").val();
	const major = $("#major").val();

	try {
		const result = await fetch(
			`/getConnections?name=${nameFilter}&classYear=${classYear}&major=${major}`
		);
		const data = await result.json();

		// Check for Error Message
		if (data.length > 0) {
			let searchMessage = $(".connect-table-message");
			if (searchMessage) {
				searchMessage.remove();
			}

			let htmlBulk = "";
			data.forEach(alumnus => {
				htmlBulk += `
                <tr onclick="fillModalData('${alumnus._id}');" data-toggle="modal" data-target="#connectModal">
                    <td>${alumnus.firstName}</td>
                    <td>${alumnus.lastName}</td>
                    <td>${alumnus.classYear}</td>
                    <td>${alumnus.major}</td>
                </tr>
                `;
			});
			$("#connect-payload").html(htmlBulk);
		} else {
			$("#connect-payload").html("");
			$("#connect-table-area").append(`
                <p class="connect-table-message">No results</p>
            `);
		}
	} catch (err) {
		console.log(err);
	}
};

const fillModalData = userId => {
	$("#requestConnectionButton").attr("onclick", `connectToUser('${userId}')`);
};

// Make Connection
const connectToUser = async userToConnect => {
	const requestMessage = $("#requestMessage").val();
	const requestId = $("#requestId").val();
	const csrf = $("#connectCsrf").val();

	try {
		const result = await fetch("/sendConnection", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"csrf-token": csrf
			},
			body: JSON.stringify({
				requestMessage: requestMessage,
				requestId: requestId,
				userToConnect: userToConnect
			})
		});
		const data = await result.text();
		if (data === "SUCCESS") {
			$("#connectModal").modal("toggle");
			alert("SUCCESSFULLY REQUESTED");
		} else {
			$("#connectModal").modal("toggle");
			alert("COULD NOT REQUEST");
		}
	} catch (err) {
		console.log(err);
	}
};

/* ==================================================
                ME PAGE
================================================== */
const manageConnectionRequest = async (btn, connectionToParse, type) => {
	const csrf = $("#connectCsrf").val();

	try {
		const result = await fetch(
			`/manageConnectionRequest?connectionToParse=${connectionToParse}&type=${type}`,
			{
				method: "PATCH",
				headers: {
					"csrf-token": csrf
				}
			}
		);

		const data = await result.text();
		if (data === "SUCCESS") {
			$(btn)
				.parent()
				.parent()
				.remove();
			$("#connectModal").modal("toggle");

			alert(`SUCCESSFULLY ${type}`);
		} else {
			$("#connectModal").modal("toggle");
			alert("FAILED");
		}
	} catch (err) {
		console.log(err);
	}
};
