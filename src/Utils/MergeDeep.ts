"use strict";

/**
 * Copied from https://stackoverflow.com/a/34749873
 * Refactored on 2020-08-01, 2021-01-12 by voltsonic.
 */
export default class MergeDeep {
    static isObject(item: any){
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    static combine(target: any, ...sources: any): any {
        if (!sources || !sources.length) return target;
        const source = sources.shift();

        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if(source.hasOwnProperty(key)){
                    if (this.isObject(source[key])) {
                        if (!target[key]) Object.assign(target, { [key]: {} });
                        target[key] = this.combine(target[key], source[key]);
                    } else {
                        Object.assign(target, { [key]: source[key] });
                    }
                }
            }
        }

        return this.combine(target, ...(sources ?? []));
    }
}
