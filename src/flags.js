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

let Parse = function() {
  let args  = process.argv.slice(2, process.argv.length)
  let align = 0, pad = ''

  for (f in Flags) {
    if (f.length > align) { align = f.length }
  }

  for (f in Flags) {
    if (f.length < align) {
      for (i = 0; i < (align - f.length + 4); i++) {
	pad = pad + ' '
      }
    } else {
      pad = '    '
    }

    console.log(
      Flags[f]['short']+',', Flags[f]['long'], pad, Flags[f]['about']
    )

    pad = ''
  }
}

module.exports = {
  Add:   Add,
  Parse: Parse
}
