// whodis.js
'use strict';

const child   = require('child_process')
const path    = require('path')

const Command = require('./command.js')
const Log     = require('./log.js')


// command.js
//
// Define our top-level command including the arguments and their
// options, then parse them.

const cmd = new Command(
	"whodis", "[OPTION] URLs...",
	"Discover software used by websites."
)

let Verbose = cmd.Flag(
	"verbose", "V", false,
	"Show all output."
)

let Quiet = cmd.Flag(
	"quiet", "q", false,
	"Suppress output, ignoring whether --verbose was issued."
)

let Debug = cmd.Flag(
	"debug", "d", false,
	"Enable debug output, ignoring whether --quiet was issued."
)

let File = cmd.Flag(
	"file", "f", "",
	"Read domains from the specified input file."
)

// let saveCsv = cmd.Flag(
// 	"csv", "c", "",
// 	"Save data as JSON to the specified file."
// )

let saveJson = cmd.Flag(
	"json", "j", "",
	"Save data as JSON to the specified file."
)

// Parse arguments and their options.
const Args = cmd.Parse()


// log.js
//
// Instantiate a new Log

const log = new Log(cmd.name)


// wappalyzer.js
//
// This is where we prepare our actual work to be done, and pass it
// through the main.js for execution.

let urls = []

if (File.value.length > 0) {
	log.Msg("reading domains from '" + File.value + "'...")

	urls = fs.readFileSync(File.value).toString().split("\n")
} else {
	// Ensure arguments were provided
	if (Args.length == 0) {
				log.Error("no arguments were provided")
	}

	// Ensure arguments "smell" like domains
	for (let i = 0; i < Args.length; i++) {
		let arg = Args[i]

		if (arg.includes(".")) {
			urls.push(arg)
		}
	}

	// Ensure we got at least one valid domain
	if (urls.length == 0) {
		log.Error("no valid urls were provided")
	}
}


// This is required so pkg knows how to access the file we want to
// execute as a child process.
const Wappaluzer = require('./wappalyzer.js')
const ex = path.join(__dirname, './exec.js')

for (let i = 0; i < urls.length; i++) {
	const url = urls[i]
	let result = child.execSync("node " + ex + " " + url)
	console.log(result.toString())
}
