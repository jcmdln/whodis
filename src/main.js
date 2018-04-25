// main.js

const fs         = require('fs'),
      wappalyzer = require('wappalyzer')

const usage   = 'Usage: whodis [OPTION] URLs...',
      flags   = {
	'help':    [false, '-h', '--help',    'Show this output'],
	'version': [false, '-v', '--version', 'Show software version'],
	'file':    [false, '-f', '-file',     'Read list of URLs from a file'],
	'json':    [false, '-j', '--json',    'Write data to JSON file']
      }

let data    = [],
    domains = [],


///
/// flags.js
///

function FlagsHelp() {
  console.log(usage)

  var align = 0, pad = ''
  for (f in flags) {
    if (f.length > align) {
      align = f.length
    }
  }

  for (f in flags) {
    if (f.length < align) {
      for (i = 0; i < (align - f.length + 4); i++) { pad = pad + ' ' }
    } else {
      pad = '    '
    }
    console.log(flags[f][1]+',', f, pad, flags[f][2])

    pad = ''
  }
}

function FlagsParse(args) {
  let al  = args.length,
      arg = args.slice(2, args.length)

  let fc = flags

  for (i = 0; arg[i]; i++) {
    console.log(arg)
    for (f in fc) {
      console.log(i, f)
      if (i.indexOf(f[1]) > -1 || i.indexOf(f[2]) > -1) {
	console.log(i, f)
      }
    }
  }

  console.log(arg)
  console.log(fc)

  return fc
}


///
/// Execution
///

function Search(url) {
  const w = new wappalyzer(url)

  if (url.indexOf('http') === -1) {
    url = 'https://' + url
  }

  w.analyze()
    .then(json => {
      if (json.length === 0) {
	console.log("whodis: error: no JSON data received")
	console.log("whodis: exiting...")
	process.exit()
      } else {
	console.log(json)
      }
    })
    .catch(error => {
      console.error(error)
    })
}

function main() {
  FlagsParse(process.argv)
}

main()
