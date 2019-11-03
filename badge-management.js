"use strict";

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const findUp = require("find-up");
const BadgeManager = require("./src/badge-manager");

let BadgeTypes = [
    new (require("./src/modules/types/RawTypeBadge"))(),
    new (require("./src/modules/types/JsonKeyTypeBadge"))(),
    new (require("./src/modules/types/nodejs/PackageVersionNodejsTypeBadge"))(),
    new (require("./src/modules/types/nodejs/RepositoryUrlNodejsTypeBadge"))()
];

class BadgeManagement {
    async init(){
        const packageJson = await findUp("package.json");
        const rootFolder = path.dirname(packageJson);
        if(!packageJson || packageJson.length === 0)
            throw new Error("package.json not found walking up directories.");
        let packageJsonContents = JSON.parse(fs.readFileSync(packageJson, "utf8"));
        if(typeof packageJsonContents !== "object")
            throw new Error("package.json not an object after parsing.");
        if(!packageJsonContents.hasOwnProperty("badges"))
            throw new Error("package.json missing badges configuration.");

        let badges = packageJsonContents.badges;

        if(!badges.hasOwnProperty("definitions"))
            throw new Error("package.json key 'badges' is missing definitions configuration.");
        if(Object.keys(badges.definitions).length === 0)
            throw new Error("package.json key 'badges' has no definitions configuration.");

        let badgeDefinitionsRaw = badges.definitions;
        let badgeDefinitions = [];
        Object.keys(badgeDefinitionsRaw).forEach(id => {
            if(badgeDefinitionsRaw.hasOwnProperty(id)){
                badgeDefinitionsRaw[id] = _.merge({id}, badgeDefinitionsRaw[id]);
                badgeDefinitions.push(badgeDefinitionsRaw[id]);
            }
        });

        let globalConfig = _.merge({
            store: "badges/",
            colors: {
                label: "555",
                color: "blue",
                style: "flat",
                scale: "1"
            }
        }, badges.global || {});

        let storeBadges = path.join(rootFolder, globalConfig.store);


        if(!fs.existsSync(storeBadges))
            fs.mkdirSync(storeBadges, {recursive: true});

        let nextBadge = () => {
            if(badgeDefinitions.length === 0){
                console.log("Finished");
                return;
            }
            let next = badgeDefinitions.shift();
            let type = next.hasOwnProperty('type')
                ?next.type
                :'raw';
            let id = next.id;
            let badgenConfig = _.merge(globalConfig.badgen, next.badgen || {});
            let saveSvg = path.join(storeBadges, id+'.svg');
            let savePng = path.join(storeBadges, id+'.png');

            let badge = BadgeManager.c(saveSvg, savePng, badgenConfig);
            let found = false;

            for(let badgeType of BadgeTypes){
                if(badgeType.is(type)){
                    badge.addConfig(badgeType.buildConfig(badgenConfig, next, rootFolder));
                    found = true;
                }
            }

            if(!found){
                console.log("|| Unknown badge type: "+type);
                nextBadge();
            }else
                badge.writeOut()
                    .then(() => {
                        console.log("[x] Badge Written: "+type+' / '+id);
                        nextBadge();
                    })
                    .catch(err => {
                        console.log('| Error Saving Badge', err);
                        console.log('| ', next);
                        console.log('| --------------------');
                        nextBadge();
                    });
        };

        nextBadge();
/*
[comment_badge_management_start]: <hidden__do_not_remove>
[comment_badge_management_end]: <hidden__do_not_remove>
 */
    }
    static run(){
        return (new BadgeManagement()).init();
    }
}

module.exports = BadgeManagement;
