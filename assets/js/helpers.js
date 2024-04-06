
import { uuid, omit, invert } from './util.js'

export function getNetWorthAt({ assets, liabilities, valuations, date }) {
  const datetime = date.toISOString()
  const accounts = [ ...assets, ...liabilities ]
  return accounts.reduce((memo, account, i) => {
    if (account.createdAt > datetime) return memo
    const valuation = valuations.find(v => v.accountId === account.id && v.createdAt < datetime)
    if (!valuation) return memo
    return memo + (assets[i] ? valuation.value : invert(valuation.value))
  }, 0)
}

export const collate = ({ links, assets, liabilities, valuations }) => {

  const now = new Date
  const twoWeeksAgo = (new Date()).setDate(now.getDate() - 14)
  const oneMonthAgo = (new Date()).setMonth(now.getMonth() - 1)
  const getFreshness = (dateString) => {
    const then = new Date(dateString)
    if (then < oneMonthAgo)
      return 2
    if (then < twoWeeksAgo)
      return 1
    return 0
  }


  const collated = {}

  let assetValue = 0
  let liabilityValue = 0
  let netWorth = 0
  let newAssets = []
  let newLiabilities = []
  let newValuations = valuations
  let newHistory = []

  for (const account of assets) {

    const latestValuation = valuations.find(v => v.accountId === account.id)
    if (!latestValuation) continue

    const newAsset = {
      ...account,
      value: latestValuation.value,
      lastUpdatedAt: latestValuation.createdAt,
      freshness: getFreshness(latestValuation.createdAt),
    }

    newAssets.push(newAsset)
    assetValue += latestValuation.value
    netWorth += latestValuation.value
  }

  for (const account of liabilities) {

    const latestValuation = valuations.find(v => v.accountId === account.id)
    if (!latestValuation) continue

    const newLiability = { 
      ...account, 
      value: latestValuation.value,
      lastUpdatedAt: latestValuation.createdAt,
      freshness: getFreshness(latestValuation.createdAt),
    }

    newLiabilities.push(newLiability)
    liabilityValue += latestValuation.value
    netWorth -= latestValuation.value
  }

  const sortByLastUpdatedAt = sortByAsc('lastUpdatedAt')
  collated.assets = newAssets.sort(sortByLastUpdatedAt)
  collated.liabilities = newLiabilities.sort(sortByLastUpdatedAt)
  collated.valuations = newValuations
  collated.calculations = {
    assetValue,
    liabilityValue,
    netWorth
  }
  collated.links = links

  let currentDate = new Date()
  for (let i = 0; i < 13; i++) {
    newHistory.unshift(getNetWorthAt({ date: currentDate, ...collated }) || null)
    currentDate.setMonth(currentDate.getMonth() - 1)
  }

  collated.history = newHistory

  return collated
}

const sortByAsc = key => (a, b) => {
  if (a[key] < b[key]) return -1
  else if (a[key] > b[key]) return 1
  return 0
}

export function createStubAsset() {
  return {
    id: uuid(),
    label: '',
    accountType: 'asset'
  }
}

export function createStubLiability() {
  return {
    id: uuid(),
    label: '',
    carriesBalance: true,
    accountType: 'liability'
  }
}

export function createStubAssetValuation() {
  return {
    id: uuid(),
  }
}

export function createStubLiabilityValuation() {
  return {
    id: uuid(),
  }
}

export function serializeLiability(liability) {
  const serialized = omit([ 'freshness', 'lastUpdatedAt', 'value' ], liability)
  serialized.interest = Math.round(parseFloat(serialized.interest) * 100)
  return serialized
}

export function serializeAsset(asset) {

}

export function unserializeLiability(liability) {
  const unserialized = liability
  unserialized.interest = unserialized.interest / 100
  return unserialized
}
