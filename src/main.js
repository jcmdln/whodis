// main.js

const fs         = require('fs'),
      wappalyzer = require('wappalyzer'),
      flag       = require('./flags.js')

let Search = function(url) {
  // If no protocol is provided, assume https
  if (url.indexOf('http') === -1) {
    url = 'https://' + url
  }

  // Set Wappalyzer options
  let options = {
    debug: false,
    delay: 50,
    maxDepth: 3,
    maxUrls: 10,
    maxWait: 5000,
    recursive: true,
    userAgent: 'whodis',
  };

  // Instantiate a new Wappalyzer instance
  let w = new wappalyzer(url, options)

  //
  w.analyze()
    .then(json => {
      if (json.length === 0) {
	console.log("whodis: error: no JSON data received")
	console.log("whodis: exiting...")
	return
      } else {
	process.stdout.write(JSON.stringify(json, null, 2) + '\n')
      }
    })
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}

function main() {
  // Define our command and flags
  let cmd  = flag.Meta("whodis", "Use Wappalyzer from the command line",
		       "[OPTION] URLs...")
  let json = flag.Add("json", "j", "wew.lad.json", "Save data to JSON file")
  let args = flag.Parse()

  if (args.length > 0 ){
    // Store all retrieved JSON in this array
    let data = []

    // Loop over all domains within args
    for (i = 0; i <= args.length; i++) {
      Search(args[i])
    }
  }

  console.log(json['value'])
}; main()
