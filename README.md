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

There are two installation methods to choose from:

### From Source
This is the preferred method since WhoDis is still being heavily
modified. I personally wouldn't install this as a global program
quite yet, though.

```
$ git clone https://github.com/jcmdln/whodis
$ cd whodis
$ yarn install
```

### Using `npm`
```
$ npm install -g git+https://github.com/jcmdln/whodis
```

### Using `yarn`
```
$ yarn global add git+https://github.com/jcmdln/whodis
```


## Usage
```
$ node whodis.js
whodis: No URLs passed! Exiting...
$ node whodis.js -h
Usage: whodis [OPTION] URLs...
Discover software used by websites

    -h, --help        Show this output
    -v, --version     Show command version
    -d, --debug       Enable debugging
    -f, --file        Read domains from txt file
    -j, --json        Save data to JSON file

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
```


## Contributing

Assistance, comments, suggestions, and other contributions are welcome!
If I'm missing a feature, let me know please!
