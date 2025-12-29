
import * as api from '../api.js'
import { html, hooks } from '../deps.js'

import { renderMoney, prevDef, id, toNumber, omit, toggleInArray } from '../util.js'

import { createStubAssetValuation, createStubLiability } from '../helpers.js'

import Icon from './icon.js'

export default ({ links, liabilities, asset, onCancel, onSave }) => {

  const [ current, update ] = hooks.useState({ ...asset })
  const [ pendingLinks, updatePendingLinks ] = hooks.useState([ ...links ])
  const [ errors, setErrors ] = hooks.useState({})

  const updater = (key, modifier) => e => {
    e.preventDefault()
    update({ ...current, [key]: (modifier || id)(e.target.value, current[key]) })
  }

  const toggleLink = e => {
    if (pendingLinks.find(l => l.liabilityId === e.target.value))
      updatePendingLinks(pendingLinks.filter(l => l.liabilityId !== e.target.value))
    else
      updatePendingLinks([ ...pendingLinks, { liabilityId: e.target.value, assetId: current.id } ])
  }

  const onDelete = e => {
    if (confirm(`Are you sure you want to delete the asset: ${current.label}`))
      api.deleteAsset(current).then(() => onCancel(true))
  }

  const onSubmit = e => {
    console.log('submitting', current)
    const newErrors = {}
    if (!current.label)
      newErrors.label = 'Please enter a name'
    if (!asset.id && typeof current.value !== 'number')
      newErrors.value = 'Please enter a value'
    if (!current.liquidity)
      newErrors.liquidity = 'Please select a liquidity level'

    setErrors(newErrors)
    if (!Object.keys(newErrors).length) {
      console.log('No errors!', current)
      api.saveAsset(omit([ 'freshness', 'lastUpdatedAt', 'value' ], current))
        .then(async resp => {

          await api.ensureLinks(current, pendingLinks)

          return !asset.label && api.saveValuation({ 
            ...createStubAssetValuation(), 
            value: current.value, 
            accountId: asset.id 
          })
        })
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
        <div class="mb-6 font-semibold text-2xl">${asset.label ? 'Update' : 'Create'} asset</div>
        <div>
          <label for="label" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
          <input value=${current.label} onInput=${updater('label')} type="text" id="label" class="input" placeholder="My Checking Account" />
          ${errors.label && html`
            <p class="mt-2 text-sm text-red-500 dark:text-red-500">${errors.label}</p>
          `}
        </div>

        ${!asset.label && html`
          <div class="mt-6">
            <label for="value" class="block text-sm font-medium text-gray-900 dark:text-white">Value</label>
            <p class="my-2 text-sm text-gray-500 dark:text-gray-400">Round to whole dollars, ie: $100</p>
            <input value=${current.value} onInput=${updater('value', toNumber)} type="number" id="value" class="input" placeholder="0" />
            ${errors.value && html`
              <p class="mt-2 text-sm text-red-500 dark:text-red-500">${errors.value}</p>
            `}
          </div>
        `}

        <div class="mt-6">
          <h3 class="font-semibold text-sm text-gray-900 dark:text-white">How soon can this be turned into cash?</h3>
          <div class="mt-2 flex">
            <div class="flex items-center h-5">
              <input onChange=${updater('liquidity', toNumber)} checked=${current.liquidity === 1} id="liquidity-1" aria-describedby="liquidity-1-para" type="radio" value="1" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <a href="#" class="cursor-default ml-2 text-sm" onClick=${updater('liquidity', () => 1)}>
              <label for="liquidity-1" class="font-medium text-gray-900 dark:text-gray-300">Immediately</label>
              <p id="liquidity-1-para" class="mt-1 text-xs font-normal text-gray-500 dark:text-gray-300">This is for cash and things that behave like cash: physical currency, checking/savings, money market accounts.</p>
            </a>
          </div>
          <div class="mt-2 flex">
            <div class="flex items-center h-5">
              <input onChange=${updater('liquidity', toNumber)} checked=${current.liquidity === 2} id="liquidity-2" aria-describedby="liquidity-2-para" type="radio" value="2" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <a href="#" class="cursor-default ml-2 text-sm" onClick=${updater('liquidity', () => 2)}>
              <label for="liquidity-2" class="font-medium text-gray-900 dark:text-gray-300">Soon, if really necessary</label>
              <p id="liquidity-2-para" class="mt-1 text-xs font-normal text-gray-500 dark:text-gray-300">
                This is for stocks, bonds, other assets with a ready market. Sale proceeds will be effected by luck of timing, eg: selling a stock when the market has dipped.
              </p>
            </a>
          </div>
          <div class="flex mt-4">
            <div class="flex items-center h-5">
              <input onChange=${updater('liquidity', toNumber)} checked=${current.liquidity === 3} id="liquidity-3" aria-describedby="liquidity-3-para" type="radio" value="3" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <a href="#" class="cursor-default ml-2 text-sm" onClick=${updater('liquidity', () => 3)}>
              <label for="liquidity-3" class="font-medium text-gray-900 dark:text-gray-300">Might take weeks or months</label>
              <p id="liquidity-3-para" class="mt-1 text-xs font-normal text-gray-500 dark:text-gray-300">
                This is for things where the buyers need to be found or require more due dilligence that slows the transaction down. Again, timing matters. Examples include: cars, real estate.
              </p>
            </a>
          </div>
          <div class="flex mt-4">
            <div class="flex items-center h-5">
              <input onChange=${updater('liquidity', toNumber)} checked=${current.liquidity === 4} id="liquidity-4" aria-describedby="liquidity-4-para" type="radio" value="4" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <a href="#" class="cursor-default ml-2 text-sm" onClick=${updater('liquidity', () => 4)}>
              <label for="liquidity-4" class="font-medium text-gray-900 dark:text-gray-300">Hopefully not for a long time</label>
              <p id="liquidity-4-para" class="mt-1 text-xs font-normal text-gray-500 dark:text-gray-300">Use this for things like private equity, retirement accounts (unless you are almost retirement age), and other long-term assets that would incur penalties by selling prematurely.</p>
            </a>
          </div>
          ${errors.liquidity && html`
            <p class="mt-2 text-sm text-red-500 dark:text-red-500">${errors.liquidity}</p>
          `}
        </div>

        ${liabilities.length ? html`
          <div class="mt-6">
            <label for="liabilities" class="block text-sm font-medium text-gray-900 dark:text-white">Related Liabilities</label>
            <p class="my-2 text-sm text-gray-500 dark:text-gray-400">Select any liabilities that were used to purchase this asset. Like if this was a house, you could select its mortgage here. </p>
            <div class="flex flex-wrap">
              ${liabilities.map(l => {
                return html`
                  <label class="border border-gray-100 p-2 mr-2 mb-2">
                    ${l.label}
                    <input class="ml-2" type="checkbox" onChange=${prevDef(toggleLink)} checked=${pendingLinks.find(pl => pl.assetId === current.id && pl.liabilityId === l.id)} value=${l.id} />
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
            ${asset.id && html`<button class="link-warning ml-2" onClick=${prevDef(onDelete)}>Delete</button>`}
          </div>
        </div>
      </form>
    </div>
  `
}
