
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function uuid() {
  return window.crypto.randomUUID()
}

export function renderMoney(n) {
  if (isNaN(n)) 
    return '$--'
  return formatter.format(n)
}

export function renderPercent(n) {
  if (isNaN(n)) 
    return '--%'
  return `${Math.round(n * 10000) / 100}%`
}

export function renderNumber(n) {
  if (typeof n !== 'number' || isNaN(n) || n == Infinity) 
    return '--'
  return n.toString()
}

export function sum(arr, key) {
  return arr.reduce((sum, n) => sum + (key ? n[key] : n), 0)
}

export function separate(fn, arr) {
  return arr.reduce((memo, item) => {
    return fn(item) ? [ memo[0].concat(item), memo[1] ] : [ memo[0], memo[1].concat(item) ]
  }, [ [], [] ])
}

export function invert(n) {
  return n * -1
}

export const prevDef = fn => e => {
  e.preventDefault()
  return fn(e)
}

export const id = x => x
export const toNumber = x => parseInt(x)
export const concatToArray = (x, arr=[]) => arr.concat([ x ])
export const toggleInArray = (x, arr=[]) => arr.includes(x) ? arr.filter(y => y !== x) : arr.concat([ x ])
export const looksLikeFloat = x => {
  return (/^\d+(\.)?(\d+)?$/.test(x.trim())) 
}

export function omit(blacklist, obj) {
  return Object.keys(obj).reduce((omitted, key) => {
    if (blacklist.includes(key))
      return omitted
    return { ...omitted, [key]: obj[key] }
  }, {})
}

export const toArray = x => ([ x ])
export const toBool = x => !!x

export const loadStylesheet = url => {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('href', url)
  document.getElementsByTagName('head')[0].appendChild(link)
}

export const loadScript = async url => {
  const link = document.createElement('script')
  link.setAttribute('src', url)
  document.getElementsByTagName('head')[0].appendChild(link)
  await new Promise(res => link.onload = res)
}
