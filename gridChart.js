
//sizing information, including margins so there is space for labels, etc
var Legendwidth = document.getElementById('Legend').clientWidth;
var Legendheight = document.getElementById('Legend').clientHeight;
// console.log(Legendwidth,Legendheight)

//sizing information, including margins so there is space for labels, etc
var Barwidth = document.getElementById('stackedBarchart').clientWidth;
var Barheight = document.getElementById('stackedBarchart').clientHeight;
// console.log(Barwidth,Barheight);

var Barmargin =  { top: 20, right: 150, bottom: 70, left: 20 }
    Barwidth = Barwidth - Barmargin.left - Barmargin.right,
    Barheight = Barheight - Barmargin.top - Barmargin.bottom;
// console.log(Barwidth,Barheight)

var Barsvg = d3.select("#stackedBarchart")
                .append("svg") // the overall space
                .attr("width", Barwidth + Barmargin.left + Barmargin.right)
                .attr("height", Barheight + Barmargin.top + Barmargin.bottom)

Barsvg.append('text')
      .attr("transform", "translate("+ (Barwidth*0.5 + Barmargin.left)  +","+ Barmargin.top*0.9 + ")")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .attr("fill", "#666")
      .text("No. of Investment Deals by Round by Sub-market");

var x = d3.scaleBand()
    .rangeRound([0, Barwidth])
    .padding(0)
    .align(0.1);

var y = d3.scaleBand()
    .rangeRound([0, Barheight])
    .padding(0)
    .align(0.1);

var colorScale = d3.scaleQuantile()
  .range(["#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]);

var stack = d3.stack()
    .offset(d3.stackOffsetExpand);

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// sizing information, including margins so there is space for labels, etc
var HBarwidth = document.getElementById('HorizontalBarchart').clientWidth;
var HBarheight = document.getElementById('HorizontalBarchart').clientHeight;
// console.log(HBarwidth,HBarheight)

var HBarmargin =  { top: 20, right: 30, bottom: 70, left: 30 }
    HBarwidth = HBarwidth - HBarmargin.left - HBarmargin.right,
    HBarheight = HBarheight - HBarmargin.top - HBarmargin.bottom;

var HBarsvg = d3.select("#HorizontalBarchart")
                .append("svg") // the overall space
                .attr("width", HBarwidth + HBarmargin.left + HBarmargin.right)
                .attr("height", HBarheight + HBarmargin.top + HBarmargin.bottom)



var x_horizontal = d3.scaleLinear()
    .range([0, HBarwidth]);

var y_horizontal = d3.scaleBand()
    .rangeRound([0, HBarheight]);

yAxis_horizontal = d3.axisLeft()
                    .scale(y_horizontal);

xAxis_horizontal = d3.axisTop(x_horizontal)

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// sizing information, including margins so there is space for labels, etc
var VBarwidth = document.getElementById('VerticalBarchart').clientWidth;
var VBarheight = document.getElementById('VerticalBarchart').clientHeight;
// console.log(VBarwidth,VBarheight)

var VBarmargin =  { top: 0, right:  150, bottom: 20, left: 20 }
    VBarwidth = VBarwidth - VBarmargin.left - VBarmargin.right,
    VBarheight = VBarheight - VBarmargin.top - VBarmargin.bottom;
// console.log(VBarwidth,VBarheight)


var VBarsvg = d3.select("#VerticalBarchart")
                .append("svg") // the overall space
                .attr("width", VBarwidth + VBarmargin.left + VBarmargin.right)
                .attr("height", VBarheight + VBarmargin.top + VBarmargin.bottom)


var x_vertical = d3.scaleBand()
    .rangeRound([0, VBarwidth]);

var y_vertical = d3.scaleLinear()
    .range([0, VBarheight]);

xAxis_vertical = d3.axisBottom()
                    .scale(x_vertical);

yAxis_vertical = d3.axisRight(y_vertical)

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

var Legendmargin =  { top: 5, right: 0, bottom: 10, left: 0 }
    Legendwidth = Legendwidth - Legendmargin.left - Legendmargin.right,
    Legendheight = Legendheight - Legendmargin.top - Legendmargin.bottom;
// console.log(Legendwidth,Legendheight)

var Legendsvg = d3.select("#Legend")
                .append("svg") // the overall space
                // .attr("transform", "translate(" +  Legendmargin.left + "," + Legendmargin.top + ")")
                .attr("transform", "translate(" + (-Legendwidth/2) + "," + (-Legendheight/4) + ")")
                .attr("width", Legendwidth*1.5 + Legendmargin.left + Legendmargin.right)
                .attr("height", Legendheight*1.5 + Legendmargin.top + Legendmargin.bottom)

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


var gridData;
d3.csv("DataSmallMulti.csv", function(error, data) {
  if (error) throw error;
  // console.log(data)
  // gridData=data.filter(function(d) {return d.dataSeason!="2018 Q3" && d.round!="新三板"})
  gridData=data
  drawGridChart('total')
})

function drawGridChart (year) {

  d3.selectAll(".gridChart").remove();
  d3.selectAll(".hChart").remove();
  d3.selectAll(".vChart").remove();
  d3.selectAll(".Legend").remove();


  var Barmain = Barsvg.append("g")
                .attr("class", "gridChart")
                .attr("transform", "translate(" + Barmargin.left + "," + Barmargin.top + ")");

  var HBarmain = HBarsvg.append("g")
                .attr("class", "hChart")
                .attr("transform", "translate(" + HBarmargin.left + "," + HBarmargin.top + ")");


  HBarmain.append('text')
        .attr("transform", "translate("+ HBarwidth*0.5 +","+ (-HBarmargin.top*0.1) + ")")
        .attr("font-size", "10px")
        .attr("fill", "#666")
        .attr("text-anchor", "middle")
        .text("by Sub-market");


  HBarmain.append("g")
      .attr("class", "axisHis axis--x")
      .attr("id", "xaxisHis_notick")
      .attr("transform", "translate(" + 0 + "," + 0 + ")")
      .call(xAxis_horizontal);

  var VBarmain = VBarsvg.append("g")
                .attr("class", "vChart")
                .attr("transform", "translate(" + VBarmargin.left + "," + VBarmargin.top + ")");


  VBarmain.append('text')
      .attr("font-size", "10px")
      .attr("fill", "#666")
      .attr("text-anchor", "middle")
      .attr("transform", "translate("+ (VBarwidth + VBarmargin.right*0.05) + "," + VBarheight*0.5 + ")rotate(90)")
      .text("by Round");

  VBarmain.append("g")
    .attr("class", "axisHis axis--y")
    .attr("id", "yaxisHis_notick")
    .attr("transform", "translate(" + VBarwidth + "," + 0 + ")")
    .call(yAxis_vertical);


  var Legendmain = Legendsvg.append("g")
                .attr("class", "Legend")
                .attr("transform", "translate(" + Legendmargin.left + "," + Legendmargin.top + ")");



  gridData;
  // console.log(gridData);

  // console.log(year)

  if (year!='total') {
    data=gridData.filter(function(d){return d.year==year})
  } else {
    data=gridData
  }
  
  var roundTrack_values=[]
  var round_keys = ["Seed/Angel", "Pre-A", "A", "B", "C", "D", "E", "Strategic Investment", "Pre-IPO", "Undiscloused", "NEEQ Fund-raising"].reverse()

  // console.log(gridData);
    // data round nest
  var data_round_nest_temp = d3.nest()
    .key(function(d) { return d.round })
    .rollup(function(v) { return v.length})
    .entries(data);

  // console.log(data_round_nest_temp)

  var data_round_nest=[]
  round_keys.forEach (function (d) {
    data_round_nest_temp.forEach (function (v) {
      if (d===v.key) {
        data_round_nest.push({
          "round": v.key,
          "value": v.value
        })
      }
    })
  })

  // console.log(data_round_nest)

  // track sort
  var data_sort = d3.nest()
    .key(function(d) { return d.track })
    .rollup(function(v) { return v.length})
    .entries(data);

  data_sort.sort(function (a,b) {return b.value-a.value})

  var track_keys = [];
  data_sort.forEach(function (d) {
    // d.pattern = [d.round, d.track]
    // if (!round_keys.includes(d.round)) {
    //   round_keys.push(d.round)
    // }
    if (!track_keys.includes(d.key)) {
      track_keys.push(d.key)
    }
  })

  // console.log(round_keys, track_keys)

  round_keys.forEach (function (d) {
    track_keys.forEach (function (v) {
      roundTrack_values.push({
        "round" : d,
        "track": v,
        "value": 0
      })
    })
  })

  // console.log(roundTrack_values)

  data.forEach(function (d) {
    d.pattern = [d.round, d.track]
  })

  // console.log(gridData)

  var data1 = d3.nest()
    .key(function(d) { return d.pattern })
    .rollup(function(v) { return v.length})
    .entries(data);

  // console.log(data1)

  roundTrack_values.forEach (function (d) {
    data1.forEach (function (v) {
      if (d.round === v.key.split(",")[0] && d.track === v.key.split(",")[1]) {
        d.value=v.value
      }
    })
  })

  // console.log(roundTrack_values)

  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////

  // set domain for 3 scale
  x.domain(round_keys);
  y.domain(track_keys);
  // console.log(d3.extent(roundTrack_values,function(d){return d.value}))
  colorScale.domain(d3.extent(roundTrack_values, function(d){return d.value}));

  var serie = Barmain.append("g")
      .attr("class", "gridChart")
      .selectAll("rect")
      .data(roundTrack_values)
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.round); })
      .attr("y", function(d) { return y(d.track);} )
      .attr("height", y.bandwidth() )
      .attr("width", x.bandwidth())
      .attr("fill", function(d) {  
        if (d.value!=0) {
          return colorScale(+d.value);
        } else {
          return "#FFF"
        }
      })
      .attr("stroke", "#666")
      .attr("stroke-width", "0.3px")
      .attr("opacity", 0.8)
      .on("mouseover", mouseOver)
      .on("mousemove", mouseMove)
      .on("mouseout", mouseOut);

  xAxis = d3.axisBottom(x);

  yAxis = d3.axisRight(y)
            .tickValues(track_keys)

  // console.log(track_keys)

  Barmain.append("g")
      .attr("class", "axisBar axis--x")
      .attr("transform", "translate("+ 0 + "," + (Barheight-5) + ")")
      .call(xAxis)
    .selectAll("text")
      .attr("y", 0)
      .attr("dx", "-1em")
      .attr("dy", "2em")
      .attr("transform", "rotate(20)")
      .style("text-anchor", "start");

  Barmain.append("g")
      .attr("class", "axisBar axis--y")
      .attr("transform", "translate(" + (Barwidth-5) + "," + 0 + ")")
      .call(yAxis);

  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////
  function mouseOver(d){

    d3.select(this)
      .attr("stroke-width", "3px");


    tip='<tspan>Sub-market: '+ d.track + '</tspan>'+'<br>'+
    '<tspan>Round: '+ d.round + '</tspan>'+'<br>'+
    '<tspan>No. of Funded Companies: '+ d.value + '</tspan>'+'<br>'

    tooltip
      .style('display', null)
      .html( tip);

  };

  function mouseMove(d){
    tooltip
        .style('top', (d3.event.pageY -15) + "px")
        .style('left', (d3.event.pageX +15) + "px");
  };

  function mouseOut(d){

    d3.select(this)
      .attr("stroke-width", "0.3px");

    tooltip
      .style('display', 'none');
  };

  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////

  // set domain for 3 scale
  // console.log(data_round_nest);
  // console.log(x_vertical.domain())
  
  y_vertical.domain([d3.max(data_round_nest, function (d) {return d.value}), 0]);
  x_vertical.domain(round_keys);

  // console.log(x_vertical.domain())
  // console.log(x_vertical.range())

  var serieVertical = VBarmain.selectAll(".rect")
      .data(data_round_nest)
      .enter()
      .append("rect")
      .attr("x", function(d) { return x_vertical(d.round)+x_vertical.bandwidth()*0.2;})
      .attr("y", function(d) { return y_vertical(d.value);})
      .attr("height", function(d) { return VBarheight - y_vertical(d.value); })
      .attr("width", function(d) { return x_vertical.bandwidth()*0.6;})
      .attr("fill", "lightblue")
      .attr("stroke", "#666")
      .attr("stroke-width", "0.3px")
      .attr("opacity", 0.8);

  // console.log(track_keys);

  VBarmain.append("g")
      .attr("class", "axisHis axis--x")
      .attr("transform", "translate(" + 0 +"," + VBarheight + ")")
      .call(xAxis_vertical)
    .selectAll("text")
      .data(data_round_nest)
      .text(function(d){return d.value});


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// set domain for 3 scale
  // console.log(data_sort)
  x_horizontal.domain([0,d3.max(data_sort, function (d) {return d.value})]);
  // console.log(x_horizontal.domain())
  y_horizontal.domain(track_keys);

  var serieHorizontal = HBarmain.selectAll(".rect")
      .data(data_sort)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", function(d) { return y_horizontal(d.key) + y_horizontal.bandwidth()*0.2;})
      .attr("height", y_horizontal.bandwidth()*0.6 )
      .attr("width", function(d) { return x_horizontal(d.value);})
      .attr("fill", "lightblue")
      .attr("stroke", "#666")
      .attr("stroke-width", "0.3px")
      .attr("opacity", 0.8);

  // console.log(track_keys);

  HBarmain.append("g")
      .attr("class", "axisHis axis--y")
      .attr("transform", "translate(" + 0 +"," + 0 + ")")
      .call(yAxis_horizontal)
      .selectAll("text")
      .data(data_sort)
      .text(function(d){return d.value});


//////////////////////////////////////////////////////////////////////////////////


data_legend=colorScale.range().reverse()

Legendmain.append('g')
          .selectAll(".rect")
          .data(data_legend)
          .enter()
          .append('rect')
          .attr("transform", "translate(" + 0 + "," + 0 + ")")
          .attr("x", function (d,i) {
            ind1 = Math.floor(i/4);
            return ind1*Legendwidth*0.7;
          })
          .attr("y", function (d,i) {
            ind2 = i-Math.floor(i/4)*4; 
            return ind2*Legendheight/3;
          })
          .attr("height", Legendheight/5 )
          .attr("width", Legendheight/5 )
          .attr("fill", function (d) { return d })
          .attr("stroke", "#737373")
          .attr("stroke-width", "0.5px");


Legendmain.append('g')
          .selectAll(".text")
          .data(data_legend)
          .enter()
          .append('text')
          .attr("transform", "translate(" + 0 + "," + 0 + ")")
          .attr("x", function (d,i) {
            ind1 = Math.floor(i/4);
            return ind1*Legendwidth*0.7+Legendheight/4;
          })
          .attr("y", function (d,i) {
            ind2 = i-Math.floor(i/4)*4; 
            return ind2*Legendheight/3+Legendheight/6 ;
          })
          .attr("fill", "#737373")
          .text(function (d,i) { 
            var low = Math.floor(colorScale.invertExtent(d)[0])+1;
            var high = Math.floor(colorScale.invertExtent(d)[1]);
            if (i===7) { low=1 }
            return low + "-" + high })
}



function type(d, i, columns) {
  for (i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}

var formatAsPercentage = d3.format(".1%");




