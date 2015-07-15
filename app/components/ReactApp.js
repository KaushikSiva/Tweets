/** @jsx React.DOM */
var React = require('react/addons');

/* create factory with griddle component */
var Griddle = React.createFactory(require('griddle-react'));

var ReactApp = React.createClass({

      componentDidMount: function () {
        console.log(getInitialState());

      },
      render: function () {
        return (
          <div id="table-area">
                   
                      
             <Griddle results={this.props.initialCount} tableClassName="table" 
             columns={["id", "text", "created_at", "user_id"]} resultsPerPage={40}/>

          </div>
        )
      }
  });

/* Module.exports instead of normal dom mounting */
module.exports = ReactApp;