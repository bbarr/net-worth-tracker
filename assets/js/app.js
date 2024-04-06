
import { html, render, hooks } from './deps.js'

import { getDataFromCache } from './db.js'

import * as router from './router.js'

import * as api from './api.js'
import { collate } from './helpers.js'
import { loadStylesheet, loadScript } from './util.js'

import Footer from './components/footer.js'
import Launch from './components/launch.js'
import Dashboard from './components/dashboard.js'
import AssetForm from './components/asset-form.js'
import AssetValuationForm from './components/asset-valuation-form.js'
import LiabilityForm from './components/liability-form.js'
import LiabilityValuationForm from './components/liability-valuation-form.js'
import Glossary from './components/glossary.js'
  
const App = ({ state, actions }) => {

  hooks.useEffect(async () => {

    router.setup({
      '/': () => {
        router.goTo('/launch')
      },
      '/launch': () => {
        actions.update({ page: 'launch' })
      },
      
      '/dashboard': async () => {
        if (await refresh()) {
          actions.update({ page: 'dashboard' })
        }
      }
    })

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape')
        closeModal()
    })
  }, [])

  async function refresh() {
    try {
      const data = await getDataFromCache()
      const collated = collate(data)
      actions.update(collated)
      return true
    } catch(e) {
      router.goTo('/launch')
      return false
    }
  }

  const closeModal = async shouldRefresh => {
    const resetState = { editingAsset: null, editingLiability: null, revaluingAsset: null, revaluingLiability: null, glossaryKey: null } 
    if (shouldRefresh === true) {
      const data = await getDataFromCache()
      const collated = collate(data)
      actions.update({ ...resetState, ...collated })
    } else {
      actions.update({ ...resetState })
    }
  }

  return html`
    <div class="min-h-[100vh] dark:bg-gray-900 dark:text-white px-4 pb-64">
      ${state.page === 'launch' && html`<${Launch} actions=${actions} state=${state} />`}
      ${state.page === 'dashboard' && html`<${Dashboard} actions=${actions} state=${state} />`}
      ${state.editingAsset ?
        html`<${AssetForm} links=${state.links} liabilities=${state.liabilities} asset=${state.editingAsset} onCancel=${closeModal} />` : null
      }
      ${state.editingLiability ?
        html`<${LiabilityForm} links=${state.links} assets=${state.assets} liability=${state.editingLiability} onCancel=${closeModal} />` : null
      }
      ${state.revaluingAsset ?
        html`<${AssetValuationForm} asset=${state.revaluingAsset} onCancel=${closeModal} />` : null
      }
      ${state.revaluingLiability ?
        html`<${LiabilityValuationForm} liability=${state.revaluingLiability} onCancel=${closeModal} />` : null
      }
      ${state.glossaryKey ?
        html`<${Glossary} slug=${state.glossaryKey} onChange=${slug => actions.update({ glossaryKey: slug })} onClose=${closeModal} />` : null
      }
      <${Footer} />
    </div>
  `
}

let state = {
  calculations: {
    assetValue: 0,
    liabilityValue: 0,
    netWorth: 0
  },
  assets: [],
  liabilities: [],
  valuations: [],
  links: [],
  history: [],
  editingAsset: null,
  editingLiability: null,
  revaluingAsset: null,
  revaluingLiability: null,
  glossaryKey: null,
  page: 'loading',
  mainStat: 'net-worth'
}

const actions = {
  update(changes) {
    state = { ...state, ...changes }
    rerender()
  }
}

function rerender() {
  render(html`<${App} state=${state} actions=${actions} />`, document.body)
}

rerender()
