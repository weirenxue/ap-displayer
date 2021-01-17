var grunt = require('grunt');

grunt.config.init({
    pkg: grunt.file.readJSON('./APDisplayer/package.json'),
    'create-windows-installer': {
        x64: {
            appDirectory: './APDisplayer/APDisplayer-win32-x64',
            outputDirectory: './APDisplayer/installer64',
            authors: 'WRXue',
            title: 'APDisplayer',
            exe: 'APDisplayer.exe',
            description: 'Account/Password Displayer',
            noMsi: true,
            loadingGif: 'wrx512.ico',
            setupIcon: 'wrx512.ico',
            icon: 'wrx512.ico',
        }
    }
})

grunt.loadNpmTasks('grunt-electron-installer');
grunt.registerTask('default', ['create-windows-installer']);