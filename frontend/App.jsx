"use strict";
/*global React*/

var React    = require('react')
var DataGrid = require('react-datagrid')
var ReactSlider = require('react-slider')
var sorty    = require('sorty')
var _ = require('lodash')

var columns = [
  { name: 'id', title: "#" },
  { name: 'panel' },
  { name: 'circuit'  },
  { name: 'endUse' },
  { name: 'label' },
  { name: 'load', type: "number" },
  { name: 'avg15Min', title: "15 Min", type: "number" },
  { name: 'avg1Hr', title: "1 Hr", type: "number" },
  { name: 'avg6Hr', title: "6 Hr", type: "number" },
  { name: 'avg24Hr', title: " 24 Hr", type: "number" }
]
var dataOrig = [
  { id: 0, panel: "HK", circuit: "7 - Dish", endUse : "cook", label: "..", load: 7.0, avg15Min: 1.0, avg1Hr: 4.0, avg6Hr: 32.5, avg24Hr: 96.0 },
  { id: 1, panel: "AA", circuit: "1 - Dish", endUse : "Acook", label: "A..", load: 2.0, avg15Min: .50, avg1Hr: 1.0, avg6Hr: 2.5, avg24Hr: 6.0 }
]
var data = dataOrig
var SORT_INFO = [ { name: 'id', dir: 'asc'}]

function sort(arr){
  return sorty(SORT_INFO, arr)
}
//sort data array with the initial sort order
data = sort(data)


var avg24Hrs = _.map(data, function(x) { return x.avg24Hr; });
var avg24HrSpan = [_.min(avg24Hrs), _.max(avg24Hrs)];

var MySlider = React.createClass({
  getInitialState: function () {
    return {value: avg24HrSpan}
  },
  onChange: function (value) {
    this.setState({value: value});
  },
  render: function() {
    var children = _.map(this.state.value, function (value, i) {
      return React.createElement('div', {key: i}, value);
    })
    return <ReactSlider
              onAfterChange={this.props.handleSliderChange}
              min={_.min(avg24Hrs)}
              max={_.max(avg24Hrs)}
              defaultValue={avg24HrSpan}
              withBars={true}
              pearling={true}
              value={this.state.value}
              onChange={this.onChange}>
                {children}
              </ ReactSlider>
  }
})

var App = React.createClass({
  render: function(){
    return (<div>
            <div id="slider">
              <MySlider handleSliderChange={this.handleSliderChange} />
            </div>
            <DataGrid
                idProperty='id'
                dataSource={data}
                columns={columns}
                style={{height: 400}}
                withColumnMenu={false}

                sortInfo={SORT_INFO}
                onSortChange={this.handleSortChange}

                onColumnOrderChange={this.handleColumnOrderChange}
                />
            </div>)
  },
  handleSliderChange: function(newVals){
    var min = newVals[0]
    var max = newVals[1]

    //reset data to original data-array
    data = dataOrig

    data = data.filter(function(item){
      if (item.avg24Hr >= min && item.avg24Hr <= max) return true;
      else return false;
    })

    this.setState({})
  },
  handleSortChange: function(sortInfo){
    SORT_INFO = sortInfo

    data = sort(data)

    this.setState({})
  },
  handleColumnOrderChange: function (index, dropIndex){
    var col = columns[index]
    columns.splice(index, 1) //delete from index, 1 item
    columns.splice(dropIndex, 0, col)
    this.setState({})
  }
})

React.render( <App />, $('#container')[0]);
