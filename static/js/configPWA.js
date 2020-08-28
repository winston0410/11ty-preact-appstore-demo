const assignServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('../../service-worker.js')
      .then((res) => {
      })
      .catch(console.error)
  }
}

window.addEventListener('DOMContentLoaded', assignServiceWorker)
