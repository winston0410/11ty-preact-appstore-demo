const fetchRequest = async (apiUrl) => await fetch(apiUrl)
  .then(response => response.json())

export {
  fetchRequest
}
