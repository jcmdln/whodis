// main.js

const fs         = require('fs'),
      wappalyzer = require('wappalyzer'),
      flag       = require('./flags.js')

let Search = function(url) {
  // No undefined anything!
  if (url === '' || typeof url === typeof undefined) {
    console.log("nope")
    process.exit(1)
  }

  // If no protocol is provided, assume https
  if (url.indexOf('http') === -1) {
    url = 'https://' + url
  }

  console.log("whodis: looking for software used by '"+url+"'...")

  // Set Wappalyzer options
  let options = {
    debug:       false,
    delay:       50,
    maxDepth:    3,
    maxUrls:     10,
    maxWait:     5000,
    recursive:   true,
    userAgent:   'whodis',
    htmlMaxCols: 2000,
    htmlMaxRows: 2000,
  };

  // Instantiate a new Wappalyzer instance
  const w = new wappalyzer(url, options)
  w.analyze()
    .then(json => {
      console.log(JSON.stringify(json, null, 2))
    })
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}

function main() {
  // Define our command and flags
  let cmd  = flag.RootCmd("whodis", "Use Wappalyzer from the command line",
			  "[OPTION] URLs...")
  let json = flag.Add("json", "j", "wew.lad.json", "Save data to JSON file")
  let args = flag.Parse()

  if (args.length > 0) {
    if (json['value'] != null) {
      // Store all retrieved JSON in this array
      let data = []
      console.log(cmd['name'], json['value'])
    }

    // Loop over all domains within args
    for (i = 0; i <= args.length; i++) {
      Search(args[i])
    }
  }

}; main()
