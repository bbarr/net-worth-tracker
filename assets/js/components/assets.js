
import { html, hooks } from '../deps.js'

import { renderMoney, prevDef } from '../util.js'

import { createStubAsset } from '../helpers.js'

import Icon from './icon.js'

export default ({ state, actions }) => {
  return html`
    <div class="">
      <div class="mb-4 text-2xl font-semibold flex justify-between items-center">
        <div class="flex items-center dark:text-gray-400">
          Assets
          <a href="#" class="ml-4 link " onClick=${prevDef(() => actions.update({ editingAsset: createStubAsset() }))}>
            <${Icon} type="add" />
          </a>
        </div>
        <div class="">${renderMoney(state.calculations.assetValue)}</div>
      </div>
      <div class="">
        ${state.assets.map(asset => {
          return html`
            <div class="pt-4 pb-2 px-4 border border-b-0 border-gray-100 dark:bg-gray-700 dark:border-gray-600 text-lg first:rounded-t-lg last:rounded-b-lg">
              <div class="flex items-center justify-center">
                <div class="flex-1 flex text-gray-800 dark:text-white items-center">
                  <a href="#" class="text-gray-400 mr-2" onClick=${prevDef(() => actions.update({ editingAsset: asset }))}>
                    <svg class="w-4 h-4" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                       viewBox="0 0 512 512"  xml:space="preserve">
                        <g>
                        <path stroke="currentColor" fill="currentColor" d="M500.111,71.068l-59.195-59.174c-15.859-15.849-41.531-15.862-57.386-0.014l-38.378,38.378L57.257,338.187
                          c-7.775,7.768-13.721,17.165-17.443,27.498L1.801,471.476c-3.968,11.039-1.202,23.367,7.086,31.655
                          c8.298,8.296,20.634,11.046,31.669,7.083l105.778-38.024c10.332-3.722,19.73-9.674,27.501-17.443l277.874-277.888l0.017,0.013
                          l10.031-10.048l38.353-38.378l0.017-0.007C515.907,112.591,515.973,86.937,500.111,71.068z M136.729,445.475l-67.393,24.227
                          l-27.02-27.02l24.213-67.393c0.184-0.485,0.416-0.964,0.609-1.441l71.024,71.024C137.679,445.073,137.221,445.302,136.729,445.475z
                           M153.759,434.678c-0.956,0.956-1.978,1.836-3.011,2.703L74.63,361.263c0.863-1.025,1.739-2.051,2.696-3.007L363.814,71.732
                          l76.443,76.437L153.759,434.678z M480.031,108.385l-28.319,28.329l-1.421,1.421l-76.444-76.437l29.75-29.75
                          c4.758-4.74,12.463-4.747,17.245,0.014l59.199,59.174C484.796,95.884,484.806,103.575,480.031,108.385z"/>
                      </g>
                    </svg>
                  </a>
                  <div>${asset.label}</div>
                </div>
                <a class="" href="#" onClick=${prevDef(() => actions.update({ revaluingAsset: asset }))}>${renderMoney(asset.value)}</a>
              </div>
              <div class="mt-1 text-sm text-gray-400 flex justify-between">
                <div><a href="#" onClick=${prevDef(() => actions.update({ glossaryKey: 'liquidity' }))}  class="link-definition">Liquidity</a>: ${asset.liquidity === 1 ? 'High' : (asset.liquidity === 2 ? 'Medium' : (asset.liquidity === 3 ? 'Low' : 'Very Low'))}</div>
                <div class="flex items-center">
                  <a class="${asset.freshness > 0 && 'link'}" href="#" onClick=${prevDef(() => actions.update({ revaluingAsset: asset }))}>${asset.freshness > 0 ? 'Update' : 'Fresh'}</a>
                  <div class="ml-2 rounded-full w-2 h-2 ${asset.freshness === 0 ? 'bg-green-500' : (asset.freshness === 1 ? 'bg-yellow-500' : 'bg-red-500')}"></div>
                </div>
              </div>
            </div>
          `
        })}
      </div>
    </div>
  `
}
