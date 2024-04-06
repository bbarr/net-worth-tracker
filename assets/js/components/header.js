
import { html } from '../deps.js'
import { clearCache } from '../db.js'
import { goTo } from '../router.js'
import { prevDef } from '../util.js'

export default ({ state, actions }) => {

  function onLogOut() {
    clearCache()
    goTo('/launch')
  }

  return html`
    <header class="py-10 max-w-7xl mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-semibold">
        Net Worth Tracker
      </h1>
      <div class="">
        <a href="#" onClick=${prevDef(onLogOut)} class="ml-4 button-passive">Exit File</a>
      </div>
    </header>
  `
}
