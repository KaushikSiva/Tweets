/**
Uses the PersonDao and provides query support on Person Collections and provides the business methods for the app.
**/
var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');

function Person(personDao) {
  this.personDao = personDao;
}

module.exports = Person;

Person.prototype = {
    showPeopleById: function (req, res,callback) {
        var self = this;
		
		var personSpec = {
            query: 'SELECT * FROM Person p WHERE p.id=@id',
            parameters: [{
                name: '@id',
                value: req.body.id
            }]
        };
		
		self.personDao.find(personSpec, function (err, pips) {
            if (err) {
                throw (err);
            }
            callback(pips,res,2);
        });
    } ,
    addPerson: function (req, res) {
        var self = this;
        var item = req;
        self.personDao.addPerson(item, function (err) {
			try{
			console.log(err);
			}
            catch (err) {
                console.log(err);
            }
        });
    }
};