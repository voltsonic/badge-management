'use strict';

import fs from 'fs';
import GenericDefinition, {IGenericArgs} from "./Core/GenericDefinition";
import KeyUndefinedDefinitionError from "../Errors/KeyUndefinedDefinitionError";
const bg = require('badgen');
const sharp = require('sharp');
const tmp = require('tmp');

export default class AbstractDefinition {
    protected readonly badgen: IBadgenOptions;
    protected readonly config: IDefinitionBlankConfig;
    protected readonly events: undefined | IGenericDefinitionEvents;

    constructor(badgen: IBadgenOptions, events?: IGenericDefinitionEvents, config?: IDefinitionBlankConfig) {
        this.badgen = badgen;
        this.config = config;
        this.events = events;
    }

    protected checkArgs(args: IDefinitionBlankArgs, checkKeys: string[] = []): void {
        for(let key of checkKeys)
            // @ts-ignore.
            if(!args.hasOwnProperty(key) || args[key] === undefined)
                throw new KeyUndefinedDefinitionError(key, (this.constructor.name));
    }

    async runGeneric(subject: string, status: string, save: ISaveConfig): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const svg = save.svg ?? tmp.fileSync().name;
            const png = save.png;
            try {
                if(fs.existsSync(svg)) fs.unlinkSync(svg);
                fs.writeFileSync(
                    svg,
                    bg.badgen({
                        ...this.badgen,
                        subject,
                        status,
                    }),
                    'utf8');
                if(fs.existsSync(png)) fs.unlinkSync(png);
                sharp(svg)
                    .toFile(png)
                    .then(() => resolve())
                    .catch(reject);
            }catch(e){
                reject(e);
            }
        });
    }

    getType(): string {
        return ((<typeof GenericDefinition> this.constructor).TYPE); // does not need to be extended and updated to whatever class. It will use whatever extended class.
    }

    getLabel(args: any): string {
        return 'Missing getLabel()';
    }

    getValue(args: any): string {
        return 'Missing getValue()';
    }

    async run(args: IDefinitionBlankArgs, save: ISaveConfig): Promise<void> {
        return this.runGeneric(
            this.getLabel(args),
            this.getValue(args),
            save
        );
    }
}
