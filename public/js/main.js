$("#signup-button-next").click(btn => {
	let currentPage = btn.target.attributes.page.value;

	// Validate
	const elementsToValidate = $(`.signup-section-${currentPage} input`);

	for (let i = 0; i < elementsToValidate.length; i++) {
		const valid = elementsToValidate[i].checkValidity();
		if (!valid) {
			$(elementsToValidate[i].reportValidity());
			return;
		}
	}

	// Hide Current Section
	$(`.signup-section-${currentPage}`).toggleClass("hide-section");

	// Show Next Section
	let newPage = Number(currentPage) + 1;
	$(`.signup-section-${newPage}`).toggleClass("hide-section");

	$("#signup-button-next").attr("page", newPage);

	if (newPage === 2) {
		const hasHideSection = $("#signup-button-prev").hasClass(
			"hide-section"
		);
		if (hasHideSection) {
			$("#signup-button-prev").toggleClass("hide-section");
		}
	}

	// TODO: YOU GET TO THE LAST PAGE AND THEN GO BACK THEN IT DOESN'T WORK
	// TODO: HAVE TWO BUTTONS?
	if (newPage === 4) {
		$("#signup-button-next").text("Sign up!");
		$("#signup-button-next").off("click");
		$("#signup-button-next").click(() => {
			let currentPage = btn.target.attributes.page.value;

			const elementsToValidate = $(
				`.signup-section-${currentPage} input`
			);
			console.log(elementsToValidate);
			for (let i = 0; i < elementsToValidate.length; i++) {
				const valid = elementsToValidate[i].checkValidity();
				if (!valid) {
					$(elementsToValidate[i].reportValidity());
					return;
				}
			}

			$("#signup-form").submit();
		});
	}
});

$("#signup-button-prev").click(() => {
	let currentPage = $("#signup-button-next").attr("page");
	let newPage = Number(currentPage) - 1;

	$(`.signup-section-${currentPage}`).toggleClass("hide-section");

	$("#signup-button-next").attr("page", newPage);

	$(`.signup-section-${newPage}`).toggleClass("hide-section");

	if (newPage === 1) {
		$("#signup-button-prev").toggleClass("hide-section");
	}
});
