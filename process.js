let debt = 0
const logs = []

async function processMessage(originalMessage, source) {
  const message = originalMessage.trim().toLowerCase()

  if (message.startsWith('log ')) {
    const messageArray = message.split(' ')
    const num = parseInt(messageArray[1])
    const reason = messageArray[2] || 'No reason'
    debt = debt + num
    const dt = new Date()
    const date = `${
      (dt.getMonth()+1).toString().padStart(2, '0')}/${
      dt.getDate().toString().padStart(2, '0')}/${
      dt.getFullYear().toString().padStart(4, '0')} ${
      dt.getHours().toString().padStart(2, '0')}:${
      dt.getMinutes().toString().padStart(2, '0')}:${
      dt.getSeconds().toString().padStart(2, '0')}`
    logs.push({
      date,
      num,
      reason
    })
    return 'OK Noted!'
  }

  if (message === 'get log') {
    let msg = 'Transactions:\n'
    logs.forEach(log => {
      msg += `Date: ${log.date}, ${log.num}, ${log.reason}\n`
    })
    return msg
  }
}

module.exports = processMessage
