


export const calculateEquityCurve = (data: DailyReturnPoint[]): EquityPoint[] => {
  let portfolioValue = 1.0;
  let spyValue = 1.0;

  return data.map((point) => {
    portfolioValue *= (1 + (point.portfolio_return || 0));
    spyValue *= (1 + (point.spy_return || 0));

    return {
      date: point.date,
      portfolio: Number(portfolioValue.toFixed(4)),
      spy: Number(spyValue.toFixed(4)),
    };
  });
};
