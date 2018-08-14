// main.js

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

let options = {
  debug:       d.value,
  delay:       100,
  htmlMaxCols: 1000,
  htmlMaxRows: 1000,
  maxDepth:    1,
  maxUrls:     1,
  maxWait:     10000,
  recursive:   true,
  userAgent:   'WhoDis ' + cmd['version']
}

let header  = []

function wappGet(promises) {
  let result = Promise.resolve()

  promises.forEach(function(promise) {
    result = result.then(promise.analyze().then(data => {
      let r = {
	"url": data["urls"][0]
      }

      for (a in data["applications"]) {
	let app = data["applications"][a]
	let val = ""

	if (app["version"] != "") {
	  val = app["version"]
	} else {
	  value = "yes"
	}

	r[app["name"]] = value

	if (!header.includes(app["name"])) {
	  header.push(app["name"])
	}
      }

      //console.log(r)
      //console.log(header)
    }))
  })

  return result
}

function main() {
  let urls = []

  if (d.value) {
    console.log(JSON.stringify(cmd, null, 2) + '\n')
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

  for (i in urls) {
    if (urls[i].length > 1) {
      if (urls[i].includes('http') === false) {
	urls[i] = new wappalyzer('http://' + urls[i], options)
      }
    }
  }

  wappGet(urls)
}; main()
