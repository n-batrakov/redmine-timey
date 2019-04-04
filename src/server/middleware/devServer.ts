import path from 'path';

const webpack = require('webpack');
const devServerMiddleware = require('webpack-dev-middleware');
const config = require('../../../webpack.config');

const compiler = webpack(config);
const middleware = devServerMiddleware(compiler, {
    publicPath: '/',
});

const indexFallback = (req: any, res: any, next: any) => {
    const url = req.url as string;

    const isApi = /^\/api\/.*/.test(url);
    if (isApi) {
        next();
    } else {
        const indexPath = path.join(config.output.path, 'index.html');
        res.end(middleware.fileSystem.readFileSync(indexPath));
    }
};

export const devServer = () => {
    return (req: any, res: any, next: any) => {
        return middleware(req, res, () => indexFallback(req, res, next));
    }
};