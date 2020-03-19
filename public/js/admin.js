// ProcessRequest() => Process Event Request Async Function
const processRequest = async (btn, type) => {
	const reqEventId = btn.parentNode.querySelector("[name=reqEventId]").value;
	const csrf = btn.parentNode.querySelector("[name=_csrf").value;

	const requestedEventElement = btn.closest(".requested-event-item");

	try {
		const result = await fetch(
			`/admin/events/event-approval/${reqEventId}/${type}`,
			{
				method: "PATCH",
				headers: {
					"csrf-token": csrf
				}
			}
		);

		const data = await result.json();
		console.log(data);
		requestedEventElement.parentNode.removeChild(requestedEventElement);
	} catch (err) {
		console.log(err);
	}
};

// SearchAlumni() => Gets Alumni By Filter
const searchAlumni = async btn => {
	const firstName = $("#firstName").val();
	const lastName = $("#lastName").val();
	const email = $("#email").val();
	const classOf = $("#classOf").val();
	const major = $("#major").val();

	const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

	try {
		const result = await fetch(
			`/admin/alumni/getAlumni?firstName=${firstName}&lastName=${lastName}&email=${email}&classOf=${classOf}&major=${major}`
		);
		const data = await result.json();
		if (data.length > 0) {
			let htmlBulk = "";
			data.forEach(alumnus => {
				htmlBulk += `
                <tr>
                    <td>${alumnus.firstName}</td>
                    <td>${alumnus.lastName}</td>
                    <td>${alumnus.major}</td>
                    <td>${alumnus.occupation}</td>
                    <td>${alumnus.company}</td>
                </tr>
                `;
				$("#alumni-payload").html(htmlBulk);
			});
		}
	} catch (err) {
		console.log(err);
	}
};

$("#searchButton").click(evt => {
	const additionalExpanded =
		evt.target.attributes["aria-expanded"].value == "false";

	if (additionalExpanded) {
		evt.target.innerText = "-";
	} else {
		evt.target.innerText = "+";
	}
});
