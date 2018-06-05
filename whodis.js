// main.js

// Set constants for our imports.
const csv        = require('csv'),
      fs         = require('fs'),
      flag       = require('flags'),
      wappalyzer = require('wappalyzer')

// Exposed arrays for maintaining state.
let data  = [],
    cols  = {},
    queue = []

// Format all provided URLs and add them to the promises array
function Search(url) {
  // If the domain does not include a protocol, use https
  if (url.indexOf('http') === -1) {
    url = 'https://' + url
  }

  // Wappalyzer Options
  const options = {
    debug:       false,
    delay:       500,
    maxDepth:    3,
    maxUrls:     10,
    maxWait:     5000,
    recursive:   true,
    userAgent:   'WhoDis',
    htmlMaxCols: 2000,
    htmlMaxRows: 2000,
  }

  // Append the task to the queue.
  queue.push(new wappalyzer(url, options).analyze())

  // Output that the promise has been queued.
  console.log('whodis: queued promise for', url)
}

//
function main() {
  // Define our command.
  let cmd = flag.Cmd("whodis", "Discover software used by websites", "[OPTION] URLs...")

  // Define our flags.
  let c   = flag.Add("csv",     "c", "",    "Save data to CSV file")
  let e   = flag.Add("elastic", "e", false, "Upload data to an Elasticsearch instance")
  let j   = flag.Add("json",    "j", "",    "Save data to JSON file")
  let r   = flag.Add("read",    "r", "",    "Read domains from txt file")

  // Assign a variable to retrieve arguments not associated with a flag.
  let args = flag.Parse()

  // Check that at least one argument was passed
  if (args.length > 0) {
    // Loop over all arguments
    for (i = 0; i < args.length; i++) {
      // If the argument contains '.' treat it like a domain, otherwise
      // report it as an invalid argument.
      if (args[i].indexOf(".") > -1) {
	Search(args[i])
      } else {
	console.log("whodis:", args[i], "is invalid")
      }
    }

    // Consume promises in the queue
    Promise.all(queue)
      .then(results => {
	// Loop over all results
	for (i = 0; i < results.length; i++) {
	  // Create an empty object
	  let tgt = {}

	  // Add the first URL to the tgt object.
	  tgt["url"] = results[i]["urls"][0]

	  // Loop over all applications of the url.
	  for (a = 0; a < results[i]["applications"].length; a++) {
	    // Add all applications to the tgt object.
	    tgt[results[i]["applications"][a]["name"]] = "y"
	    cols[results[i]["applications"][a]["name"]] = results[i]["applications"][a]["name"]
	  }

	  // Push the tgt object in to the data array.
	  data.push(tgt)
	}

	// If not saving to a JSON or CSV file, then output to console.
	if ((j.value === "") && (c.value === "")) {
	  process.stdout.write(JSON.stringify(data, null, 2) + '\n')
	} else {
	  // Save as CSV
	  if (c.value != "") {
	    fs.writeFileSync(c.value, csv.stringify(data, { header: true, columns: cols }), 'utf8')
	  }

	  // Save as JSON
	  if (j.value != "") {
	    fs.writeFileSync(j.value, JSON.stringify(data, null, 2) + '\n', 'utf8')
	  }
	}

	process.exit(0)
      })
      .catch(error => {
	process.stderr.write('whodis:', error + '\n')
	process.exit(1)
      })
  } else {
    console.log("whodis: No URLs passed! Exiting...")
    process.exit(0)
  }
}; main()
