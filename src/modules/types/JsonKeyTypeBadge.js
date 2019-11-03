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
        let afterCallback = (nextConfig.hasOwnProperty("after") && typeof nextConfig.after === "function")
            ?nextConfig.after
            :(v => v);

        return super.buildConfig(badgenConfig, _.merge(
            nextConfig,
            {
                text: afterCallback(JsonKeyTypeBadge.GetKey(json, nextConfig.key))
            }
        ));
    }
}

module.exports = JsonKeyTypeBadge;
