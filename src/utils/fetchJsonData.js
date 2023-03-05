export default async function fetchJsonData(...args) {
	const res = await fetch(...args);
	if (res.ok) {
		const jsonData = await res.json();
		return jsonData;
	} else {
		const errData = await res.json();
		throw new Error({
			statusCode: res?.status,
			data: errData
		});
	}
}
