// whodis.js
'use strict';
process.setMaxListeners(0);

const fs         = require('fs')
const flag       = require('flags')
const json2csv   = require('json2csv').parse
const wappalyzer = require('wappalyzer')

let cmd     = flag.Cmd("whodis", "Discover software used by websites", "[OPTION] URLs...")
let Verbose = flag.Add("--verbose", "-V", false, "Enable verbose output")
let Quiet   = flag.Add("--quiet",   "-q", false, "Hide all output")
let Debug   = flag.Add("--debug",   "-d", false, "Enable Wappalyzer's debug output")
let File    = flag.Add("--file",    "-f", "",    "Read domains from txt file")
let Json    = flag.Add("--json",    "-j", "",    "Save data to JSON file")
let Args    = flag.Parse()

function log(msg) {
    if (!Quiet.value) {
        console.log("whodis:", msg)
    }

    return
}

function verbose(msg) {
    if (Verbose.value && !Quiet.value) {
        console.log("whodis:", msg)
    }

    return
}

function parse(data) {
    verbose("entered 'parse()'")

    let parsed = { "url": Object.keys(data["urls"])[0] }

    for (let a = 0; a < data["applications"].length; a++) {
        let app = data["applications"][a]
        let val = ""

        if (app["version"] != null) {
            val = app["version"]
        } else {
            val = "yes"
        }

        parsed[app["name"]] = val
    }

    return parsed
}

function save(data) {
    verbose("entered 'save()'")

    if (Csv.value.length < 1 && Json.value.length < 1) {
	return
    } else {
	if (Json.value != "") {
	    verbose("checking for existing '"+j.value+"'...")

	    if (fs.existsSync(j.value)) {
		verbose("'"+j.value+"' exists. Appending to file...")

		let file = JSON.parse(fs.readFileSync(j.value))
		file.push(data)
		fs.writeFileSync(j.value, JSON.stringify(file, null, 2) + '\n', 'utf8')
	    } else {
		verbose("'"+j.value+"' doesn't exist. Creating...")
		fs.writeFileSync(j.value, JSON.stringify([data], null, 2) + '\n', 'utf8')
	    }
	}
    }

    return "Saved"
}

async function main() {
    let urls = []
    let opts = {
	chunkSize:   1,
	debug:       Debug.value,
	delay:       0,
	htmlMaxCols: 2000,
	htmlMaxRows: 2000,
	maxDepth:    1,
	maxUrls:     1,
	maxWait:     5000,
	recursive:   false,
	userAgent:   'WhoDis'
    }

    if (File.value != "") {
        log("reading domain(s) from '"+File.value+"'...")
        urls = fs.readFileSync(File.value).toString().split("\n")
    } else {
        if (Args.length > 0) {
            log("reading domain(s) from arguments...")
            urls = Args
        } else {
            log("no URLs passed! Exiting...")
            process.exit(1)
        }
    }

    for (let u = 0; u < urls.length; u++) {
        let url = urls[u]

	if (url.length > 1) {
	    if (!url.includes("http://") && !url.includes("https://")) {
		url = "http://" + url
            }

	    const w = new wappalyzer(url, opts)
	    await w.analyze().then(data => {
		log("crawling '"+ Object.keys(data["urls"])[0] +"'...")
		let d = parse(data)
		console.log(JSON.stringify(d, null, 2))
	    })
	}
    }

    process.exit(0)
}; main()
