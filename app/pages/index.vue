<template>
  <div class="container">
    <div class="chart-container my-3 mb-10">
      <ChartLine
        :chart-data="chartData"
        :options="chartOption"
        :styles="chartStyles"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { ChartData, ChartOptions } from 'chart.js'
import moment from 'moment'
import { balances } from '../store/index'
import { ChartDataType } from '../store/balance'

@Component({
  async asyncData() {
    await balances.fetchBalanceData().then(() => {
      balances.getBalanceDataSet(ChartDataType.BALANCE)
      // balances.getBalanceDataSet(ChartDataType.CHANGE)
    })
  },
})
export default class extends Vue {
  get balancesData() {
    return balances.getBalanceData
  }

  get dateList() {
    return balances.getDateList
  }

  get getChangeData() {
    return balances.getChangeData
  }

  get last30DaysChange() {
    const dayCount = 30
    return balances.getBalanceChangeData
      .slice(dayCount * -1)
      .reverse()
      .map((change, index) => {
        return {
          date: moment()
            .utc()
            .subtract(index + 1, 'days')
            .startOf('days'),
          change,
        }
      })
  }

  get estimatedDate() {
    return (average: number) => {
      return moment()
        .add(parseInt((this.currentBalance / average).toString()), 'days')
        .format('YYYY-MM-DD')
    }
  }

  get estimatedDaysleft() {
    return (date: string) => {
      return moment(date).diff(moment(), 'days')
    }
  }

  get currentBalance() {
    return balances.getChartDatasets[0].data![
      balances.getChartDatasets[0].data!.length - 1
    ] as number
  }

  get chartData() {
    const chartData: ChartData = {
      // 横軸のラベル
      labels: this.dateList.map((d) => {
        return moment(d).format('YYYY-MM-DD')
      }),
      // データのリスト
      datasets: balances.getChartDatasets,
    }
    return chartData
  }

  get chartOption() {
    const chartOption: ChartOptions = {
      maintainAspectRatio: false,
      tooltips: {
        callbacks: {
          label(item) {
            return item.yLabel!.toLocaleString()
          },
        },
      },
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            position: 'left',
            ticks: {
              suggestedMin: 0,
              callback(value, _index, _values) {
                return ((value as number) / 1000000).toLocaleString() + ' m'
              },
            },
          },
        ],
      },
    }
    return chartOption
  }

  get chartStyles() {
    // チャートのスタイル: <canvas>のstyle属性として設定
    const chartStyles = {
      height: '100%',
      width: '100%',
    }
    return chartStyles
  }
}
</script>
