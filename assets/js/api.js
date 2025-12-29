
import { writeToDisk, getDataFromCache, getFileHandleFromCache } from './db.js'

export async function saveAsset(asset) {
  return writeToDisk(existing => {
    const existingAsset = existing.assets.find(ea => ea.id === asset.id)

    const newAssets = existingAsset ? 
      existing.assets.map(a => a.id === asset.id ? asset : a) :
      existing.assets.concat([ asset ])

    return {
      ...existing,
      assets: newAssets
    }
  })
}

export async function saveLiability(liability) {
  return writeToDisk(existing => {
    const existingLiability = existing.liabilities.find(el => el.id === liability.id)

    const newLiabilities = existingLiability ? 
      existing.liabilities.map(l => l.id === liability.id ? liability : l) :
      existing.liabilities.concat([ liability ])

    return {
      ...existing,
      liabilities: newLiabilities
    }
  })
}

export async function saveValuation(valuation) {
  return writeToDisk(existing => {
    return {
      ...existing,
      valuations: [ 
        { 
          ...valuation,  
          createdAt: (new Date).toISOString()
        },
        ...existing.valuations
      ]
    }
  })
}

export async function deleteAsset(asset) {
  return writeToDisk(existing => {
    return {
      ...existing,
      assets: existing.assets.filter(a => a.id !== asset.id)
    }
  })
}

export async function deleteLiability(liability) {
  return writeToDisk(existing => {
    return {
      ...existing,
      liabilities: existing.liabilities.filter(l => l.id !== liability.id)
    }
  })
}

export async function ensureLinks(account, links) {
  return writeToDisk(existing => {
    return {
      ...existing,
      links
    }
  })
}
