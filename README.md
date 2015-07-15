<html>
    <head>
        <titleTweeter API with Node.js,DocumentDb and Azure</title>
    </head>
    <body>
        <h2>Demo Using Twitter API NodeJS DocumentDb and React Js</h2>
        <p>
        .
        </p>
	<p>
            The website  has 3 functions:<br/> [1]On Pressing Get New Tweets Button it fetches all tweets related for a   minute relating to "seattle" and stores in documentdb<br/>[2]display all tweets to user on homepage in a table<br/>[3]search by personID displayed in above table to get info of the person making the Tweet.<br/><br/>Two documentdb Collections were used    Tweets(tweetId,tweet,time,personID(makingthetweet)) and Person(personId,twitterhandlename,location,image_url).<br/><br/>[2]uses tweet Collection while [3] uses a join of the sort to project(both tables are used for projection).
        </p>
        <h4>Installing the library using npm</h4>
        <p><pre>&gt; npm install</pre></p>
        <p><pre>&gt; Also install twitter,documentdb,reactify apart from listed dependencies</pre></p>
        <h4>The config.js for the project(should be in the root of the project(same level as app.js))</h4>
        <p><pre>var config = {}
config.host = process.env.HOST || "";
config.authKey = process.env.AUTH_KEY || "";
config.databaseId="";
config.tweetsId = "";//twitterCollectionId
config.personId = "";//personCollectionId
config.consumer_key = '';
config.consumer_secret='';
config.access_token_key='';
config.access_token_secret='';
module.exports = config;</pre></p>
<h4>Running the Demo</h4>
<p><pre>  
http://tweet-trends0demo.azurewebsites.net/
</p></pre>
<p><pre>  
Basic Usage of the site :<br/>1)Press getTweets for a Minute to get tweets from twitter(tracked with "Seattle").<br/>2)See the Table.<br/>3)Grab one person Id fro Table and search for person with that Information and see His Info <br/>
</p></pre>
    </body>
</html>
