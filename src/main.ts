import * as argparse from 'argparse'
import * as path from 'path'
import * as fs from 'fs-extra'
import MSBuildInvoker, { MSBuildConfig } from './invoke-msbuild';

const parser = new argparse.ArgumentParser();
parser.addArgument(["--msbuild_exe"], { required: true, help: "MSBuild to use"});
parser.addArgument(["--config"], { required: true, help: "Location of config file"});

const args = parser.parseArgs();

main();

async function main() {
    const jsonText = fs.readFileSync(args.config, { encoding: 'utf8' });
    const buildConfigs = <Array<MSBuildConfig>>JSON.parse(jsonText);

    const msbuilder = new MSBuildInvoker(args.msbuild_exe);
    for (const bc of buildConfigs) {
        await msbuilder.build(bc);
    }
}
