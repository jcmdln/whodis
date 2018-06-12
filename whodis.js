// main.js

const fs         = require('fs'),
      flag       = require('flags'),
      json2csv   = require('json2csv').parse,
      os         = require("os"),
      threads    = require('threads'),
      wappalyzer = require('wappalyzer')

let cpus   = os.cpus().length,
    data   = [],
    fields = ['url'],
    queue  = []

let cmd  = flag.Cmd("whodis", "Discover software used by websites", "[OPTION] URLs..."),
    d    = flag.Add("--debug", "-d", false, "Enable debugging"),
    f    = flag.Add("--file",  "-f", "",    "Read domains from txt file"),
    c    = flag.Add("--csv",   "-c", "",    "Save data to CSV file"),
    j    = flag.Add("--json",  "-j", "",    "Save data to JSON file"),
    args = flag.Parse()

function Search(url) {
  if (url.indexOf('http') === -1) {
    url = 'https://' + url
  }

  queue.push(new wappalyzer(url, {
    debug:     d.value,
    delay:     100,
    maxDepth:  3,
    maxUrls:   12,
    maxWait:   5000,
    recursive: true,
    userAgent: 'WhoDis'
  }).analyze())
}

function Work() {
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

function main() {
  let Targets = [],
      Threads = []

  if (f.value != "") {
    console.log("whodis: reading domains from", f.value + "...")
    Targets = fs.readFileSync(f.value).toString().split("\n")
  } else if (args.length > 0) {
    console.log("whodis: reading domains from arguments...")
    Targets = args;
  } else {
    console.log("whodis: No URLs passed! Exiting...")
    process.exit(0)
  }

  for (i in Targets) {
    if (Targets[i].indexOf(".") > -1) {
      Search(Targets[i])
    } // else {
    //   console.log()
    //   process.exit(1)
    // }
  }

  Work()
}; main()
