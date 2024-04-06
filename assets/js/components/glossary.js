
import * as api from '../api.js'
import { html, hooks } from '../deps.js'

import { renderMoney, prevDef, id, toNumber, omit } from '../util.js'

import { createStubLiabilityValuation, createStubLiability } from '../helpers.js'

import items from '../glossary.js'

import Icon from './icon.js'

export default ({ slug, onClose, onChange }) => {

  const [ current, update ] = hooks.useState(slug)

  const updater = (key, modifier) => e => {
    e.preventDefault()
    update({ ...current, [key]: (modifier || id)(e.target.value) })
  }

  function sluggify(item) {
    return item.name.toLowerCase().replace(/[\W\s]/g, '-')
  }

  const item = items.find(item => item.slug === slug)

  return html`
    <div class="fixed inset-0 bg-white flex flex-col justify-center items-center dark:bg-gray-900">
      <div class="fixed top-0 right-0 p-6 dark:text-gray-400">
        <button class="" onClick=${prevDef(onClose)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12.88,12l7.56-7.56l-0.88-0.88L12,11.12L4.44,3.56L3.56,4.44L11.12,12l-7.56,7.56l0.88,0.88L12,12.88l7.56,7.56l0.88-0.88L12.88,12z"></path></svg>
          <span>Esc</span>
        </button>
      </div>
      <div class="max-w-[80vw] w-full p-10 h-[100vh] overflow-y-auto">
        <div class="mb-8 font-semibold text-3xl flex justify-between items-center">
          Glossary
        </div>
        <div class="flex mt-8">
          <div class="w-1/4 border-r border-gray-400">
            ${items.map(item => {
              return html`<a class="block p-4 ${item.slug === slug ? 'bg-gray-100 dark:bg-gray-600' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}" href="#" onClick=${prevDef(() => onChange(item.slug))}>${item.name}</a>`
            })}
          </div>
          <div class="w-3/4 py-4 px-8">
            <div id="${sluggify(item)}" class="">
              <h3 class="mb-4 text-xl font-semibold">${item.name}</h3>
              <div class="prose dark:prose-invert mt-8" innerHTML=${item.body}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}
