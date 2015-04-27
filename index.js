const mdjson = require('mdjson')
const bl     = require('bl')

process.stdin.pipe(bl(function(err, data) {
  if (err) throw err

  var data = mdjson(data+'')

  Object.keys(data).forEach(function(key) {
    data[key] = data[key].raw
  })

  process.stdout.write('window.TEXTCHUNKS = ')
  process.stdout.write(JSON.stringify(data, null, 2))
  process.stdout.write('\n')
}))
