// main.js

const fs         = require('fs'),
      wappalyzer = require('wappalyzer'),
      flag       = require('./flags.js')

const options = {
  debug:       false,
  delay:       0,
  maxDepth:    2,
  maxUrls:     6,
  maxWait:     1000,
  recursive:   true,
  userAgent:   'whodis',
  htmlMaxCols: 2000,
  htmlMaxRows: 2000,
}

let Search = function(url) {
  // If no protocol is provided, assume https
  if (url.indexOf('http') === -1) {
    url = 'https://' + url
  }
  console.log("whodis: looking for software used by '"+url+"'...")

  const w = new wappalyzer(url, options);
  w.analyze()
    .then(json => {
      console.log(JSON.stringify(json, null, 2))
    })
    .catch(error => {
      process.stderr.write(error + '\n')
      process.exit(1)
    })
}

function main() {
  let cmd  = flag.RootCmd("whodis", "Use Wappalyzer from the command line",
			  "[OPTION] URLs...")
  let json = flag.Add("json", "j", "wew.lad.json", "Save data to JSON file")
  let args = flag.Parse()

  if (args.length > 0) {
    for (i = 0; i < args.length; i++) {
      Search(args[i])
    }
  }
}; main()
