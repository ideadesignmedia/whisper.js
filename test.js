const whisper = require('./index.js')

whisper(['./test.m4a'], undefined).then(files => {
    console.log('output files', files)
}).catch(e => {
    console.log(e)
})