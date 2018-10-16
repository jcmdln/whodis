# whodis
WhoDis uses the existing Wappalyzer nodejs package to detect site
software from the command line. It is written as cleanly as possible
in a single file that relies on few imports.

I wrote [flags.js](https://github.com/jcmdln/flags.js) in tandem with
WhoDis because I wanted unix-style flags parsing in NodeJS, though it
should be suitable for any NodeJS project.


## Why?
Unlike using the browser extension or stacks-cli, WhoDis allows
reviewing the software of many sites simultaneously and storing the
results as a csv or json file. I would like to reach a point where Whodis
is able to generate reports against millions or tens of millions of
domains at a time.


## Installation
There are multiple installation methods to choose from:

### From Source
This is the preferred method since WhoDis is still being heavily
modified. I personally wouldn't install this as a global program
quite yet, though.

	$ git clone https://github.com/jcmdln/whodis
	$ cd whodis
	$ yarn install

### From a package manager
I prefer `yarn` but I'll show two examples:

#### Using `npm`

	$ npm install -g git+https://github.com/jcmdln/whodis

#### Using `yarn`

	$ yarn global add git+https://github.com/jcmdln/whodis


## Usage
A big issue with `whodis` is that due to my haphazard "understanding" of
NodeJS promises memory is not always relinquished. Due to this, there
are two strategies for running `whodis` explained below.

### Single domains or small batches
If running against a single domain or small batches of domains, using
`whodis` directly is not an issue. For fewer than 50 domains, this is
the preferred method:

	$ node whodis.js techcrunch.com
	whodis: Reading domain(s) from arguments...
	whodis: scanning 'techcrunch.com'...
	whodis: checking for known software...
	{
		"url": "http://techcrunch.com/",
		"Lodash": "4.17.10",
		"New Relic": "yes",
		"Nginx": "yes",
		"Twitter Emoji (Twemoji)": "yes",
		"Typekit": "1.19.2",
		"WordPress": " 4.9.8",
		"PHP": "yes",
		"MySQL": "yes",
		"YouTube": "yes"
	}

### Bulk domains
The shell script takes two arguments: the list of domains to read from,
and the file to save results to. This could be easily re-created in an
alternate language such as Python, though peek at the file and re-create
it if needed. You may use it as follows:

	$ sh whodis.sh list-of-domains.txt whodis-results.csv
	...

#### Why is this needed at all?
If you are attempting to collect info on 50 or more domains (ie
thousands of domains) there is `whodis.sh` which is a shell script to
act as a frontend. All this does is iterate over each domain with a
fresh process so we can be sure that memory is being freed. To clarify
further, this is not my intention. I would very much prefer that running
`whodis` directly allowed checking against millions of domains, though at
this time I believe that would require breaking apart the Wappalyzer code
which I don't believe would be useful.


## Contributing
Assistance, comments, suggestions, and other contributions are welcome!
If I'm missing a feature, let me know please!
