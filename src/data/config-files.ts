export interface MonoBuildConfig
{
    projectDir: string;
    outDir: string;
    libraries: string[];
    type: "library" | "exe" | "module" | "winexe";
};