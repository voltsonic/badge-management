'use strict';

import fs from 'fs';
import util from 'util';
import 'mocha';
import {before} from "mocha";
import {ProjectPaths} from "./assets/ProjectPaths";

before(async () => {
    if(!fs.existsSync(ProjectPaths.dirs.badges))
        fs.mkdirSync(ProjectPaths.dirs.badges, {recursive: true});
});

after(async () => {
    await util.promisify(fs.rm)(
        ProjectPaths.dirs.badges,
        {force: true, recursive: true}
    );
});
