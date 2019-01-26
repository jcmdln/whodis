# whodis
WhoDis uses the existing Wappalyzer nodejs package to detect site
software from the command line.

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


## Installing
There are a few options for running `whodis`, though the preffered method is 
that you would build from source.

### Download a nexe binary


### Build from source
This package ships with `nexe` as a dev dependecy for building a single binary
for easy consumption and sharing. The process for doing so is outlined in the 
following:

    $ git clone https://github.com/jcmdln/whodis.git
    $ cd whodis
    $ yarn run build
    $ ./whodis -h
    Usage: whodis [OPTION] URLs...
    Discover software used by websites

        -d, --debug      Enable Wappalyzer's debug output
        -f, --file       Read domains from txt file
        -j, --json       Save data to JSON file
        -h, --help       Show this output
        -v, --version    Show command version
