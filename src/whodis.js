// whodis.js
'use strict';
process.setMaxListeners(0);


const Command = require('./lib/command.js')
const Log = require('./lib/log.js')
const Wappalyzer = require('wappalyzer')
const Browser = require('../node_modules/wappalyzer/browsers/zombie.js')
//const json2csv = require('json2csv').parse


const cmd = new Command("whodis", "[OPTION] URLs...",
  "Discover software used by websites")
let Verbose = cmd.Flag("verbose", "V", false,
  "Show additional messages for tracking execution.")
let Quiet = cmd.Flag("quiet", "q", false,
  "Suppress output, ignoring whether --verbose was issued.")
let Debug = cmd.Flag("debug", "d", false,
  "Enable Wappalyzer's debug output, ignoring whether --quiet was issued.")
let File = cmd.Flag("file", "f", "",
  "Read domains from the specified text file.")
let Json = cmd.Flag("json", "j", "",
  "Save data to tje specified JSON file")
let Args = cmd.Parse()


/**
 * 
 */
function Parse(data) {
  let parsed = {
    "url": Object.keys(data.urls)[0]
  }

  for (let a in data.applications) {
    let app = data.applications[a]

    if (app.version !== null && app.version !== "") {
      parsed[app.name] = app.version
    } else {
      parsed[app.name] = true
    }
  }

  return JSON.stringify(parsed, null, 2)
}

/**
 * 
 */
function Save(data) {
  if (Json.value != "") {
    if (fs.existsSync(Json.value)) {
      let file = JSON.parse(
        fs.readFileSync(Json.value)
      )

      file.push(data)
      fs.writeFileSync(Json.value, data + '\n', 'utf8')
    } else {
      fs.writeFileSync(Json.value, data + '\n', 'utf8')
    }
  } else {
    console.log(data)
  }
}

/**
 * 
 */
async function main() {
  let urls = []

  if (File.value != "") {
    urls = fs.readFileSync(File.value).toString().split("\n")
  } else {
    if (Args.length > 0) {
      urls = Args
    } else {
      process.exit(1)
    }
  }

  for (let u in urls) {
    let url = urls[u]

    if (!url.includes("http://") && !url.includes("https://")) {
      url = "https://" + urls[u]
    }

    await new Wappalyzer(Browser, url, {
      debug: Debug.value,
      delay: 500,
      htmlMaxCols: 2000,
      htmlMaxRows: 2000,
      maxDepth: 3,
      maxUrls: 10,
      maxWait: 5000,
      recursive: true,
      userAgent: 'whodis',
    }).analyze().then(data => {
      let d = Parse(data)
      Save(d)
    }).catch(err => {
      console.log(err)
    })
  }

  process.exit(0)
};

main()