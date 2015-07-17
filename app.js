var DocumentDBClient = require('documentdb').DocumentClient;
var config = require('./config');
var Tweets = require('./routes/Tweets');
var Person = require('./routes/Person');
var TweetsDao = require('./models/TweetsDao');
var PersonDao = require('./models/PersonDao');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();
// view engine setup
//
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var docDbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});

var twit = require('twitter'),
twitter = new twit({
	consumer_key : config.consumer_key,
	consumer_secret:config.consumer_secret,
	access_token_key:config.access_token_key,
	access_token_secret:config.access_token_secret
});

require('node-jsx').install();

var React = require('react/addons'),
ReactApp = React.createFactory(require('./app/components/ReactApp'));

//end-config

//Json which is going to be stored in tweets collection.
var tweetPersistObj = ({
    "id"        : ""
  , "text"        : ""
  , "created_at"  : ""
  , "user_id"     : ""
});
//combined projection response json when searched by personId
var response = ({
    tweets:[],
    persons:[]
});
//Json which is going to stored in person collection
var personPersistObj = ({
    "id"           : ""
  , "screen_name"  : ""
  , "location"  : ""
  , "profile_image_url" : ""
});


var tweetsDao = new TweetsDao(docDbClient, config.databaseId, config.tweetsId);
var tweets = new Tweets(tweetsDao);
tweets.showTweets.bind(tweets);
tweetsDao.init();
var personDao = new PersonDao(docDbClient,config.databaseId, config.personId);
var person = new Person(personDao);
personDao.init();

var peopleResp;
var tweetsResp;	
var count = 0,
    util = require('util');


//Find Tweets by PersonId .Display Info of Both Collections.
//In This use case both can perform async
//both call buildResponse as callback to build responeJson.
app.post('/tweetsById', function(req, res) {
	  tweets.showTweetsById(req,res,buildResponse);
      person.showPeopleById(req,res,buildResponse);
});
//builds a common json object for Tweet and UserInformation for the given userId
//When it recieves the required
function buildResponse(json,res,ind)
{  
    count = count + 1;
    for(var i in json) {
         var item = json[i];
    if(ind == 1)
    {
         response.tweets.push({ 
        "id" : item.id,
        "text" : item.text,
        "user_id"  : item.user_id,
        "created_at" : item.created_at      
    });
    }
    else
    {
        response.persons.push({ 
        "screen_name"  : item.screen_name,
        "location" : item.location,
        "profile_image_url" : item.profile_image_url
       });
    }
    }
    if(count == 2)
    {
        count= 0;
        res.render('showById', {
                title: 'Tweets',
                tweetsResp: response.tweets,
                peopleResp : response.persons
            });
       response.tweets = [];
       response.persons = []
    }
}
//show All tweets on Loading Page and calls RenderTwets as callback
app.get('/', function(req, res) {
    
	tweets.showTweets(req,res,renderTweets);

});

function renderTweets(json,res)
{
   	// React.renderToString takes your component
	    // and generates the markup
		var reactHtml = React.renderToString(ReactApp({initialCount:json}));
	    // Output html rendered by react
	    res.render('index', {reactOutput: reactHtml});
}

//This Route fetches actual twitter Data from Twitter and puts it in documentdb
//Runs for  a minute then times out closes the stream and redirected to home url
//Done on pressing getnewTweets Button
app.get('/gettweets', function(req, res) {
	twitter.stream('statuses/filter',{track: 'seattle'},function(stream){
	
	stream.on('data',function(data){
		var json = data;
		tweetPersistObj.id= json.id_str;
		tweetPersistObj.text = json.text;
		tweetPersistObj.created_at= json.created_at;
		tweetPersistObj.user_id = json.user.id_str;
		tweets.addTweet(tweetPersistObj);
	    personPersistObj.id  = json.user.id_str;
        personPersistObj.screen_name =json.user.screen_name;
        personPersistObj.location = json.user.location;
        personPersistObj.profile_image_url = json.user.profile_image_url;
		person.addPerson(personPersistObj);
       
	});
    
    setTimeout(function(){
       stream.destroy(); 
       res.redirect('/');
    },6000);
     
});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
};

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
