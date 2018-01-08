import * as program from 'commander';
import { applyConfigurationFile } from './apply-configuration-file';
import { buildSandboxes } from './build-sandboxes';
import { Config } from './apply-configuration-file';
import { startWatch } from './start-watch';
import { runAngularCli } from './run-angular-cli';

export async function run() {
    program
        .name('angular-playground')
        .version('3.2.0')
        .option('-C, --config <path>', 'Configuration file', './angular-playground.json')
        .option('-S, --src <path>', 'Specify component source directory', './src/')

        // Build options
        .option('--no-watch', 'Disable sandboxes watch', false)
        .option('--no-serve', 'Disable cli serve', false)
        .option('--no-chunk', 'Don\'t chunk sandbox files individually', false)

        // @angular/cli options
        .option('--ng-cli-app <appName>', '@angular/cli appName')
        .option('--ng-cli-env <path>', 'Path to @angular/cli environment')
        .option('--ng-cli-port <n>', '@angular/cli serve port', 4201)
        .option('--ng-cli-cmd <path>', 'Path to @angular/cli executable', 'node_modules/@angular/cli/bin/ng')
        .option('--ng-cli-args <list>', 'Additional @angular/cli arguments');

    program.parse(process.argv);
    const config: Config = applyConfigurationFile(program);
    await buildSandboxes(config.sourceRoot, config.noChunk);

    if (!config.noWatch) {
        startWatch(config.sourceRoot, () => buildSandboxes(config.sourceRoot, config.noChunk));
    }

    if (!config.noServe) {
        runAngularCli(config);
    }
}
