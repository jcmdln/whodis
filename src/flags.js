// flags.js

let pkginfo    = require('pkginfo')(module, 'version')
    pkgversion = module.exports['version']


// Define our JSON object which will hold metadata about our commands,
// and a mechanism for defining the root command.

let Cmd = {}

let RootCmd = function(Name, About, Usage) {
  Cmd["name"]    = Name,
  Cmd["version"] = pkgversion,
  Cmd["about"]   = About,
  Cmd["usage"]   = Usage,
  Cmd["flags"]   = {
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
  }

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


// This function parses the length of all flags to provide
// width-respecting help output.

let Help = function() {
  // Flip 'help's boolean, though this isn't really important as when
  // this is triggered it will exit.
  Cmd['flags']['help']['value'] = true

  // Print the command name, usage, and about text.
  console.log(
    'Usage:', Cmd['name'], Cmd['usage']+'\n'
      + Cmd['about']+'\n'
  )

  // Store our initial values for alignment and padding.
  let align = [0, 0], pad = ['', '']

  // Update align to store the length of the longest short/long flags
  for (f in Cmd['flags']) {
    if (Cmd['flags'][f]['short'].length > align[0]) {
      align[0] = Cmd['flags'][f]['short'].length
    }
    if (Cmd['flags'][f]['long'].length > align[1]) {
      align[1] = Cmd['flags'][f]['long'].length
    }
  }

  //
  for (f in Cmd['flags']) {
    let flag_short = Cmd['flags'][f]['short'],
	flag_long  = Cmd['flags'][f]['long']

    if (flag_short.length < align[0]) {
      for (i = 0; i < (align[0] - flag_short.length + 1); i++) {
	pad[0] = pad[0] + ' '
      }
    } else {
      pad[0] = ' '
    }

    if (flag_long.length < align[1]) {
      for (i = 0; i < (align[1] - flag_long.length + 4); i++) {
	pad[1] = pad[1] + ' '
      }
    } else {
      pad[1] = '    '
    }

    console.log(
      '    ' + flag_short + ',' + pad[0] + flag_long + pad[1],
      Cmd['flags'][f]['about']
    )

    // Reset pad
    pad = ['', ''];
  }
}


// This is our argument parser which reads all arguments from the index
// of 2 and later, then updates the values and returns non-flag arguments
// for handling in personal logic.

let Parse = function() {
  let args = process.argv.slice(2, process.argv.length)
  let parsed_args = []

  // Check for no arguments or '-h|--help', print Help() and exit.
  if (args.length === 0 ||
      args.indexOf(Cmd['flags']['help']['short']) > -1 ||
      args.indexOf(Cmd['flags']['help']['long'])  > -1) {
    Help()
    process.exit()
  }

  // Check for '-v|--version', print version and exit.
  if (args.indexOf(Cmd['flags']['version']['short']) > -1  ||
      args.indexOf(Cmd['flags']['version']['long']) > -1) {
    console.log(Cmd['name'], '- v'+pkgversion)
    process.exit()
  }

  // Iterate over all arguments
  for (i = 0; i < args.length; i++) {
    // Compare against each flag
    for (f in Cmd['flags']) {
      // Confirm that a flag matches
      if ((args[i].indexOf(Cmd['flags'][f]['short']) > -1) ||
	  (args[i].indexOf(Cmd['flags'][f]['long'])  > -1)) {

	// Check for arguments that toggle booleans
	if (typeof Cmd['flags'][f]['value'] === typeof false) {
	  if (Cmd['flags'][f]['value'] === true) {
	    Cmd['flags'][f]['value'] = false
	  } else {
	    Cmd['flags'][f]['value'] = true
	  }
	}

	// Check for arguments that receive strings
	if (typeof Cmd['flags'][f]['value'] === typeof '') {
	  if (typeof args[i+1] === typeof '') {
	    Cmd['flags'][f]['value'] =  args[i+1]
	    i += 2
	  } else {
	    console.error(
	      'markan: type of', args[i+1],
	      'does not match the original value!\n'
		+ 'Exiting...'
	    )
	    process.exit(1)
	  }
	}

	// Check for arguments that receive numbers
	if (typeof Cmd['flags'][f]['value'] === typeof 0) {
	  // Confirm the passed value is of the same type
	  if (typeof args[i+1] === typeof 0){
	    Cmd['flags'][f]['value'] = args[i+1]
	    i += 2
	  } else {
	    console.error(
	      'markan: type of', args[i+1],
	      'does not match the original value!\n'
		+ 'Exiting...'
	    )
	    process.exit(1)
	  }
	}
      }
    }

    // Add non-flag arguments to parg
    parsed_args.push(args[i])
  }

  return parsed_args
}


// Expose only the needed functions in order to create commands and
// flags.

module.exports = {
  RootCmd:  RootCmd,
  Add:      Add,
  Parse:    Parse,
}
