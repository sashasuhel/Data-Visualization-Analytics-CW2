
// PopDensity.js is the file resposible for the chloropleth graph on the population density of a country.
// It can be clearly seen which countries have to most dense populations. 


//----------------------------------------CODE BELOW--------------------------------------------------------------------------------------------------


function displayDensity() {
    // //color scale for population density
    const densityScale = d3.scaleThreshold()
        .domain([0, 50, 100, 200, 300, 500, 1000, 2000, 8000])
        .range(d3.schemeRdPu[7]);


    // //Loading data externally, JSON and CSV format and processing data to select needed data
    Promise.all([
        d3.json("https://raw.githubusercontent.com/sashasuhel/Data-Visualization-Analytics-CW2/main/data/world.geojson"),
        d3.csv("https://raw.githubusercontent.com/sashasuhel/Data-Visualization-Analytics-CW2/main/data/mergedpopulationds.csv", function (d) {
            map.set(d.code, +d.PopDensity)
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
            // //set the color for each country based on the density values
            .attr("fill", function (d) {
                d.PopDensity = map.get(d.id) || 0;
                return densityScale(d.PopDensity);
            })
            .attr("stroke", "black")
            .attr("stroke-width", "0.5")
            .on('click', clicked)

    })

}

