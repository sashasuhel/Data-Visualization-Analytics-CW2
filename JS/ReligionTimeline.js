
// Religion Timeline.js is the file resposible for the animation of the timeline of how religions spread accross the globe. 
// 1st step to acheieve this was by organising the data strcuture to make processing data a little bit easier
// 2nd step is to update the data and map of the data so that new data for the years is available
// 3rd step is to create the loop and then bind the data to the DOM elements on screen to show it as the animation.

//----------------------------------------CODE BELOW--------------------------------------------------------------------------------------------------



// Creating the data structure and color scale
let data = new Map()
let yearData = new Map()
let years = new Set()
let religions = ['chrstprot', 'chrstcat', 'chrstorth', 'chrstang', 'chrstothr', 'chrstgen', 'judorth', 'jdcons', 'judref', 'judothr', 'judgen', 'islmsun', 'islmshi', 'islmibd', 'islmnat', 'islmalw', 'islmahm', 'islmothr', 'islmgen', 'budmah', 'budthr', 'budothr', 'budgen', 'zorogen', 'hindgen', 'sikhgen', 'shntgen', 'bahgen', 'taogen', 'jaingen', 'confgen', 'syncgen', 'anmgen']
currentReligion = 'chrstprot'
arrayOfYears = []
currentYear = 0
playing = false;
var relData;
const colorScale = d3.scaleLinear()
    .domain([0, 1000, 10000, 100000, 1000000, 1000000000])
    .range(d3.schemeRdPu[8]);



// Loading data from github.
Promise.all([
    d3.json("https://raw.githubusercontent.com/sashasuhel/Data-Visualization-Analytics-CW2/main/data/world.geojson"),
    d3.csv("https://raw.githubusercontent.com/sashasuhel/Data-Visualization-Analytics-CW2/main/data/WRP%20national%20data.csv"
    )
]).then(function (loadData) {
    let topo = loadData[0]
    relData = loadData[1]
    let j = 0
    let firstYear = "1945";


    relData.forEach(element => {
        year = element.year
        countryName = element.name
        religion = element[currentReligion]
        if (!years.has(year)) {
            years.add(year)
        }
        if (j == 0) {
            firstYear = year;
            yearData.set(countryName, religion)
            j++;
        }
        if (!data.has(year)) {
            let dEntry = new Map()
            dEntry.set(countryName, religion)
            data.set(year, dEntry)
        }
        else {
            yearEntry = data.get(year)
            yearEntry.set(countryName, religion)
            if (year.localeCompare(firstYear) == 0) {
                yearData.set(countryName, religion)
            }
        }
    })
    let k = 0;
    years.forEach(element => {
        arrayOfYears[k] = element
        k++
    })
    //arrayOfYears = yearData.values()
    console.log(data)
    console.log(yearData)
    console.log(arrayOfYears)
    console.log(years)

    // DropDown for showing all the religions
    d3.select("#dropDown")
        .selectAll('myItems')
        .data(religions)
        .enter()
        .append('option')
        .text(function (d) { return d; }) 
        .attr("value", function (d) { return d; }) 

    wdMap = d3.select('#mapViz').append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
        .attr("d", d3.geoPath()
            .projection(map_type)
        )
        .attr("fill", function (d) {
            d.religion = yearData.get(d.id) || 0;
            return colorScale(d.religion);
        })
        .attr("stroke", "black")
            .attr("stroke-width", "0.5px")
})

//function for making the animation on the screen
function animateMap() {
    d3.select('#mapViz').selectAll('path').transition()
        .duration(1000)
        .attr('fill', function (d) {
            var tempData = data.get(arrayOfYears[currentYear])
            d.religion = tempData.get(d.id) || 0;
            //console.log(d.religion)
            return colorScale(d.religion);
        })
}

//Updating the data for each read
function updateData() {
    relData.forEach(element => {
        year = element.year
        countryName = element.name
        //console.log(currentReligion)
        religion = element[currentReligion]
        if (!data.has(year)) {
            let dEntry = new Map()
            dEntry.set(countryName, religion)
            data.set(year, dEntry)
        }
        else {
            yearEntry = data.get(year)
            yearEntry.set(countryName, religion)
        }
    })
}

//updating the map on screen as the years go by
function updateMap() {
    updateData()
    d3.select('#mapViz').selectAll('path').transition()
        .duration(200)
        .attr('fill', function (d) {
            var tempData = data.get(arrayOfYears[currentYear])
            d.religion = tempData.get(d.id) || 0;
            //console.log(d.religion)
            return colorScale(d.religion);
        })
}

//Function for for making the animation affect loop
function runAnimation() {
    var timeInterval;
    console.log("button clicked")
    if (playing == false) {
        timeInterval = setInterval(function () {
            if (currentYear < arrayOfYears.length - 1) {
                currentYear += 1;
            } else {
                currentYear = 0;
            }
            animateMap();
            d3.select('#clock').html(arrayOfYears[currentYear]);
        }, 750);
        d3.select('#play').html('playing...');
        playing = true;
        console.log(playing)
    } else {
        clearInterval(timeInterval);
        d3.select('#play').html('play');
        playing = false;
    }
}

// selecting the religion from the options in the dropdown menu 
d3.select("#dropDown").on("change", function (event, d) {
    currentReligion = d3.select(this).property("value")
    updateMap(currentReligion)
})