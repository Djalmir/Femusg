import { spawn } from 'child_process';

const child = spawn('npm', ['run', 'preview']);

child.on('exit', function (code, signal) {
    console.log(
        'child process exited with ' + `code ${code} and signal ${signal}`,
    );
});

child.stdout.on('data', (data) => {
    console.log(data.toString());
});

child.stderr.on('data', (data) => {
    console.error(data.toString());
});

