import path from 'path';
import fs from 'fs';

export const fallback = (fallbackPath: string) => {
    return (req: any, res: any, next: any) => {
        if (req.url === undefined) {
            next();
            return;
        }

        const ext = path.extname(req.url);
        if (ext !== '') {
            next();
            return;
        }

        if (req.url.startsWith('/api/')) {
            next();
            return;
        }

        // TODO: Optimize
        res.end(fs.readFileSync(fallbackPath));
    };
};