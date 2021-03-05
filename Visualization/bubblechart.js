//Quick fix for resizing some things for mobile-ish viewers
var mobileScreen = $(window).innerWidth() < 500 ? true : false;

//Scatterplot
var margin = { left: 130, top: 80, right: 50, bottom: 60 },
  width = Math.min($("#chart").width(), 900),
  height = (width * 2) / 3;

var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

var wrapper = svg
  .append("g")
  .attr("class", "chordWrapper")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//////////////////////////////////////////////////////
///////////// Initialize Axes & Scales ///////////////
//////////////////////////////////////////////////////

var opacityCircles = 0.8;
maxDistanceFromPoint = 50;
//Set the color for each Speaker
var color = d3
  .scaleOrdinal()
  .range(["#EFB605", "#991C71", "#C20049", "#2074A0", "#10A66E"])
  .domain([
    "Hans Rosling",
    "Juan Enriquez",
    "Rives",
    "Marco Tempest",
    "Clay Shirky",
  ]);

//Set the new x axis range
var xScale = d3.scaleLinear().range([0, width]).domain([2005, 2018]);

//Set new x-axis
var xAxis = d3.axisBottom().ticks(10).tickFormat(d3.format("")).scale(xScale);
//Append the x-axis
wrapper
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(" + 0 + "," + height + ")")
  .call(xAxis);

//Set the new y axis range
var yScale = d3
  .scaleLinear()
  .range([height, 0])
  .domain(
    d3.extent(speakers, function (d) {
      return d.views;
    })
  )
  .nice();
var yAxis = d3
  .axisLeft()
  .ticks(6) //Set rough # of ticks
  .scale(yScale)
  .tickFormat(function (d) {
    return parseInt(d / 1000000) + "M";
  });
//Append the y-axis
wrapper
  .append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(" + 0 + "," + 0 + ")")
  .call(yAxis);

//Scale for the bubble size
var rScale = d3
  .scaleSqrt()
  .range([mobileScreen ? 3 : 4, mobileScreen ? 10 : 30])
  .domain(
    d3.extent(speakers, function (d) {
      return d.Duration;
    })
  );

//////////////////////////////////////////////////////
///////////////// Initialize Labels //////////////////
//////////////////////////////////////////////////////

//Set up X axis label
wrapper
  .append("g")
  .append("text")
  .attr("class", "x title")
  .attr("text-anchor", "end")
  .style("font-size", (mobileScreen ? 8 : 14) + "px")
  .attr("transform", "translate(" + width + "," + (height + 50) + ")")
  .text("Published Year");

//Set up y axis label
wrapper
  .append("g")
  .append("text")
  .attr("class", "y title")
  .attr("text-anchor", "end")
  .style("font-size", (mobileScreen ? 8 : 14) + "px")
  .attr("transform", "translate(18, 0) rotate(-90)")
  .text("Views");
//////////////////////////////////////////////////////////////
//////////////////// Set-up voronoi //////////////////////////
//////////////////////////////////////////////////////////////

//Initiate the voronoi function
//Use the same variables of the data in the .x and .y as used in the cx and cy of the circle call
//The clip extent will make the boundaries end nicely along the chart area instead of splitting up the entire SVG
//(if you do not do this it would mean that you already see a tooltip when your mouse is still in the axis area, which is confusing)
var voronoi = d3
  .voronoi()
  .x(function (d) {
    return xScale(d.published_year);
  })
  .y(function (d) {
    return yScale(d.views);
  })
  .extent([
    [0, 0],
    [width, height],
  ]);

var voronoiCells = voronoi.polygons(speakers);

////////////////////////////////////////////////////////////
///////////// Circles to capture close mouse event /////////
////////////////////////////////////////////////////////////

//Create wrapper for the voronoi clip paths
var clipWrapper = wrapper.append("defs").attr("class", "clipWrapper");

clipWrapper
  .selectAll(".clip")
  .data(voronoiCells)
  .enter()
  .append("clipPath")
  .attr("class", "clip")
  .attr("id", function (d) {
    console.log(d);
    return "clip-" + d.data.CountryCode;
  })
  .append("path")
  .attr("class", "clip-path-circle")
  .attr("d", function (d) {
    return "M" + d.join(",") + "Z";
  });

//Initiate a group element for the circles
var circleClipGroup = wrapper.append("g").attr("class", "circleClipWrapper");

//Place the larger circles to eventually capture the mouse
var circlesOuter = circleClipGroup
  .selectAll(".circle-wrapper")
  .data(
    speakers.sort(function (a, b) {
      return b.Duration > a.Duration;
    })
  )
  .enter()
  .append("circle")
  .attr("class", function (d, i) {
    return "circle-wrapper " + d.CountryCode;
  })
  .attr("clip-path", function (d) {
    return "url(#clip-" + d.CountryCode + ")";
  })
  .style("clip-path", function (d) {
    return "url(#clip-" + d.CountryCode + ")";
  })
  .attr("cx", function (d) {
    return xScale(d.published_year);
  })
  .attr("cy", function (d) {
    return yScale(d.views);
  })
  .on("mouseover", showTooltip)
  .on("mouseout", removeTooltip);

////////////////////////////////////////////////////////////
/////////////////// Scatterplot Circles ////////////////////
////////////////////////////////////////////////////////////

//Initiate a group element for the circles
var circleGroup = wrapper.append("g").attr("class", "circleWrapper");

//Place the country circles
circleGroup
  .selectAll("speakers")
  .data(
    speakers.sort(function (a, b) {
      return b.Duration > a.Duration;
    })
  ) //Sort so the biggest circles are below
  .enter()
  .append("circle")
  .attr("class", function (d, i) {
    return "speakers " + d.CountryCode;
  })
  .style("opacity", opacityCircles)
  .style("fill", function (d) {
    return color(d.Speaker);
  })
  .attr("cx", function (d) {
    return xScale(d.published_year);
  })
  .attr("cy", function (d) {
    return yScale(d.views);
  })
  .attr("r", function (d) {
    return rScale(d.Duration);
  })
  .on("mouseover", showTooltip)
  .on("mouseout", removeTooltip);

///////////////////////////////////////////////////////////////////////////
///////////////////////// Create the Legend////////////////////////////////
///////////////////////////////////////////////////////////////////////////

if (!mobileScreen) {
  //Legend
  var legendMargin = { left: 20, top: 120, right: 20, bottom: 10 },
    legendWidth = 500,
    legendHeight = 270;

  var svgLegend = d3
    .select("#legend")
    .append("svg")
    .attr("width", legendWidth + legendMargin.left + legendMargin.right)
    .attr("height", legendHeight + legendMargin.top + legendMargin.bottom);

  var legendWrapper = svgLegend
    .append("g")
    .attr("class", "legendWrapper")
    .attr("text-anchor", "end")

    .attr(
      "transform",
      "translate(" + legendMargin.left + "," + legendMargin.top + ")"
    );

  var rectSize = 19, //dimensions of the colored square
    rowHeight = 20, //height of a row in the legend
    maxWidth = 144; //widht of each row

  //Create container per rect/text pair
  var legend = legendWrapper
    .selectAll(".legendSquare")
    .data(color.range())
    .enter()
    .append("g")
    .attr("class", "legendSquare")
    .attr("transform", function (d, i) {
      return "translate(" + 0 + "," + i * rowHeight + ")";
    })
    .style("cursor", "pointer")
    .on("mouseover", selectLegend(0.02))
    .on("mouseout", selectLegend(opacityCircles))
    .on("click", clickLegend);

  //Non visible white rectangle behind square and text for better hover
  legend
    .append("rect")
    .attr("width", maxWidth)
    .attr("height", rowHeight)
    .style("fill", "transparent");
  //Append small squares to Legend
  legend
    .append("rect")
    .attr("x", 10)
    .attr("y", -9.5)
    .attr("width", rectSize)
    .attr("height", rectSize)
    .style("fill", function (d) {
      return d;
    });
  //Append text to Legend
  legend
    .append("text")
    .attr("x", 35)
    .attr("y", 0)
    .attr("class", "legendText")
    .style("font-size", "14px")
    .attr("dy", ".35em")
    .text(function (d, i) {
      return color.domain()[i];
    });
} //if !mobileScreen
else {
  d3.select("#legend").style("display", "none");
}

///////////////////////////////////////////////////////////////////////////
//////////////////// Hover function for the legend ////////////////////////
///////////////////////////////////////////////////////////////////////////

//Decrease opacity of non selected circles when hovering in the legend
function selectLegend(opacity) {
  return function (d, i) {
    var chosen = color.domain()[i];

    wrapper
      .selectAll(".speakers")
      .filter(function (d) {
        return d.Speaker != chosen;
      })
      .transition()
      .style("opacity", opacity);
  };
} //function selectLegendx

///////////////////////////////////////////////////////////////////////////
///////////////////// Click functions for legend //////////////////////////
///////////////////////////////////////////////////////////////////////////

//Function to show only the circles for the clicked sector in the legend
function clickLegend(d, i) {
  event.stopPropagation();

  //deactivate the mouse over and mouse out events
  d3.selectAll(".legendSquare").on("mouseover", null).on("mouseout", null);

  //Chosen legend item
  var chosen = color.domain()[i];

  //Only show the circles of the chosen sector
  wrapper
    .selectAll(".speakers")
    .style("opacity", opacityCircles)
    .style("visibility", function (d) {
      if (d.Speaker != chosen) return "hidden";
      else return "visible";
    });

  //Make sure the pop-ups are only shown for the clicked on legend item
  wrapper
    .selectAll(".voronoi")
    .on("mouseover", function (d, i) {
      if (d.Speaker != chosen) return null;
      else return showTooltip.call(this, d, i);
    })
    .on("mouseout", function (d, i) {
      if (d.Speaker != chosen) return null;
      else return removeTooltip.call(this, d, i);
    });
} //sectorClick

//Show all the cirkels again when clicked outside legend
function resetClick() {
  //Activate the mouse over and mouse out events of the legend
  d3.selectAll(".legendSquare")
    .on("mouseover", selectLegend(0.02))
    .on("mouseout", selectLegend(opacityCircles));

  //Show all circles
  wrapper
    .selectAll(".speakers")
    .style("opacity", opacityCircles)
    .style("visibility", "visible");

  //Activate all pop-over events
  wrapper
    .selectAll(".voronoi")
    .on("mouseover", showTooltip)
    .on("mouseout", function (d, i) {
      removeTooltip.call(this, d, i);
    });
} //resetClick

//Reset the click event when the user clicks anywhere but the legend
d3.select("body").on("click", resetClick);

///////////////////////////////////////////////////////////////////////////
/////////////////// Hover functions of the circles ////////////////////////
///////////////////////////////////////////////////////////////////////////

//Hide the tooltip when the mouse moves away
function removeTooltip(d, i) {
  //Save the chosen circle (so not the voronoi)
  var element = d3
    .select(".speakers." + d.CountryCode)
    .transition()
    .duration(200);

  //Fade out the bubble again
  element.style("opacity", opacityCircles).style("stroke-width", 1);

  //Hide tooltip
  $(".popover").each(function () {
    $(this).remove();
  });

  //Fade out guide lines, then remove them
  d3.selectAll(".guide")
    .transition()
    .duration(200)
    .style("opacity", 0)
    .remove();
} //function removeTooltip

//Show the tooltip on the hovered over slice
function showTooltip(d, i) {
  //Save the chosen circle (so not the voronoi)
  var element = d3.select(".speakers." + d.CountryCode),
    el = element._groups[0];

  //Define and show the tooltip
  $(el).popover({
    placement: "auto top",
    container: "#chart",
    trigger: "manual",
    html: true,
    content: function () {
      return (
        "<span style='font-size: 12px; text-align: center;'>" +
        "<span>" +
        "Title: " +
        "</span>" +
        d.Title +
        "\n" +
        "<span>" +
        "Speaker: " +
        "</span>" +
        d.Speaker +
        "\n" +
        "<span>" +
        "Duration: " +
        "</span>" +
        Math.round(d.Duration) +
        "min" +
        "\n" +
        "</span>"
      );
    },
  });
  $(el).popover("show");

  //Make chosen circle more visible
  element.style("opacity", 1).style("stroke-width", 6);

  //Place and show tooltip
  var x = +element.attr("cx"),
    y = +element.attr("cy"),
    color = element.style("fill");

  //Append lines to bubbles that will be used to show the precise data points

  //vertical line
  wrapper
    .append("line")
    .attr("class", "guide")
    .attr("x1", x)
    .attr("x2", x)
    .attr("y1", y)
    .attr("y2", height)
    .style("stroke", color)
    .style("opacity", 0)
    .transition()
    .duration(200)
    .style("opacity", 0.6);

  //horizontal line
  wrapper
    .append("line")
    .attr("class", "guide")
    .attr("x1", x)
    .attr("x2", -40)
    .attr("y1", y)
    .attr("y2", y)
    .style("stroke", color)
    .style("opacity", 0)
    .transition()
    .duration(200)
    .style("opacity", 0.6);
  //Value on the axis
  wrapper
    .append("text")
    .attr("class", "guide")
    .attr("x", -45)
    .attr("y", y)
    .attr("dy", "0.35em")
    .style("fill", color)
    .style("opacity", 0)
    .style("text-anchor", "end")
    .text(d.views)
    .transition()
    .duration(200)
    .style("opacity", 0.6);
} //function showTooltip
