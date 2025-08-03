
const dayjs = require('dayjs')

const formatDate = (date) => dayjs(date).format('HH:mm')
module.exports = {
    formatDate
}