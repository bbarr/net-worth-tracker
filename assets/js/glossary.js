
export default [
  {
    name: 'Average Loan to Value',
    slug: 'loan-to-value',
    body: `
      <p>
        This is the average amount of "leverage" you are using on your debt-backed assets. For example, if you bought a house for $100,000 with a mortgage
        for $70,000, your loan to value would be 70000 / 100000, or 70%; ie you have 30% equity on this property and owe 70% worth of the value on the loan.
      </p>
    `
  },
  { 
    name: 'Effective Debt Interest Rate',
    slug: 'effective-debt-interest-rate',
    body: `
      <p>This is the average of your liabilities' interest rates, weighted by each liabilities' balance due. This is sort of like the </p>
      <p>
        <strong>Example:</strong>
      </p>
      <p>
        Liability 1: $100 at 10%<br>
        Liability 2: $50 at 20%<br>
        Effective Debt Interest Rate: (100 * 3%) + (50 * 5%) / (100 + 50) = <strong>3.66%</strong>
      </p>
      <p>
        <strong>Implications:</strong>
      </p>
      <p>Effective Debt Interest Rate is the cost of your debt. You probably also earn a return on your assets, 
      via investments and bank accounts' interest yields, and if these provide a higher return than the cost of debt, then you are moving in the right direction!
    `
  },
  {
    name: 'Estimated Annual Interest Cost',
    slug: 'estimated-annual-interest-cost',
    body: `
      <p>This is roughly how much you will pay each year in interest charges for the debt you carry.</p>
    `
  },
  {
    name: 'Assets / Debt',
    slug: 'assets-to-debt',
    body: `
      <p>Assets to debt is a ratio that indicates general financial health. A number over 1 means that you have a positive net worth, while a number under 1 means you have more debt than asset value.<p>
      <p>Note that some life circumstances will tend towards a low number here, such as when you are fresh out of college and have school loans, but not much in the asset list to offset them. If you wanted to, you could certainly list your actual college degree as an asset, but the valuation would be pretty loose and not convertible into cash in its entirity at any point.</p>
    `
  },
  {
    name: 'Current Ratio',
    slug: 'current-ratio',
    body: `
      <p>
        This determines if you are able to pay all of the debt that will soon be due. If the number is over 1, you are covered and should be able to pay your debts. Any number under 1 should be cause for concern, and you may need to find a way to free up more cash or else put off any debt until later.
      </p>
    `
  },
  { 
    name: 'Working Capital',
    slug: 'working-capital',
    body: `
      <p>Also known as "working capital", this is your cash minus any short-term debt, like credit cards you pay off monthly. If "Cash / Short-Term Debt" is less than 1, this number will be negative.</p>
    `
  },
  { 
    name: 'Liquidity',
    slug: 'liquidity',
    body: `
      <p>Liquidity refers to how quickly an asset can become "cash" and be spent. Physical cash and checking/savings accounts are examples of highly-liquid assets, as they are basically able to be spent immediately. Investments, or anything that must first be sold to be converted to cash should be considered less liquid. And the least liquid asset is one that has a regulated withdrawal timeline which penalizes early conversion to cash, such as a 401k. Though even the 401k has the capacity to be borrowed against under some circumstances, so just know that you may have more liquidity than it appears on paper, you just need to get creative and make sure you understand the risks.</p>
      <p>
        A analogy for liquidity is to think of "spending money" as drinking water. You can drink water when it is a liquid, but it gets more difficult to drink as slush, and ice is right out. Cash is water, your stocks might be like slush, and your retirement 401k is ice.
      </p>
    `
  },
  { 
    name: 'Risk-free Rate of Return',
    slug: 'risk-free-rate',
    body: `
      <p>This refers broadly to the basic, minimum earning potential of cash. In the US, the 10-year US treasury rate is often used. The US government's debt makes for a good risk-free rate because it is seen as the borrower least likely to default on its debt. This risk-free rate is a useful benchmark for comparing against interest rates on assets or liabilities to make decisions about debt paydown or adding to investments.</p>
    `
  }
]
