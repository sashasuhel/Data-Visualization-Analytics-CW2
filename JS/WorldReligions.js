
// WorldReligions.js is the file resposible for showing the bubble chart
// Each bubble represents a country and religion pair.
// Each bubble shows the size of a population for a specific religion
// The bigger the circle, the more population of that religion is present in a country.
// The bubbles are colour coded for each religion which can be seen in the chart.
// To stop the bubbles from overlapping, d3.force() is used.

//----------------------------------------CODE BELOW--------------------------------------------------------------------------------------------------


// appending the svg  to the bubble container div in the html file
const religionsvg = d3.select("#bubble-container")
    .append("svg")
    .attr("width", 800)
    .attr("height", 530)


// Reading the csv data from github
d3.csv("https://raw.githubusercontent.com/sashasuhel/Data-Visualization-Analytics-CW2/main/data/world_religions.csv").then(function (data) {

    // function dataProcess(d){
    //     var islam = d.muslims;
    //     return islam;
    //     console.log(islam);
    // }

    // Setting the scale and size for each bubble that will represent the countries
    const size = d3.scaleLinear()
        .domain([0, 973750001]) //domain will be the smallest value in the dataset
        .range([4, 50])  //range will be 4 px to 50 px.

    // creating Tooltip for the bubbles and setting its properties
    const Tooltip = d3.select("#bubble-container")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "rgb(253 164 175)")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("width", "500px")
    .style("margin-left","100px")
    .style("margin-top", "15px")
    .style("margin-bottom", "15px")
    .style("color","rgb(69 10 10)")

    // Function for mouseover the bubble the tooltip will show
    const mouseover = function (event, d) {
        Tooltip.transition()
                .duration(100)
                .style("opacity", 1);
    
    }

    //When the mouse is over the bubble, the message will show.
    const mousemove = function (event, d) {
        Tooltip.html('<b>' + d.country_name + '</b>' + "<br>" + "In " + d.country_name + " there are " + "<b>" + d.value + "</b>" +" "+d.religion+".")
    }

     // Function for mouseover the bubble the tooltip will not show
    var mouseleave = function (event, d) {
        Tooltip.transition()
                .duration(1000)
                .style("opacity", 0)
    }

    // Defining the circles and setting its properties, the colour will be seperate for each religions bubble.
    var node = religionsvg.append("g")
        .selectAll("circle")
        .attr("class", "circ")
        .data(data)
        .join("circle")
        .attr("r", d => size(d.value))
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", function(d){
            if(d.religion.includes("muslims")){return "yellow"}
            else if (d.religion.includes("hindus")){ return "orange";}
            else if (d.religion.includes("christians")){ return "pink";}
            else if (d.religion.includes("buddhists")){ return "blue";}
            else if (d.religion.includes("jews")){ return "purple";}
        })
        .attr("stroke", "black")
        .style("stroke-width", "1px")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    // Forces being applied to the nodes, to prevent them from overlapping
    var simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width / 2).y(height/1.7)) // Positioning the force in the svg 
        .force("charge", d3.forceManyBody().strength(0.5))
        .force("collision", d3.forceCollide().radius(function (d) { return (size(d.value))+3}).strength(0.8).iterations(1))
        .nodes(data)
        .on("tick", function (d) {
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
        }); 

})
