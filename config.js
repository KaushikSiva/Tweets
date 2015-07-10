var config = {}

config.host = process.env.HOST || "https://tweets.documents.azure.com:443/";
config.authKey = process.env.AUTH_KEY || "5JTZ0knWqU8YB2Kujp3yd8BNeGDFRZytFLARx6yUDvcn0nE8YNdRLyp0d44V2UZA/Nvynf60Du4xkxapZq/X+g==";
config.databaseId = "ToDoList";
config.collectionId = "Items";

module.exports = config;