WhoDis uses the existing Wappalyzer nodejs package to detect site
software from the command line.

    $ ./whodis --help
    Usage: whodis [OPTION] URLs...
    Discover software used by websites

      -V, --verbose    Show additional messages for tracking execution.
      -q, --quiet      Suppress output, ignoring whether --verbose was issued.
      -d, --debug      Enable Wappalyzer's debug output, ignoring whether --quiet was issued.
      -f, --file       Read domains from the specified text file.
      -j, --json       Save data to JSON file
      --help           Show this output
      --version        Show command version

## Installing
There are a few options for running `whodis`, though the preffered method is 
that you would build from source.

### Build from source
This package ships with `nexe` as a dev dependecy for building a single binary
for easy consumption and sharing. The process for doing so is outlined in the 
following:

    $ git clone https://github.com/jcmdln/whodis.git
    $ cd whodis
    $ yarn run build

### Download a binary
I won't be doing this yet, though I plan to make regular releases in the 
future. At the moment this project is too immature and I'm the only one working
on it, so this is not a priority.

