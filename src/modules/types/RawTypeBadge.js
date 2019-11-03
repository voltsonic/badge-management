"use strict";

class RawTypeBadge {
    is(type){
        return type === "raw";
    }
    buildConfig(badgenConfig, nextConfig, rootFolder){
        return {
            label: nextConfig.hasOwnProperty("label")
                ?nextConfig.label
                :"label",
            status: nextConfig.text
        };
    }
}

module.exports = RawTypeBadge;
