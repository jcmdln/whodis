# whodis
WhoDis uses the existing Wappalyzer nodejs package to detect site
software from the command line.


## Installation

	$ npm install -g git+https://github.com/jcmdln/whodis


## Usage

	$ node whodis.js -h
	Usage: whodis [OPTION] URLs...
	Discover software used by websites

      -h, --help        Show this output
      -v, --version     Show command version
      -V, --verbose     Enable verbose output
      -q, --quiet       Hide all output
      -d, --debug       Enable Wappalyzer's debug output
      -f, --file        Read domains from txt file
      -j, --json        Save data to JSON file

### Single domains (or small batches)

    $ node whodis.js techcrunch.com
    whodis: reading domain(s) from arguments...
    whodis: crawling 'https://techcrunch.com'...
    {
      "url": "https://techcrunch.com/",
      "New Relic": "yes",
      "Nginx": "yes",
      "WordPress": "5.0.1",
      "PHP": "yes",
      "MySQL": "yes",
      "Lodash": "4.17.11",
      "Parse.ly": "yes",
      "Prebid": "yes",
      "Twitter Emoji (Twemoji)": "yes",
      "Typekit": "1.19.2",
      "jQuery": "1.12.4",
      "jQuery Migrate": "1.4.1",
      "MediaElement.js": "4.2.6"
    }

### Bulk domains

	$ sh whodis.sh list-of-domains.txt whodis-results.csv
	...
