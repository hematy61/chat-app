const day = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat'
}
const getDate = () => {
  const now = new Date()
  const rightNow = `${day[now.getDay()]} ${now.getHours()}:${ now.getMinutes() > 9 ? now.getMinutes() : `0${now.getMinutes() }`}`
  return rightNow
}

module.exports = {
  getDate
}