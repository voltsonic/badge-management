'use strict';

import fs from "fs";
// const root = path.resolve(__dirname, '../../..');

export const CleanPaths = (paths: string[]) =>
    (paths.map(path =>
        (fs.existsSync(path)
            ? fs.unlinkSync(path)
            : 0)));
