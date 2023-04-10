
// PopCount.js is the file resposible for showing a chloropleth map for the population of the world.
// The darker the countries colour the higher the population
// India and China as can be seen have the highest population

//----------------------------------------CODE BELOW--------------------------------------------------------------------------------------------------


// //appending SVG 
var svg = d3.select("#map-container")
    .attr("class", "map-svg")
    .append("svg")
    .attr("width", "700")
    .attr("height", "450")
    .style("background-color", "rgb(254 205 211)")
    .style("border-radius", "10px");

// //Setting width and Heights of SVG
var width = +svg.attr("width");
var height = +svg.attr("height");

// //Fitting the Map to scale
const path = d3.geoPath();
const map_type = d3.geoMercator()
    .scale(108)
    .center([0, 20])
    .translate([width / 2, height / 1.6]);

// //Initialising Map 
const map = new Map();

displayCount();

function displayCount() {
    //color scales
    const popScale = d3.scaleThreshold()
        .domain([100, 1000, 10000, 30000, 100000, 500000])
        .range(d3.schemeRdPu[7]);

    // //Loading data externally, JSON and CSV format and processing data to select needed data
    Promise.all([
        d3.json("https://raw.githubusercontent.com/sashasuhel/Data-Visualization-Analytics-CW2/main/data/world.geojson"),
        d3.csv("https://raw.githubusercontent.com/sashasuhel/Data-Visualization-Analytics-CW2/main/data/mergedpopulationds.csv", function (d) {
            map.set(d.code, +d.PopTotal)
        }),
    ]).then(function (loadData) {
        let topo = loadData[0]
        // //Drawing the map
        svg.append("g")
            .selectAll("path")
            .data(topo.features)
            .join("path")
            // //drawing each country
            .attr("d", d3.geoPath()
                .projection(map_type)
            )
            // //set the color for each country based on the value of population
            .attr("fill", function (d) {
                d.PopTotal = map.get(d.id) || 0;
                return popScale(d.PopTotal);
            })
            .attr("stroke", "black")
            .attr("stroke-width", "0.5")
            .on('click', clicked)

    })

}
