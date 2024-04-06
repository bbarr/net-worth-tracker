
import { createElement, render } from 'https://cdn.skypack.dev/preact'
import { default as htm } from 'https://cdn.skypack.dev/htm'
const html = htm.bind(createElement)
export { render, html }
export * as hooks from 'https://cdn.skypack.dev/preact/hooks'

import * as ChartModule from 'https://cdn.jsdelivr.net/npm/chart.js@4.2.0/+esm'
ChartModule.Chart.register(...ChartModule.registerables)
export { ChartModule }
