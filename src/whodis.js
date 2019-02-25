// whodis.js
'use strict';

const child = require('child_process')
const Command = require('./lib/command.js')
const Log = require('./lib/log.js')

const cmd = new Command("whodis", "[OPTION] URLs...", "Discover software used by websites")
let Verbose = cmd.Flag("verbose", "V", false, "Show additional messages for tracking execution.")
let Quiet = cmd.Flag("quiet", "q", false, "Suppress output, ignoring whether --verbose was issued.")
let Debug = cmd.Flag("debug", "d", false, "Enable debug output, ignoring whether --quiet was issued.")
let File = cmd.Flag("file", "f", "", "Read domains from the specified text file.")
let saveJson = cmd.Flag("json", "j", "", "Save data to tje specified JSON file")
let Args = cmd.Parse()


const log = new Log(cmd.name)


let urls = []

if (File.value !== "" && File.value !== "") {
	log.Msg("reading domains from '" + File.value  + "'...")
	urls = fs.readFileSync(File.value).toString().split("\n")
} else {
	if (Args.length > 0) {
		urls = Args
	} else {
		log.Error("no arguments were passed!")
	}
}

for (let u in urls) {
	let url = urls[u]
	let result = child.execSync("node ./src/exec.js " + url)
	console.log(result.toString())
}
