# whisper.js
Call whisper from the command line using node and return the output files.

## Installation
Must have whisper installed and added to your command line path.
See: https://github.com/openai/whisper.git
```
yarn add @ideadesignmedia/whisper.js
```

## Usage
```
const whisper = require('@ideadesignmedia/whisper.js');

const audioFiles = [
  'path/to/audio/file.mp3',
  'path/to/audio/file2.mp3',
  'path/to/audio/file3.mp3',
];

whisper(audioFiles).then((outputFiles) => {
  console.log(outputFiles);
}).catch(e => {
    console.log('Failed to whisper', e);
})
```