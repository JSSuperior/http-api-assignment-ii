const http = require('http');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    '/' : htmlHandler.getClient,
    '/style.css' : htmlHandler.getCss,
};

const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    if(request.method === 'POST')
    {

    }
    else
    {
        
    }

    if(urlStruct[parsedUrl.pathname])
    {
        return urlStruct[parsedUrl.pathname](request, response);
    }

};

const handlePost = (request, response, parsedUrl) => {
    if(parsedUrl.pathname === '/addUser')
    {
        parseBody()
    }
};

const parseBody = (request, response, handler) => {

};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1${port}`);
});
