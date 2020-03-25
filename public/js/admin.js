/* ==================================================
                PROCESS EVENT REQUEST PAGE
================================================== */
// ProcessRequest() => Process Event Request Async Function
const processRequest = async (btn, type) => {
	const reqEventId = btn.parentNode.querySelector("[name=reqEventId]").value;
	const csrf = btn.parentNode.querySelector("[name=_csrf").value;

	const requestedEventElement = btn.closest(".request-event-item");

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

		if (data.message === "SUCCESS") {
			requestedEventElement.parentNode.removeChild(requestedEventElement);
		} else {
			alert("Event Flag Changed Failed");
		}
	} catch (err) {
		console.log(err);
	}
};

/* ==================================================
                SEARCH ALUMNI PAGE
================================================== */
// SearchAlumni() => Gets Alumni By Filter
const searchAlumni = async btn => {
	const firstName = $("#firstName").val();
	const lastName = $("#lastName").val();
	const email = $("#email").val();
	const classYear = $("#classYear").val();
	const major = $("#major").val();
	const addressLineMain = $("#address1").val();
	const addressLineSecondary = $("#address2").val();
	const city = $("#city").val();
	const state = $("#state").val();
	const zip = $("#zip").val();
	const phone = $("#phone").val();
	const company = $("#company").val();
	const occupation = $("#occupation").val();

	const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

	try {
		const result = await fetch(
			`/admin/alumni/getAlumni?firstName=${firstName}&lastName=${lastName}&email=${email}&classYear=${classYear}&major=${major}&addressLineMain=${addressLineMain}&addressLineSecondary=${addressLineSecondary}&city=${city}&state=${state}&zip=${zip}&phone=${phone}&company=${company}&occupation=${occupation}`
		);
		const data = await result.json();

		if (data.length > 0) {
			let searchMessage = $(".search-table-message");
			if (searchMessage) {
				searchMessage.remove();
			}

			let htmlBulk = "";
			data.forEach(alumnus => {
				htmlBulk += `
                <tr data-toggle="modal" data-target="#searchModal">
                    <td>${alumnus.firstName}</td>
                    <td>${alumnus.lastName}</td>
                    <td>${alumnus.major}</td>
                    <td>${alumnus.occupation}</td>
                    <td>${alumnus.company}</td>
                </tr>
                `;
			});
			$("#alumni-payload").html(htmlBulk);
		} else {
			$("#alumni-payload").html("");
			$("#search-table-area").append(`
                <p class="search-table-message">No results</p>
            `);
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

/* ==================================================
                SITE CONFIG
================================================== */
const setButtonClicked = btn => {
	btn.parentNode.querySelector("[name=btnClicked]").value = btn.value;
};

$("#collapseControlButton").click(btn => {
	const type = $("#collapseControlButton").attr("controlling");
	if (type === "MANAGING") {
		$("#collapseControlButton").attr("controlling", "ADDING");
		$("#collapseControlButton").text("Manage Existing Items");
		$("#carouselManageBox").hide();
		$("#carouselAddBox").show();
	} else if (type === "ADDING") {
		$("#collapseControlButton").attr("controlling", "MANAGING");
		$("#collapseControlButton").text("Add New Item");
		$("#carouselAddBox").hide();
		$("#carouselManageBox").show();
	}
});
