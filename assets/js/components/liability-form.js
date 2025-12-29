

import * as api from '../api.js'
import { html, hooks } from '../deps.js'

import { looksLikeFloat, toArray, renderMoney, prevDef, id, toNumber, omit, toggleInArray } from '../util.js'

import { createStubLiabilityValuation, createStubLiability, serializeLiability, unserializeLiability } from '../helpers.js'

import Icon from './icon.js'

export default ({ links, assets, liability, onCancel, onSave }) => {

  const [ current, update ] = hooks.useState({ ...unserializeLiability(liability) })
  const [ pendingLinks, updatePendingLinks ] = hooks.useState([ ...links ])
  const [ errors, setErrors ] = hooks.useState({})

  const updater = (key, opts={}) => e => {
    const { modify, test, defaultValue=current[key] } = opts
    e.preventDefault()
    const modified = (modify || id)(e.target.value, current[key])
    const allowed = test ? test(modified) : true
    update({ ...current, [key]: allowed ? modified : defaultValue })
  }

  const toggleLink = e => {
    if (pendingLinks.find(l => l.assetId === e.target.value))
      updatePendingLinks(pendingLinks.filter(l => l.assetId !== e.target.value))
    else
      updatePendingLinks([ ...pendingLinks, { assetId: e.target.value, liabilityId: current.id } ])
  }

  const onDelete = e => {
    if (confirm(`Are you sure you want to delete the liability: ${current.label}`))
      api.deleteLiability(current).then(() => onCancel(true))
  }

  const onSubmit = e => {
    console.log('submitting', current)
    const newErrors = {}
    if (!current.label)
      newErrors.label = 'Please enter a name'
    if (!liability.label && typeof current.value !== 'number')
      newErrors.value = 'Please enter a value'
    if (!current.interest)
      newErrors.interest = 'Please enter an interest rate'
    if (!current.termLength)
      newErrors.termLength = 'Please select a term length'

    setErrors(newErrors)
    if (!Object.keys(newErrors).length) {
      console.log('No errors!', current)
      const serialized = serializeLiability(current)
      api.saveLiability(serialized)
        .then(async resp => {

          await api.ensureLinks(current, pendingLinks)

          return !liability.label && api.saveValuation({ 
            ...createStubLiabilityValuation(), 
            value: current.value, 
            accountId: liability.id
          })
        })
        .then(() => onCancel(true))
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
        <div class="mb-6 font-semibold text-2xl">${liability.label ? 'Update' : 'Create'} liability</div>
        <div>
          <label for="label" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
          <input value=${current.label} onInput=${updater('label')} type="text" id="label" class="input" placeholder="School Loan" />
          ${errors.label && html`
            <p class="mt-2 text-sm text-red-500 dark:text-red-500">${errors.label}</p>
          `}
        </div>
        ${!liability.label && html`
          <div class="mt-6">
            <label for="value" class="block text-sm font-medium text-gray-900 dark:text-white">Balance</label>
            <p class="my-2 text-sm text-gray-500 dark:text-gray-400">Round to whole dollars, ie: $100</p>
            <div class="flex mb-6">
              <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                $
              </span>
              <input value=${current.value} onInput=${updater('value', { modify: toNumber })} type="number" id="value" placeholder="0" class="input rounded-none rounded-r-lg" />
            </div>
            ${errors.value && html`
              <p class="mt-2 text-sm text-red-500 dark:text-red-500">${errors.value}</p>
            `}
          </div>
        `}
        <div class="mt-6">
          <label for="interest" class="block text-sm font-medium text-gray-900 dark:text-white">Interest rate</label>
          <div class="flex mb-6">
            <input value=${current.interest || ''} onInput=${updater('interest', { test: looksLikeFloat })} type="text" id="interest" placeholder="0.00" class="input rounded-none rounded-l-lg" />
            <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              %
            </span>
          </div>
          ${errors.interest && html`
            <p class="mt-2 text-sm text-red-500 dark:text-red-500">${errors.interest}</p>
          `}
        </div>
        <div class="mt-6">
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" onChange=${prevDef(e => update({ ...current, carriesBalance: !current.carriesBalance }))} checked=${!current.carriesBalance} value="" class="sr-only peer" />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Ignore interest</span>
          </label>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Check this if you never intend to pay any interest on this account, such as with a credit card on auto-pay.</p>
        </div>
        <div class="mt-6">
          <h3 class="font-semibold text-sm text-gray-900 dark:text-white">Term length</h3>
          <p class="my-2 text-sm text-gray-500 dark:text-gray-400">This refers to how long you have to pay the debt back.</p>
          <div class="flex">
            <div class="flex items-center h-5">
              <input onChange=${updater('termLength', { modify: toNumber })} checked=${current.termLength === 1} id="term-length-1" aria-describedby="term-length-1-para" type="radio" value="1" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <a href="#" class="cursor-default ml-2 text-sm" onClick=${updater('termLength', { modify: () => 1 })}>
              <label for="term-length-1" class="font-medium text-gray-900 dark:text-gray-300">Short</label>
              <p id="term-length-1-para" class="mt-1 text-xs font-normal text-gray-500 dark:text-gray-300">Use this for debts that are due in under a month. A good example would be credit cards that you will pay off every month and never carry a balance.</p>
            </a>
          </div>
          <div class="flex mt-4">
            <div class="flex items-center h-5">
              <input onChange=${updater('termLength', { modify: toNumber })} checked=${current.termLength === 2} id="term-length-2" aria-describedby="term-length-2-para" type="radio" value="2" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <a href="#" class="cursor-default ml-2 text-sm" onClick=${updater('termLength', { modify: () => 2 })}>
              <label for="term-length-2" class="font-medium text-gray-900 dark:text-gray-300">Medium</label>
              <p id="term-length-2-para" class="mt-1 text-xs font-normal text-gray-500 dark:text-gray-300">Use this for debts that are due in more than a month but less than a year. This could be a short-term loan or just the tail end of a long-term one.</p>
            </a>
          </div>
          <div class="flex mt-4">
            <div class="flex items-center h-5">
              <input onChange=${updater('termLength', { modify: toNumber })} checked=${current.termLength === 3} id="term-length-3" aria-describedby="term-length-3-para" type="radio" value="3" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <a href="#" class="cursor-default ml-2 text-sm" onClick=${updater('termLength', { modify: () => 3 })}>
              <label for="term-length-3" class="font-medium text-gray-900 dark:text-gray-300">Long</label>
              <p id="term-length-3-para" class="mt-1 text-xs font-normal text-gray-500 dark:text-gray-300">Use this for debts that are due in more than a year. A good example would be student loans or a mortgage.</p>
            </a>
          </div>
          ${errors.termLength && html`
            <p class="mt-2 text-sm text-red-500 dark:text-red-500">${errors.termLength}</p>
          `}
        </div>

        ${assets.length ? html`
          <div class="mt-6">
            <label for="assets" class="block text-sm font-medium text-gray-900 dark:text-white">Related assets</label>
            <p class="my-2 text-sm text-gray-500 dark:text-gray-400">Select any assets that were purchased using this liability. Like if this is a mortgage, you could select its property asset here.</p>
            <div class="flex flex-wrap max-h-[200px] overflow-y-auto">
              ${assets.map(a => {
                return html`
                  <label class="border border-gray-100 p-2 mr-2 mb-2">
                    ${a.label}
                    <input class="ml-2" type="checkbox" onChange=${prevDef(toggleLink)} checked=${pendingLinks.find(l => l.liabilityId === current.id && l.assetId === a.id)} value=${a.id} />
                  </label>
                `
              })}
            </div>
            ${errors.value && html`
              <p class="mt-2 text-sm text-red-500 dark:text-red-500">${errors.value}</p>
            `}
          </div>
        ` : ''}

        <div class="flex items-center justify-between mt-10">
          <div>
            <button class="button">Save</button>
            <button class="button-passive ml-2" onClick=${prevDef(onCancel)}>Close</button>
          </div>
          <div>
            ${liability.id && html`<button class="link-warning ml-2" onClick=${prevDef(onDelete)}>Delete</button>`}
          </div>
        </div>
      </form>
    </div>
  `
}
