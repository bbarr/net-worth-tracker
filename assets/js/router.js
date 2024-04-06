
let initialized = false
let routes = {}

window.addEventListener('click', e => {
  const path = e.target.tagName === 'A' && e.target.getAttribute('href')
  if (path && path.charAt(0) === '/') {
    e.preventDefault()
    window.history.pushState({ path }, null, path)
    handle(path)
  }
})

window.addEventListener("popstate", event => {
  const path = event.state?.path
  if (!path) debugger
  path && handle(path)
})

function handle(path) {
  const route = routes[path]
  if (!route) return console.error('Missing route: ', path)
  route()
}

export function setup(newRoutes) {
  routes = { ...routes, ...newRoutes }
  if (!initialized) {
    initialized = true
    handle(window.location.pathname)
  }
}

export function goTo(path) {
  window.history.pushState({ path }, null, path)
  handle(path)
}

