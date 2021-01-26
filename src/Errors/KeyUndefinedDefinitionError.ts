export default class KeyUndefinedDefinitionError extends Error {
    constructor(key: string, className: string) {
        super(`Missing key "${key}" for (new ${className}).run()`);
        this.name = 'KeyUndefinedDefinitionError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
