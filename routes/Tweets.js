/**
Uses the TweetsDao and provides query support on Tweets Collections and provides the business methods for the app.
**/
var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');

function Tweets(tweetsDao) {
  this.tweetsDao = tweetsDao;
}

module.exports = Tweets;

Tweets.prototype = {
    showTweetsById: function (req, res,callback) {
        var self = this;
		var querySpec = {
            query: 'SELECT * FROM Tweets t WHERE t.user_id=@id',
            parameters: [{
                name: '@id',
                value: req.body.id
            }]
        };
		
		self.tweetsDao.find(querySpec, function (err, twips) {
            if (err) {
                throw (err);
            }
            callback(twips,res,1);
        });
    },
    showTweets: function (req, res ,callback) {
        var self = this;

        var querySpec = {
            query: 'SELECT * FROM root r',
        };

        self.tweetsDao.find(querySpec, function (err, items) {
            if (err) {
                throw (err);
            }
            callback(items,res);
        });
    },
    addTweet: function (req, res) {
        var self = this;
        var item = req;
        self.tweetsDao.addTweet(item, function (err) {
			try{
			console.log(err);
			}
            catch (err) {
                console.log(err);
            }
        });
    }
};