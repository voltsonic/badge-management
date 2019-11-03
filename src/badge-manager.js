"use strict";

const fs = require('fs');
const _ = require('lodash');
const { badgen } = require('badgen');
const sharp = require('sharp');

class BadgeManager {
    static c(saveToSvg, saveToPng){
        return new BadgeManager(saveToSvg, saveToPng);
    }

    constructor(saveToSvg, saveToPng, overwriteGlobalBadgen = {}){
        this.saveLocationSvg = saveToSvg;
        this.saveLocationPng = saveToPng;
        this.addConfig(overwriteGlobalBadgen, true);
    }

    addConfig(configAppend, reset = false){
        if(reset) this.configs = {
            subject: 'unk',
            status: '_blank_',
            color: 'blue',
            style: 'flat'
        };

        this.configs = _.merge(this.configs, configAppend);
    }

    writeOut(){
        return new Promise((resolve, reject) => {
            fs.writeFileSync(
                this.saveLocationSvg,
                badgen(this.configs),
                'utf8');
            sharp(this.saveLocationSvg)
                .toFile(this.saveLocationPng)
                .then(() => {
                    resolve();
                })
                .catch(reject);
            return this;
        });
    }
}

module.exports = BadgeManager;
