function makeResponsive() {
  let svgWidth = 960;
  let svgHeight = 500;

  let margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100,
  };

  let width = svgWidth - margin.left - margin.right;
  let height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  let svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  let chartGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Import Data
  d3.csv("assets/data/data.csv").then(function (povertyData) {
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    povertyData.forEach(function (data) {
      data.age = +data.age;
      data.smokes = +data.smokes;
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
      data.abbr = data.abbr;
      data.income = +data.income;
    });
    // Step 2: Create scale functions
    // ==============================
    let xLinearScale = d3
      .scaleLinear()
      .domain([8.5, d3.max(povertyData, (d) => d.poverty)])
      .range([0, width]);

    let yLinearScale = d3
      .scaleLinear()
      .domain([3.5, d3.max(povertyData, (d) => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    let xAxis = d3.axisBottom(xLinearScale);
    let yAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g").call(yAxis);

    // Step 5: Create Circles
    // ==============================
    let circlesGroup = chartGroup
      .selectAll("circle")
      .data(povertyData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xLinearScale(d.poverty))
      .attr("cy", (d) => yLinearScale(d.healthcare))
      .attr("r", 10)
      .attr("fill", "teal")
      .attr("opacity", ".6")
      .attr("stroke-width", "1")
      .attr("stroke", "teal");

    chartGroup
      .select("g")
      .selectAll("circle")
      .data(povertyData)
      .enter()
      .append("text")
      .text((d) => d.abbr)
      .attr("x", (d) => xLinearScale(d.poverty))
      .attr("y", (d) => yLinearScale(d.healthcare))
      .attr("dy", -395)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "black");

    console.log(povertyData);

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3
      .tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function (d) {
        return `${d.state}<br>In Poverty (%): ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`;
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup
      .on("mouseover", function (data) {
        toolTip.text((d) => d.abbr);
      })
      // onmouseout event
      .on("mouseout", function () {
        toolTip.style("display", "none");
      });

    // Create axes labels

    chartGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 50)
      .attr("x", 0 - 250)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup
      .append("text")
      .attr(
        "transform",
        `translate(${width / 2.5}, ${height + margin.top + 25})`
      )
      .attr("class", "axisText")
      .text("In Poverty (%)");
  });
}

makeResponsive();
