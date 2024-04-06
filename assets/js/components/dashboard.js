
import { html, hooks } from '../deps.js'
import Header from './header.js'
import Progress from './progress.js'
import Stats from './stats.js'
import Assets from './assets.js'
import Liabilities from './liabilities.js'
import { renderPercent, prevDef, renderMoney } from '../util.js'

import { createStubAsset, createStubLiability } from '../helpers.js'

export default ({ state, actions }) => {
  
  const { history, liabilities, assets } = state
  const isNew = !liabilities.length && !assets.length

  const [ wasNew, setWasNew ] = hooks.useState(isNew)

  const eh = history.filter(h => !!h)

  const avg12 = eh.length === 12 ? (eh[11] - eh[0]) / eh[0] : '--'
  const avg6 = eh.length >= 6 ? (eh[6] - eh[0]) / eh[0] : '--'
  const avg3 = eh.length >= 3 ? (eh[3] - eh[0]) / eh[0] : '--'

  if (isNew) {
    return html`
    <div class="">
      <${Header} state=${state} actions=${actions} />
      <div class="mt-20 max-w-5xl mx-auto text-center">
        <div class="text-4xl font-semibold">Welcome!</div>
        <div class="text-2xl mt-10 prose dark:prose-invert mx-auto">
          <p>This dashboard is a thing of beauty, but only if there is data to work with.
          <br />Let's get started by adding our first asset and liability accounts.</p>
        </div>
        <div class="flex justify-center items-center mt-10">
        ${assets.length ? 
          html`<div class="button-passive mr-6" disabled>Asset added!</div>` :
          html`<button onClick=${prevDef(() => actions.update({ editingAsset: createStubAsset() }))} class="button mr-6">Add an Asset</button>`}
        ${liabilities.length ?
          html`<div class="button-passive mr-6" disabled>Liability added!</div>` :
          html`<button onClick=${prevDef(() => actions.update({ editingLiability: createStubLiability() }))} class="button">Add a Liability</button>`}
        </div>
      </div>
    </div>
    `
  }

  hooks.useEffect(() => {
    if (!isNew && wasNew) {
      setTimeout(() => {
        setWasNew(false)
      }, 3000)
    }
  }, [ liabilities.length, assets.length ])

  if (wasNew) {
    return html`
    <div class="">
      <${Header} state=${state} actions=${actions} />
      <div class="mt-20 max-w-5xl mx-auto text-center">
        <div class="text-4xl font-semibold">Building dashboard...</div>
        <div class="text-3xl mt-10 prose dark:prose-invert mx-auto">
          <p>Once there, you can review your stats and add more accounts!</p>
        </div>
      </div>
    </div>
    `
  }

  return html`
    <div class="">
      <${Header} state=${state} actions=${actions} />
      <div class="mt-20 max-w-5xl mx-auto">
        <div class="text-6xl text-center font-semibold">${renderMoney(state.calculations.netWorth)}</div>
        <div class="mt-14 w-4/5 mx-auto">
          <${Progress} history=${state.history} />
        </div>
      </div>
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-center items-center">
          <div class="p-8">
            <div class="text-center text-xl mb-2 dark:text-gray-400">12-Month Change</div>
            <div class="text-center text-2xl">${renderPercent(avg12)}</div>
          </div>
          <div class="p-8 mx-10">
            <div class="text-center text-xl mb-2 dark:text-gray-400">6-Month Change</div>
            <div class="text-center text-2xl">${renderPercent(avg6)}</div>
          </div>
          <div class="p-8">
            <div class="text-center text-xl mb-2 dark:text-gray-400">3-Month Change</div>
            <div class="text-center text-2xl">${renderPercent(avg3)}</div>
          </div>
        </div>
        <${Stats} state=${state} actions=${actions} />
        <div class="mt-20 max-w-7xl mx-auto">
          <div class="flex justify-between">
            <div class="w-1/2 pr-10">
              <${Assets} state=${state} actions=${actions} />
            </div>
            <div class="w-1/2 pl-10">
              <${Liabilities} state=${state} actions=${actions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}
