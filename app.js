const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('file-system');

const Dir = "./Dir";
const Dist = ".\\Dist"

let ALLOWED_FILES = [".js"]
let EXCEPTION_FILES = ["preload.js"];

start()
async function start() {
    await fs.recurseSync(Dir, async function (filepath, relative, filename) {


        if (filename == undefined) {
            if (!fs.existsSync(`${Dist}\\${relative}`)) {
                await fs.mkdirSync(`${Dist}\\${relative}`);
            }
        } 
        
        else if (filename.includes(ALLOWED_FILES[0]) && await checkExceptions(filename)) await obfuscateFile(relative)

        else {

            await fs.copyFile(`${Dir}\\${relative}`, `${Dist}\\${relative}`, (err) => {
                if (err) return console.log(err)
                else console.log(`Copied file: ${filename}`)
            })

        }

    });

}


/**
 * Returns whether the given file should be obfuscated or not.
 *
 * @param {string} filename Name of the file to check.
 * @return {boolean} Whether  the given file is allowed.
 */
async function checkExceptions(filename){
    if(filename.includes('json')) return false;
    if(EXCEPTION_FILES.includes(filename)) return false;
    return true;
}


/**
 * Obfuscates the given file at path `path`.
 *
 * @param {string} path Relative path to the file to be obfuscated
 */
async function obfuscateFile(path) {

    await fs.readFile(Dir + "/" + path, 'utf8', async (err, data) => {
        if (err) return console.log(err)

        let obfuscationResult = JavaScriptObfuscator.obfuscate(data, obfuscationOptions)
        fs.writeFile(Dist + "/" + path, obfuscationResult.toString(), function (err) {
            if (err) return console.log(err)
            console.log("Obfuscated: " + path)
        })
    })

}


var obfuscationOptions = {
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
    //compact: false,
    //ignoreRequireImports: true,
    //simplify: false,
    //!stringArray: false,
    //optionsPreset: "medium-obfuscation"
}