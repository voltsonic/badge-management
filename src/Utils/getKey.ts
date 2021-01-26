'use strict';

const getKey = (object: any, keys: string | string[]): string => {
    if(typeof keys === "string")
        keys = [keys];
    let nextKey = keys.shift();
    if(!object.hasOwnProperty(nextKey)){
        throw new Error(`key_not_found: ${nextKey}`);
    }
    if(keys.length === 0)
        return object[nextKey];
    return getKey(object[nextKey], keys);
};

export default getKey;
