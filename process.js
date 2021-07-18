// Hardcode
// Tu Huynh ID: 'Ub4d35a2b56a1253264c2bcebbe89a62a'

const moment = require("moment")

async function processMessage(originalMessage, source, debtData) {
  const message = originalMessage.trim().toLowerCase()

  // Logging
  console.log(originalMessage)
  console.log(source)

  if (message.startsWith('log ')) {
    const messageArray = message.split(' ')
    const num = parseFloat(messageArray[1])
    if (isNaN(num)) {
      return "Invalid data bro =='"
    }
    const [, , ...reasonArray] = messageArray
    const reason = reasonArray.join(' ') || 'No reason'
    debtData.debt = debtData.debt + num

    const broBotDate = new BroBotDate()
    const isTu = source.userId === 'Ub4d35a2b56a1253264c2bcebbe89a62a'
    const reporter = isTu ? 'Tú' : 'Lâm'

    debtData.logs.push({
      date: broBotDate.toString(),
      num,
      reason,
      reporter
    })

    return `Debt of Tú now is ${debtData.debt}`
  }

  if (message === 'get log' || message === 'get logs') {
    let msg = 'Latest Transactions:\n'
    const last10logs = debtData.logs.slice(Math.max(debtData.logs.length - 10, 0))

    last10logs.reverse().forEach(log => {
      const time = moment(log.date).fromNow()
      msg += `${log.num > 0 ? '+' : ''}${log.num} ${log.reason} (${time})\n`
    })
    return msg
  }

  if (message === 'get log verbose' || message === 'get logs verbose') {
    let msg = 'Transactions Verbose:\n'

    debtData.logs.reverse().forEach(log => {
      msg += `[${log.date}] ${log.num > 0 ? '+' : ''}${log.num} ${log.reason} [by ${log.reporter}]\n`
    })
    return msg
  }

  if (message === 'get debt') {
    return `Current debt of Tú: ${debtData.debt}$ ~ ${debtData.debt * 17000}VND`
  }

  if (message === 'link') {
    return `Here bro https://gist.github.com/tuhuynh27/bcb67d0114d546029bf311185e4c5b86`
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
