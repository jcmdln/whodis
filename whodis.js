// main.js

const fs         = require('fs'),
      flag       = require('flags'),
      json2csv   = require('json2csv').parse,
      wappalyzer = require('wappalyzer')

let cmd  = flag.Cmd("whodis", "Discover software used by websites", "[OPTION] URLs...")
let f    = flag.Add("file", "f", "domains.txt", "Read domains from txt file")
let c    = flag.Add("csv",  "c", "", "Save data to CSV file")
let j    = flag.Add("json", "j", "", "Save data to JSON file")
let args = flag.Parse()

let data   = [],
    fields = ['url'],
    cols   = {fields},
    queue  = []

function Search(url) {
  if (url.indexOf('http') === -1) {
    url = 'https://' + url
  }

  const options = {
    debug:       false,
    delay:       1000,
    maxDepth:    3,
    maxUrls:     9,
    maxWait:     5000,
    recursive:   true,
    userAgent:   'WhoDis'
  }

  queue.push(new wappalyzer(url, options).analyze())
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
	  } // else {
	  //   value = "yes"
	  // }

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
	  fs.writeFileSync(c.value, json2csv(data, cols) + '\n', 'utf8')
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

if (f.value != "") {
  console.log("whodis: reading domains from", f.value + "...")
  let File = fs.readFileSync(f.value).toString().split("\n")

  for (i in File) {
    if (File[i].indexOf(".") > -1) {
      Search(File[i])
    } else {
      console.log("whodis:", File[i], "is invalid")
      process.exit(1)
    }
  }

  Work()
} else if (args.length > 0) {
  console.log("whodis: queuing domains...")
  for (i in args.length) {
    if (args[i].indexOf(".") > -1) {
      Search(args[i])
    } else {
      console.log("whodis:", args[i], "is invalid")
      process.exit(1)
    }
  }

  Work()
} else {
  console.log("whodis: No URLs passed! Exiting...")
  process.exit(0)
}
