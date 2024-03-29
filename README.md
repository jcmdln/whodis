WhoDis uses the existing Wappalyzer NodeJS package to detect site
software from the command line.

    $ whodis --help
    Usage: whodis [OPTION] URLs...
    Discover software used by websites

    -V, --verbose    Show additional messages for tracking execution.
    -q, --quiet      Suppress output, ignoring whether --verbose was issued.
    -d, --debug      Enable debug output, ignoring whether --quiet was issued.
    -f, --file       Read domains from the specified text file.
    -j, --json       Save data to the specified JSON file
    -h, --help       Show this output
    -v, --version    Show command version


Why?
----------
I needed to analyze more than one site at a time to build reports, and
this appeared to be the fastest method forward.

Currently `whodis` is only able to export to a JSON file, though I will
be re-adding a CSV export at some point.


Running
----------
If you would like to directly run `whodis` from a local copy of the
source, you may interact with it as follows:

    $ node src/whodis.js <URL>
