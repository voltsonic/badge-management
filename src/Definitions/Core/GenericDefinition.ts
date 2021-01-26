'use strict';

import AbstractDefinition from "../AbstractDefinition";

export interface IGenericArgs extends IDefinitionBlankArgs {
    label: string;
    value: string;
}
export interface IGenericDefinitionConfig extends IDefinitionBlankConfig {} // Placeholder class for extended items.

export default class GenericDefinition extends AbstractDefinition implements IDefinition {
    static TYPE = 'generic';
    protected readonly config: IGenericDefinitionConfig;

    protected checkArgs(args: IGenericArgs, checkKeys: string[] = ['label', 'value']): void {
        super.checkArgs(args, checkKeys);
    }

    getLabel(args: IGenericArgs): string {
        this.checkArgs(args);
        return this.events?.prepared?.label
            ? this.events.prepared.label(args.label)
            : (args.label);
    }

    getValue(args: IGenericArgs): string {
        this.checkArgs(args);
        return this.events?.prepared?.value
            ? this.events.prepared.value(args.value)
            : (args.value);
    }

    async run(args: IGenericArgs, save: ISaveConfig): Promise<void> {
        this.checkArgs(args);
        return this.runGeneric(
            this.getLabel(args),
            this.getValue(args),
            save
        );
    }
}
