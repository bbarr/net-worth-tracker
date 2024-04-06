
import { ChartModule, html, hooks } from '../deps.js'
import { renderMoney } from '../util.js'

function getHistoryLabels() {
  const MONTHS = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
  const labels = ['Now']
  let currentDate = new Date
  for (let i = 0; i < 12; i++) {
    currentDate.setMonth(currentDate.getMonth() - 1)
    if (currentDate.getMonth() === 11) currentDate.setFullYear(currentDate.getFullYear() - 1)
    labels.unshift(MONTHS[currentDate.getMonth()].slice(0, 3))
  }
  return labels
}

export default ({ history }) => {

  const canvas = hooks.useRef(null)
  const chart = hooks.useRef(null)
  
  hooks.useEffect(async () => {
    if (!canvas.current) return

    if (!chart.current) {
      chart.current = new ChartModule.Chart(
        canvas.current.getContext('2d'),
        { type: 'line' }
      )
    }

    chart.current.options = {
      spanGaps: true,
      aspectRatio: 4,
      plugins: {
        legend: {
          display: false
        },
      },
      scales: {
        x: {
          ticks: {
            align: 'inner',
          }
        },
        y: {
          grace: 20,
          ticks: {
            callback: (value, index, ticks) => {
              return renderMoney(value)
            }
          }
        }
      }
    }
    chart.current.data = {
      labels: getHistoryLabels(),
      datasets: [{
        data: history
      }]
    }

    chart.current.update()
  }, [ canvas, history ])

  return html`
    <canvas ref=${canvas}></canvas>
  `

}
