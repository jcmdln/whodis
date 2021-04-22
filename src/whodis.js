// whodis.js
'use strict';

const Command = require('../lib/command.js')
const Log = require('../lib/log.js')
const Wappalyzer = require('wappalyzer');
const fs = require("fs")
const path = require('path')


const cmd = new Command(
    "whodis", "[OPTION] URLs...", "Discover software used by websites.")
const log = new Log(cmd.name)
const wappalyzer = new Wappalyzer()


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
const Args = cmd.Parse()


async function whodis(urls) {
    let data = {}

    try {
	await wappalyzer.init()

	const results = await Promise.all(
	    urls.map(async (url) => ({
		url,
		results: await wappalyzer.open(url).analyze()
	    }))
	)

	data = results
    } catch (error) {
	console.error(error)
    }

    await wappalyzer.destroy()

    return data
}


async function main() {
    let data = {}
    let result = {}
    let urls = []

    if (File.value.length > 0) {
	log.Msg("reading domains from '" + File.value + "'...")

	urls = fs.readFileSync(File.value).toString().split("\n")
    } else {
	if (Args.length == 0) {
	    log.Error("no arguments were provided")
	}

	for (let i = 0; i < Args.length; i++) {
	    let arg = Args[i]

	    if (arg.includes(".")) {
		urls.push(arg)
	    }
	}

	if (urls.length == 0) {
	    log.Error("no valid urls were provided")
	}
    }

    data = await whodis(urls)

    for (let d in data) {
	let n = data[d]
	let tech = n.results.technologies
	let url = n.url

	result[url] = {}

	for (let t in tech) {
	    let item = tech[t]
	    let name = item.name

	    if (item.version != null) {
		result[url][item.name] = item.version
	    } else {
		result[url][item.name] = true
	    }
	}
    }

    console.log(JSON.stringify(result, null, 2))
}; main()
