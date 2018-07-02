// main.js

const fs         = require('fs'),
      flag       = require('flags'),
      json2csv   = require('json2csv').parse,
      os         = require("os"),
      threads    = require('threads'),
      wappalyzer = require('wappalyzer')

let cmd  = flag.Cmd("whodis", "Discover software used by websites", "[OPTION] URLs..."),
    d    = flag.Add("--debug", "-d", false, "Enable debugging"),
    f    = flag.Add("--file",  "-f", "",    "Read domains from txt file"),
    c    = flag.Add("--csv",   "-c", "",    "Save data to CSV file"),
    j    = flag.Add("--json",  "-j", "",    "Save data to JSON file"),
    args = flag.Parse()

let data = [], fields = ['url'],
    urls = [], queue  = []

let options = {
  debug:     d.value,
  delay:     500,
  maxDepth:  3,
  maxUrls:   10,
  maxWait:   5000,
  recursive: true,
  userAgent: 'WhoDis '+cmd['version']
}

if (d.value === true) {
  process.stdout.write(JSON.stringify(cmd, null, 2) + '\n')
}

if (f.value != "") {
  console.log("whodis: main: Reading domains from", f.value + "...")
  urls = fs.readFileSync(f.value).toString().split("\n")
} else {
  if (args.length > 0) {
    console.log("whodis: main: Reading domains from arguments...")
    urls = args
  } else {
    console.log("whodis: main: No URLs passed! Exiting...")
    process.exit(1)
  }
}

if (urls.length <= 0) {
  console.log("whodis: main: No URLs passed! Exiting...")
  process.exit(1)
}

for (u in urls) {
  let url = urls[u]

  if (url.includes(".") === false) {
    console.log("whodis: main:", url, "is not a valid domain! Exiting...")
    process.exit(1)
  }

  if (url.includes('http') === false) {
    url = 'https://' + url
  }

  let w = new wappalyzer(url, options)

  w.analyze()
    .then(results => {
      let r = {}
      r["url"] = results["urls"][0]

      for (a in results["applications"]) {
	let value = ""

	if (results["applications"][a]["version"] != "") {
	  value = results["applications"][a]["version"]
	} else {
	  value = "yes"
	}

	r[results["applications"][a]["name"]] = value
	fields.push(results["applications"][a]["name"])
      }

      data.push(r)

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
    })
    .catch(error => {
      process.stderr.write('whodis:', error + '\n')
      process.exit(1)
    })
}
