// flags.js

let pkginfo  = require('pkginfo')(module, 'name', 'version', 'description'),
    pkgname    = module.exports['name'],
    pkgversion = module.exports['version'],
    pkgabout   = module.exports['description']


//
//

let Cmd = {
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

let Meta = function(Usage) {
  Cmd["name"]    = pkgname
  Cmd["version"] = pkgversion
  Cmd["usage"]   = Usage
  Cmd["about"]   = pkgabout
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
    'Usage:', pkgname, Cmd['usage']+'\n'
      + pkgabout+'\n'
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
  let parg = []

  // Check for no arguments or '-h|--help', print Help() and exit.
  if (args.length === 0 ||
      args.indexOf(Cmd['flags']['help']['short']) > -1 ||
      args.indexOf(Cmd['flags']['help']['long'])  > -1) {
    Help()
    process.exit()
  }

  // Check for '-v|--version', print version and exit.
  if (args.indexOf(Cmd['flags']['version']['short'] > -1 ) ||
      args.indexOf(Cmd['flags']['version']['long']) > -1) {
    console.log(pkgname, '- v'+pkgversion)
    process.exit()
  }

  // Parse arguments
  for (i = 0; i < args.length; i++ ) {
    for (f in Cmd['flags']) {
      if ((args[i].indexOf(Cmd['flags'][f]['short']) > -1) ||
	  (args[i].indexOf(Cmd['flags'][f]['long'])  > -1)) {

	// Check for arguments that have undefined types
	if (Cmd['flags'][f]['value'] === typeof(undefined)) {
	  console.log("nope")
	  process.exit()
	}

	// Check for arguments that toggle booleans
	if (Cmd['flags'][f]['value'] === typeof(boolean)) {
	  Cmd['flags'][f]['value'] = true
	} else if (Cmd['flags'][f]['value'] === true) {
	  Cmd['flags'][f]['value'] = false
	}

	// Check for arguments that receive strings
	if (Cmd['flags'][f]['value'] === typeof(string)) {
	  Cmd['flags'][f]['value'] = args[i+1]
	  i++
	}

	// Check for arguments that receive numbers
	if (Cmd['flags'][f]['value'] === typeof(int)) {
	  Cmd['flags'][f]['value'] = args[i+1]
	  i++
	}

	return
      }
    }

    // Collect arguments not associated with a flag
    parg.push(args[i])
  }

  // Return array of non-flag arguments
  return parg
}

// Here we will expose certain items for user consumption.
module.exports = {
  Add:   Add,
  Cmd:   Cmd,
  Meta:  Meta,
  Parse: Parse,
}
