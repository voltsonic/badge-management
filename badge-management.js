"use strict";

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const findUp = require("find-up");
const BadgeManager = require("./src/badge-manager");
const detectNewline = require('detect-newline');

let BadgeTypes = [
    new (require("./src/modules/types/RawTypeBadge"))(),
    new (require("./src/modules/types/JsonKeyTypeBadge"))(),
    new (require("./src/modules/types/nodejs/PackageVersionNodejsTypeBadge"))(),
    new (require("./src/modules/types/nodejs/RepositoryUrlNodejsTypeBadge"))()
];

const defaultHeaderPound = 3;

class BadgeManagement {
    constructor(headerPounds = defaultHeaderPound){
        this.headerPounds = headerPounds;
    }

    async initPackage(){
        this.packageJson = await findUp("package.json");
        this.rootFolder = path.dirname(this.packageJson);
        if(!this.packageJson || this.packageJson.length === 0)
            throw new Error("package.json not found walking up directories.");

        this.packageJsonContents = JSON.parse(fs.readFileSync(this.packageJson, "utf8"));
        if(typeof this.packageJsonContents !== "object")
            throw new Error("package.json not an object after parsing.");
        if(!this.packageJsonContents.hasOwnProperty("badges"))
            throw new Error("package.json missing badges configuration.");

        this.badges = this.packageJsonContents.badges;

        if(!this.badges.hasOwnProperty("definitions"))
            throw new Error("package.json key 'badges' is missing definitions configuration.");
        if(Object.keys(this.badges.definitions).length === 0)
            throw new Error("package.json key 'badges' has no definitions configuration.");

        this.badgeInjectors = this.badges.hasOwnProperty("injectors")?this.badges.injectors:false;
        this.badgeDefinitionsRaw = this.badges.definitions;
        this.badgeDefinitions = [];
        Object.keys(this.badgeDefinitionsRaw).forEach(id => {
            if(this.badgeDefinitionsRaw.hasOwnProperty(id)){
                this.badgeDefinitionsRaw[id] = _.merge({id}, this.badgeDefinitionsRaw[id]);
                this.badgeDefinitions.push(this.badgeDefinitionsRaw[id]);
            }
        });

        this.globalConfig = _.merge({
            store: "badges/",
            badgen: {
                labelColor: "555",
                color: "blue",
                style: "flat",
                scale: "1"
            }
        }, this.badges.global || {});

        this.storeBadges = path.join(this.rootFolder, this.globalConfig.store);

        if(!fs.existsSync(this.storeBadges))
            fs.mkdirSync(this.storeBadges, {recursive: true});

        this.builtBadges = {};

        return true;
    }

    async createBadge(next){
        let meRoot = this;
        return new Promise((resolve) => {
            let type = next.hasOwnProperty('type')
                ?next.type
                :'raw';
            let id = next.id;
            let badgenConfig = _.merge(meRoot.globalConfig.badgen, next.badgen || {});
            let saveSvg = path.join(meRoot.storeBadges, id+'.svg');
            let savePngRel = id+".png";
            let savePng = path.join(meRoot.storeBadges, savePngRel);

            let badge = BadgeManager.c(saveSvg, savePng, badgenConfig);
            let found = false;
            let builtConfig = false;

            for(let badgeType of BadgeTypes){
                if(badgeType.is(type)){
                    badge.addConfig((builtConfig = badgeType.buildConfig(badgenConfig, next, meRoot.rootFolder)));
                    found = true;
                }
            }

            let started = (new Date()).getTime();

            if(!found){
                console.log("|| Unknown badge type: "+type+' (continuing on)');
            }else
                badge.writeOut()
                    .then(() => {
                        let passed = ((new Date()).getTime() - started) / 1000;
                        console.log("[x] Badge Written: "+type+' / '+id+' ('+(passed.toFixed(3))+' s)');
                        if(meRoot.builtBadges.length > 0) meRoot.builtBadges.push(" ");
                        let url = builtConfig.hasOwnProperty("url")
                            ?builtConfig.url
                            :false;

                        meRoot.builtBadges[id] = _.merge(builtConfig, {
                            badgeRendered: `![${id} badge](${meRoot.globalConfig.store+savePngRel})`
                        });

                        resolve();
                    })
                    .catch(err => {
                        console.log('| Error Saving Badge', err);
                        console.log('| ', next);
                        console.log('| --------------------');
                        resolve();
                    });
        });
    }

    buildBadgesMarkdown(BadgesTemplate, EOL = require("os").EOL){
        let meRoot = this;
        let builds = {};
        for(let badgeTemplate of BadgesTemplate){
            let badgeHeader = badgeTemplate.label || "";
            let badgeTag = badgeTemplate.tag || "generic";
            if(!builds.hasOwnProperty(badgeTag))
                builds[badgeTag] = {
                    header: (badgeHeader.length > 0
                        ?`${'#'.repeat(this.headerPounds)} ${badgeHeader+EOL+EOL}`
                        :''),
                    badges: []
                };
            for(let badgeAppend of badgeTemplate.definitions.map(badgeKey => {
                let badgeAbout = meRoot.builtBadges[badgeKey];
                let render = badgeAbout.badgeRendered;
                if(badgeAbout.hasOwnProperty("url"))
                    render = `[${render}](${badgeAbout.url})`;
                return render;
            }))
                builds[badgeTag].badges.push(badgeAppend);
        }
        for(let buildKey in builds)
            if(builds.hasOwnProperty(buildKey))
                builds[buildKey] = builds[buildKey].header+builds[buildKey].badges.join(' ');
        return builds;
    }

    __updateFileMarkdowns_Between(fileContents, tagA, tagB, indexFrom = 0, EOL = require("os").EOL){
        let indexA = fileContents.indexOf(tagA, indexFrom);
        if(indexA < 0)
            throw new Error("Failed tagA: "+tagA);
        let index = indexA;
        indexA += tagA.length;
        let indexB = fileContents.indexOf(tagB, indexA);
        if(indexB < 0)
            throw new Error("Failed tagB: "+tagB);

        let contentsLength = indexB - indexA;

        return {
            contents: [ tagA, fileContents.substr(indexA, contentsLength), tagB ].join(""),
            index
        };
    }

    __updateFileMarkdowns_GetTag(tagStart){
        let tS = tagStart.match(/[^<]+<[^>]+-([^->]+)>/);
        if(tS)
            return tS[1];
        return "generic";
    }

    async updateFileMarkdowns(markdownRendered, fileContents, EOL = require("os").EOL,
                              tagStart    = 'comment_badge_management_start',
                              tagEnd      = 'comment_badge_management_end'){
        return new Promise(resolve => {
            let tagStartsRegex = new RegExp("\\["+tagStart+"]: \\<([^>]+)>", "gi");
            let tagStarts = fileContents.match(tagStartsRegex);
            let tagEndsRegex = new RegExp("\\["+tagEnd+"]: \\<([^>]+)>", "gi");
            let tagEnds = fileContents.match(tagEndsRegex);

            let lastIndex = 0;
            for(let i in tagStarts){
                if(tagStarts.hasOwnProperty(i) && tagEnds.hasOwnProperty(i)){
                    let tagModifier = this.__updateFileMarkdowns_GetTag(tagStarts[i]);
                    let markdownRenderedTag = tagStarts[i]+EOL+markdownRendered[tagModifier]+EOL+EOL+tagEnds[i];
                    let tagReplace = this.__updateFileMarkdowns_Between(fileContents, tagStarts[i], tagEnds[i], lastIndex, EOL);
                    fileContents = fileContents.replace(tagReplace.contents, markdownRenderedTag);
                    lastIndex = tagReplace.index + markdownRenderedTag.length;
                }
            }
            resolve(fileContents);
        });
    }

    async init(){
        let meRoot = this;
        if(await this.initPackage()){
            let started = (new Date()).getTime();
            for(let next of this.badgeDefinitions)
                await this.createBadge(next);
            let passed = ((new Date()).getTime() - started) / 1000;
            console.log("[x] Badges Rendered ("+(passed.toFixed(3))+' s)');
            if(typeof this.badgeInjectors === "object"){
                for(let fileRoot of Object.keys(this.badgeInjectors)){
                    started = (new Date()).getTime();
                    let fileSrc = path.join(meRoot.rootFolder, fileRoot);
                    let fileContents = fs.readFileSync(fileSrc, "utf8");
                    let EOL = detectNewline(fileContents);
                    let newFileContents = await meRoot.updateFileMarkdowns(
                        meRoot.buildBadgesMarkdown(this.badgeInjectors[fileRoot], EOL),
                        fileContents,
                        EOL
                    );
                    fs.writeFileSync(fileSrc, newFileContents);
                    passed = ((new Date()).getTime() - started) / 1000;
                    console.log("[x] Badges Injected in "+fileRoot+" ("+(passed.toFixed(3))+' s)');
                }
            }
        }
    }
    static run(headerPounds = defaultHeaderPound){
        return (new BadgeManagement(headerPounds)).init();
    }
}

module.exports = BadgeManagement;
