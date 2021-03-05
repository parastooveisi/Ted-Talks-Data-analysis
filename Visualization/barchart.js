(function chart1() {
  var svg = d3
      .select("#chart1")
      .append("svg")
      .attr("width", 900)
      .attr("height", 550),
    margin = { top: 20, right: 20, bottom: 50, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);

  var x1 = d3.scaleBand().padding(0.05);

  var y = d3.scaleLinear().rangeRound([height, 0]);

  var z = d3
    .scaleOrdinal()
    .range(["#EFB605", "#991C71", "#C20049", "#2074A0", "#10A66E"]);

  var tip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function (d) {
      console.log(d);
      return (
        "<strong>Name: </strong>" +
        d.key +
        "<br><strong>Value: </strong>" +
        d.value
      );
    });

  svg.call(tip);

  d3.csv(
    "positiveRatings.csv",
    function (d, i, columns) {
      for (var i = 1, n = columns.length; i < n; ++i)
        d[columns[i]] = +d[columns[i]];
      return d;
    },
    function (error, data) {
      if (error) throw error;

      var keys = data.columns.slice(1);

      x0.domain(
        data.map(function (d) {
          return d.State;
        })
      );
      x1.domain(keys).rangeRound([0, x0.bandwidth()]);
      y.domain([
        0,
        d3.max(data, function (d) {
          return d3.max(keys, function (key) {
            return d[key];
          });
        }),
      ]).nice();

      g.append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function (d) {
          return "translate(" + x0(d.State) + ",0)";
        })
        .selectAll("rect")
        .data(function (d) {
          return keys.map(function (key) {
            return { key: key, value: d[key] };
          });
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x1(d.key);
        })
        .attr("y", function (d) {
          return y(d.value);
        })
        .attr("width", x1.bandwidth())
        .attr("height", function (d) {
          return height - y(d.value);
        })
        .attr("fill", function (d) {
          return z(d.key);
        })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

      g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));

      g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", -70)
        .attr("y", y(y.ticks().pop()) - 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .attr("transform", "translate(18, 0) rotate(-90)")
        .text("Ratings");

      var legend = g
        .append("g")
        .attr("font-size", 14)
        .attr("text-anchor", "end")
        .attr("padding-top", 5)
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter()
        .append("g")
        .attr("padding-top", 5)
        .attr("transform", function (d, i) {
          return "translate(0," + i * 20 + ")";
        });

      legend
        .append("rect")
        .attr("padding-top", 5)
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

      legend
        .append("text")
        .attr("font-size", 14)
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function (d) {
          return d;
        });
    }
  );
})();

(function chart2() {
  var svg2 = d3
      .select("#chart2")
      .append("svg")
      .attr("width", 900)
      .attr("height", 550),
    margin = { top: 20, right: 20, bottom: 50, left: 40 },
    width = +svg2.attr("width") - margin.left - margin.right,
    height = +svg2.attr("height") - margin.top - margin.bottom,
    g = svg2
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);

  var x1 = d3.scaleBand().padding(0.05);

  var y = d3.scaleLinear().rangeRound([height, 0]);

  var z = d3
    .scaleOrdinal()
    .range(["#EFB605", "#991C71", "#C20049", "#2074A0", "#10A66E"]);

  var tip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function (d) {
      console.log(d);
      return (
        "<strong>Name:</strong>" +
        d.key +
        "<br><strong>Value:</strong>" +
        d.value
      );
    });

  svg2.call(tip);

  d3.csv(
    "negetiveRatings.csv",
    function (d, i, columns) {
      for (var i = 1, n = columns.length; i < n; ++i)
        d[columns[i]] = +d[columns[i]];
      return d;
    },
    function (error, data) {
      if (error) throw error;

      var keys = data.columns.slice(1);

      x0.domain(
        data.map(function (d) {
          return d.State;
        })
      );
      x1.domain(keys).rangeRound([0, x0.bandwidth()]);
      y.domain([
        0,
        d3.max(data, function (d) {
          return d3.max(keys, function (key) {
            return d[key];
          });
        }),
      ]).nice();

      g.append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function (d) {
          return "translate(" + x0(d.State) + ",0)";
        })
        .selectAll("rect")
        .data(function (d) {
          return keys.map(function (key) {
            return { key: key, value: d[key] };
          });
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x1(d.key);
        })
        .attr("y", function (d) {
          return y(d.value);
        })
        .attr("width", x1.bandwidth())
        .attr("height", function (d) {
          return height - y(d.value);
        })
        .attr("fill", function (d) {
          return z(d.key);
        })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

      g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));

      g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", -70)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .attr("transform", "translate(18, 0) rotate(-90)")
        .text("Ratings");

      var legend = g
        .append("g")
        .attr("font-size", 14)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
          return "translate(0," + i * 20 + ")";
        });

      legend
        .append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

      legend
        .append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function (d) {
          return d;
        });
    }
  );
})();
