// main.js

process.setMaxListeners(0)

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
  htmlMaxCols: 2000,
  htmlMaxRows: 2000,
  maxDepth:    2,
  maxUrls:     2,
  maxWait:     20000,
  recursive:   true,
  userAgent:   'WhoDis ' + cmd['version']
}


function wappGet(promises) {
  let result = Promise.resolve()

  promises.forEach(function(promise) {
    result = result.then(promise.analyze().then(data => {
      // let header  = []

      let r = {
	"url": data["urls"][0]
      }

      for (a in data["applications"]) {
	let app = data["applications"][a]
	let value = ""

	if (app["version"] != "") {
	  value = app["version"]
	} else {
	  value = "yes"
	}

	r[app["name"]] = value

	// if (!header.includes(app["name"])) {
	//   header.push(app["name"])
	// }
      }

      if (j.value === "" && c.value === "") {
      	console.log(JSON.stringify(r, null, 2) + '\n')
      } else {
      	if (j.value != "") {
	  if (fs.existsSync(j.value)) {
	    fs.readFile(j.value, function (err, data) {
	      let file = JSON.parse(data)
	      file.push(r)

	      fs.writeFileSync(j.value, JSON.stringify(file, null, 2) + '\n', 'utf8')
	    })
	  } else {
	    fs.writeFileSync(j.value, JSON.stringify([r], null, 2) + '\n', 'utf8')
	  }
      	}
      }
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
