// main.js

const fs         = require('fs'),
      flag       = require('flags'),
      json2csv   = require('json2csv').parse,
      wappalyzer = require('wappalyzer')

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
  console.log('whodis: queued', url)
}

function main() {
  let cmd  = flag.Cmd("whodis", "Discover software used by websites", "[OPTION] URLs...")
  let c    = flag.Add("csv",     "c", "",    "Save data to CSV file")
  let e    = flag.Add("elastic", "e", false, "Upload data to an Elasticsearch instance")
  let j    = flag.Add("json",    "j", "",    "Save data to JSON file")
  let r    = flag.Add("read",    "r", "",    "Read domains from txt file")
  let args = flag.Parse()

  if (args.length > 0) {
    for (i = 0; i < args.length; i++) {
      if (args[i].indexOf(".") > -1) {
	Search(args[i])
      } else {
	console.log("whodis:", args[i], "is invalid")
      }
    }

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

	    tgt[results[i]["applications"][a]["name"]]  = value
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
  } else {
    console.log("whodis: No URLs passed! Exiting...")
    process.exit(0)
  }
}; main()
