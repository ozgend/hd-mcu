const scaler = (rangeFrom, rangeTo) => {
  const d = (rangeTo[1] - rangeTo[0]) / (rangeFrom[1] - rangeFrom[0]);
  return value => (value - rangeFrom[0]) * d + rangeTo[0];
};

module.exports = { scaler };