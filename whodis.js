// main.js

const fs         = require('fs'),
      flag       = require('flags'),
      json2csv   = require('json2csv').parse,
      os         = require("os"),
      spawn      = require('threads').spawn,
      wappalyzer = require('wappalyzer')

let cmd  = flag.Cmd("whodis", "Discover software used by websites", "[OPTION] URLs..."),
    d    = flag.Add("--debug", "-d", false, "Enable debugging"),
    f    = flag.Add("--file",  "-f", "",    "Read domains from txt file"),
    c    = flag.Add("--csv",   "-c", "",    "Save data to CSV file"),
    j    = flag.Add("--json",  "-j", "",    "Save data to JSON file"),
    args = flag.Parse()

let data   = [],
    fields = ['url'],
    urls   = [],
    queue  = []

let options = {
  debug:     d.value,
  delay:     500,
  maxDepth:  3,
  maxUrls:   10,
  maxWait:   5000,
  recursive: true,
  userAgent: 'WhoDis '+cmd['version']
}

function Get(queue) {
  Promise.all(queue)
    .then(results => {
      for (i = 0; i < results.length; i++) {
	let r = {}
	r["url"]  = results[i]["urls"][0]

	for (a = 0; a < results[i]["applications"].length; a++) {
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

if (urls.length > 1000) {
  for (let u = 0; u < 1000; u++) {
    let url = urls[u]

    if (url.includes(".") === true) {
      if (url.includes('http') === false) {
	url = 'https://' + url
      }

      queue.push(new wappalyzer(url, options).analyze())
    }
  }

  Get(queue)
} else {
  for (u in urls) {
    let url = urls[u]

    if (url.includes(".") === true) {
      if (url.includes('http') === false) {
	url = 'https://' + url
      }

      queue.push(new wappalyzer(url, options).analyze())
    }
  }

  Get(queue)
}
