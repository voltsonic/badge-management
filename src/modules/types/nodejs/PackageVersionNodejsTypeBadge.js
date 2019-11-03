"use strict";

const JsonKeyTypeBadge = require("../JsonKeyTypeBadge");

class PackageVersionNodejsTypeBadge extends JsonKeyTypeBadge {
    is(type){
        return type === "package_version";
    }
    buildConfig(badgenConfig, nextConfig, rootFolder){
        return super.buildConfig(
            badgenConfig,
            {
                file: "package.json",
                key: "version",
                label: nextConfig.hasOwnProperty("label")
                    ?nextConfig.label
                    :"app"
            },
            rootFolder
        );
    }
}

module.exports = PackageVersionNodejsTypeBadge;
