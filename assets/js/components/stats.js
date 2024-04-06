
import { html } from '../deps.js'
import { prevDef, invert, separate, sum, renderMoney, renderPercent, renderNumber } from '../util.js'

export default ({ state, actions }) => {

  const { liabilities, assets, links, valuations } = state

  const ratedLiabilities = liabilities.filter(l => l.interest > 0 && l.carriesBalance)
  const ratedLiabilitiesSum = sum(ratedLiabilities, 'value')
  const effectiveRate = ratedLiabilities.length ? (
    ratedLiabilities.reduce((memo, l) => {
      return memo + ((l.interest / 10000) * l.value)
    }, 0) / ratedLiabilitiesSum
  ) : ''

  const isCurrent = a => (a.liquidity === 1 || a.liquidity === 2) || a.termLength === 1
  const isCash = a => a.liquidity === 1
  const assetsToDebt = Math.round(sum(assets, 'value') / sum(liabilities, 'value') * 100) / 100
  const currentAssetsToDebt = Math.round(sum(assets.filter(isCurrent), 'value') / sum(liabilities.filter(isCurrent), 'value') * 100) / 100
  const workingCapital = sum(assets.filter(isCash), 'value') - sum(liabilities.filter(isCurrent), 'value')
  const interestCost = !ratedLiabilitiesSum ? 0 : ratedLiabilitiesSum * (effectiveRate)
  const [ cashAssets, nonCashAssets ] = separate(isCash, assets)
  const cashTotal = sum(cashAssets, 'value')
  const averageLoanToValue = links.length ? (links.reduce((sum, link) => {
    const assetValue = valuations.find(v => v.accountId === link.assetId)?.value
    const liabilityValue = valuations.find(v => v.accountId === link.liabilityId)?.value
    return assetValue && liabilityValue && (sum + (liabilityValue / assetValue))
  }, 0) / links.length) : ''

  return html`
    <div class="mt-5 grid grid-cols-3 gap-4">
      <div class="shadow bg-gray-50 dark:bg-transparent px-4 py-8 rounded">
        <div class="text-center text-xl mb-3 dark:text-gray-400 flex items-center justify-center">
          <a href="#" class="uppercase link-definition" onClick=${prevDef(() => actions.update({ glossaryKey: 'effective-debt-interest-rate' }))}>
            Effective Debt Interest Rate
          </a>
        </div>
        <div class="text-center text-4xl">${renderPercent(effectiveRate)}</div>
        <!--
        <div class="flex items-center justify-center text-sm mt-2 dark:text-gray-400">
          (versus <a href="#" onClick=${prevDef(() => actions.update({ glossaryKey: 'risk-free-rate' }))} class="link-definition mx-1">risk-free rate</a> of 3.82%)
        </div>
          -->
      </div>
      <div class="shadow bg-gray-50 dark:bg-transparent px-4 py-8 rounded">
        <div class="text-center text-xl mb-3 dark:text-gray-400">
          <a href="#" class="uppercase link-definition" onClick=${prevDef(() => actions.update({ glossaryKey: 'estimated-annual-interest-cost' }))}>
            Estimated Annual Debt Expense
          </a>
        </div>
        <div class="text-center text-4xl">${renderMoney(interestCost)}</div>
      </div>
      <div class="shadow bg-gray-50 dark:bg-transparent px-4 py-8 rounded">
        <div class="text-center text-xl mb-3 dark:text-gray-400">
          <a href="#" class="uppercase link-definition" onClick=${prevDef(() => actions.update({ glossaryKey: 'assets-to-debt' }))}>
            Assets / Debt
          </a>
        </div>
        <div class="text-center text-4xl">${renderNumber(assetsToDebt)}</div>
      </div>
    </div>
    <div class="mt-5 grid grid-cols-3 gap-4">
      <div class="shadow bg-gray-50 dark:bg-transparent px-4 py-8 rounded">
        <div class="text-center text-xl mb-3 dark:text-gray-400">
          <a href="#" class="uppercase link-definition" onClick=${prevDef(() => actions.update({ glossaryKey: 'loan-to-value' }))}>
            Average Loan to Value
          </a>
        </div>
        <div class="text-center text-4xl">${renderPercent(averageLoanToValue)}</div>
      </div>
    </div>
  `
}
