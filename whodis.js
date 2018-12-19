// whodis.js
'use strict';
process.setMaxListeners(0);

const fs         = require('fs')
const flag       = require('flags')
const json2csv   = require('json2csv').parse
const wappalyzer = require('wappalyzer')
const browser    = require('./node_modules/wappalyzer/browsers/zombie.js')


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
}


function verbose(msg) {
    if (Verbose.value && !Quiet.value) {
        console.log("whodis:", msg)
    }
}


function parse(data) {
    verbose("entered 'parse()'")

    let parsed = { "url": Object.keys(data["urls"])[0] }

    for (let a in data["applications"]) {
        let app = data["applications"][a]
        let val = ""

        if (app["version"] != null && app["version"] != "") {
            val = app["version"]
        } else {
            val = "yes"
        }

        parsed[app["name"]] = val
    }

    return JSON.stringify(parsed, null, 2)
}


function save(data) {
    verbose("entered 'save()'")

    if (Json.value === "") {
        console.log(data)
    } else {
        if (Json.value != "") {
            verbose("checking for existing '"+ Json.value +"'...")

            if (fs.existsSync(Json.value)) {
                verbose("'"+ Json.value +"' exists. Appending to file...")

                let file = JSON.parse(fs.readFileSync(Json.value))
                file.push(data)
                fs.writeFileSync(Json.value, data + '\n', 'utf8')
            } else {
                verbose("'"+ Json.value +"' doesn't exist. Creating...")
                fs.writeFileSync(Json.value, data + '\n', 'utf8')
            }
        }
    }
}


async function main() {
    let urls = []
    let opts = {
        debug:       Debug.value,
        delay:       500,
        htmlMaxCols: 2000,
        htmlMaxRows: 2000,
        maxDepth:    3,
        maxUrls:     10,
        maxWait:     5000,
        recursive:   true,
        userAgent:   'whodis',
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

    for (let u in urls) {
        let url = urls[u]

        if (!url.includes("http://") && !url.includes("https://")) {
            url = "https://" + urls[u]
        }

        await new wappalyzer(browser, url, opts).analyze().then(data => {
            log("crawling '"+ url +"'...")
            let d = parse(data)
            save(d)
        }).catch(err => { console.log(err) })
    }

    process.exit(0)
}; main()
