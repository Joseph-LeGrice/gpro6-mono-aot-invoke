import * as path from 'path'
import * as fs from 'fs-extra'
import execa from 'execa'
import { MonoBuildConfig } from './data/config-files';

const SDK_ROOT: string = <string>process.env.MONO_SDK_ROOT;
const MONO_COMPILER = path.join(SDK_ROOT, 'bin/mcs')
const MONO_LIB_PATH = path.join(SDK_ROOT, 'lib');

const EXCLUDED_DIRECTORIES = [
    "obj",
    "bin"
];

async function getFilesRecursively(directory: string, results: string[]) : Promise<void>
{
    const files = await fs.readdir(directory)
    for (const f of files)
    {
        const fullPath = path.join(directory, f);
        const isDirectory: boolean = fs.statSync(fullPath).isDirectory();
        const isExcluded: boolean = EXCLUDED_DIRECTORIES.findIndex((v, i ,o) => { return  v === f; }) !== -1;
        if (isDirectory && !isExcluded)
        {
            await getFilesRecursively(fullPath, results);
        }
        else
        {
            const extension = fullPath.substring(fullPath.lastIndexOf('.'));
            if (extension === '.cs')
            {
                results.push(fullPath);
            }
        }
    }
}

export async function BuildMonoProject(monoProject: MonoBuildConfig, configFilePath: string)
{
    const projectPath = path.resolve(configFilePath, monoProject.projectDir);
    const outputPath = path.resolve(configFilePath, monoProject.outDir);
    
    await fs.ensureDir(path.dirname(outputPath));

    console.log(`[ScriptingAOT] Building Mono Project at Path: ${projectPath}`);
    console.log(`[ScriptingAOT] Output Path: ${outputPath}`);
    
    const args: string[] = [];
    args.push(`-target:${monoProject.type}`);
    args.push(`-out:${outputPath}`);

    const libPaths = new Array<string>();
    for (let i=0; i<monoProject.libraries.length; i++) {
        libPaths.push(path.resolve(configFilePath, monoProject.libraries[i]));
        if (i < monoProject.libraries.length - 1) {
            libPaths.push(',');
        }
    }
    if (libPaths.length > 0) {
        args.push(`-r:${libPaths.join('')}`);
    }
    
    const allFiles: Array<string> = new Array<string>();
    await getFilesRecursively(projectPath, allFiles);

    for (const monoScriptPath of allFiles)
    {
        console.log(monoScriptPath);
        args.push(monoScriptPath);
    }

    const exec = execa(MONO_COMPILER, args);
    exec.stdout.on('data', data => console.log(data.toString()));
    exec.stderr.on('data', data => console.log(data.toString()));
    await exec;
}
