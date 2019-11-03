"use strict";

class RawTypeBadge {
    is(type){
        return type === "raw";
    }
    buildConfig(badgenConfig, nextConfig, rootFolder){
        let afterCallback = (nextConfig.hasOwnProperty("after") && typeof nextConfig.after === "function")
            ?nextConfig.after
            :(v => v);

        return {
            label: nextConfig.label,
            status: afterCallback(nextConfig.text)
        };
    }
}

module.exports = RawTypeBadge;
