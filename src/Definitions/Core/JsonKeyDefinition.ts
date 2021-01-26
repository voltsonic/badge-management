'use strict';

import fs from 'fs';
import AbstractDefinition from "../AbstractDefinition";
import getKey from "../../Utils/getKey";
import NoSuchFileDefinitionError from "../../Errors/NoSuchFileDefinitionError";

export interface IJsonKeyArgs extends IDefinitionBlankArgs {
    label?: string; // Otherwise defaults to the key provided (last key if chain is provided).
    file: string;
    key: string | string[];
}
export interface IJsonKeyDefinitionConfig extends IDefinitionBlankConfig {} // Placeholder class for extended items.

export default class JsonKeyDefinition extends AbstractDefinition implements IDefinition {
    static TYPE = 'json_key';
    protected readonly config: IJsonKeyDefinitionConfig;
    protected checkedFiles: string[] = [];

    constructor(badgen: IBadgenOptions, events?: IGenericDefinitionEvents, config?: IJsonKeyDefinitionConfig) {
        super(badgen, events, config);
    }

    protected checkArgs(args: IJsonKeyArgs, checkKeys: string[] = ['file', 'key']): void {
        super.checkArgs(args, checkKeys);
        if(this.checkedFiles.indexOf(args.file) === -1){
            if(!fs.existsSync(args.file))
                throw new NoSuchFileDefinitionError(args.file);
            this.checkedFiles.push(args.file);
        }
    }

    protected getLabelPrivate(args: IJsonKeyArgs): string {
        this.checkArgs(args);
        return args.label ?? (() => {
            if(typeof args.key === 'string')
                return args.key;
            return args.key[args.key.length - 1];
        })();
    }

    getLabel(args: IJsonKeyArgs): string {
        this.checkArgs(args);
        const label = this.getLabelPrivate(args);
        return this.events?.prepared?.label
            ? this.events.prepared.label(label)
            : label;
    }

    getValue(args: IJsonKeyArgs): string {
        this.checkArgs(args);
        const jsonRaw = fs.readFileSync(args.file, 'utf8');
        const json: any = JSON.parse(jsonRaw);
        const value = getKey(json, args.key);
        return this.events?.prepared?.value
            ? this.events.prepared.value(value)
            : value;
    }

    run = async (args: IJsonKeyArgs, save: ISaveConfig): Promise<void> => {
        this.checkArgs(args);
        await this.runGeneric(this.getLabel(args), this.getValue(args), save);
    };
}
