// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 50, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 50, graph_2_height = 275;
let graph_3_width = (MAX_WIDTH / 2) - 50, graph_3_height = 375;
let height = 350;

let svg1 = d3.select("#graph1")
   .append("svg")
   .attr("width", graph_1_width)     // HINT: width
   .attr("height", height)     // HINT: height
   .append("g")
   .attr("transform", 'translate(250, 50)');    // HINT: transform


let svg2 = d3.select("#graph2")
  .append("svg")
  .attr("width", graph_2_width)     // HINT: width
  .attr("height", height)     // HINT: height
  .append("g")
  .attr("transform", 'translate(250, 50)');    // HINT: transform


let svg3 = d3.select("#graph3")
  .append("svg")
  .attr("width", graph_3_width)     // HINT: width
  .attr("height", graph_3_height)     // HINT: height
  .append("g")
  .attr("transform", 'translate(250, 170)');    // HINT: transform

  addGraph1();
  addGraph2(document.getElementById('genreForm').value);
  addGraph3(document.getElementById('regionForm').value);

function addGraph3(region) {
  let tooltip = d3.select("#graph3")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  svg3.selectAll("text").remove();
  const radius = 160
  let g = svg3.append("g");

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var label = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius - 60);

    d3.csv("./data/modified_video_games2.csv").then(function(data) {
         data = cleanRegionData(data, region);
         let color = d3.scaleOrdinal()
             .domain(data.map(function(d) { return d[0] }))
             .range(d3.quantize(d3.interpolateHcl("#FF5733  ", "#800080"), 10));

         let mouseover = function(d) {
         let html = `${d.data[0]}<br/>
                ${d.data[1]} Million </span><br/>`;

         tooltip.html(html)
             .style("left", `${(d3.event.pageX) - 80}px`)
             .style("top", `${(d3.event.pageY) - 460}px`)
             .style("box-shadow", `2px 2px 5px #00FFFF`)    // OPTIONAL for students
             .transition()
             .duration(200)
             .style("opacity", 0.9)
             };

           // Mouseout function to hide the tool on exit
           let mouseout = function(d) {
               // Set opacity back to 0 to hide
               tooltip.transition()
                   .duration(200)
                   .style("opacity", 0);
           };
         const pie = d3.pie(data).value(function(d){return d[1]});
         var arc = g.selectAll(".arc")
                    .data(pie(data))
                    .enter().append("g")
                    .attr("class", "arc");

                    arc.append("path")
                       .attr("d", path)
                       .on("mouseover", mouseover) // HINT: Pass in the mouseover and mouseout functions here
                       .on("mouseout", mouseout)
                       .transition()
                       .duration(400)
                       .attr("fill", function(d) { return color(d.data[0]); });

                    arc.append("text")
                       .attr("transform", function(d) {
                                return "translate(" + label.centroid(d) + ")";
                        })
                      .style("text-anchor", "start")
                       .text(function(d) { return d.data[0]; });
                    });

                    svg3.append("g")
                    .attr("transform", `translate(${(-60)} , ${(-155)})`)
                       .append("text")
                       .text("Popular Genres in Region: " + region)
                       .style("font-size", 15)
                       .attr("class", "title")
};
function addGraph2(genre) {
  let countRef = svg2.append("g");

  svg2.selectAll("rect").remove();
  svg2.selectAll("text").remove();

  d3.csv("./data/modified_video_games2.csv").then(function(data) {
  data = cleanPublisherData(data, genre);
  data = data.slice(0,10)
  let x = d3.scaleLinear()
      .domain([0, d3.max(data.map(function(d){return parseFloat(d[1]) })) ])
      .range([0, (graph_2_width - margin.left - margin.right)]);

  let y = d3.scaleBand()
      .domain(data.map(function(d) {return d[0]}))
      .range([0, height - margin.top - margin.bottom])
      .padding(0.1);  // Improves readability
  svg2.append("g")
      .call(
        d3.axisLeft(y).tickSize(0).tickPadding(10)
      );

  let bars = svg2.selectAll("rect").data(data);

  let color = d3.scaleOrdinal()
      .domain(data.map(function(d) { return d[0] }))
      .range(d3.quantize(d3.interpolateHcl("#00FFFF", "#00FF00"), 10));

  bars.enter()
      .append("rect")
      .merge(bars)
      .transition()
      .duration(400)
      .attr("fill", function(d) { return color(d[0]) }) // Here, we are using functin(d) { ... } to return fill colors based on the data point d
      .attr("x", x(0))
      .attr("y", function(d) { return y(d[0])})// HINT: Use function(d) { return ...; } to apply styles based on the data point (d)
      .attr("width", function(d){return x(d[1])})
      .attr("height",  y.bandwidth());

  let counts = countRef.selectAll("text").data(data);

  // TODO: Render the text elements on the DOM
  counts.enter()
      .append("text")
      .merge(counts)
      .attr("x", function(d){return x(d[1]) + 5})       // HINT: Add a small offset to the right edge of the bar
      .attr("y", function(d){return y(d[0]) + 17})       // HINT: Add a small offset to the top edge of the bar
      .style("text-anchor", "start")
      .text(function(d) { return d[1]});           // HINT: Get the Publisher of the artist

  // TODO: Add x-axis label
  svg2.append("text")
  .attr("transform", `translate(${(graph_2_width - margin.right - margin.left)/2} , ${(height - margin.top - margin.bottom) + 15})`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
      .style("text-anchor", "middle")
      .text("Global Sales(millions)");

  // TODO: Add y-axis label

  svg2.append("text")
      .attr("transform", `translate(${-height/2} , ${(height - margin.top - margin.bottom)/2})`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
      .style("text-anchor", "middle")
      .text("Publisher");

  // TODO: Add chart title
  svg2.append("text")
      .attr("transform", `translate(${(graph_2_width - margin.right - margin.left)/2}, ${-15})`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
      .style("text-anchor", "middle")
      .style("font-size", 15)
      .text("Top Publishers of " + genre);
})};

function addGraph1(data) {
  let countRef = svg1.append("g");
  d3.csv("./data/modified_video_games2.csv").then(function(data) {
    data = cleanData(data, function(a, b) {return b.Global_Sales - a.Global_Sales;});

  data = data.slice(0, 10)
  let x = d3.scaleLinear()
      .domain([0, d3.max(data, function(d){return d.Global_Sales }) ])
      .range([0, (graph_1_width - margin.left - margin.right)]);

  let y = d3.scaleBand()
      .domain(data.map(function(d) {return d.Name}))
      .range([0, height - margin.top - margin.bottom])
      .padding(0.1);  // Improves readability

  svg1.append("g")
      .call(
        d3.axisLeft(y).tickSize(0).tickPadding(10)
      );

  let bars = svg1.selectAll("rect").data(data);

  let color = d3.scaleOrdinal()
      .domain(data.map(function(d) { return d["Name"] }))
      .range(d3.quantize(d3.interpolateHcl("#00FFFF", "#00FF00"), 10));

  bars.enter()
      .append("rect")
      .merge(bars)
      .transition()
      .duration(400)
      .attr("fill", function(d) { return color(d.Name) }) // Here, we are using functin(d) { ... } to return fill colors based on the data point d
      .attr("x", x(0))
      .attr("y", function(d) { return y(d.Name)})             // HINT: Use function(d) { return ...; } to apply styles based on the data point (d)
      .attr("width", function(d){return x(d.Global_Sales)})
      .attr("height",  y.bandwidth());        // HINT: y.bandwidth() makes a reasonable display height

  //
  let counts = countRef.selectAll("text").data(data);

  // TODO: Render the text elements on the DOM
  counts.enter()
      .append("text")
      .merge(counts)
      .attr("x", function(d){return x(d.Global_Sales) + 5})       // HINT: Add a small offset to the right edge of the bar
      .attr("y", function(d){return y(d.Name) + 17})       // HINT: Add a small offset to the top edge of the bar
      .style("text-anchor", "start")
      .text(function(d) { return d.Global_Sales});           // HINT: Get the name of the artist

  // TODO: Add x-axis label
  svg1.append("text")
  .attr("transform", `translate(${(graph_1_width - margin.right - margin.left)/2} , ${(height - margin.top - margin.bottom) + 15})`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
      .style("text-anchor", "middle")
      .text("Global Sales(millions)");

  // TODO: Add y-axis label

  svg1.append("text")
  .attr("transform", `translate(${-height/2} , ${(height - margin.top - margin.bottom)/2})`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
      .style("text-anchor", "middle")
      .text("Name");

  // TODO: Add chart title
  svg1.append("text")
  .attr("transform", `translate(${(graph_1_width - margin.right - margin.left)/2}, ${-15})`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
      .style("text-anchor", "middle")
      .style("font-size", 15)
      .text("Top 10 Video Games of All Time");
})};

function cleanData(data, comparator) {
   // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
   //genres_list = ['Action', 'Adventure', 'Fighting', 'Misc', 'Platform', 'Puzzle', 'Racing', 'Role-Playing', 'Shooter', 'Simulation', 'Sports', 'Strategy']
   data = data.sort(comparator);
   for (let i = 0; i < 10; i++){
     data[i].Global_Sales = parseFloat(data[i].Global_Sales).toFixed(0)
   }
   return data;
}

function cleanPublisherData(data, genre){
  let pub = 'topPublishersfor'+genre
  let sales = 'topPublishersfor'+genre+'Sales'
  newData = []
  for (let i = 0; i < data.length; i++){
    newData.push([data[i][pub], parseFloat(data[i][sales]).toFixed(0)])
  }
  return newData
}

function cleanRegionData(data, region) {
    genres_list = ['Action', 'Adventure', 'Fighting', 'Misc', 'Platform', 'Puzzle', 'Racing', 'Role-Playing', 'Shooter', 'Simulation', 'Sports', 'Strategy']
    const top = 8
    const remainder = (genres_list.length-top)
    let lowRemainderSum = 0
    let pub = 'topGenre'+region
    let sales = 'topGenre'+region+'Sales'
    newData = []
    for (let i = 0; i < genres_list.length; i++){
      if(i <= top){
        newData.push([data[i][pub], parseFloat(data[i][sales]).toFixed(0)])
      }
      else{
        lowRemainderSum += parseFloat(data[i][sales])
      }
    }
  const name = remainder.toString()+ " Others"
  newData.push([name, lowRemainderSum])
  return newData;
}
