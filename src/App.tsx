import { FC, useState } from 'react'
import './styles.css'

const INIT_APY = 0.05

const MONTHS_IN_A_YEAR = 12
const MONEY_PER_MONTH = 600_000

const originalInvests = Array.from({ length: 20 }).fill([
  ...new Array(MONTHS_IN_A_YEAR).fill(MONEY_PER_MONTH),
]) as Array<number[]>

const YEARS_COUNT = originalInvests.length

function sum(numbers: number[]) {
  return numbers.reduce((prev, val) => prev + val, 0)
}

const TOTAL_MONEY_SAVED = sum(originalInvests.map(sum))

const formatMoney = (amount: number) => {
  const numberFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 2,
  })
  return numberFormatter.format(amount)
}

const InvestList: FC<{ apy: number }> = ({ apy }) => {
  function investsAfterYears(invests: typeof originalInvests) {
    return invests.map((monthlyInvests, i) => {
      let total = sum(monthlyInvests)

      const GROWS_PER_YEAR = 1 + apy

      total = Math.pow(GROWS_PER_YEAR, YEARS_COUNT - i)

      return total
    })
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {originalInvests.map((investsInYear, i) => {
        const savedInYear = sum(investsInYear)

        return (
          <li key={i}>
            <span>{`Year #${i + 1} - `}</span>
            <span>{formatMoney(savedInYear)}</span>
            <span style={{ color: 'gray' }}>{` (${formatMoney(
              savedInYear,
            )} per month), it grew into `}</span>
            <span>{``}</span>
          </li>
        )
      })}
    </ul>
  )
}

const InvestSummary: FC<{ apy: number }> = ({ apy }) => {
  let money = 0

  return (
    <>
      <div>
        {`After ${YEARS_COUNT} years, you earned: $${formatMoney(
          money,
        )} from ${formatMoney(TOTAL_MONEY_SAVED)} (invested ${formatMoney(
          (money / TOTAL_MONEY_SAVED) * 100,
        )}%)`}
      </div>
      <div>
        {`2% per year would be $${formatMoney((money * 0.02) / 12)} per month`}
      </div>
    </>
  )
}

export default function App() {
  const [apy, setApy] = useState(INIT_APY)

  return (
    <div className="App">
      <label>
        <span>{`APY:`}</span>
        <input
          type="number"
          min={-100}
          max={100}
          value={apy * 100}
          onChange={(e) => setApy(Number.parseInt(e.target.value, 10) / 100)}
        />
      </label>
      <InvestSummary apy={apy} />
      <InvestList apy={apy} />
    </div>
  )
}
