// main.js

// Imports
const fs         = require('fs'),
      flag       = require('flags'),
      wappalyzer = require('wappalyzer')

// Flags
let cmd  = flag.Cmd("whodis", "Use Wappalyzer from the command line",
		    "[OPTION] URLs...")
let json = flag.Add("json", "j", "", "Save data to JSON file")
let args = flag.Parse()

// Create a promises array to store all our URLs to crawl
let promises = []

// Format all provided URLs and add them to the promises array
function Search(url) {
  if (url.indexOf('http') === -1) {
    url = 'https://' + url
  }

  // Wappalyzer Options
  const options = {
    debug:       false,
    delay:       0,
    maxDepth:    2,
    maxUrls:     10,
    maxWait:     3000,
    recursive:   true,
    userAgent:   'whodis',
    htmlMaxCols: 2000,
    htmlMaxRows: 2000,
  }

  promises.push(new wappalyzer(url, options).analyze())
  console.log("whodis: looking for software used by '"+url+"'...")
}

// Execution
function main() {
  if ((args.length > 0) && (args.indexOf(".") > -1)) {
    for (i = 0; i < args.length; i++) {
      Search(args[i])
    }

    // Parse all promises
    Promise.all(promises)
      .then(results => {
	// if json.value is blank
	if (json.value === "") {
	  // Log results to stdout
	  process.stdout.write(JSON.stringify(results, null, 2) + '\n')
	} else {
	  // Write to JSON
	  fs.writeFileSync(json.value, JSON.stringify(results, null, 2) + '\n', 'utf8')
	}

	process.exit(0)
      })
      .catch(error => {
	process.stderr.write(error + '\n')
	process.exit(1)
      })
  } else {
    console.log("whodis: No URLs passed! Exiting...")
    process.exit(0)
  }
}; main()
