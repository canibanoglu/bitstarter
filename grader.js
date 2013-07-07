#!/usr/bin/env node
/*jslint smarttabs:true */


var fs= require('fs');
var program = require("commander");
var cheerio = require("cheerio");
var rest = require("restler");
var HTMLFILE_DEFAULT = "index.html";
var CHEKSFILE_DEFAULT = "checks.json";
var url = "";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if (!fs.existsSync(instr)) {
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1);
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for (var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var urlStuff = function(checksfile) {
    var url2 = function(data) {
	$ = cheerio.load(data);
	var checks = loadChecks(checksfile).sort();
        var out = {};
        for (var ii in checks) {
	    var present = $(checks[ii]).length > 0;
	    out[checks[ii]] = present;
	};
	outJson = JSON.stringify(out, null, 4);
	console.log(outJson)
    };
    return url2;
}

var clone = function(fn) {
    return fn.bind({});
};

if (require.main == module) {
    program
	 .option("-c, --checks <check_file>", "Path to checks.json", clone(assertFileExists), CHEKSFILE_DEFAULT)
	 .option("-f, --file <html_file>", "Path to index.html", clone(assertFileExists), HTMLFILE_DEFAULT)
	 .option("-u, --url <URL>", "Address to the bitstarter page", url, "")
	  .parse(process.argv);
    if (program.url) {
	var url2 = urlStuff(program.checks);
	rest.get(program.url).on("complete", url2);
	
    }
else {
	var checkJson = checkHtmlFile(program.file, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
}
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
