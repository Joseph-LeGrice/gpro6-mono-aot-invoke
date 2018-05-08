import * as argparse from 'argparse'
import * as path from 'path'
import * as fs from 'fs-extra'
import { BuildMonoProject } from './build-mono';
import { MonoBuildConfig } from './data/config-files';

const parser = new argparse.ArgumentParser();
parser.addArgument(["CONFIG_FILE"], { help: "Location of config file"});

const args = parser.parseArgs();

main();

async function main() {
    const jsonText = fs.readFileSync(args.CONFIG_FILE, { encoding: 'utf8' });
    const configuration = <Array<MonoBuildConfig>>JSON.parse(jsonText);

    const configFilePath = path.dirname(args.CONFIG_FILE);
    for (const monoProject of configuration) {
        await BuildMonoProject(monoProject, configFilePath);
    }
}
