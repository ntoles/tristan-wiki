// 2d plots varying tiles
{
  let ppc = 16;
  let ncells = 1e6;
  let nprts = ppc * ncells;

  let sizex = 400;
  let sizey = 250;

  d3.text('data/perf/vartiles2d').then(function(text) {
    let data = d3.csvParseRows(text, function(d) {
        return d.map(Number);
      });
    // plot #1
    {
      // swap 1 <-> 0 for this data
      let x_data = data.map(e => e[1]);
      let y_data = data.map(e => e[0]);

      // transform data
      let transformX = function(x) {
        return x * x;
      }
      let transformY = function(y) {
        return y / 1e3;
      }

      let dataset = [];
      for (let i = 0; i < x_data.length; ++i) {
        dataset.push([transformX(x_data[i]), transformY(y_data[i])])
      }

      // let xmin = d3.min(dataset, d => d[0])
      // let xmax = d3.max(dataset, d => d[0])
      // let ymin = d3.min(dataset, d => d[1])
      // let ymax = d3.max(dataset, d => d[1])
      let ymin = -0.01;
      let ymax = 1.7*1.05;
      let xmin = 4**2;
      let xmax = 560**2;

      // dimensions
      let margin = {top: 10, right: 30, bottom: 40, left: 50};
      let width = sizex - margin.left - margin.right;
      let height = sizey - margin.top - margin.bottom;

      // set scalings
      xScaling = d3.scaleLog()
          .domain([xmin, xmax])
          .range([0, width]);
      yScaling = d3.scaleLinear()
          .domain([ymin, ymax])
          .range([height, 0]);

      // draw
      // figure
      var svg = d3.select("#vartiles2d-1")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      // xaxis
      let xlabels = dataset.map(e => e[0]).sort()
      const xAxis = d3.axisBottom(xScaling)
                            .tickSize(-height)
                            .tickValues(xlabels)
                            .tickFormat(function(d) {
                              return Math.sqrt(d) + "²";
                            });

      svg.append('g')
          .style("font", "14px 'DecimaMonoPro',monospace")
          .attr('class', 'x axis-grid')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);
      const yAxis = d3.axisLeft(yScaling)
                            .tickSize(-width).ticks(10);
      svg.append('g')
          .style("font", "14px 'DecimaMonoPro',monospace")
          .attr('class', 'y axis-grid')
          .call(yAxis);

      svg.append("text")
          .style("font", "14px 'DecimaMonoPro',monospace")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("move step [sec]");

      svg.append("text")
          .style("font", "14px 'DecimaMonoPro',monospace")
          .attr("transform",
                "translate(" + (width/2) + " ," +
                               (height + margin.top + 20) + ")")
          .style("text-anchor", "middle")
          .text("tile size");

      svg.selectAll(".dot")
          .data(dataset)
        .enter().append("circle") // Uses the enter().append() method
          .attr("class", "dot") // Assign a class for styling
          .attr("cx", function(d) { return xScaling(d[0]) })
          .attr("cy", function(d) { return yScaling(d[1]) })
          .attr("r", 3)
          .style("fill", MPL_COLOR_1);
    }

    // plot #2
    {
      // swap 1 <-> 0 for this data
      let x_data = data.map(e => e[1]);
      let y_data = data.map(e => e[0]);

      // transform data
      let transformX = function(x) {
        return x * x * ppc;
      }
      let transformY = function(y) {
        return y * 1e6 / nprts;
      }

      let dataset = [];
      for (let i = 0; i < x_data.length; ++i) {
        dataset.push([transformX(x_data[i]), transformY(y_data[i])])
      }

      // let xmin = d3.min(dataset, d => d[0])
      // let xmax = d3.max(dataset, d => d[0])
      // let ymin = d3.min(dataset, d => d[1])
      // let ymax = d3.max(dataset, d => d[1])
      let ymin = -1;
      let ymax = 110*1.1;
      let xmin = 2e2;
      let xmax = 5e6*1.1;

      // dimensions
      let margin = {top: 10, right: 30, bottom: 40, left: 50};
      let width = sizex - margin.left - margin.right;
      let height = sizey - margin.top - margin.bottom;

      // set scalings
      xScaling = d3.scaleLog()
          .domain([xmin, xmax])
          .range([0, width]);
      yScaling = d3.scaleLinear()
          .domain([ymin, ymax])
          .range([height, 0]);

      // draw
      // figure
      var svg = d3.select("#vartiles2d-2")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      // xaxis
      const xAxis = d3.axisBottom(xScaling)
                            .tickSize(-height)
                            .ticks(5, sciTickFrmt);
      svg.append('g')
          .style("font", "14px 'DecimaMonoPro',monospace")
          .attr('class', 'x axis-grid')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);
      const yAxis = d3.axisLeft(yScaling)
                            .tickSize(-width).ticks(10);
      svg.append('g')
          .style("font", "14px 'DecimaMonoPro',monospace")
          .attr('class', 'y axis-grid')
          .call(yAxis);

      svg.append("text")
          .style("font", "14px 'DecimaMonoPro',monospace")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("time per particle push [ns]");

      svg.append("text")
          .style("font", "14px 'DecimaMonoPro',monospace")
          .attr("transform",
                "translate(" + (width/2) + " ," +
                               (height + margin.top + 20) + ")")
          .style("text-anchor", "middle")
          .text("particles per tile");

      svg.selectAll(".dot")
          .data(dataset)
        .enter().append("circle") // Uses the enter().append() method
          .attr("class", "dot") // Assign a class for styling
          .attr("cx", function(d) { return xScaling(d[0]) })
          .attr("cy", function(d) { return yScaling(d[1]) })
          .attr("r", 3)
          .style("fill", MPL_COLOR_2)
    }
  });
}

// 2d plots varying ppc
{
  let ts = 20;
  let ncells = 1e6;

  let sizex = 400;
  let sizey = 250;

  d3.text('data/perf/varppc2d').then(function(text) {
    let data = d3.csvParseRows(text, function(d) {
        return d.map(Number);
      });
    // plot #1
    {
      // swap 1 <-> 0 for this data
      let x_data = data.map(e => e[1]);
      let y_data = data.map(e => e[0]);

      // transform data
      let transformX = function(x) {
        return x;
      }
      let transformY = function(y) {
        return y / 1e3;
      }

      let dataset = [];
      for (let i = 0; i < x_data.length; ++i) {
        dataset.push([transformX(x_data[i]), transformY(y_data[i])])
      }

      // let xmin = d3.min(dataset, d => d[0])
      // let xmax = d3.max(dataset, d => d[0])
      // let ymin = d3.min(dataset, d => d[1])
      // let ymax = d3.max(dataset, d => d[1])
      let ymin = -0.01;
      let ymax = 1.45;
      let xmin = -0.01;
      let xmax = 64.5;

      // dimensions
      let margin = {top: 10, right: 30, bottom: 40, left: 50};
      let width = sizex - margin.left - margin.right;
      let height = sizey - margin.top - margin.bottom;

      // set scalings
      xScaling = d3.scaleLinear()
          .domain([xmin, xmax])
          .range([0, width]);
      yScaling = d3.scaleLinear()
          .domain([ymin, ymax])
          .range([height, 0]);

      // draw
      // figure
      var svg = d3.select("#varppc2d-1")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      // xaxis
      const xAxis = d3.axisBottom(xScaling)
                            .tickSize(-height)
                            .ticks(10);

      svg.append('g')
          .style("font", "14px 'DecimaMonoPro',monospace")
          .attr('class', 'x axis-grid')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);
      const yAxis = d3.axisLeft(yScaling)
                            .tickSize(-width).ticks(10);
      svg.append('g')
          .style("font", "14px 'DecimaMonoPro',monospace")
          .attr('class', 'y axis-grid')
          .call(yAxis);

      svg.append("text")
          .style("font", "14px 'DecimaMonoPro',monospace")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("move step [sec]");

      svg.append("text")
          .style("font", "14px 'DecimaMonoPro',monospace")
          .attr("transform",
                "translate(" + (width/2) + " ," +
                               (height + margin.top + 20) + ")")
          .style("text-anchor", "middle")
          .text("particles per cell");

    let coeff;
    {
      let c = [];
      for (let i = 0; i < dataset.length; ++i) {
        c.push(dataset[i][1] / dataset[i][0]);
      }
      coeff = d3.mean(c);
    }

    svg.append("line")
          .style("stroke-dasharray", "3, 3")
          .style("stroke", "gray")
          .attr("x1", xScaling(0.25))
          .attr("y1", yScaling(coeff * 0.25))
          .attr("x2", xScaling(65))
          .attr("y2", yScaling(coeff * 65));

      svg.selectAll(".dot")
          .data(dataset)
        .enter().append("circle") // Uses the enter().append() method
          .attr("class", "dot") // Assign a class for styling
          .attr("cx", function(d) { return xScaling(d[0]) })
          .attr("cy", function(d) { return yScaling(d[1]) })
          .attr("r", 3)
          .style("fill", MPL_COLOR_3);
    }

    // plot #2
    {
      // swap 1 <-> 0 for this data
      let x_data = data.map(e => e[1]);
      let y_data = data.map(e => e[0]);

      // transform data
      let transform = function(x, y) {
        return [x * ts * ts, y * 1e9 / (1e3 * x * ncells)];
      }
      let dataset = [];
      for (let i = 0; i < x_data.length; ++i) {
        [x, y] = transform(x_data[i], y_data[i]);
        dataset.push([x, y]);
      }

      // let xmin = d3.min(dataset, d => d[0])
      // let xmax = d3.max(dataset, d => d[0])
      // let ymin = d3.min(dataset, d => d[1])
      // let ymax = d3.max(dataset, d => d[1])
      let ymin = -1;
      let ymax = 94;
      let xmin = 80;
      let xmax = 3e4*1.1;

      // dimensions
      let margin = {top: 10, right: 30, bottom: 40, left: 50};
      let width = sizex - margin.left - margin.right;
      let height = sizey - margin.top - margin.bottom;

      // set scalings
      xScaling = d3.scaleLog()
          .domain([xmin, xmax])
          .range([0, width]);
      yScaling = d3.scaleLinear()
          .domain([ymin, ymax])
          .range([height, 0]);

      // draw
      // figure
      var svg = d3.select("#varppc2d-2")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      // xaxis
      const xAxis = d3.axisBottom(xScaling)
                            .tickSize(-height)
                            .ticks(3, sciTickFrmt);

      svg.append('g')
          .style("font", "14px 'DecimaMonoPro',monospace")
          .attr('class', 'x axis-grid')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);
      const yAxis = d3.axisLeft(yScaling)
                            .tickSize(-width).ticks(10);
      svg.append('g')
          .style("font", "14px 'DecimaMonoPro',monospace")
          .attr('class', 'y axis-grid')
          .call(yAxis);

      svg.append("text")
          .style("font", "14px 'DecimaMonoPro',monospace")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("time per particle push [ns]");

      svg.append("text")
          .style("font", "14px 'DecimaMonoPro',monospace")
          .attr("transform",
                "translate(" + (width/2) + " ," +
                               (height + margin.top + 20) + ")")
          .style("text-anchor", "middle")
          .text("particles per tile");

      let coeff = d3.mean(dataset, d => d[1]);
      svg.append("line")
            .style("stroke-dasharray", "3, 3")
            .style("stroke", "gray")
            .attr("x1", xScaling(xmin))
            .attr("y1", yScaling(coeff))
            .attr("x2", xScaling(xmax))
            .attr("y2", yScaling(coeff));

      svg.selectAll(".dot")
          .data(dataset)
        .enter().append("circle") // Uses the enter().append() method
          .attr("class", "dot") // Assign a class for styling
          .attr("cx", function(d) { return xScaling(d[0]) })
          .attr("cy", function(d) { return yScaling(d[1]) })
          .attr("r", 3)
          .style("fill", MPL_COLOR_4);
    }
  });
}
