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
        console.log(`[InvokeMSBuild] Project File: ${config.projectFile}`);

        const args: string[] = [];
        args.push('/property:GenerateFullPaths=true');
        args.push('/t:Build');
        args.push('cs-api/GPro.csproj');

        await execa(this.msbuild, args);
        console.log(`[InvokeMSBuild] ${config.projectFile} built.`);    
    }
}

export default MSBuildInvoker;