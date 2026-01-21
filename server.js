/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express');
const next = require('next');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
    const server = express();

    // 1. Built-in Middleware (Replacing old middleware usage)
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    // 2. CORS Handling
    server.use(cors());

    // 3. Next.js Request Handling
    // All other requests are handled by Next.js
    server.all(/(.*)/, (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> The Great Escape is ready on http://localhost:${port}`);
    });
}).catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
});
