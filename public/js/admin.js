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
					"csrf-token": csrf,
				},
			}
		);

		const data = await result.json();

		if (data.message === "SUCCESS") {
			requestedEventElement.parentNode.removeChild(requestedEventElement);
			const containerEmpty =
				$("#event-approval-container").html().trim() === "";
			if (containerEmpty) {
				$("#event-approval-container").html(
					`<h4 class="text-center mt-5">No pending event approvals</h4>`
				);
			}
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
const searchAlumni = async (btn) => {
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

		console.log(data);

		if (data.length > 0) {
			let searchMessage = $(".search-table-message");
			if (searchMessage) {
				searchMessage.remove();
			}

			let htmlBulk = "";
			data.forEach((alumnus) => {
				htmlBulk += `
                <tr data-toggle="modal" data-target="#searchModal">
                    <td>${alumnus.firstName}</td>
                    <td>${alumnus.lastName}</td>
                    <td>${alumnus.major}</td>
                    <td>${alumnus.occupation}</td>
                    <td>${alumnus.company}</td>
                    <td style="display:none;">${alumnus._id}</td>
                </tr>
                `;
			});
			$("#alumni-payload").html(htmlBulk);
		} else {
			$("#alumni-payload").html("");

			if ($(".search-table-message").length === 0) {
				$("#search-table-area").append(`
                <p class="search-table-message">No results</p>
            `);
			}
		}
	} catch (err) {
		console.log(err);
	}
};

$("#searchButton").click((evt) => {
	const additionalExpanded =
		evt.target.attributes["aria-expanded"].value == "false";

	if (additionalExpanded) {
		evt.target.innerText = "-";
	} else {
		evt.target.innerText = "+";
	}
});

$("#searchModal").on("show.bs.modal", async (evt) => {
	const lastItemIndex = evt.relatedTarget.children.length - 1;
	const searchId = evt.relatedTarget.children[lastItemIndex].textContent;

	const result = await fetch(
		`/admin/alumni/getAlumni?id=${searchId}&type=individual`
	);
	const data = await result.json();

	const {
		firstName,
		lastName,
		email,
		phone,
		addressLineMain,
		addressLineSecondary,
		city,
		state,
		zip,
		classYear,
		major,
		occupation,
		company,
	} = data;

	$("#firstNameModal").html(firstName);
	$("#lastNameModal").html(lastName);
	$("#emailModal").html(email);
	$("#phoneModal").html(phone);
	$("#addressMainModal").html(addressLineMain);
	$("#addressSecondaryModal").html(addressLineSecondary);
	$("#cityModal").html(city);
	$("#stateModal").html(state);
	$("#zipModal").html(zip);
	$("#classYearModal").html(classYear);
	$("#majorModal").html(major);
	$("#occupationModal").html(occupation);
	$("#companyModal").html(company);
});

/* ==================================================
                SITE CONFIG
================================================== */
const setButtonClicked = (btn) => {
	btn.parentNode.querySelector("[name=btnClicked]").value = btn.value;
};

$("#collapseControlButton").click((btn) => {
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
