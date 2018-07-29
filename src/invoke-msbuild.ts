import execa from 'execa'

export interface MSBuildConfig
{
    projectFile: string;
};

class MSBuildInvoker
{
    constructor(private msbuild: string) {}

    public async build(config: MSBuildConfig): Promise<void>
    {
        console.log(`[InvokeMSBuild] [INFO] Project File: ${config.projectFile}`);

        const args: string[] = [];
        args.push('/property:GenerateFullPaths=true');
        args.push('/t:Build');
        args.push(config.projectFile);

        const task = execa(this.msbuild, args);
        task.stdout.on('data', data => console.log(`[InvokeMSBuild] [INFO] ${data.toString()}`));
        task.stderr.on('data', data => console.log(`[InvokeMSBuild] [ERROR] ${data.toString()}`));
        await task;

        console.log(`[InvokeMSBuild] [INFO] ${config.projectFile} complete.`);
    }
}

export default MSBuildInvoker;