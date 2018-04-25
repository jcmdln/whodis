// flags.js

let Flags = {
  "help": {
    "short": "-h",
    "long":  "--help",
    "value": false,
    "about": "Shows this output"
  },
  "version": {
    "short": "-v",
    "long":  "--version",
    "value": false,
    "about": "Show application version"
  },
}

let Add = function(Long, Short, Value, About) {
  Flags[Long] = {
    "short": '-'+Short,
    "long":  '--'+Long,
    "value": Value,
    "about":  About
  }

  return Flags[Long]
}

let Parse = function(usage) {
  let args  = process.argv.slice(2, process.argv.length)

  if (args.length === 0 || args.indexOf("-h") > -1) {
    Flags['help']['value'] = true

    console.log(usage)

    let align = 0, pad = ''
    for (f in Flags) { if (f.length > align) { align = f.length } }
    for (f in Flags) {
      if (f.length < align) {
	for (i = 0; i < (align - f.length + 4); i++) { pad = pad + ' ' }
      } else {
	pad = '    '
      }

      console.log(
	Flags[f]['short']+',', Flags[f]['long'], pad, Flags[f]['about']
      )

      pad = ''
    }
    return
  }

  if (args.indexOf("-v") > -1) {
    Flags['version']['value'] = true
    return
  }

  if (args.indexOf("-j") > -1) {
    Flags['json']['value'] = true
  }
}

module.exports = {
  Flags: Flags,
  Add:   Add,
  Parse: Parse
}
