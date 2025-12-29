
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
    const assetValue = valuations.filter(v => v.createdAt <= state.contextDate).find(v => v.accountId === link.assetId)?.value
    const liabilityValue = valuations.filter(v => v.createdAt <= state.contextDate).find(v => v.accountId === link.liabilityId)?.value
    return assetValue && liabilityValue && (sum + (liabilityValue / assetValue))
  }, 0) / links.length) : ''

  const stats = [
    { label: 'Effective Debt Interest Rate', glossaryKey: 'effective-debt-interest-rate', value: renderPercent(effectiveRate) },
    { label: 'Estimated Annual Debt Expense', glossaryKey: 'estimated-annual-interest-cost', value: renderMoney(interestCost) },
    { label: 'Assets / Debt', glossaryKey: 'assets-to-debt', value: renderNumber(assetsToDebt) },
    { label: 'Average Loan to Value', glossaryKey: 'loan-to-value', value: renderPercent(averageLoanToValue) }
  ]

  return html`
    <div class="mt-5 grid grid-cols-2 gap-4">
      ${stats.map(stat => {
        return html`
          <div class="shadow bg-gray-50 dark:bg-transparent px-4 py-8 rounded flex flex-col justify-between">
            <div class="text-center text-base mb-3 dark:text-gray-400 flex items-center justify-center">
              <a href="#" class="uppercase link-definition" onClick=${prevDef(() => actions.update({ glossaryKey: stat.glossaryKey }))}>
                ${stat.label}
              </a>
            </div>
            <div class="text-center text-4xl">${stat.value}</div>
          </div>
        `
      })}
    </div>
  `
}
