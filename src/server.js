// Dependencies
const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

// Port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Urls
const urlStruct = {
    '/': htmlHandler.getClient,
    '/style.css': htmlHandler.getCss,
    '/getUsers': jsonHandler.getUsers,
    '/addUser': jsonHandler.addUser,
    notFound: jsonHandler.notReal,
};

// Umbrella request
const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    if (request.method === 'POST') {
        // Handle post requests
        if (urlStruct[parsedUrl.pathname]) {
            parseBody(request, response, urlStruct[parsedUrl.pathname]);
        }
    }
    else {
        // Handle get requests
        if (urlStruct[parsedUrl.pathname]) {
            return urlStruct[parsedUrl.pathname](request, response);
        }
        return urlStruct.notFound(request, response);
    }
};

// Assembles and parses incoming packets
const parseBody = (request, response, handler) => {
    // Code from body-parse demo
    // https://github.com/IGM-RichMedia-at-RIT/body-parse-example-done/blob/master/src/server.js
    const body = [];

    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    request.on('data', (chunk) => {
        body.push(chunk);
    });

    request.on('end', () => {
        // could probably do something here to account for not json
        const bodyString = Buffer.concat(body).toString();
        request.body = JSON.parse(bodyString);
        handler(request, response);
    });
};

// Start server
http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1${port}`);
});
