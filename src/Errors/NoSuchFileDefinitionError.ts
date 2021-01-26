export default class NoSuchFileDefinitionError extends Error {
    constructor(file: string) {
        super(`No such file: "${file}"`);
        this.name = 'NoSuchFileDefinitionError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
