import { spawn } from 'child_process';

import { readFileSync } from 'fs';
const logo = readFileSync('./.docker/logo.txt', 'utf8');

const runCommand = (cmd: string, args: string[]) => {
    return new Promise<void>((resolve, reject) => {
        const child = spawn(cmd, args, { stdio: 'inherit', shell: true });
        child.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`${cmd} exited with code ${code}`));
            } else {
                resolve();
            }
        });
    });
};

/**
 * Builds the project in the specified mode.
 *
 * @param mode - The mode in which to build the project. Can be 'development' or 'production'.
 */
export const buildProd = async (mode: string) => {
    console.log('\n🚀 Starting front end build process...');

    console.log('\n' + logo);

    console.log(`\n🛠️  Building the project in ${mode} mode`);

    console.log('\n🔍 Running type-check...');
    await runCommand('npm', ['run', 'type-check']);

    console.log(`\n🧱 Building the project with mode ${mode}...`);
    await runCommand('npm', ['run', 'build:only', '--', '--mode', mode]);

    console.log('\n🗺️ Generating sitemap...');
    await runCommand('npm', [
        'run',
        'generate-sitemap:' + (mode === 'production' ? 'prod' : 'test'),
    ]);
};

const mode: string = process.argv[2] || 'development';

buildProd(mode).catch((err) => {
    console.error(err);
    process.exit(1);
});
