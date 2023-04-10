
// Scatter.js is the file resposible for showing the scatter plot.
// The plot shows the literacy count for a country vs the ratio of male to females.
// The point was to identify any interesting trends to see if the education levels of a country had an affect the ratio

//----------------------------------------CODE BELOW--------------------------------------------------------------------------------------------------



// append the svg object to the body of the page
const scatter_svg = d3.select("#scatter")
 .append("svg")
 .attr("class","scatter-svg")
 .attr("width", width + margin.left + margin.right)
 .attr("height", height + margin.top + margin.bottom)
 .append("g")
 .attr("transform", `translate(${margin.left}, ${margin.top})`)


//Read the data
d3.csv("https://raw.githubusercontent.com/sashasuhel/Data-Visualization-Analytics-CW2/main/data/litracy_vs_ratio_per_country.csv").then(function (data) {

 // Add X axis
 const x = d3.scaleLinear()
     .domain([0, 0])
     .range([0, width]);
scatter_svg.append("g")
     .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
     .attr("transform", `translate(0, ${height})`)
     .call(d3.axisBottom(x))
     .attr("opacity", "0")

 // Add Y axis
 const y = d3.scaleLinear()
     .domain([0.8, 3])
     .range([height, 0]);
const yAxis= scatter_svg.append("g")
     .call(d3.axisLeft(y));

 // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
 // Its opacity is set to 0: we don't see it by default.
 const tooltip = d3.select("#scatter")
     .append("div")
     .style("opacity", 0)
     .attr("class", "tooltip")
     .style("background-color", "rgb(253 164 175)")
     .style("border", "solid")
     .style("border-width", "1px")
     .style("border-radius", "5px")
     .style("padding", "10px")
     .style("width", "200px")
     .style("margin-left","700px")
     .style("margin-top", "15px")
     .style("margin-bottom", "15px")
     .style("color","rgb(69 10 10)")

 // A function that change this tooltip when the user hover a point.
 // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
 const mouseover = function (event, d) {
     tooltip.transition()
            .duration(200)
            .style("opacity", 1);
    
 }

 const mousemove = function (event, d) {
     tooltip.html('<b>'+d.Entity+"</b>")

 }

 // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
 const mouseleave = function (event, d) {
     tooltip.transition()
            .duration(1000)
            .style("opacity", 0)
 }

 // Adding dots to the plot
 const dots = scatter_svg.append('g')
     .selectAll("dot")
     .attr("class", "dots")
     .data(data)
     .enter()
     .append("circle")
     .attr("cx", function (d) { return x(d.Literacy); })
     .attr("cy", function (d) { return y(d.Ratio); })
     .attr("r", "5px")
     .style("fill", "pink")
     .style("opacity", 0.5)
     .on("mouseover", mouseover)
     .on("mousemove", mousemove)
     .on("mouseleave", mouseleave)

 // Upon start the transition for the x-axis
 x.domain([0, 110])
 scatter_svg.select(".myXaxis")
     .transition()
     .duration(2000)
     .attr("opacity", "1")
     .call(d3.axisBottom(x));
//transition of the plots upon start
scatter_svg.selectAll("circle")
     .transition()
     .delay(function (d, i) { return (i * 3) })
     .duration(800)
     .attr("cx", function (d) { return x(d.Literacy); })
     .attr("cy", function (d) { return y(d.Ratio); })


// A function that updates the plot when the yCont input is changed
function updatePlot() {

    // Getting the value of the y axis input box
    yCont = this.value

    // Updating the Y axis
    y.domain([0.8,yCont])
    yAxis.transition().duration(80).call(d3.axisLeft(y))

    // Updating the plots on the chart
    scatter_svg.selectAll("circle")
        .data(data)
        .transition()
        .duration(1000)
        .attr("cx", function (d) { return x(d.Literacy); })
        .attr("cy", function (d) { return y(d.Ratio); })
}

// calling the update plot when the y axis input is changed.
d3.select("#buttonYcont").on("input", updatePlot)
})