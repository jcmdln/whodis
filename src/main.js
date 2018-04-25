// main.js

const fs         = require('fs'),
      wappalyzer = require('wappalyzer'),
      flag       = require('./flags.js')

let data    = [],
    domains = []

function Search(url) {
  const w = new wappalyzer(url)

  if (url.indexOf('http') === -1) {
    url = 'https://' + url
  }

  w.analyze()
    .then(json => {
      if (json.length === 0) {
	console.log("whodis: error: no JSON data received")
	console.log("whodis: exiting...")
	process.exit()
      } else {
	console.log(json)
      }
    })
    .catch(error => {
      console.error(error)
    })
}

const usage = 'Usage: whodis [OPTION] URLs...'

function main() {
  var json
  flag.Add("json", "j", false, "Save data to JSON file")

  flag.Parse()
}

main()
