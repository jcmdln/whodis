// wappalyzer.js

const Log = require('./log.js')
const Wappalyzer = require('wappalyzer')
const Browser = require('../../node_modules/wappalyzer/browsers/zombie.js')

const log = new Log("wappalyzer")


class Wapp {
	constructor(Name, Debug, JsonFile) {
		this.name    = Name
		this.debug   = Debug
		this.Json    = JsonFile
		this.options = {
			debug: Debug,
			delay: 500,
			htmlMaxCols: 2000,
			htmlMaxRows: 2000,
			maxDepth: 3,
			maxUrls: 10,
			maxWait: 5000,
			recursive: true,
			userAgent: Name,
		}
	}

	Parse(Data) {
		let parsed = {
			"url": Object.keys(Data.urls)[0]
		}

		for (let a in Data.applications) {
			let app = Data.applications[a]

			if (app.version !== null && app.version !== "") {
				parsed[app.name] = app.version
			} else {
				parsed[app.name] = true
			}
		}

		return JSON.stringify(parsed, null, 2)
	}

	Save(Data) {
		if (this.Json != "") {
			if (fs.existsSync(this.Json)) {
				let file = JSON.parse(fs.readFileSync(this.Json))

				file.push(Data)
				fs.writeFileSync(this.Json, Data + '\n', 'utf8')
			} else {
				fs.writeFileSync(this.Json, Data + '\n', 'utf8')
			}
		} else {
			return Data
		}
	}

	async Scan(Urls) {
    for (let u in Urls) {
			let url = Urls[u]

			if (!url.includes(".")) {
				log.Fatal("'"+ url + "'" + " is not a domain!")
			}

			if (!url.includes("http://") && !url.includes("https://")) {
				url = "https://" + url
			}

			await new Wappalyzer(Browser, url, this.options).analyze().then(data => {
				let d = this.Parse(data)
				let s = this.Save(d)
				console.log(s)
			}).catch(err => {
				console.log(err)
			})
    }

			process.exit(0)
	}
}

module.exports = Wapp
