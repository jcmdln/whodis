// whodis.js


// imports
const fs         = require('fs'),
      flag       = require('flags'),
      json2csv   = require('json2csv').parse,
      wappalyzer = require('wappalyzer')


// Define our flags
let cmd  = flag.Cmd("whodis", "Discover software used by websites", "[OPTION] URLs..."),
    V    = flag.Add("--verbose", "-V", false, "Enable verbose output"),
    q    = flag.Add("--quiet",   "-q", false, "Hide all output"),
    d    = flag.Add("--debug",   "-d", false, "Enable Wappalyzer's debug output"),
    f    = flag.Add("--file",    "-f", "",    "Read domains from txt file"),
    j    = flag.Add("--json",    "-j", "",    "Save data to JSON file"),
    args = flag.Parse()


// This is a helper promise we'll use to manage 'state' basically. We'll
// call this later on as a mechanism to control the 'flow' of our
// promise chain.

let promise = Promise.resolve()


// 'log()' is a wrapper that checks if '-q' was passed, and outputs a
// message when false.

function log(msg) {
  if (!q.value) {
    console.log("whodis:", msg)
  }
}


// 'verbose()' is a wrapper that checks if '-v' was passed, and outputs
// additional messages on actions.

function verbose(msg) {
  if (V.value) {
    console.log("whodis:", msg)
  }
}


// I like having a main() function, although it's sort of pointless for
// Node. Here we'll process the provided domains, from a file using '-f'
// or from the arguments received from 'args', and handle the entrypoint
// for our promises.

function main() {
  verbose("flag state: " + JSON.stringify(cmd, null, 2) + '\n')

  let urls = []

  let options = {
    debug:       d.value,
    delay:       100,
    htmlMaxCols: 1500,
    htmlMaxRows: 1500,
    maxDepth:    1,
    maxUrls:     1,
    maxWait:     5000,
    recursive:   false,
    userAgent:   'WhoDis v1'
  }

  if (f.value.length > 0) {
    log("reading domain(s) from", f.value + "...")

    urls = fs.readFileSync(f.value).toString().split("\n")
  } else {
    if (args.length > 0) {
      log("reading domain(s) from arguments...")

      urls = args
    } else {
      log("no URLs passed! Exiting...")

      process.exit(1)
    }
  }

  // Create a listener for each domain
  process.setMaxListeners(urls.length)

  urls.forEach(url => {
    promise = promise.then(() => {
      return get(url, new wappalyzer('http://' + url, options))
    }).catch(err => { console.log(err) })
  })

  // Once all promises have completed, this block runs.
  promise.then(() => {
    process.exit(0)
  }).catch(err => { console.log(err) })
} main()


// get() is a 'promise factory' that is used to handle the 'analyze()'
// method from the imported wappalyzer class. Before proceeding, we'll
// ensure that it has received data, run our parse() function, and
// finally resolve() the parsed data.

function get(url, promise) {
  verbose("entered 'get()'")
  log("scanning '"+ url +"'...")

  return new Promise((resolve) => {
    promise.analyze().then(data => {
      let p = parse(data)
      resolve(p)
    }).catch(err => { console.log(err) })
  }).catch(err => { console.log(err) })
}


// parse() is where we'll keep our logic for how to handle the data we
// receive. Much of the data we receive goes unused, but we keep the
// important bits.

function parse(data) {
  verbose("entered 'parse()'")
  log("checking for known software...")

  let r = {
    "url": Object.keys(data["urls"])[0]
  }

  for (a in data["applications"]) {
    let app = data["applications"][a]
    let value = ""

    if (app["version"] != null) {
      value = app["version"]
    } else {
      value = "yes"
    }

    r[app["name"]] = value
  }

  if (j.value === "") {
    console.log(JSON.stringify(r, null, 2) + '\n')
  } else {
    save(r)
  }

  return r
}


// 'save()' is where the logic for saving to and reading from files is
// kept. Here we will handle saving to a json or csv file based on the
// provided flags.

function save(data) {
  verbose("entered 'save()'")
  log("saving data to file...")

  if (j.value != "") {
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
