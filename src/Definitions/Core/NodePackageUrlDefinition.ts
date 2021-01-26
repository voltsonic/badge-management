'use strict';

import JsonKeyDefinition, {IJsonKeyArgs} from "./JsonKeyDefinition";

export interface INodePackageUrlArgs extends IDefinitionBlankArgs {
    label?: 'repo' | string; // Otherwise defaults to the key provided (last key if chain is provided).
    file: string;
    key?: ['repository', 'url'] | string | string[];
}
export interface INodePackageUrlDefinitionConfig extends IDefinitionBlankConfig {} // Placeholder class for extended items.

export default class NodePackageUrlDefinition extends JsonKeyDefinition implements IDefinition {
    static TYPE = 'node_package_url';
    protected readonly config: INodePackageUrlDefinitionConfig;

    constructor(badgen: IBadgenOptions, events?: IGenericDefinitionEvents, config?: INodePackageUrlDefinitionConfig) {
        super(badgen, events, config);
    }

    protected args2args = (args: INodePackageUrlArgs): IJsonKeyArgs => ({label: args.label ?? 'repo', file: args.file, key: args.key ?? ['repository', 'url']});

    getLabel(args: INodePackageUrlArgs): string {
        return super.getLabel(this.args2args(args));
    }

    getValue(args: INodePackageUrlArgs): string {
        let url = super.getValue(this.args2args(args));
        url = url.replace(/[^+]+\+http/i, 'http');
        return url;
    }

    run = async (args: INodePackageUrlArgs, save: ISaveConfig): Promise<void> => this.runGeneric(this.getLabel(args), this.getValue(args), save);
}
