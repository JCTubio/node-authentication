# node-authentication
Authentication api using node.js and mongodb

# Pre-requisites
This API requires an online Mongo database to connect to

# Set-up
First create a `.env` file in the root directory and define the following environment variables:

`PORT`: The port on which the server will be available

`DB_URI`: The MONGODB_URI provided by mongodb, it looks like this (mongodb://<dbuser>:<dbpassword>@ds257698.mlab.com:57698/node-auth)

`SECRET`: A secret message to be used as salt for hashing passwords (this could be any string, such as 'potato' or 'mario')

# Starting the server
Make sure the mongo service is up and running and finally run the following command
`npm run start`
