var JavaScriptObfuscator = require('javascript-obfuscator');
var fs = require('file-system');



const before = "./Before";
const after = "./After"



fs.recurseSync(before, function (filepath, relative, filename) {

    fs.readFile(before + "/" + relative, 'utf8', async (err, data) => {

            if (err) return console.log(err)

            var obfuscationResult = JavaScriptObfuscator.obfuscate(data, {
                //compact: false,
                //ignoreRequireImports: true,
                //simplify: false,
                //!stringArray: false,
                //optionsPreset: "medium-obfuscation"

                compact: true,
                controlFlowFlattening: false,
                deadCodeInjection: false,
                debugProtection: false,
                debugProtectionInterval: 0,
                disableConsoleOutput: false,
                identifierNamesGenerator: 'hexadecimal',
                log: false,
                numbersToExpressions: false,
                renameGlobals: false,
                selfDefending: false,
                simplify: true,
                splitStrings: false,
                stringArray: false,
                stringArrayCallsTransform: false,
                stringArrayCallsTransformThreshold: 0.5,
                stringArrayEncoding: [],
                stringArrayIndexShift: true,
                stringArrayRotate: true,
                stringArrayShuffle: true,
                stringArrayWrappersCount: 1,
                stringArrayWrappersChainedCalls: true,
                stringArrayWrappersParametersMaxCount: 2,
                stringArrayWrappersType: 'variable',
                stringArrayThreshold: 0.75,
                unicodeEscapeSequence: false

            }
            )

        //console.log(obfuscationResult)

        fs.writeFile(after + "/" + relative, obfuscationResult.toString(), function (err) {

            console.log("finished: " + relative)

            if (err) return console.log(err)

        })


    })





});