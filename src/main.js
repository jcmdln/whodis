// main.js

const fs         = require('fs'),
      wappalyzer = require('wappalyzer'),
      flag       = require('./flags.js')

let data    = [],
    domains = []

function Search(url) {
  // If no protocol is provided, assume https
  if (url.indexOf('http') === -1) {
    url = 'https://' + url
  }

  const w = new wappalyzer(url)

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

function main() {
  let cmd  = flag.Meta("[OPTION] URLs...")
  let json = flag.Add("json", "j", "export.json", "Save data to JSON file")
  let args = flag.Parse()

  for (i = 0; i <= args.length; i++) {
    Search(args[i])
  }
}; main()
