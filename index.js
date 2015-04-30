#!/usr/bin/env node

const mdjson = require('mdjson')
const bl     = require('bl')

process.stdin.pipe(bl(function(err, data) {
  if (err) throw err

  var data = (data+'').split('\n')
  var head = null
  var out  = {}

  for (var i = 0; i < data.length; i++) {
    var trim = data[i].trim()
    var raw  = data[i]

    if (trim.match(/^\#/g)) {
      trim = trim.replace(/^\#+/g, '')
      trim = trim.trim()
      out[head = trim] = []
      continue
    }

    if (head === null) continue

    out[head].push(raw)
  }

  Object.keys(out).forEach(function(head) {
    var group = out[head]
    if (!group.length) return
    if (!group[0].trim()) group.shift()
    if (!group.length) return
    if (!group[group.length - 1].trim()) group.pop()
  })

  Object.keys(out).forEach(function(head) {
    out[head] = out[head].join('\n')
  })

  process.stdout.write('window.TEXTCHUNKS = ')
  process.stdout.write(JSON.stringify(out, null, 2))
  process.stdout.write('\n')
}))
