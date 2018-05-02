

/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const browsers = {
    chrome_latest_win_10: {
        base: "SauceLabs",
        browserName: "chrome",
        version: "latest",
        platform: "Windows 10"
    },
    // firefox_latest_win_10: {
    //     base: "SauceLabs",
    //     browserName: "firefox",
    //     version: "latest",
    //     platform: "Windows 10"
    // },
    // safari_latest_osx_11: {
    //     base: "SauceLabs",
    //     browserName: "safari",
    //     version: "latest",
    //     platform: "macOS 10.13"
    // },
    // ie_11_win_8_1: {
    //     base: "SauceLabs",
    //     browserName: "internet explorer",
    //     version: "latest",
    //     platform: "Windows 8.1"
    // },
    edge_latest_win_10: {
        base: "SauceLabs",
        browserName: "MicrosoftEdge",
        version: "latest",
        platform: "Windows 10"
    }
};

module.exports = function(karma) {
    "use strict";

    const config = {
        autoWatch: true,
        hostname: "karmalocal",
        basePath: "",
        frameworks: ["jasmine", "jasmine-matchers"],
        files: [
            //PrismJS
            {
                pattern: "./node_modules/prismjs/themes/prism.css",
                included: true,
                watched: false
            },
            {
                pattern: "./node_modules/prismjs/prism.js",
                included: true,
                watched: false
            },
            {
                pattern:
                    "./node_modules/prismjs/components/prism-typescript.min.js",
                included: true,
                watched: false
            },

            // Custom Elements
            {
                pattern:
                    "./node_modules/@webcomponents/custom-elements/custom-elements.min.js",
                included: true,
                watched: false
            },

            // Clarity
            {
                pattern: "./dist/clr-ui/clr-ui.min.css",
                included: true,
                watched: true
            },

            // Entry point to all our spec files
            { pattern: "./tests/tests.entry.ts", watched: false }
        ],
        exclude: ["node_modules/**/*spec.js"],
        preprocessors: {
            "./tests/tests.entry.ts": ["webpack"]
        },
        mime: {
            "text/x-typescript": ["ts", "tsx"]
        },
        reporters: ["mocha", "coverage-istanbul", "html"],
        htmlReporter: {
            outputFile: "./reports/unit/index.html",
            useLegacyStyle: true,
            useCompactStyle: true
        },
        coverageIstanbulReporter: {
            dir: "./reports/coverage/",
            fixWebpackSourcePaths: true,
            reports: ["html", "lcovonly", "cobertura"]
        },
        browsers: [
            // ChromeHeadless is the default, but you can toggle this list in dev. Always reset back to just ChromeHeadless.
            "ChromeHeadless", 
            // "FirefoxHeadless",
            // "Safari",
            // "Edge",
            // "IE",
        ],
        browserNoActivityTimeout: 100000,
        port: 9018,
        runnerPort: 9101,
        colors: true,
        logLevel: karma.LOG_INFO,
        singleRun: process.env.TRAVIS ? true : false,
        concurrency: Infinity,
        webpackServer: { noInfo: true, quiet: true },
        webpackMiddleware: { noInfo: true, quiet: true },
        webpack: require("./webpack.test.config"),
        customLaunchers: {
            ChromeHeadless: {
                base: "Chrome",
                flags: [
                    "--headless",
                    "--disable-gpu",
                    "--remote-debugging-port=9222"
                ]
            }
        },
        mochaReporter: {
            ignoreSkipped: true
        }
    };

    // We'll use saucelabs for testing if and only if the access key is set in ENV, and CI flag is set.
    // We'll modify the config as necessary.
    if (process.env.SAUCE_ACCESS_KEY) {// && process.env.TRAVIS) {
        config.reporters.push("saucelabs");
        config.browsers = [
            "chrome_latest_win_10",
            // "firefox_latest_win_10",
            // "safari_latest_osx_11",
            // "ie_11_win_8_1",
            "edge_latest_win_10",
        ];
        config.captureTimeout = 120000;
        config.customLaunchers = browsers;
        config.sauceLabs = {
            testName: "Unit Tests",
            startConnect: true,
            // If you need to debug, here are some options
            // connectOptions: {
            //     verbose: true,
            //     logfile: './sauceconnect.log'
            // }
        };
    }

    karma.set(config);
};
