import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import moment from 'moment'
import { ChartDataSets } from 'chart.js'
import { $axios } from '../utils/api'

const apiBaseUrl = 'https://data.ripple.com/'
export const strict = false
export enum ChartDataType {
  BALANCE,
  CHANGE,
}

export type balanceChangeDataType = {
  date: moment.Moment
  balance: number
  change: number
}

export type balanceDataType = {
  name: string
  address: string
  data: Array<balanceChangeDataType>
}

interface balanceType {
  currency: string
  value: string
}

interface responseBalancesType {
  result: string
  // eslint-disable-next-line camelcase
  ledger_index: number
  // eslint-disable-next-line camelcase
  close_time: string
  limit: number
  balances: Array<balanceType>
}

interface balanceChangeDescriptorType {
  // eslint-disable-next-line camelcase
  amount_change: string
  // eslint-disable-next-line camelcase
  final_balance: string
  // eslint-disable-next-line camelcase
  node_index: number | undefined
  // eslint-disable-next-line camelcase
  tx_index: number
  // eslint-disable-next-line camelcase
  change_type: string
  currency: string
  // eslint-disable-next-line camelcase
  executed_time: string
  counterparty: string
  // eslint-disable-next-line camelcase
  ledger_index: number
  // eslint-disable-next-line camelcase
  tx_hash: string
}

interface responseBalanceChangeType {
  result: string
  count: number
  marker?: string
  // eslint-disable-next-line camelcase
  balance_changes: balanceChangeDescriptorType[]
}
// https://xrpscan.com/account/rEhKZcz5Ndjm9BzZmmKrtvhXPnSWByssDv
// https://xrpscan.com/account/rDbWJ9C7uExThZYAwV8m6LsZ5YSX3sa6US

const TARGET_ADDRESS: Array<{ name: string; address: string }> = [
  // XRPScan
  { name: '', address: 'r3F5NsyiGwVYs2Rs3cCcrVw4t5wZP2ZxRr' },
  { name: '', address: 'r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV' },
  { name: '', address: 'r4LxkCUXYTCUgwquN3BnsUxFacoVLjGFyF' },
  { name: '', address: 'r4MoybfgCHDoUByYyMejimaX6a8CEtWtav' },
  { name: '', address: 'r8TR1AeB1RDQFabM6i8UoFsRF5basqoHJ' },
  { name: '', address: 'r93oSNBKuFjuKt8GxhF8VYaGzzwsNDPaX5' },
  { name: '', address: 'r9NpyVfLfUG8hatuCCHKzosyDtKnBdsEN3' },
  { name: '', address: 'r9UUEXn3cx2seufBkDa8F86usfjWM6HiYp' },
  { name: '', address: 'rB3WNZc45gxzW31zxfXdkx8HusAhoqscPn' },
  { name: '', address: 'rBg2FuZT91C52Nny68houguJ4vt5x1o91m' },
  { name: '', address: 'rBzM1P5zH3cssjqKqUT6uuxLWQAZkGmrrY' },
  { name: '', address: 'rDahLhHJaowRYn4hRkS9S2YpAeiTR8mjBF' },
  { name: '', address: 'rDbWJ9C7uExThZYAwV8m6LsZ5YSX3sa6US' },
  { name: '', address: 'rDdXiA3M4mYTQ4cFpWkVXfc2UaAXCFWeCK' },
  { name: '', address: 'rDqGA2GfveHypDguQ1KXrJzYymFZmKxEsF' },
  { name: '', address: 'rEi8BzmV1mMZ9pN1nUd111mmX3zuZuvw8W' },
  { name: '', address: 'rfakn148pevQPbpn38Hnn1mk7WxfdHdfAf' },
  { name: '', address: 'rffYK32pnicbmUvodKsLxTyQFJyEb23gaZ' },
  { name: '', address: 'rfWPPQBYqYmoFMdVnjzXCagJbz5uajSBXL' },
  { name: '', address: 'rGKHDyj4L6pc7DzRB6LWCR4YfZfzXj2Bdh' },
  { name: '', address: 'rGo1CzUcLiVBEQSqcf32pz5nEm38jTbhtk' },
  { name: '', address: 'rGtASNaiZMC2Xvjg2bR6b816TUz1gHgbZk' },
  { name: '', address: 'rh2EsAe2xVE71ZBjx7oEL2zpD4zmSs3sY9' },
  { name: '', address: 'rhEwsCWDCVxDiKxGJAKM6VuXC8EFtJP5gQ' },
  { name: '', address: 'rHGfmgv54kpc3QCZGRXEQKUhLPndbasbQr' },
  { name: '', address: 'rhyp1uMC9Xyj3Px8amUH3xVv6tbjYJkojs' },
  { name: '', address: 'rJAMeVrUyezc5TVrzwq7HUM4VzW4xUYZzR' },
  { name: '', address: 'rjWXZ8rKLz7B3w4nueAA12h9JmRDbHuuW' },
  { name: '', address: 'rKDvgGUsNPZxsgmoemfrgXPS2Not4co2op' },
  { name: '', address: 'rKveEyR1SrkWbJX214xcfH43ZsoGMb3PEv' },
  { name: '', address: 'rKwJaGmB5Hz24Qs2iyCaTdUuL1WsEXUWy5' },
  { name: '', address: 'rLAdBWnD6qufUTByWJXyBtC4hR3GSXaEbn' },
  { name: '', address: 'rMhkqz3DeU7GUUJKGZofusbrTwZe6bDyb1' },
  { name: '', address: 'rMQ98K56yXJbDGv49ZSmW51sLn94Xe1mu1' },
  { name: '', address: 'rN6mwh6XAtwNH53sFLWySfMsqPcW1mzEnb' },
  { name: '', address: 'rN8pqRwLYuuvY7pUHurybPC8P6rLqVsu6o' },
  { name: '', address: 'rNASJdZjY9dToHnNURi3HAUku3duPwbtD1' },
  { name: '', address: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM' },
  { name: '', address: 'rNKpohy2aF3ZJg27QLAhQHT5muoXYNrzSu' },
  { name: '', address: 'rNuF65SoNFRgi7KomddPeSpLhdB2Y7RnsN' },
  { name: '', address: 'rNz6HfHBA3nReSbVPwM6YE39MQoeS5SqLU' },
  { name: '', address: 'rP61PT2XWpvD5dJRHj6naiZcUYpJDhTfpq' },
  { name: '', address: 'rp6aTJmW3nq1aKt3Jmuz4DPRxksT5PBjpH' },
  { name: '', address: 'rpQhAu8n7WwwNPFeqXPDVZyNx8ShAQrYZU' },
  { name: '', address: 'rsjFB8mPWqiZgPUaVh8XYqdfa59PE2d5LG' },
  { name: '', address: 'rU3hoiEM3uQb7ihCZiLJpk6Hm2UDYNiXSq' },
  { name: '', address: 'rU9qmGM4Y6WWDhiNzkwVKBwwatcoE7YL1T' },
  { name: '', address: 'rw2hzLZgiQ9q62KCuaTWuFHWfiX7JWg3wY' },
  // gtgox
]
const startDate = moment()
  .subtract(1, 'days')
  .subtract(24, 'months')
  .utc()
  .startOf('days')
const endDate = moment().subtract(1, 'days').utc().endOf('days')

const fetchInitialBalance = async (address: {
  name: string
  address: string
}) => {
  console.log('fetchInitialBalance start : ' + address.name)
  const responseBalances: Promise<responseBalancesType> = $axios.$get(
    apiBaseUrl + 'v2/accounts/' + address.address + /balances/,
    { params: { date: startDate.toISOString(), currency: 'XRP' } }
  )
  console.log('fetchInitialBalance end : ' + address.name)
  try {
    return parseFloat((await responseBalances).balances[0].value)
  } catch {
    return 0
  }
}

const fetchData = async (address: { name: string; address: string }) => {
  console.log('fetchData start :' + address.name)
  const processData: Array<balanceChangeDataType> = []
  let marker: string | undefined = ''
  while (marker !== undefined) {
    const resData: responseBalanceChangeType = await $axios.$get(
      apiBaseUrl + 'v2/accounts/' + address.address + /balance_changes/,
      {
        params: {
          limit: 1000,
          descending: true,
          marker,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      }
    )
    console.log(startDate.toISOString())
    console.log(endDate.toISOString())
    console.log(resData)
    // eslint-disable-next-line camelcase
    let nextFinalBalanceData: { final_balance?: number; date?: moment.Moment }
    resData.balance_changes.forEach((b) => {
      if (b.change_type === 'payment_source') {
        const data: balanceChangeDataType = {
          date: moment(b.executed_time).utc().startOf('day'),
          balance: parseFloat(b.final_balance),
          change: parseFloat(b.amount_change),
        }
        if (nextFinalBalanceData && nextFinalBalanceData.date) {
          if (nextFinalBalanceData.date.isSame(data.date)) {
            // payment_source comes after payment_destination at the same day
            data.balance = nextFinalBalanceData.final_balance!
          } else {
            // payment_source comes after payment_destination at the different day
            const befDataOnlyPaymentDestAtDay = {
              date: nextFinalBalanceData.date,
              balance: nextFinalBalanceData.final_balance!,
              change: 0,
            }
            processData.push(befDataOnlyPaymentDestAtDay)
          }
        }
        // console.log(data)
        processData.push(data)
        nextFinalBalanceData = {}
      } else if (b.change_type === 'payment_destination') {
        if (
          processData[processData.length - 1] &&
          processData[processData.length - 1].date.isSame(
            moment(b.executed_time).utc().startOf('day')
          )
        ) {
          // when payment_destination comes after payment_source
        } else {
          // when payment_destination comes before payment_source
          nextFinalBalanceData = {
            final_balance: parseFloat(b.final_balance),
            date: moment(b.executed_time).utc().startOf('day'),
          }
        }
      }
    })
    marker = resData.marker
  }
  console.log('fetchData END : ' + address.name)
  return processData
}

@Module({
  name: 'balance',
  stateFactory: true,
  namespaced: true,
})
export default class balance extends VuexModule {
  balanceData: balanceDataType[] = []
  initialBalanceData: number[] = []
  chartDatasets: ChartDataSets[] = []
  dateList: moment.Moment[] = []
  balanceChangeData: number[] = []

  @Mutation
  appendExchangeData(data: balanceDataType) {
    this.balanceData = [...this.balanceData, data]
  }

  @Mutation
  appendInitalBalanceData(data: number) {
    this.initialBalanceData = [...this.initialBalanceData, data]
  }

  @Mutation
  setChartDatasets(data: ChartDataSets) {
    this.chartDatasets = [...this.chartDatasets, data]
  }

  @Mutation
  setDateList(dates: moment.Moment[]) {
    this.dateList = [...dates]
  }

  @Mutation
  setBalanceChangeData(data: number[]) {
    this.balanceChangeData = [...data]
  }

  @Action({ rawError: true })
  async fetchBalanceData() {
    const dates: Array<moment.Moment> = []
    for (
      const d = startDate.clone();
      d.isSameOrBefore(endDate);
      d.add(1, 'day')
    ) {
      dates.push(moment(new Date(d.toDate())))
    }
    this.setDateList([...dates])

    for (const address of TARGET_ADDRESS) {
      const rtnData = await fetchData(address)
      const appendData: balanceDataType = {
        name: address.name,
        address: address.address,
        data: rtnData,
      }
      this.appendExchangeData({ ...appendData })

      const initBlance = await fetchInitialBalance(address)
      this.appendInitalBalanceData(initBlance)
    }
  }

  @Action({ rawError: true })
  getBalanceDataSet(type: ChartDataType) {
    console.log('getBalanceDataSet start')
    const befBalance: number[] = this.getInitialBalanceData
    const retData = this.getDateList.map((date) => {
      const balanceDataList = this.getBalanceData.map((data, balanceIdx) => {
        const findData = data.data.find((d) => {
          return moment(d.date).isSame(date)
        })

        const setBalance =
          findData === undefined ? befBalance[balanceIdx] : findData.balance
        const setChange = findData === undefined ? 0 : findData.change
        befBalance[balanceIdx] =
          findData === undefined ? befBalance[balanceIdx] : findData.balance

        return type === ChartDataType.BALANCE ? setBalance : setChange
      })
      if (type === ChartDataType.BALANCE) {
        return balanceDataList.reduce((sum, element) => {
          return sum + element
        })
      } else {
        return (
          balanceDataList[
            this.getBalanceData.findIndex((b) => {
              return b.name === 'Jed(tacostand)'
            })
          ] * -1
        )
      }
    })
    this.setBalanceChangeData([...retData])
    this.setChartDatasets({
      type: type === ChartDataType.BALANCE ? 'line' : 'bar',
      label: type === ChartDataType.BALANCE ? 'Balance' : 'Release',
      data: retData,
      yAxisID: type === ChartDataType.BALANCE ? 'y-axis-1' : 'y-axis-2',
      pointRadius: 0,
      borderColor:
        type === ChartDataType.BALANCE
          ? 'rgba(200,200,200,1)'
          : 'rgba(253,174,107,0.8)',
      backgroundColor:
        type === ChartDataType.BALANCE
          ? 'rgba(254,230,206,0.8)'
          : 'rgba(253,174,107,0.8)',
    })
    console.log('getBalanceDataSet end')
  }

  get getInitialBalanceData() {
    return this.initialBalanceData
  }

  get getDateList() {
    return this.dateList
  }

  get getBalanceChangeData() {
    return this.balanceChangeData
  }

  get getChartDatasets() {
    return this.chartDatasets
  }

  get getBalanceData() {
    return this.balanceData
  }

  get getChangeData() {
    return this.chartDatasets[1].data! as number[]
  }
}
