// flags.js

//
//

let Cmd = {
  "name":    "",
  "version": "",
  "usage":   "",
  "about":   "",
  "flags": {
    "help": {
      "short": "-h",
      "long":  "--help",
      "value": false,
      "about": "Show this output",
    },
    "version": {
      "short": "-v",
      "long":  "--version",
      "value": false,
      "about": "Show command version",
    },
  },
}


//
//

let Meta = function(Name, Version, Usage, About) {
  Cmd["name"]    = Name
  Cmd["version"] = Version
  Cmd["usage"]   = Usage
  Cmd["about"]   = About
  return Cmd
}


// Add will add a flag to our Flags JSON object. The key is also the
// long flag, and flags do not require the user to manually add '-'.

let Add = function(Long, Short, Value, About) {
  Cmd['flags'][Long] = {
    "short": '-'+Short,
    "long":  '--'+Long,
    "value": Value,
    "about": About,
  }

  return Cmd['flags'][Long]
}


//
//

let Help = function() {
  Cmd['flags']['help']['value'] = true

  console.log(
    Cmd['name']+':', Cmd['about']+'\n'
      +'Usage:', Cmd['name'], Cmd['usage']+'\n\n'
      +'Available options:'
  )

  let align = 0, pad = ''

  for (f in Cmd['flags']) {
    if (f.length > align) {
      align = f.length }
  }

  for (f in Cmd['flags']) {
    if (f.length < align) {
      for (i = 0; i < (align - f.length + 4); i++) {
	pad = pad + ' '
      }
    } else {
      pad = '    '
    }

    console.log(
      '    '+Cmd['flags'][f]['short']+',', Cmd['flags'][f]['long'], pad,
      Cmd['flags'][f]['about']
    )

    pad = '';
  }
}

//
//
let Parse = function() {
  let args = process.argv.slice(2, process.argv.length)

  // Checking for no arguments. No point in parsing further bits if
  // there's nothing to parse.
  if (args.length === 0 ||
      (args.indexOf(Cmd['flags']['help']['short']) > -1 ) ||
      (args.indexOf(Cmd['flags']['help']['long'])  > -1)) {
    Help()
    return
  }



  // Compare arguments against flags and perform tasks like flipping
  // boolean bits.
  for (i = 0; i < args.length; i++ ) {
    for (f in Cmd['flags']) {
      if ((args[i].indexOf(Cmd['flags'][f]['short']) > -1) ||
	  (args[i].indexOf(Cmd['flags'][f]['long'])  > -1)) {
	// Flip booleans
	if (Cmd['flags'][f]['value'] === false) {
	  Cmd['flags'][f]['value'] = true
	} else if (Cmd['flags'][f]['value'] === true) {
	  Cmd['flags'][f]['value'] = false
	}

	return
      }
    }

    // Log all arguments not associated with a flag
    console.log(Cmd['name']+":", "no such flag", args[i])
  }
}

// Here we will expose certain items for user consumption.
module.exports = {
  Add:   Add,
  Cmd:   Cmd,
  Meta:  Meta,
  Parse: Parse,
}
