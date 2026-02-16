// List of users and their data
const users = {};

const respond = (request, response, status, object) => {
    const content = JSON.stringify(object);

    // Write head regardless
    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });

    // If request wasn't a head request or user wasn't updating existing data, write body
    if (request.method !== 'HEAD' || status !== 204) {
        response.write(content);
    }

    response.end();
};

const getUsers = (request, response) => {
    // Return list of users
    const responseJSON = {
        users,
    };
    const status = 200;

    return respond(request, response, status, responseJSON);
};

const notReal = (request, response) => {
    // Return default page not found
    const responseJSON = {
        id: 'notFound',
        message: 'The page you are looking for was not found.',
    };
    const status = 404;

    return respond(request, response, status, responseJSON);
};

const addUser = (request, response) => {
    // Code from body-parse demo 
    // https://github.com/IGM-RichMedia-at-RIT/body-parse-example-done/blob/master/src/jsonResponses.js

    // Set default response and status
    const responseJSON = {
        message: 'Name and age are both required',
    };
    let status = 400;

    // If invalid post request, return early
    const { name, age } = request.body;
    if (!name || !age) {
        responseJSON.id = 'addUserMissingParams';
        return respond(request, response, status, responseJSON);
    }

    // If new user, create new user profile and update status
    status = 204;
    if (!users[name]) {
        status = 201;
        users[name] = {
            name: name,
        };
    }

    // Update age regardless
    users[name].age = age;

    // If new user created, send back success message, otherwise respond normally
    if (status === 201) {
        responseJSON.message = 'Created Successfully';
        return respond(request, response, status, responseJSON);
    }
    return respond(request, response, status, {});
};

module.exports = {
    getUsers,
    notReal,
    addUser,
};