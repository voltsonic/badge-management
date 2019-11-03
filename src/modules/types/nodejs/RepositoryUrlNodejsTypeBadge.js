"use strict";

const _ = require("lodash");
const url = require("url");
const JsonKeyTypeBadge = require("../JsonKeyTypeBadge");

class RepositoryUrlNodejsTypeBadge extends JsonKeyTypeBadge {
    is(type){
        return type === "package_repository_url";
    }
    buildConfig(badgenConfig, nextConfig, rootFolder){
        let repoUri = 'unknown://__missing__';
        let label = nextConfig.hasOwnProperty("label")
            ?nextConfig.label
            :"repo";
        return _.merge(super.buildConfig(
            badgenConfig,
            {
                file: "package.json",
                key: ["repository", "url"],
                after: (v) => {
                    if(v.split('://')[0].indexOf("+") > -1)
                        v = v.replace(/^[^+]+\+/i, '');
                    repoUri = v;
                    console.log("repoUri", repoUri);
                    return url.parse(repoUri).hostname;
                }
            },
            rootFolder
        ), {
            label,
            repoUri
        });
    }
}

module.exports = RepositoryUrlNodejsTypeBadge;
