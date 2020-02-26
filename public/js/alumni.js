// Cancel Event Request Async Function
const cancelRequest = async btn => {
	const reqEventId = btn.parentNode.querySelector("[name=reqEventId]").value;
	const csrf = btn.parentNode.querySelector("[name=_csrf").value;

	const requestedEventElement = btn.closest(".requested-event-item");

	try {
		const result = await fetch(`/delete-requested/${reqEventId}`, {
			method: "DELETE",
			headers: {
				"csrf-token": csrf
			}
		});
		const data = await result.json();
		console.log(data);

		requestedEventElement.parentNode.removeChild(requestedEventElement);
	} catch (err) {
		console.log(err);
	}
};
