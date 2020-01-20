let optData = [['no vec', .66e3], ['vec', .33e3], ['vec + 1d ind', .21e3]];

{
  let sizex = 400,
      sizey = 250;

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 50, left: 120},
      width = sizex - margin.left - margin.right,
      height = sizey - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#opt2d")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  // x
  var scalex = d3.scaleLinear()
    .domain([0, 800])
    .range([ 0, width]);
  svg.append("g")
    .style("font", "12px 'DecimaMonoPro',monospace")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(scalex))
    .selectAll("text")
      // .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // y
  var scaley = d3.scaleBand()
    .range([ 0, height ])
    .domain(optData.map(e => e[0]))
    .padding(.1);

  optData.forEach(function(d) {
    svg.append("rect")
      .attr("x", scalex(0))
      .attr("y", scaley(d[0]))
      .attr("width", scalex(d[1]))
      .attr("height", scaley.bandwidth())
      .attr("fill", "#69b3a2");
  });
  svg.append("g")
    .style("font", "12px 'DecimaMonoPro',monospace")
    .call(d3.axisLeft(scaley));

  svg.append("text")
      .style("font", "14px 'DecimaMonoPro',monospace")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("move step [ms]");
}
