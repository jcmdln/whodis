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

let urls   = [],
    queue  = []

let options = {
  debug:       d.value,
  delay:       1000,
  maxDepth:    1,
  maxUrls:     1,
  maxWait:     8000,
  recursive:   true,
  userAgent:   'WhoDis ' + cmd['version']
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function Get(target) {
  let data   = [],
      fields = []

  // console.log("whodis: Checking domain(s) for known software...")

  Promise.all(target)
    .then(results => {
      for (i = 0; i < results.length; i++) {
	let r = {
	  "url": results[i]["urls"][0]
	}

	for (a = 0; a < results[i]["applications"].length; a++) {
	  let value = ""
	  if (results[i]["applications"][a]["confidence"] > 0) {
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

    .then(function() {
      if (j.value === "" && c.value === "") {
        process.stdout.write(JSON.stringify(data, null, 2) + '\n')
      } else {
        if (c.value != "") {
          fields.sort()
          fields.unshift('url')

          // console.log("whodis: writing to", c.value)
	  //
          fs.writeFileSync(c.value, json2csv(data, {fields}) + '\n', 'utf8')
        }

        if (j.value != "") {
          // console.log("whodis: writing to", j.value)
	  //
          fs.writeFileSync(j.value, JSON.stringify(data, null, 2) + '\n', 'utf8')
        }
      }
    })

    .finally(function() {
      process.exit(0)
    })

    .catch(error => {
      process.stderr.write('whodis:', error + '\n')
      process.exit(1)
    })
}

function main() {
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

  for (u in urls) {
    let url = urls[u]

    if (url.includes(".") === false) {
      console.log("whodis: Invalid url", + "'" + url + "'")
    } else if (url.includes('http') === false) {
      url = 'https://' + url
    }

    queue.push(new wappalyzer(url, options).analyze())

  }

  if (queue.length > 50) {
    for each(let q = 0; q >= 4 ; q++) {
      let bit = queue.splice(0, 50)
      Get(bit)


    }
  } else {
    Get(queue)
  }
}; main()
