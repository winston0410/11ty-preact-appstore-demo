const fetchRequest = (apiUrl) => fetch(apiUrl)
  .then(response => response.json())

export {
  fetchRequest
}
