const path = require('path');

module.exports = (base) => {
    const root = (...paths) => path.join(base, ...paths);
    return ({
        root,
        src: (...paths) => root('src', ...paths),
        dist: (...paths) => root('dist', ...paths),
        nodeModules: (...paths) => root('node_modules', ...paths),
    });
};