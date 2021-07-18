let debt = 0
const logs = []

// Hardcode
// Tu Huynh ID: 'Ub4d35a2b56a1253264c2bcebbe89a62a'

async function processMessage(originalMessage, source) {
  const message = originalMessage.trim().toLowerCase()

  // Logging
  console.log(originalMessage)
  console.log(source)

  if (message.startsWith('log ')) {
    const messageArray = message.split(' ')
    const num = parseFloat(messageArray[1])
    const [, , ...reasonArray] = messageArray
    const reason = reasonArray.join(' ') || 'No reason'
    debt = debt + num

    const broBotDate = new BroBotDate()
    const isTu = source.userId === 'Ub4d35a2b56a1253264c2bcebbe89a62a'
    const reporter = isTu ? 'TU' : 'LAM'

    logs.push({
      date: broBotDate.toString(),
      num,
      reason,
      reporter
    })

    return `Okay got it! Debt now is ${debt}`
  }

  if (message === 'get log') {
    let msg = 'Transactions:\n'
    const last10logs = logs.slice(Math.max(logs.length - 10, 0))

    last10logs.reverse().forEach(log => {
      msg += `${log.num} [${log.reason}]\n`
    })
    return msg
  }

  if (message === 'get log verbose') {
    let msg = 'Transactions:\n'

    logs.reverse().forEach(log => {
      msg += `[${log.date}] [${log.num}] [${log.reason}] by [${log.reporter}]\n`
    })
    return msg
  }

  if (message === 'get debt') {
    return `Current debt: ${debt}`
  }
}

class BroBotDate {
  constructor() {
    this.date = new Date()
  }
  toString() {
    const dt = this.date
    return `${
      (dt.getMonth()+1).toString().padStart(2, '0')}/${
      dt.getDate().toString().padStart(2, '0')}/${
      dt.getFullYear().toString().padStart(4, '0')} ${
      dt.getHours().toString().padStart(2, '0')}:${
      dt.getMinutes().toString().padStart(2, '0')}:${
      dt.getSeconds().toString().padStart(2, '0')}`
  }
}

module.exports = processMessage
