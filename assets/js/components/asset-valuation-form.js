
import * as api from '../api.js'
import { html, hooks } from '../deps.js'

import { renderMoney, prevDef, id, toNumber, omit } from '../util.js'

import { createStubAssetValuation, createStubLiability } from '../helpers.js'

import Icon from './icon.js'

export default ({ asset, onCancel }) => {

  const [ current, update ] = hooks.useState({ ...createStubAssetValuation(), accountId: asset.id, value: asset.value })
  const [ errors, setErrors ] = hooks.useState({})

  const updater = (key, modifier) => e => {
    e.preventDefault()
    update({ ...current, [key]: (modifier || id)(e.target.value) })
  }

  const onSubmit = e => {
    console.log('submitting', current)
    const newErrors = {}
    if (!current.value)
      newErrors.value = 'Please enter a value'

    setErrors(newErrors)
    if (!Object.keys(newErrors).length) {
      console.log('No errors!', current)
      api.saveValuation(current)
        .then(() => {
          onCancel(true)
        })
        .catch(e => {
          debugger
        })
    }
  }

  return html`
    <div class="fixed inset-0 bg-white flex justify-center items-center dark:bg-gray-900">
      <div class="fixed top-0 right-0 p-6 dark:text-gray-400">
        <button class="" onClick=${prevDef(onCancel)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12.88,12l7.56-7.56l-0.88-0.88L12,11.12L4.44,3.56L3.56,4.44L11.12,12l-7.56,7.56l0.88,0.88L12,12.88l7.56,7.56l0.88-0.88L12.88,12z"></path></svg>
          <span>Esc</span>
        </button>
      </div>
      <form class="max-w-full w-[500px] p-6" onSubmit=${prevDef(onSubmit)}>
        <div class="mb-6 font-semibold text-2xl">Update value of "${asset.label}"</div>
        <div class="mt-6">
          <label for="value" class="block text-sm font-medium text-gray-900 dark:text-white">Value</label>
          <p class="my-2 text-sm text-gray-500 dark:text-gray-400">Round to whole dollars.</p>
          <input value=${current.value} onInput=${updater('value', toNumber)} type="number" id="value" class="input" placeholder="0" />
          ${errors.value && html`
            <p class="mt-2 text-sm text-red-500 dark:text-red-500">${errors.value}</p>
          `}
        </div>
        <div class="flex items-center justify-between mt-10">
          <div>
            <button class="button">Save</button>
            <button class="button-passive ml-2" onClick=${prevDef(onCancel)}>Close</button>
          </div>
        </div>
      </form>
    </div>
  `
}
