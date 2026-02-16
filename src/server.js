const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    '/' : htmlHandler.getClient,
    '/style.css' : htmlHandler.getCss,
    '/getUsers' : jsonHandler.getUsers,
    '/addUser' : jsonHandler.addUser,
    notFound: jsonHandler.notReal,
};

const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    if(request.method === 'POST'){
        // Handle post requests
        if(urlStruct[parsedUrl.pathname])
        {
            console.log(request.body);
            parseBody(request, response, urlStruct[parsedUrl.pathname]);
        }
    }
    else
    {
        // Handle get requests
        if(urlStruct[parsedUrl.pathname])
        {
            return urlStruct[parsedUrl.pathname](request, response);
        }
        return urlStruct.notFound(request, response);
    }
};

const parseBody = (request, response, handler) => {
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
        const bodyString = Buffer.concat(body).toString();
        // could probably do something here to account for only json and application type
        request.body = JSON.parse(bodyString);
        handler(request, response);
    });
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1${port}`);
});
