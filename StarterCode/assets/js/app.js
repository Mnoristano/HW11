// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};
console.log("this ran")
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv")
  .then(function(incomeData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    incomeData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare
      data.abbr = data.abbr;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(incomeData, d => d.poverty) - 2, d3.max(incomeData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(incomeData, d => d.healthcare) -1 , d3.max(incomeData, d => d.healthcare)+ 2])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================

    var circlesGroup = chartGroup.selectAll("circle")
    .data(incomeData)
    .enter()


   circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "lightsteelblue")
    .attr("opacity", ".9"); 

    
    var circles =  circlesGroup.append("text").text(function(d){
      return d.abbr
    }
    ).attr('dx', d => xLinearScale(d.poverty-.18)).attr('dy', d => yLinearScale(d.healthcare-.18)).attr('fill','white')


    // var labels = chartGroup.selectAll('text')
    // .data(incomeData)
    // .enter()
    // .append('text')
    // .attr('dx',d => xLinearScale(d.poverty))
    // .attr('dy',d => yLinearScale(d.healthcare))
    // .text(function(d){console.log(d.abbr)
    //   return d.abbr});
    
    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .style("background",'gray')
      .style('color','white')
      .style('border', '10px')
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>% in Poverty: ${d.poverty}<br>% that lack Healthcare: ${d.healthcare}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circles.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
        // Create axes labels
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("In Poverty (%)");
  
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");
    });
  