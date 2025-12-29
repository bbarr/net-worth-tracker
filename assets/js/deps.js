
import { h, render } from 'https://esm.sh/preact@10.19.3'
import htm from 'https://esm.sh/htm@3.1.1'
const html = htm.bind(h)
export { render, html }
export * as hooks from 'https://esm.sh/preact@10.19.3/hooks'

import * as ChartModule from 'https://cdn.jsdelivr.net/npm/chart.js@4.2.0/+esm'
ChartModule.Chart.register(...ChartModule.registerables)
export { ChartModule }
