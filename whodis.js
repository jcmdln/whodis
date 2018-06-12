// main.js

// Define our imports and assign them to constants.

const fs         = require('fs'),
      flag       = require('flags'),
      json2csv   = require('json2csv').parse,
      os         = require("os"),
      threads    = require('threads'),
      wappalyzer = require('wappalyzer')


// Define our command which will store our flags as a JSON object. This
// will allow easily debugging command line flags and values when
// comparing against logic, as well as easily accessing the value of a
// flag which is returned to the variable. Since the variables must be
// mutable, they cannot be constants.

let cmd  = flag.Cmd("whodis", "Discover software used by websites", "[OPTION] URLs..."),
    d    = flag.Add("--debug", "-d", false, "Enable debugging"),
    f    = flag.Add("--file",  "-f", "",    "Read domains from txt file"),
    c    = flag.Add("--csv",   "-c", "",    "Save data to CSV file"),
    j    = flag.Add("--json",  "-j", "",    "Save data to JSON file"),
    r    = flag.Add("--raw",   "-r", false, "Show raw information"),
    args = flag.Parse()


// Define our global storage mechanisms as variables. We'll need to
// track the data before it's written to a file, the fields of the CSV
// if we are instructed to write one, and the queue for storing promises
// that will be passed to Wappalyzer().

let data   = [],
    fields = ['url'],
    queue  = []


// This big block of trash is going to be cleaned up later on. I won't go
// into too much detail because I'll be switching this to a threaded
// model that respects the total number of CPU threads.

function Wappalyzer(queue) {
  Promise.all(queue)
    .then(results => {
      for (i = 0; i < results.length; i++) {
	let tgt = {}
	tgt["url"]  = results[i]["urls"][0]

	for (a = 0; a < results[i]["applications"].length; a++) {
	  let value = ""
	  if (results[i]["applications"][a]["version"] != "") {
	    value = results[i]["applications"][a]["version"]
	  } else {
	    value = "yes"
	  }

	  tgt[results[i]["applications"][a]["name"]] = value
	  fields.push(results[i]["applications"][a]["name"])
	}

	data.push(tgt)
      }

      if ((j.value === "") && (c.value === "")) {
	process.stdout.write(JSON.stringify(data, null, 2) + '\n')
      } else {
	if (c.value != "") {
	  console.log("whodis: writing to", c.value)
	  fs.writeFileSync(c.value, json2csv(data, {fields}) + '\n', 'utf8')
	}

	if (j.value != "") {
	  console.log("whodis: writing to", j.value)
	  fs.writeFileSync(j.value, JSON.stringify(data, null, 2) + '\n', 'utf8')
	}
      }

      process.exit(0)
    })
    .catch(error => {
      process.stderr.write('whodis:', error + '\n')
      process.exit(1)
    })
}


// The execution block. This really doesn't need to be a function, but I
// would like to properly scope the variables despite it not being really
// necessary.

function main() {
  // If debugging, then print the 'cmd' JSON object.
  if (d.value === true) {
    process.stdout.write(JSON.stringify(cmd, null, 2) + '\n')
  }

  // Storage mechanisms.
  let Urls    = [],
      Threads = []

  // Check if we are to read domains from a file
  if (f.value != "") {
    console.log("whodis: reading domains from", f.value + "...")
    Urls = fs.readFileSync(f.value).toString().split("\n")
  } else {
    // Read domains from arguments
    if (args.length > 0) {
      console.log("whodis: reading domains from arguments...")
      Urls = args;
    } else {
      console.log("whodis: No URLs passed! Exiting...")
      process.exit(0)
    }
  }

  if (Urls.length > 0) {
    for (i in Urls) {
      // Shorthand for consuming the current url.
      let url = Urls[i]

      // Ensure that the current target resembles a domain.
      if (url.indexOf(".") > -1) {
	// If a domain does not have a defined protocol, pre-append
	// 'https://' to it.
	if (url.indexOf('http') === -1) {
	  url = 'https://' + url
	}

	// Add the url to the queue
	queue.push(new wappalyzer(
	  url, {
	    debug:     d.value,
	    delay:     100,
	    maxDepth:  3,
	    maxUrls:   12,
	    maxWait:   5000,
	    recursive: true,
	    userAgent: 'WhoDis'
	  }
	).analyze())
      } else {
	// Complain
	console.log("whodis:", url, "is not a valid domain! Exiting...")
	process.exit(1)
      }
    }

    //
    Wappalyzer(queue)
  }
}; main()
