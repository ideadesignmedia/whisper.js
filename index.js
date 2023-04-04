const { exec } = require('child_process');
const path = require('path')
const toSnakeLower = (str) => str.replace(/([A-Z])/g, (g) => `_${g[0].toLowerCase()}`).replace(/^_/, '')
const whisper = (files = [], output, options = {}) => new Promise((res, rej) => {
    files = files.map(file => path.isAbsolute(file) ? file : path.join(process.cwd(), file))
    const args = {}
    if (options.translate) args.task = 'translate'
    if (options.language) args.language = options.language
    if (options.model) args.model = options.model
    else args.model = 'tiny'
    if (options.outputFormat) args.outputFormat = options.outputFormat
    else args.outputFormat = 'json'
    if (output) args.outputDir = output
    else if (options.output) args.outputDir = options.output
    if (!options.verbose) args.verbose = 'False'
    if (options.temperature) args.temperature = options.temperature
    if (options.bestOf) args.bestOf = options.bestOf
    if (options.beamSize) args.beamSize = options.beamSize
    if (options.patience) args.patience = options.patience
    if (options.lengthPenalty) args.lengthPenalty = options.lengthPenalty
    if (options.suppressTokens) args.suppressTokens = options.suppressTokens
    if (options.initialPrompt) args.initialPrompt = options.initialPrompt
    if (options.conditionOnPreviousText) args.conditionOnPreviousText = options.conditionOnPreviousText
    if (options.temperatureIncrementOnFallback) args.temperatureIncrementOnFallback = options.temperatureIncrementOnFallback
    if (options.compressionRatioThreshold) args.compressionRatioThreshold = options.compressionRatioThreshold
    if (options.logprobThreshold) args.logprobThreshold = options.logprobThreshold
    if (options.noSpeechThreshold) args.noSpeechThreshold = options.noSpeechThreshold
    if (options.wordTimestamps) args.wordTimestamps = options.wordTimestamps
    if (options.prependPunctuations) args.prependPunctuations = options.prependPunctuations
    if (options.appendPunctuations) args.appendPunctuations = options.appendPunctuations
    if (options.threads) args.threads = options.threads
    if (options.device) args.device = options.device
    else {
        args.device = 'cpu'
        args.fp16 = 'False'
    }
    if (options.fp16) args.fp16 = options.fp16
    exec(`whisper ${files.join(' ')} ${Object.entries(args).map(([arg, value]) => `--${toSnakeLower(arg)} ${value}`).join(' ')}`, (err, stdout, stderr) => {
        if (err) {
            return rej(err)
        }
        let outputFiles = []
        let outputFolder = path.join(process.cwd(), args.outputDir || '')
        let outputType = args.outputFormat || 'json'
        if (outputType === 'all') {
            let types = ['json', 'txt', 'srt', 'vtt', 'tsv']
            for (let i = 0; i < files.length; i++) {
                for (let type of types) {
                    outputFiles.push(path.join(outputFolder, `${files[i].split('.')[0]}.${type}`))
                }
            }
        } else {
            for (let i = 0; i < files.length; i++) {
                outputFiles.push(path.join(outputFolder, `${files[i].split('.')[0]}.${outputType}`))
            }
        }
        return res(outputFiles)
    })
})
module.exports = whisper