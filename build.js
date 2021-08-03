const path = require('path');
const builder = require('electron-builder');

builder.build({
    projectDir: path.resolve(__dirname),
    win: ['portable', 'nsis'],
    config: {
        'appId': 'io.github.weirenxue.apdisplayer',
        'productName': 'AP Displayer',
        'copyright': 'Copyright © 2020 Wei-Ren Xue',
        'directories': {
            'output': 'electron-build/win'
        },
        'win': {
            'icon': path.resolve(__dirname, 'icon.png'),
        },
        'files': [
            'build/**/*',
            'node_modules/**/*',
            'package.json',
            'main.js',
            'preload.js',
            'icon.png',
            'icon_s.png',
        ],
        'extends': null,
    }
}).then(
    (data) => console.log(data),
    (err) => console.error(err)
)