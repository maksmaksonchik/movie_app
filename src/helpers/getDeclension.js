export default (one, two, five) => (count) => {
  const lastDigit = count % 10;
  const lastTwo = count % 100;

  if (lastTwo >= 11 && lastTwo <= 19) {
    return five;
  }

  if (lastDigit === 1) {
    return one;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return two;
  }

  return five;
};
