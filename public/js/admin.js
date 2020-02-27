// Process Event Request Async Function
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
