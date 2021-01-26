'use strict';

import fs from 'fs';
import chai from 'chai';
import 'mocha';
import GenericDefinition from "../src/Definitions/Core/GenericDefinition";
import {ProjectPaths} from "./assets/ProjectPaths";
import path from "path";
import {CleanPaths} from "./assets/CleanPaths";
import JsonKeyDefinition from "../src/Definitions/Core/JsonKeyDefinition";
import NodePackageVersionDefinition from "../src/Definitions/Core/NodePackageVersionDefinition";
import NodePackageUrlDefinition from "../src/Definitions/Core/NodePackageUrlDefinition";
import KeyUndefinedDefinitionError from "../src/Errors/KeyUndefinedDefinitionError";

chai.use(require('chai-fs'));

const badgen: IBadgenOptions = {
    subject: 'unk', // will be overwritten.
    status: '_blank_', // will be overwritten.
    color: 'blue',
    style: 'flat'
};

describe('CoreDefinitions // Basics', () => {
    const file = path.resolve(__dirname, '..', '..', 'package.json');
    const easyErrorTest_KeyUndefined = async (
        def: IDefinition,
        baseArgs: IDefinitionBlankArgs,
        keyTest: string,
        tagFiles: string,
    ) => {
        const svg = path.resolve(ProjectPaths.dirs.badges, tagFiles+'.svg');
        const png = path.resolve(ProjectPaths.dirs.badges, tagFiles+'.png');
        CleanPaths([svg, png]);
        const defClass = def.constructor.name;
        // Test: Missing key: ${keyTest}.
        await (async () => {
            try {
                await def.run(baseArgs, {svg, png});
            } catch (e) {
                if (e instanceof Error) {
                    chai.assert.equal(e.name, 'KeyUndefinedDefinitionError', 'New error found?');
                    chai.assert.equal(e.message, `Missing key "${keyTest}" for (new ${defClass}).run()`, 'New error found?');
                } else
                    throw e;
                return;
            }
            chai.assert.fail(`[${tagFiles}.${keyTest}] Failed missing key test.`);
        })();

        // Test: Undefined key: ${keyTest}.
        await (async () => {
            try {
                await def.run({...baseArgs, ...{[keyTest]: undefined}}, {svg, png});
            } catch (e) {
                if (e instanceof Error) {
                    chai.assert.equal(e.name, 'KeyUndefinedDefinitionError', 'New error found?');
                    chai.assert.equal(e.message, `Missing key "${keyTest}" for (new ${defClass}).run()`, 'New error found?');
                } else
                    throw e;
                return;
            }
            chai.assert.fail(`[${tagFiles}.${keyTest}] Failed undefined key test.`);
        })();
    };

    it(`GenericDefinition            => Plain.`, async () => {
        const gd = new GenericDefinition(badgen);
        const svg = path.resolve(ProjectPaths.dirs.badges, 'cd_b-gd_p.svg');
        const png = path.resolve(ProjectPaths.dirs.badges, 'cd_b-gd_p.png');
        const svgRawCheck = `<svg width="70.6" height="20" viewBox="0 0 706 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="test: value">
  <title>test: value</title>
  <g>
    <rect fill="#555" width="309" height="200"/>
    <rect fill="#08C" x="309" width="397" height="200"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
    <text x="60" y="148" textLength="209" fill="#000" opacity="0.1">test</text>
    <text x="50" y="138" textLength="209">test</text>
    <text x="364" y="148" textLength="297" fill="#000" opacity="0.1">value</text>
    <text x="354" y="138" textLength="297">value</text>
  </g>
  
</svg>`;
        CleanPaths([svg, png]);
        await gd.run({label: 'test', value: 'value'}, {svg,png});
        chai.assert.pathExists(svg, `SVG not created?`);
        chai.assert.pathExists(png, `PNG not created?`);
        chai.assert.equal(fs.readFileSync(svg, 'utf8'), svgRawCheck, `SVG generation has changed. (${svg})`);
    });
    it(`                                Events.`, async () => {
        const gd = new GenericDefinition(badgen, {prepared: {
            label: labelPulled => (labelPulled+'2'),
            value: valuePulled => (valuePulled+'2')}}
        );
        const svg = path.resolve(ProjectPaths.dirs.badges, 'cd_b-gd_e.svg');
        const png = path.resolve(ProjectPaths.dirs.badges, 'cd_b-gd_e.png');
        const svgRawCheck = `<svg width="84.6" height="20" viewBox="0 0 846 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="test2: value2">
  <title>test2: value2</title>
  <g>
    <rect fill="#555" width="379" height="200"/>
    <rect fill="#08C" x="379" width="467" height="200"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
    <text x="60" y="148" textLength="279" fill="#000" opacity="0.1">test2</text>
    <text x="50" y="138" textLength="279">test2</text>
    <text x="434" y="148" textLength="367" fill="#000" opacity="0.1">value2</text>
    <text x="424" y="138" textLength="367">value2</text>
  </g>
  
</svg>`;
        CleanPaths([svg, png]);
        await gd.run({label: 'test', value: 'value'}, {svg,png});
        chai.assert.pathExists(svg, `SVG not created?`);
        chai.assert.pathExists(png, `PNG not created?`);
        chai.assert.equal(fs.readFileSync(svg, 'utf8'), svgRawCheck, `SVG generation has changed. (${svg})`);
    });
    it(`                                Errors Working.`, async () =>
        (await easyErrorTest_KeyUndefined((new GenericDefinition(badgen)), {label: 'asdf'}, 'value', 'cd_b-gd_ew')));
    it(`JsonKeyDefinition            => Plain.`, async () => {
        const gd = new JsonKeyDefinition(badgen);
        const svg = path.resolve(ProjectPaths.dirs.badges, 'cd_b-jkd_p.svg');
        const png = path.resolve(ProjectPaths.dirs.badges, 'cd_b-jkd_p.png');
        const svgRawCheck = `<svg width="153.4" height="20" viewBox="0 0 1534 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="test: badge-management">
  <title>test: badge-management</title>
  <g>
    <rect fill="#555" width="309" height="200"/>
    <rect fill="#08C" x="309" width="1225" height="200"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
    <text x="60" y="148" textLength="209" fill="#000" opacity="0.1">test</text>
    <text x="50" y="138" textLength="209">test</text>
    <text x="364" y="148" textLength="1125" fill="#000" opacity="0.1">badge-management</text>
    <text x="354" y="138" textLength="1125">badge-management</text>
  </g>
  
</svg>`;
        CleanPaths([svg, png]);
        await gd.run({label: 'test', key: 'name', file: path.resolve(ProjectPaths.root, 'package.json')}, {svg,png});
        chai.assert.pathExists(svg, `SVG not created?`);
        chai.assert.pathExists(png, `PNG not created?`);
        chai.assert.equal(fs.readFileSync(svg, 'utf8'), svgRawCheck, `SVG generation has changed. (${svg})`);
    });
    it(`                                Events.`, async () => {
        const gd = new JsonKeyDefinition(badgen, {
            prepared: {
                label: labelPulled => (labelPulled+'2'),
                value: valuePulled => (valuePulled+'2'),
            },
        });
        const svg = path.resolve(ProjectPaths.dirs.badges, 'cd_b-jkd_e.svg');
        const png = path.resolve(ProjectPaths.dirs.badges, 'cd_b-jkd_e.png');
        const svgRawCheck = `<svg width="167.4" height="20" viewBox="0 0 1674 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="test2: badge-management2">
  <title>test2: badge-management2</title>
  <g>
    <rect fill="#555" width="379" height="200"/>
    <rect fill="#08C" x="379" width="1295" height="200"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
    <text x="60" y="148" textLength="279" fill="#000" opacity="0.1">test2</text>
    <text x="50" y="138" textLength="279">test2</text>
    <text x="434" y="148" textLength="1195" fill="#000" opacity="0.1">badge-management2</text>
    <text x="424" y="138" textLength="1195">badge-management2</text>
  </g>
  
</svg>`;
        CleanPaths([svg, png]);
        await gd.run({label: 'test', key: 'name', file: path.resolve(ProjectPaths.root, 'package.json')}, {svg,png});
        chai.assert.pathExists(svg, `SVG not created?`);
        chai.assert.pathExists(png, `PNG not created?`);
        chai.assert.equal(fs.readFileSync(svg, 'utf8'), svgRawCheck, `SVG generation has changed. (${svg})`);
    });
    it(`                                Errors Working.`, async () => {
        const gd = new JsonKeyDefinition(badgen);
        await easyErrorTest_KeyUndefined(gd, {file}, 'key', 'cd_b-gd_ew-key');
        await easyErrorTest_KeyUndefined(gd, {key: 'asdf'}, 'file', 'cd_b-gd_ew-file');
    });
    it(`NodePackageVersionDefinition => Plain.`, async () => {
        const gd = new NodePackageVersionDefinition(badgen);
        const svg = path.resolve(ProjectPaths.dirs.badges, 'cd_b-npvd_p.svg');
        const png = path.resolve(ProjectPaths.dirs.badges, 'cd_b-npvd_p.png');
        const svgRawCheck = `<svg width="89.2" height="20" viewBox="0 0 892 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="version: 1.0.2">
  <title>version: 1.0.2</title>
  <g>
    <rect fill="#555" width="502" height="200"/>
    <rect fill="#08C" x="502" width="390" height="200"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
    <text x="60" y="148" textLength="402" fill="#000" opacity="0.1">version</text>
    <text x="50" y="138" textLength="402">version</text>
    <text x="557" y="148" textLength="290" fill="#000" opacity="0.1">1.0.2</text>
    <text x="547" y="138" textLength="290">1.0.2</text>
  </g>
  
</svg>`;
        CleanPaths([svg, png]);
        await gd.run({file: path.resolve(ProjectPaths.root, 'package.json')}, {svg,png});
        chai.assert.pathExists(svg, `SVG not created?`);
        chai.assert.pathExists(png, `PNG not created?`);
        chai.assert.equal(fs.readFileSync(svg, 'utf8'), svgRawCheck, `SVG generation has changed. (${svg})`);
    });
    it(`                                Events.`, async () => {
        const gd = new NodePackageVersionDefinition(badgen, {prepared: {
            label: labelPulled => (labelPulled+'2'),
            value: valuePulled => (valuePulled+'-r0')
        }});
        const svg = path.resolve(ProjectPaths.dirs.badges, 'cd_b-npvd_e.svg');
        const png = path.resolve(ProjectPaths.dirs.badges, 'cd_b-npvd_e.png');
        const svgRawCheck = `<svg width="112.9" height="20" viewBox="0 0 1129 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="version2: 1.0.2-r0">
  <title>version2: 1.0.2-r0</title>
  <g>
    <rect fill="#555" width="572" height="200"/>
    <rect fill="#08C" x="572" width="557" height="200"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
    <text x="60" y="148" textLength="472" fill="#000" opacity="0.1">version2</text>
    <text x="50" y="138" textLength="472">version2</text>
    <text x="627" y="148" textLength="457" fill="#000" opacity="0.1">1.0.2-r0</text>
    <text x="617" y="138" textLength="457">1.0.2-r0</text>
  </g>
  
</svg>`;
        CleanPaths([svg, png]);
        await gd.run({file: path.resolve(ProjectPaths.root, 'package.json')}, {svg,png});
        chai.assert.pathExists(svg, `SVG not created?`);
        chai.assert.pathExists(png, `PNG not created?`);
        chai.assert.equal(fs.readFileSync(svg, 'utf8'), svgRawCheck, `SVG generation has changed. (${svg})`);
    });
    it(`                                Errors Working.`, async () => {
        const gd = new NodePackageVersionDefinition(badgen);
        const svg = path.resolve(ProjectPaths.dirs.badges, 'cd_b-npvd_ew.svg');
        const png = path.resolve(ProjectPaths.dirs.badges, 'cd_b-npvd_ew.png');
        CleanPaths([svg, png]);

        // // Test: file undefined
        // await (async () => {
        //     try {
        //         await gd.run({file: undefined}, {svg, png});
        //     } catch (e) {
        //         if (e instanceof Error) {
        //             chai.assert.equal(e.name, 'TypeError', 'New error found?');
        //             chai.assert.equal(e.message, 'The "path" argument must be of type string or an instance of Buffer or URL. Received undefined', 'New error found?');
        //         } else
        //             throw e;
        //         return;
        //     }
        //     chai.assert.fail('No error was thrown?');
        // })();
        //
        // // Test: file empty
        // await (async () => {
        //     try {
        //         await gd.run({file: ''}, {svg, png});
        //     } catch (e) {
        //         if (e instanceof Error) {
        //             chai.assert.equal(e.name, 'Error', 'New error found?');
        //             chai.assert.equal(e.message, 'ENOENT: no such file or directory, open', 'New error found?');
        //         } else
        //             throw e;
        //         return;
        //     }
        //     chai.assert.fail('No error was thrown?');
        // })();
    });
    it(`NodePackageUrlDefinition     => Plain.`, async () => {
        const gd = new NodePackageUrlDefinition(badgen);
        const svg = path.resolve(ProjectPaths.dirs.badges, 'cd_b-npud_p.svg');
        const png = path.resolve(ProjectPaths.dirs.badges, 'cd_b-npud_p.png');
        const svgRawCheck = `<svg width="339.9" height="20" viewBox="0 0 3399 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="repo: https://github.com/voltsonic/badge-management.git">
  <title>repo: https://github.com/voltsonic/badge-management.git</title>
  <g>
    <rect fill="#555" width="349" height="200"/>
    <rect fill="#08C" x="349" width="3050" height="200"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
    <text x="60" y="148" textLength="249" fill="#000" opacity="0.1">repo</text>
    <text x="50" y="138" textLength="249">repo</text>
    <text x="404" y="148" textLength="2950" fill="#000" opacity="0.1">https://github.com/voltsonic/badge-management.git</text>
    <text x="394" y="138" textLength="2950">https://github.com/voltsonic/badge-management.git</text>
  </g>
  
</svg>`;
        CleanPaths([svg, png]);
        await gd.run({file: path.resolve(ProjectPaths.root, 'package.json')}, {svg,png});
        chai.assert.pathExists(svg, `SVG not created?`);
        chai.assert.pathExists(png, `PNG not created?`);
        chai.assert.equal(fs.readFileSync(svg, 'utf8'), svgRawCheck, `SVG generation has changed. (${svg})`);
    });
    it(`                                Events.`, async () => {
        const gd = new NodePackageUrlDefinition(badgen, {prepared: {
            label: labelPulled => (labelPulled+'2'),
            value: valuePulled => (valuePulled+'-r0')
        }});
        const svg = path.resolve(ProjectPaths.dirs.badges, 'cd_b-npud_e.svg');
        const png = path.resolve(ProjectPaths.dirs.badges, 'cd_b-npud_e.png');
        const svgRawCheck = `<svg width="363.6" height="20" viewBox="0 0 3636 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="repo2: https://github.com/voltsonic/badge-management.git-r0">
  <title>repo2: https://github.com/voltsonic/badge-management.git-r0</title>
  <g>
    <rect fill="#555" width="419" height="200"/>
    <rect fill="#08C" x="419" width="3217" height="200"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
    <text x="60" y="148" textLength="319" fill="#000" opacity="0.1">repo2</text>
    <text x="50" y="138" textLength="319">repo2</text>
    <text x="474" y="148" textLength="3117" fill="#000" opacity="0.1">https://github.com/voltsonic/badge-management.git-r0</text>
    <text x="464" y="138" textLength="3117">https://github.com/voltsonic/badge-management.git-r0</text>
  </g>
  
</svg>`;
        CleanPaths([svg, png]);
        await gd.run({file: path.resolve(ProjectPaths.root, 'package.json')}, {svg,png});
        chai.assert.pathExists(svg, `SVG not created?`);
        chai.assert.pathExists(png, `PNG not created?`);
        chai.assert.equal(fs.readFileSync(svg, 'utf8'), svgRawCheck, `SVG generation has changed. (${svg})`);
    });
    it(`                                Errors Working.`, async () =>
        (await easyErrorTest_KeyUndefined((new NodePackageUrlDefinition(badgen)), {}, 'file', 'cd_b-npud_ew-file')));
});
