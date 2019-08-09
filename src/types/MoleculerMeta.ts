import Module = NodeJS.Module;

export interface MoleculerMeta {
    nodeID: string;
    ns: string;
    mod: string;
}

export type Loggable = Module | MoleculerMeta;
