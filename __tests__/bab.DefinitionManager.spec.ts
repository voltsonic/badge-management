'use strict';

import chai from 'chai';
import 'mocha';
import DefinitionManager from "../src/Definitions/DefinitionManager";
import GenericDefinition, {IGenericArgs, IGenericDefinitionConfig} from "../src/Definitions/Core/GenericDefinition";
import JsonKeyDefinition, {IJsonKeyArgs} from "../src/Definitions/Core/JsonKeyDefinition";
import NodePackageVersionDefinition, {INodePackageVersionArgs} from "../src/Definitions/Core/NodePackageVersionDefinition";
import NodePackageUrlDefinition, {INodePackageUrlArgs} from "../src/Definitions/Core/NodePackageUrlDefinition";
import {ProjectPaths} from "./assets/ProjectPaths";
import path from "path";
import fs from "fs";
import AbstractDefinition from "../src/Definitions/AbstractDefinition";
import {CleanPaths} from "./assets/CleanPaths";

chai.use(require('chai-fs'));

const badgen: IBadgenOptions = {
    subject: 'unk', // will be overwritten.
    status: '_blank_', // will be overwritten.
    color: 'blue',
    style: 'flat'
};

interface ICustomArgs extends IDefinitionBlankArgs {
    lbl: string;
    val: string;
}

class CustomDefinition extends AbstractDefinition implements IDefinition {
    static TYPE = 'custom';
    protected readonly config: IGenericDefinitionConfig;

    getLabel(args: ICustomArgs): string {
        return this.events?.prepared?.label
            ? this.events.prepared.label(args.lbl)
            : (args.val);
    }

    getValue(args: ICustomArgs): string {
        return this.events?.prepared?.value
            ? this.events.prepared.value(args.lbl)
            : (args.val);
    }

    async run(args: ICustomArgs, save: ISaveConfig): Promise<void> {
        return this.runGeneric(
            this.getLabel(args),
            this.getValue(args),
            save
        );
    }
}

describe('DefinitionManager // Basics', () => {
    it(`Full Setup // Plain`, async () => {
        const dm = new DefinitionManager(badgen);
        dm.definitionAdd(GenericDefinition);
        dm.definitionAdd(JsonKeyDefinition);
        dm.definitionAdd(NodePackageVersionDefinition);
        dm.definitionAdd(NodePackageUrlDefinition);

        // Test: GenericDefinition
        await (async () => {
            const svg = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_p-g.svg');
            const png = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_p-g.png');
            CleanPaths([svg, png]);
            const label = 'label';
            const value = 'value';
            const svgRawCheck = `<svg width="75.8" height="20" viewBox="0 0 758 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="label: value">
  <title>label: value</title>
  <g>
    <rect fill="#555" width="361" height="200"/>
    <rect fill="#08C" x="361" width="397" height="200"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
    <text x="60" y="148" textLength="261" fill="#000" opacity="0.1">label</text>
    <text x="50" y="138" textLength="261">label</text>
    <text x="416" y="148" textLength="297" fill="#000" opacity="0.1">value</text>
    <text x="406" y="138" textLength="297">value</text>
  </g>
  
</svg>`;
            await dm.run(GenericDefinition.TYPE, ({label, value} as IGenericArgs), {svg, png});
            chai.assert.pathExists(svg, `SVG not created?`);
            chai.assert.pathExists(png, `PNG not created?`);
            chai.assert.equal(fs.readFileSync(svg, 'utf8'), svgRawCheck, `SVG generation has changed. (${svg})`);
        })();

        // Test: JsonKeyDefinition
        await (async () => {
            const svg = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_p-jk.svg');
            const png = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_p-jk.png');
            CleanPaths([svg, png]);
            const label = 'package';
            const file = path.resolve(__dirname, '..', '..', 'package.json');
            const key = 'name';
            const svgRawCheck = `<svg width="178.3" height="20" viewBox="0 0 1783 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="package: badge-management">
  <title>package: badge-management</title>
  <g>
    <rect fill="#555" width="558" height="200"/>
    <rect fill="#08C" x="558" width="1225" height="200"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
    <text x="60" y="148" textLength="458" fill="#000" opacity="0.1">package</text>
    <text x="50" y="138" textLength="458">package</text>
    <text x="613" y="148" textLength="1125" fill="#000" opacity="0.1">badge-management</text>
    <text x="603" y="138" textLength="1125">badge-management</text>
  </g>
  
</svg>`;
            await dm.run(JsonKeyDefinition.TYPE, ({label, file, key} as IJsonKeyArgs), {svg, png});
            chai.assert.pathExists(svg, `SVG not created?`);
            chai.assert.pathExists(png, `PNG not created?`);
            chai.assert.equal(fs.readFileSync(svg, 'utf8'), svgRawCheck, `SVG generation has changed. (${svg})`);
        })();

        // Test: NodePackageVersionDefinition
        await (async () => {
            const svg = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_p-npv.svg');
            const png = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_p-npv.png');
            CleanPaths([svg, png]);
            const file = path.resolve(__dirname, '..', '..', 'package.json');
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
            await dm.run(NodePackageVersionDefinition.TYPE, ({file} as INodePackageVersionArgs), {svg, png});
            chai.assert.pathExists(svg, `SVG not created?`);
            chai.assert.pathExists(png, `PNG not created?`);
            chai.assert.equal(fs.readFileSync(svg, 'utf8'), svgRawCheck, `SVG generation has changed. (${svg})`);
        })();

        // Test: NodePackageUrlDefinition
        await (async () => {
            const svg = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_p-npu.svg');
            const png = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_p-npu.png');
            CleanPaths([svg, png]);
            const file = path.resolve(__dirname, '..', '..', 'package.json');
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
            await dm.run(NodePackageUrlDefinition.TYPE, ({file} as INodePackageUrlArgs), {svg, png});
            chai.assert.pathExists(svg, `SVG not created?`);
            chai.assert.pathExists(png, `PNG not created?`);
            chai.assert.equal(fs.readFileSync(svg, 'utf8'), svgRawCheck, `SVG generation has changed. (${svg})`);
        })();
    });
    it(`Full Setup // Custom`, async () => {
        const dm = new DefinitionManager(badgen);
        dm.definitionAdd(CustomDefinition);

        const svg = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_c-1.svg');
        const png = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_c-1.png');
        CleanPaths([svg, png]);
        const lbl = 'lbl';
        const val = 'val';
        const svgRawCheck = `<svg width="52.2" height="20" viewBox="0 0 522 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="val: val">
  <title>val: val</title>
  <g>
    <rect fill="#555" width="261" height="200"/>
    <rect fill="#08C" x="261" width="261" height="200"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
    <text x="60" y="148" textLength="161" fill="#000" opacity="0.1">val</text>
    <text x="50" y="138" textLength="161">val</text>
    <text x="316" y="148" textLength="161" fill="#000" opacity="0.1">val</text>
    <text x="306" y="138" textLength="161">val</text>
  </g>
  
</svg>`;
        await dm.run(CustomDefinition.TYPE, ({lbl, val} as ICustomArgs), {svg, png});
        chai.assert.pathExists(svg, `SVG not created?`);
        chai.assert.pathExists(png, `PNG not created?`);
        chai.assert.equal(fs.readFileSync(svg, 'utf8'), svgRawCheck, `SVG generation has changed. (${svg})`);
    });
    it(`Full Setup // Events`, async () => {
        const dm = new DefinitionManager(badgen);
        const s: IGenericDefinitionEvents = {
            prepared: {
                value: valuePulled => (valuePulled+'2'),
                label: labelPulled => (labelPulled+'2')
            }
        };
        dm.definitionAdd(GenericDefinition, s);
        dm.definitionAdd(JsonKeyDefinition, s);
        dm.definitionAdd(NodePackageVersionDefinition, s);
        dm.definitionAdd(NodePackageUrlDefinition, s);

        // Test: GenericDefinition
        await (async () => {
            const svg = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_e-g.svg');
            const png = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_e-g.png');
            CleanPaths([svg, png]);
            const label = 'label';
            const value = 'value';
            const svgRawCheck = `<svg width="89.8" height="20" viewBox="0 0 898 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="label2: value2">
  <title>label2: value2</title>
  <g>
    <rect fill="#555" width="431" height="200"/>
    <rect fill="#08C" x="431" width="467" height="200"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
    <text x="60" y="148" textLength="331" fill="#000" opacity="0.1">label2</text>
    <text x="50" y="138" textLength="331">label2</text>
    <text x="486" y="148" textLength="367" fill="#000" opacity="0.1">value2</text>
    <text x="476" y="138" textLength="367">value2</text>
  </g>
  
</svg>`;
            await dm.run(GenericDefinition.TYPE, ({label, value} as IGenericArgs), {svg, png});
            chai.assert.pathExists(svg, `SVG not created?`);
            chai.assert.pathExists(png, `PNG not created?`);
            chai.assert.equal(fs.readFileSync(svg, 'utf8'), svgRawCheck, `SVG generation has changed. (${svg})`);
        })();

        // Test: JsonKeyDefinition
        await (async () => {
            const svg = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_e-jk.svg');
            const png = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_e-jk.png');
            CleanPaths([svg, png]);
            const label = 'package';
            const file = path.resolve(__dirname, '..', '..', 'package.json');
            const key = 'name';
            const svgRawCheck = `<svg width="192.3" height="20" viewBox="0 0 1923 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="package2: badge-management2">
  <title>package2: badge-management2</title>
  <g>
    <rect fill="#555" width="628" height="200"/>
    <rect fill="#08C" x="628" width="1295" height="200"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
    <text x="60" y="148" textLength="528" fill="#000" opacity="0.1">package2</text>
    <text x="50" y="138" textLength="528">package2</text>
    <text x="683" y="148" textLength="1195" fill="#000" opacity="0.1">badge-management2</text>
    <text x="673" y="138" textLength="1195">badge-management2</text>
  </g>
  
</svg>`;
            await dm.run(JsonKeyDefinition.TYPE, ({label, file, key} as IJsonKeyArgs), {svg, png});
            chai.assert.pathExists(svg, `SVG not created?`);
            chai.assert.pathExists(png, `PNG not created?`);
            chai.assert.equal(fs.readFileSync(svg, 'utf8'), svgRawCheck, `SVG generation has changed. (${svg})`);
        })();

        // Test: NodePackageVersionDefinition
        await (async () => {
            const svg = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_e-npv.svg');
            const png = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_e-npv.png');
            CleanPaths([svg, png]);
            const file = path.resolve(__dirname, '..', '..', 'package.json');
            const svgRawCheck = `<svg width="103.2" height="20" viewBox="0 0 1032 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="version2: 1.0.22">
  <title>version2: 1.0.22</title>
  <g>
    <rect fill="#555" width="572" height="200"/>
    <rect fill="#08C" x="572" width="460" height="200"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
    <text x="60" y="148" textLength="472" fill="#000" opacity="0.1">version2</text>
    <text x="50" y="138" textLength="472">version2</text>
    <text x="627" y="148" textLength="360" fill="#000" opacity="0.1">1.0.22</text>
    <text x="617" y="138" textLength="360">1.0.22</text>
  </g>
  
</svg>`;
            await dm.run(NodePackageVersionDefinition.TYPE, ({file} as INodePackageVersionArgs), {svg, png});
            chai.assert.pathExists(svg, `SVG not created?`);
            chai.assert.pathExists(png, `PNG not created?`);
            chai.assert.equal(fs.readFileSync(svg, 'utf8'), svgRawCheck, `SVG generation has changed. (${svg})`);
        })();

        // Test: NodePackageUrlDefinition
        await (async () => {
            const svg = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_e-npu.svg');
            const png = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_e-npu.png');
            CleanPaths([svg, png]);
            const file = path.resolve(__dirname, '..', '..', 'package.json');
            const svgRawCheck = `<svg width="353.9" height="20" viewBox="0 0 3539 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="repo2: https://github.com/voltsonic/badge-management.git2">
  <title>repo2: https://github.com/voltsonic/badge-management.git2</title>
  <g>
    <rect fill="#555" width="419" height="200"/>
    <rect fill="#08C" x="419" width="3120" height="200"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
    <text x="60" y="148" textLength="319" fill="#000" opacity="0.1">repo2</text>
    <text x="50" y="138" textLength="319">repo2</text>
    <text x="474" y="148" textLength="3020" fill="#000" opacity="0.1">https://github.com/voltsonic/badge-management.git2</text>
    <text x="464" y="138" textLength="3020">https://github.com/voltsonic/badge-management.git2</text>
  </g>
  
</svg>`;
            await dm.run(NodePackageUrlDefinition.TYPE, ({file} as INodePackageUrlArgs), {svg, png});
            chai.assert.pathExists(svg, `SVG not created?`);
            chai.assert.pathExists(png, `PNG not created?`);
            chai.assert.equal(fs.readFileSync(svg, 'utf8'), svgRawCheck, `SVG generation has changed. (${svg})`);
        })();
    });
    it(`Full Setup // Errors`, async () => {
        const dm = new DefinitionManager(badgen);
        dm.definitionAdd(GenericDefinition);
        dm.definitionAdd(JsonKeyDefinition);
        dm.definitionAdd(NodePackageVersionDefinition);
        dm.definitionAdd(NodePackageUrlDefinition);

        const easyErrorTest_KeyUndefined = async (
            definitionType: string,
            definitionClass: string,
            baseArgs: IDefinitionBlankArgs,
            keyTest: string,
            tagFiles: string,
        ) => {
            const svg = path.resolve(ProjectPaths.dirs.badges, tagFiles+'.svg');
            const png = path.resolve(ProjectPaths.dirs.badges, tagFiles+'.png');
            CleanPaths([svg, png]);
            await (async () => {
                try {
                    await dm.run(definitionType, baseArgs, {svg, png});
                } catch (e) {
                    if (e instanceof Error) {
                        chai.assert.equal(e.name, 'KeyUndefinedDefinitionError', 'New error found?');
                        chai.assert.equal(e.message, `Missing key "${keyTest}" for (new ${definitionClass}).run()`, 'New error found?');
                    } else
                        throw e;
                    return;
                }
                chai.assert.fail(`[${tagFiles}.${keyTest}] Failed missing key test.`);
            })();

            // Test: Undefined key: ${keyTest}.
            await (async () => {
                try {
                    await dm.run(definitionType, {...baseArgs, ...{[keyTest]: undefined}}, {svg, png});
                } catch (e) {
                    if (e instanceof Error) {
                        chai.assert.equal(e.name, 'KeyUndefinedDefinitionError', 'New error found?');
                        chai.assert.equal(e.message, `Missing key "${keyTest}" for (new ${definitionClass}).run()`, 'New error found?');
                    } else
                        throw e;
                    return;
                }
                chai.assert.fail(`[${tagFiles}.${keyTest}] Failed undefined key test.`);
            })();
        };

        // Test: GenericDefinition
        await easyErrorTest_KeyUndefined(GenericDefinition.TYPE, 'GenericDefinition', {label: 'asdf'}, 'value', 'dm_b-fs_e-g0');
        await easyErrorTest_KeyUndefined(GenericDefinition.TYPE, 'GenericDefinition', {value: 'asdf'}, 'label', 'dm_b-fs_e-g1');

        // Test: JsonKeyDefinition
        await (async () => {
            await easyErrorTest_KeyUndefined(JsonKeyDefinition.TYPE, 'JsonKeyDefinition', {file: ''}, 'key', 'dm_b-fs_e-jk0');
            await easyErrorTest_KeyUndefined(JsonKeyDefinition.TYPE, 'JsonKeyDefinition', {key: ''}, 'file', 'dm_b-fs_e-jk1');

            // Test: Invalid `file`.
            await (async () => {
                const svg = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_e-jk2.svg');
                const png = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_e-jk2.png');
                CleanPaths([svg, png]);

                try {
                    await dm.run(JsonKeyDefinition.TYPE, {file: '', key: 'name'}, {svg,png});
                }catch(e){
                    if(e instanceof Error){
                        chai.assert.equal(e.name, 'NoSuchFileDefinitionError', 'New error found?');
                        chai.assert.equal(e.message, 'No such file: ""', 'New error found?');
                    }else
                        throw e;
                    return;
                }
                chai.assert.fail('No error was thrown for undefined key test.');
            })();
        })();

        //
        // Test: NodePackageVersionDefinition
        await (async () => {
            const svg = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_e-npv.svg');
            const png = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_e-npv.png');
            CleanPaths([svg, png]);

            // Test: file undefined
            await (async () => {
                try {
                    await dm.run(NodePackageVersionDefinition.TYPE, {file: undefined}, {svg, png});
                } catch (e) {
                    if (e instanceof Error) {
                        chai.assert.equal(e.name, 'KeyUndefinedDefinitionError', 'New error found?');
                        chai.assert.equal(e.message, 'Missing key "file" for (new NodePackageVersionDefinition).run()', 'New error found?');
                    } else
                        throw e;
                    return;
                }
                chai.assert.fail('No error was thrown?');
            })();

            // Test: file empty
            await (async () => {
                try {
                    await dm.run(NodePackageVersionDefinition.TYPE, {file: ''}, {svg, png});
                } catch (e) {
                    if (e instanceof Error) {
                        chai.assert.equal(e.name, 'NoSuchFileDefinitionError', 'New error found?');
                        chai.assert.equal(e.message, 'No such file: ""', 'New error found?');
                    } else
                        throw e;
                    return;
                }
                chai.assert.fail('No error was thrown?');
            })();
        })();

        // Test: NodePackageUrlDefinition
        await (async () => {
            const svg = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_e-npu.svg');
            const png = path.resolve(ProjectPaths.dirs.badges, 'dm_b-fs_e-npu.png');
            await (async () => {
                try {
                    await dm.run(NodePackageUrlDefinition.TYPE, {file: undefined}, {svg,png});
                }catch(e){
                    if(e instanceof Error){
                        chai.assert.equal(e.name, 'KeyUndefinedDefinitionError', 'New error found?');
                        chai.assert.equal(e.message, 'Missing key "file" for (new NodePackageUrlDefinition).run()', 'New error found?');
                    }else
                        throw e;
                    return;
                }
                chai.assert.fail('No error was thrown?');
            })();
            await (async () => {
                try {
                    await dm.run(NodePackageUrlDefinition.TYPE, {file: ''}, {svg,png});
                }catch(e){
                    if(e instanceof Error){
                        chai.assert.equal(e.name, 'NoSuchFileDefinitionError', 'New error found?');
                        chai.assert.equal(e.message, 'No such file: ""', 'New error found?');
                    }else
                        throw e;
                    return;
                }
                chai.assert.fail('No error was thrown?');
            })();
        })();
    });
});
