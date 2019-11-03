"use strict";

const fs = require('fs');
const path = require('path');
const _ = require("lodash");
const RawTypeBadge = require("./RawTypeBadge");

class JsonKeyTypeBadge extends RawTypeBadge {
    static GetKey(object, keys){
        if(typeof keys !== "object")
            keys = [keys];
        let nextKey = keys.shift();
        if(keys.length === 0)
            return object[nextKey];
        return this.GetKey(object[nextKey], keys);
    }

    is(type){
        return type === "json_key";
    }
    buildConfig(badgenConfig, nextConfig, rootFolder){
        let jsonFile = path.join(rootFolder, nextConfig.file);
        let json = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

        return super.buildConfig(badgenConfig, _.merge(
            nextConfig,
            {
                text: JsonKeyTypeBadge.GetKey(json, nextConfig.key)
            }
        ));
    }
}

module.exports = JsonKeyTypeBadge;
