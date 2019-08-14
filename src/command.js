// command.js

const version = require('../package.json').version;

/**
 * Define a command and it's flags.
 */
class Command {
  constructor(Name, Usage, About) {
		this.name = Name
		this.usage = Usage
		this.about = About
		this.flags = {}
  }

  Flag(Long, Short, Value, About) {
		if (Short !== null) {
	    Short = "-" + Short
		}

		if (Long === null) {
	    // TODO: provide a stacktrace of what caused the error.
	    console.error("command: error: 'Long' must not be null")
	    console.trace()
	    process.exit(1)
		}

		this.flags[Long] = {
	    "short": Short,
	    "long": "--" + Long,
	    "value": Value,
	    "about": About,
	    "triggered": false
		}

		return this.flags[Long]
  }

  /**
   * Display formatted and aligned help output, similar to Unix and/or GNU
   * help output. The order you define your flags is the order they are
   * listed.
   */
  Help() {
		let align = [0, 0]
		let pad = ['', '']

		console.log("Usage:", this.name, this.usage + "\n" + this.about + "\n")

		for (let f in this.flags) {
	    let flag = this.flags[f]

	    if (flag.short !== null) {
				if (flag.short.length > align[0]) {
					align[0] = flag.short.length
				}
	    }

	    if (flag.long.length > align[1]) {
				align[1] = flag.long.length
	    }
		}

		for (let f in this.flags) {
	    let flag = this.flags[f]

	    if (flag.short !== null) {
				if (flag.short.length < align[0]) {
					for (let i = 0; i < (align[0] - flag.short.length + 1); i++) {
						pad[0] += " "
					}
				} else {
					pad[0] = " "
				}
	    }

	    if (flag.long.length < align[1]) {
				for (let i = 0; i < (align[1] - flag.long.length + 4); i++) {
					pad[1] += " "
				}
	    } else {
				pad[1] = "    "
	    }

	    if (flag.short === null) {
				console.log("  " + flag.long + pad[1] + "    " + flag.about)
	    } else {
				console.log(
					"  " + flag.short + "," + pad[0] + flag.long + pad[1] +
						flag.about
				)
	    }

	    pad = ['', ''];
		}

		// Newline
		console.log()
		process.exit(0)
  }

  Parse() {
		this.Flag("help", "h", false, "Show this output")
		this.Flag("version", "v", false, "Show command version")

		let args = process.argv.slice(2, process.argv.length)
		let found = []
		let param = []

		for (let a in args) {
	    let arg = args[a]
	    let argn = args[parseInt(a) + 1]

	    for (let f in this.flags) {
				let flag = this.flags[f]

				if (!this.flags[f].triggered &&
						(arg === flag.short || arg === flag.long)) {
					this.flags[f].triggered = !flag.value

					if (typeof flag.value === "boolean") {
						this.flags[f].value = !flag.value
						found.push(arg)
						break
					} else {
						this.flags[f].value = argn
						found.push(arg)
						break
					}
				}
	    }

	    if (!found.includes(arg)) {
				param.push(arg)
	    }
		}

		if (this.flags.help.value) {
	    this.Help()
		}

		if (this.flags.version.value) {
	    console.log(this.name, "v" + version)
	    process.exit(0)
		}

		return param
  }
}

module.exports = Command
