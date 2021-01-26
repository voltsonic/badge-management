'use strict';

export default class DefinitionManager {
    protected definitions: IDefinition[] = [];
    private readonly globalBadgen: IBadgenOptions;

    constructor(globalBadgen?: IBadgenOptions) {
        this.globalBadgen = globalBadgen ?? {
            status: '_no_status_'
        };
    }

    public definitionAdd(classConstructor: DefinitionConstructorType, events?: IGenericDefinitionEvents, config?: IDefinitionBlankConfig){
        const n = new classConstructor(this.globalBadgen, events, config);
        for(let d of this.definitions)
            if(d.getType() === n.getType())
                throw new Error("Type already exists"); // @todo needs custom error.
        this.definitions.push(n);
    }

    public async run(
        type: string,
        args: IDefinitionBlankArgs,
        save: ISaveConfig
    ): Promise<boolean> {
        for(let d of this.definitions)
            if(d.getType() === type){
                await d.run(args, save);
                return true;
            }
        return false;
    }
}
