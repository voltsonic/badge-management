'use strict';

import JsonKeyDefinition, {IJsonKeyArgs} from "./JsonKeyDefinition";

export interface INodePackageVersionArgs extends IDefinitionBlankArgs {
    label?: 'version' | string; // Otherwise defaults to the key provided (last key if chain is provided).
    file: string;
    key?: 'version' | string | string[];
}
export interface INodePackageVersionDefinitionConfig extends IDefinitionBlankConfig {} // Placeholder class for extended items.

export default class NodePackageVersionDefinition extends JsonKeyDefinition implements IDefinition {
    static TYPE = 'node_package_version';
    protected readonly config: INodePackageVersionDefinitionConfig;

    constructor(badgen: IBadgenOptions, events?: IGenericDefinitionEvents, config?: INodePackageVersionDefinitionConfig) {
        super(badgen, events, config);
    }

    protected args2args = (args: INodePackageVersionArgs): IJsonKeyArgs => ({label: args.label ?? 'version', file: args.file, key: args.key ?? 'version'});

    getLabel(args: INodePackageVersionArgs): string {
        return super.getLabel(this.args2args(args));
    }

    getValue(args: INodePackageVersionArgs): string {
        return super.getValue(this.args2args(args));
    }

    run = async (args: INodePackageVersionArgs, save: ISaveConfig): Promise<void> => this.runGeneric(this.getLabel(args), this.getValue(args), save);
}
