
type EventPreparedLabel = (labelPulled: string) => string;
type EventPreparedValue = (valuePulled: string) => string;

interface IGenericDefinitionEvents {
    prepared?: {
        label?: EventPreparedLabel; // Return a modified label from what the system is configured to.
        value?: EventPreparedValue; // Return a modified value from what the system is configured to.
    },
}

interface ISaveConfig {
    svg?: string,
    png: string
}

interface IDefinitionBlankArgs {} // Used for type hinting.
interface IDefinitionBlankConfig {} // Used for type hinting.

interface IDefinition {
    getLabel(args: IDefinitionBlankArgs): string;
    getValue(args: IDefinitionBlankArgs): string;
    getType(): string; // @todo setup types for hardcoded (and string for custom items).
    run(args: IDefinitionBlankArgs, save: ISaveConfig): Promise<void>;
}

type DefinitionConstructorType = {
    new(
        badgen: IBadgenOptions,
        events?: IGenericDefinitionEvents,
        config?: IDefinitionBlankConfig): IDefinition
};
