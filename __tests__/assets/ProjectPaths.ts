'use strict';

import path from "path";
const root = path.resolve(__dirname, '../../..');

export const ProjectPaths = {
    root,
    dirs: {
        badges: path.resolve(root, 'badges-test')
    },
};
