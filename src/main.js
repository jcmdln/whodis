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

  const options = {
    debug: false,
    delay: 100,
    maxDepth: 3,
    maxUrls: 10,
    maxWait: 5000,
    recursive: true,
    userAgent: 'Wappalyzer',
    htmlMaxCols: 2000,
    htmlMaxRows: 2000,
  };

  const w = new wappalyzer(url, options)

  w.analyze()
    .then(json => {
      if (json.length === 0) {
	console.log("whodis: error: no JSON data received")
	console.log("whodis: exiting...")
	process.exit()
      } else {
	process.stdout.write(JSON.stringify(json, null, 2) + '\n')
	process.exit(0)
      }
    })
    .catch(error => {
      console.error(error)
      process.exit(1)
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
