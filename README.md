# whodis
WhoDis uses the existing Wappalyzer nodejs package to detect site software from the command line.

```
[jcmdln@vps whodis]$ node whodis.js 
Usage: whodis [OPTION] URLs...
Discover software used by websites

    -h, --help        Show this output
    -v, --version     Show command version
    -c, --csv         Save data to CSV file
    -e, --elastic     Upload data to an Elasticsearch instance
    -j, --json        Save data to JSON file
    -r, --read        Read domains from txt file
[jcmdln@vps whodis]$ node whodis.js techcrunch.com
whodis: queued https://techcrunch.com
[
  {
    "url": "https://techcrunch.com/",
    "New Relic": "yes",
    "Nginx": "yes",
    "Typekit": "1.19.2",
    "WordPress": " 4.9.6",
    "PHP": "yes",
    "MySQL": "yes",
    "Twitter Emoji (Twemoji)": "yes",
    "Gravatar": "yes"
  }
]
```
