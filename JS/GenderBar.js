
// GenderImbalance.js is the file resposible for showing a comparison between males and females in a simple barchart for the countrie around the world. 
// The bar chart has axese that automatically change scale for when a different data set is clicked on the world map.
// When clicking on a country on the map, the data for that country will be shown on the chart.

//----------------------------------------CODE BELOW--------------------------------------------------------------------------------------------------


var loading_screen = d3.select("#gender-imbalance-container")
  .append("div")
  .attr("class", "loading-screen")
  .html("Please click on a country from the map<br><span class='loading-text'>Waiting...</span>");

function clicked(event, d) {
  // Removing loading screen
  loading_screen.remove();

  //d3.select(this)
  console.log(d.id)
  console.log(d)
  d3.csv("https://raw.githubusercontent.com/sashasuhel/Data-Visualization-Analytics-CW2/main/data/mergedpopulationds.csv").then(data => {
    data.forEach(d => {
        d.code = d.code
        d.PopMale = +d.PopMale;
        d.PopFemale = +d.PopFemale;
    });
    var barData = getMaleFemale(data,d.id)
    console.log(barData);
    //console.log(data[d.id])
    updateBar(barData);
  });
  //updateBar(d);
}

function getMaleFemale(data,code){
  var rtn = []
  data.forEach(d=>{
    if(d.code==code){
      rtn[0] = d.PopMale
      rtn[1] = d.PopFemale
    }
  })
  return rtn
}

const margin = { top: 10, right: 10, bottom: 20, left: 50 }

  // appending svg to body of page
  bar_svg = d3.select('#gender-imbalance-container')
    .append("svg")
    .attr("class","gender-bar-svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")")
    .style("background-color", "white");


var g = bar_svg.append("g")

//X axis
const xBar = d3.scaleBand()
  .range([0, width]);
const xAxisBar = bar_svg.append("g")
  .attr("transform", "translate(0," + height + ")")

//Y axis
const yBar = d3.scaleLinear()
  .range([height, 0]);
const yAxisBar = bar_svg.append("g")


// A function for updating plot for variables
function updateBar(data) {
  console.log(data);

  // Updating X axis
  xBar.domain(['Male','Female'])
  xAxisBar.call(d3.axisBottom(xBar));

  // Updatin Y axis
  yBar.domain([0,data[0]+data[1]]);
  yAxisBar.transition()
    .duration(1000).call(d3.axisLeft(yBar));


  var u = bar_svg.selectAll("rect")
    .data(data)


  u.enter("path")
    .append("rect")
    .merge(u)
    .transition()
    .duration(1000)
    .attr("x", function (d,i) {  return i*350+150; })
    .attr("y", function (d){ return yBar(d)})
    .attr("width", "50")
    .attr("height", function (d) { let delta = height - yBar(d); console.log(delta); return delta;})
    .attr("fill", "pink")


  u.exit()
    .remove()
}
