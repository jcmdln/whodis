# whodis
Find what software a site uses

```
$ node src/main.js
Usage: whodis [OPTION] URLs...
Find what software stack a website is using via Wappalyzer

    -h, --help         Show this output
    -v, --version      Show command version

$ node src/main.js techcrunch.com
{ urls: [ 'https://techcrunch.com/' ],
  applications:
   [ { name: 'Lo-dash',
       confidence: '100',
       version: '4.17.10',
       icon: 'Lo-dash.png',
       website: 'http://www.lodash.com',
       categories: [Array] },
     { name: 'New Relic',
       confidence: '100',
       version: '',
       icon: 'New Relic.png',
       website: 'https://newrelic.com',
       categories: [Array] },
     { name: 'Nginx',
       confidence: '100',
       version: '',
       icon: 'Nginx.svg',
       website: 'http://nginx.org/en',
       categories: [Array] },
     { name: 'SiteCatalyst',
       confidence: '100',
       version: '',
       icon: 'SiteCatalyst.png',
       website: 'http://www.adobe.com/solutions/digital-marketing.html',
       categories: [Array] },
     { name: 'Typekit',
       confidence: '100',
       version: '1.19.2',
       icon: 'Typekit.png',
       website: 'http://typekit.com',
       categories: [Array] },
     { name: 'Underscore.js',
       confidence: '100',
       version: '4.17.10',
       icon: 'Underscore.js.png',
       website: 'http://underscorejs.org',
       categories: [Array] },
     { name: 'WordPress',
       confidence: '100',
       version: ' 4.9.5',
       icon: 'WordPress.svg',
       website: 'http://wordpress.org',
       categories: [Array] },
     { name: 'PHP',
       confidence: '0',
       version: '',
       icon: 'PHP.svg',
       website: 'http://php.net',
       categories: [Array] } ],
  meta: { language: 'en-US' } }
```
