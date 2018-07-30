// main.js

//process.setMaxListeners(0)

const fs         = require('fs'),
      flag       = require('flags'),
      json2csv   = require('json2csv').parse,
      os         = require("os"),
      wappalyzer = require('wappalyzer')

let cmd  = flag.Cmd("whodis", "Discover software used by websites", "[OPTION] URLs..."),
    d    = flag.Add("--debug", "-d", false, "Enable debugging"),
    f    = flag.Add("--file",  "-f", "",    "Read domains from txt file"),
    c    = flag.Add("--csv",   "-c", "",    "Save data to CSV file"),
    j    = flag.Add("--json",  "-j", "",    "Save data to JSON file"),
    args = flag.Parse()


function Get(target) {
  let data   = [],
      fields = []

  console.log("whodis: Crawling domain(s)...")

  Promise.all(target)
    .then(results => {
      console.log("whodis: Analyzing provided domain(s)...")

      for (let i = 0; i < results.length; i++) {
	let r = {
	  "url": results[i]["urls"][0]
	}

	for (let a = 0; a < results[i]["applications"].length; a++) {
	  let value = ""

	  if (results[i]["applications"][a]["version"] != "") {
	    value = results[i]["applications"][a]["version"]
	  } else {
	    value = "yes"
	  }

	  r[results[i]["applications"][a]["name"]] = value

	  if (fields.includes(results[i]["applications"][a]["name"]) === false) {
	    fields.push(results[i]["applications"][a]["name"])
	  }
	}

	data.push(r)
      }
    })

    .finally(function() {
      if (j.value === "" && c.value === "") {
	process.stdout.write(JSON.stringify(data, null, 2) + '\n')
      } else {
	if (c.value != "") {
	  fields.sort()
	  fields.unshift('url')

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


function main() {
  let queue = [],
      urls  = []

  if (d.value === true) {
    process.stdout.write(JSON.stringify(cmd, null, 2) + '\n')
  }

  if (f.value.length > 0) {
    console.log("whodis: Reading domain(s) from", f.value + "...")
    urls = fs.readFileSync(f.value).toString().split("\n")
  } else {
    if (args.length > 0) {
      console.log("whodis: Reading domain(s) from arguments...")
      urls = args
    } else {
      console.log("whodis: No URLs passed! Exiting...")
      process.exit(1)
    }
  }

  if (urls.length < 1) {
    console.log("whodis: No URLs passed! Exiting...")
    process.exit(1)
  } else {
    console.log("whodis: Added", urls.length, "domain(s)")
  }

  for (let u = 0; u < urls.length; u++ ) {
    let url = urls[u]

    if (url.length > 1) {
      if (url.includes('http') === false) {
	url = 'http://' + url
      }
    }

    queue.push(new wappalyzer(url, {
      debug:       d.value,
      delay:       100,
      htmlMaxCols: 1000,
      htmlMaxRows: 1000,
      maxDepth:    2,
      maxUrls:     2,
      maxWait:     60000,
      recursive:   true,
      userAgent:   'WhoDis ' + cmd['version']
    }).analyze())
  }

  Get(queue)
}; main()
