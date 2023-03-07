export default async function fetchJsonData(...args) {
  const res = await fetch(...args);
  if (res.ok) {
    const jsonData = await res.json();
    return jsonData;
  } else {
    const errData = await res.json();
    const error = Error('Error while fetching data');
    error.status = res.status;
    error.info = errData;
    throw error;
  }
}
