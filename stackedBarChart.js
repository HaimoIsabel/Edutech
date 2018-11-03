////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var Awidth = document.getElementById('areaChart').clientWidth*0.95;
var Aheight = document.getElementById('areaChart').clientHeight;

// console.log(Awidth,Aheight)

var Amargin = {top: 20, right: 300, bottom: 30, left: 50},
    Awidth = Awidth - Amargin.left - Amargin.right,
    Aheight = Aheight - Amargin.top - Amargin.bottom;

var svg = d3.select("#areaChart")
    .append('svg')
    .attr('width', Awidth + Amargin.left + Amargin.right)
    .attr('height', Aheight + Amargin.top + Amargin.bottom);

var Ax = d3.scaleBand()
          .rangeRound([0, Awidth])
          .padding(0.2),
    Ay = d3.scaleLinear().range([Aheight, 0]),
    Az = d3.scaleOrdinal()
          .range(["#019ad6","#90d7eb","#b3ec44","#32df8c","#f05b71","#fab3af","#ae4f39","#ff781d","#ffbe78","#ce74b8","#8552a1"]);
          // .range(["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#b15928"]);
          // .range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]);

var keysLegend = ["K12","Vocational Edu.","Language Learning","Enrichment Programs","Early Childhood Edu.","SaaS & Informatization","STEM","Study Abroad Services","Higher Edu.","Paid Knowledge","Others"];

var LegendData = [{key: "K12", value: "#019ad6"}
,{key: "Vocational Edu.", value: "#90d7eb"}
,{key: "Language Learning", value: "#b3ec44"}
,{key: "Enrichment Programs", value: "#32df8c"}
,{key: "Early Childhood Edu.", value: "#f05b71"}
,{key: "SaaS & Informatization", value: "#fab3af"}
,{key: "STEM", value: "#ae4f39"}
,{key: "Study Abroad Services", value: "#ff781d"}
,{key: "Higher Edu.", value: "#ffbe78"}
,{key: "Paid Knowledge", value: "#ce74b8"}
,{key:"Others", value: "#8552a1"}];


var stack = d3.stack();

var area = d3.area()
    .x(function(d, i) { return Ax(d.data.date); })
    .y0(function(d) { return Ay(d[0]); })
    .y1(function(d) { return Ay(d[1]); });

  // Legend

  serieLegend = svg.append("g")
              .attr("class","legend")
              .attr("transform", "translate(" + (Awidth+Amargin.left+Amargin.right*0.1) + "," + Amargin.top + ")");

  // console.log(keysLegend)

  serieLegend.selectAll("text")
      .data(LegendData)
      .enter()
      .append("text")
      // .attr("class", "legendText")
      .attr("class", function(d,i) { return "legendText-"+i; })
      .attr("x", Amargin.right*0.05 + Awidth/20 + 15)
      .attr("y", function (d,i) { return Aheight/11*(10-i)+ Aheight/60}) 
      .attr("dy", ".35em")
      .style("font", "10px sans-serif")
      .style("text-anchor", "start")
      .style("fill", "#000")
      .text(function(d) { return d.key;})
      .on("click", click);
      
  serieLegend.selectAll("rect")
      .data(LegendData)
      .enter()
      .append("rect")
      .attr("class", function(d,i) { return "legendRect-"+i; })
      .attr("x", Amargin.right*0.05 + Awidth/20)
      .attr("y", function (d,i) { return Aheight/11*(10-i) }) 
      .attr("height", Aheight/30)
      .attr("width", Aheight/30)
      .attr("stroke", "#4e4e4e")
      .attr("stroke-width", "0px")
      .attr("opacity", 0.6)
      .attr("fill", function(d) { return Az(d.key);})
      .on("click", click);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var Lwidth = document.getElementById('lineChart').clientWidth*0.95;
var Lheight = document.getElementById('lineChart').clientHeight;

// console.log(Lwidth,Lheight)

var Lmargin = {top: 40, right: 300, bottom: 30, left: 50},
    Lwidth = Lwidth - Lmargin.left - Lmargin.right,
    Lheight = Lheight - Lmargin.top - Lmargin.bottom;

var lineSvg = d3.select("#lineChart")
    .append('svg')
    .attr('width', Lwidth + Lmargin.left + Lmargin.right)
    .attr('height', Lheight + Lmargin.top + Lmargin.bottom);

// console.log(Lwidth,Lheight)
var Lx = d3.scaleLinear()
          .range([0, Lwidth]),
    Ly = d3.scaleLinear()
          .range([Lheight, 0]),
    Ly_rect = d3.scaleLinear()
          .range([Lheight, 0]);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var visData;

d3.csv("DataByTrackBySeason.csv", type, function(error, data) {

  if (error) throw error;
  visData=data;

  drawBarChart("total","round") 
  drawLineChart("total","round")
});

var per_serieBar;
var per_indBar;
function drawBarChart(serie,ind) {

    var keys = ["K12","Vocational Edu.","Language Learning","Enrichment Programs","Early Childhood Edu.","SaaS & Informatization","STEM","Study Abroad Services","Higher Edu.","Paid Knowledge","Others"];

    if (serie==per_serieBar) {
      serie="total"
      per_serieBar=serie
    } else if (serie===0) {
      serie=pre_serie;
    } else {
      per_serieBar=serie
    }

    if (ind==undefined) {
      ind=per_indBar
    } else {
      per_indBar=ind
    }

  //reordering keys

  if (serie!="total") {

    var index = keys.indexOf(serie);
    if (index > -1) {
      keys.splice(index, 1);
    }

    keys.unshift(serie);
    stack.keys(keys);
  } else {
    stack.keys(keysLegend);
  }

  data=visData.filter(function(d) {return d.tab==ind && d.type=="perc"})

  var date_keys = data.map(function(d) { return d.date;})// 
  Ax.domain(date_keys);
  Az.domain(keysLegend);


  d3.selectAll(".serie").remove();

  var g = svg.append("g")
      .attr("class", "serie")
      .attr("transform", "translate(" + (Amargin.left+0.5*Ax.bandwidth()) + "," + Amargin.top + ")");

  var serieBar = g.selectAll(".serie")
      .data(stack(data))
      .enter().append("g")
      .attr("class", "serie-stack")
      .attr("id", function(d,i) { return "serie-"+i; })
      .attr("fill", function(d) { return Az(d.key); })
      .on("click", click);

  serieBar.selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
      .attr("x", function(d) { return Ax(d.data.date) + Ax.bandwidth()*0.2; })
      .attr("y", function(d) { return Ay(d[1]); })
      .attr("height", function(d) { return Ay(d[0]) - Ay(d[1]); })
      .attr("width", Ax.bandwidth()*0.6)
      .attr("stroke", "#4e4e4e")
      .attr("stroke-width", "0px")
      .attr("opacity", 0.6);

  serieBar.selectAll("text")
      .data(function(d) { return d; })
      .enter().append("text")
      .attr("class", "barLabel")
      .attr("x", function(d) { return Ax(d.data.date)+Ax.bandwidth()*0.5; })
      .attr("y", function(d) { return Ay(d[1]) - 5; })
      .text(function(d) { return parsePercent(d[1] - d[0]) })
      .attr("text-anchor", "middle")
      .attr("fill", "#000")
      .attr("opacity", 0);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(" + (0) + "," + Aheight + ")")
      .call(d3.axisBottom(Ax));

  g.append("g")
      .attr("class", "axis axis--y")
      .attr("transform", "translate(" + (0)  + "," + 0 + ")")
      .call(d3.axisLeft(Ay).ticks(10, "%"));

  if (serie!="total") {
      serieId=keysLegend.indexOf(serie);

      d3.selectAll("#serie-0")
        .selectAll("rect")
        .transition()
        .duration(200)
        .attr("opacity", 1)
        .attr("stroke-width", "3px");

      d3.selectAll("#serie-0")
        .selectAll(".barLabel")
        .transition()
        .duration(200)
        .style("font-weight", "bold")
        .attr("opacity",1);

      d3.selectAll(".legend")
        .selectAll("rect")
        .transition()
        .duration(200)
        .attr("stroke-width", "0px")
        .attr("opacity",0.6);

      d3.selectAll(".legendRect-"+serieId)
        .transition()
        .duration(200)
        .attr("font-weight", "bold")
        .attr("stroke-width", "2px")
        .attr("opacity",1);


    } else {
      d3.selectAll(".legend")
        .selectAll("rect")
        .transition()
        .duration(200)
        .attr("stroke-width", "0px")
        .attr("opacity",0.6);
    }

}


var pre_ind;
var pre_serie;
function drawLineChart (serie,ind) {

    // console.log(serie,pre_serie,"-",ind,pre_ind)
    if (ind==undefined) {
      ind=pre_ind
    } else {
      pre_ind=ind
    }

    if (serie==pre_serie) {
      serie="total"
      pre_serie=serie
    } else if (serie===0) {
      serie=pre_serie;
      serie_orgin=0;
    } else {
      pre_serie=serie
    }


    data=visData.filter(function(d) {return d.tab=="round" && d.type=="value"})
    dataRect=visData.filter(function(d) {return d.tab=="volume" && d.type=="value"})

    Ly.domain([0,d3.max(data, function(d) { return +d[serie]})]);

    Ly_rect.domain( [0,d3.max(dataRect, function(d) { return +d[serie]})*1.5]);
    // console.log(Ly.domain())
    // console.log(data,serie)

    var SPline = d3.line()
      .x(function(d){ return Lx(+d.index);})
      .y(function(d){ return Ly(+d[serie]);})


    d3.selectAll(".serie_line").remove();

    var lineMain=lineSvg.append('g')
                        .attr("class", "serie_line")
                        .attr("transform", "translate(" + (Lmargin.left+Ax.bandwidth()*0.5) + "," + Lmargin.top + ")");

    ///////////////////   draw regression lines/////////////////////////////////////////////////


    lineMain.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(" + (0) + "," + Lheight + ")")
    .call(d3.axisBottom(Ax));

    lineMain.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(" + (0)  + "," + 0 + ")" )
        .call(d3.axisLeft(Ly).ticks(4));

    lineMain.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(" + (Lwidth)  + "," + 0 + ")" )
        .call(d3.axisRight(Ly_rect).ticks(4));

    lineMain.append("text")
      .attr("class", "unit")
      .attr("transform", "translate(" + 5 + "," + 5 + ")"  )
      .text("Round");

    lineMain.append("text")
      .attr("transform", "translate(" + (Lwidth+5) + "," + 5 + ")"  )
      .text("Million RMB");


    var path = lineMain.selectAll('path')
      .data(data);

    ////////////////////////////////////////////////////////////////////
    d_string = "";
    data.forEach(function(d,i) {
      if (i==0) {
        d_string += "M " + (Ax(d.date)+Ax.bandwidth()*0.5) + " " + Ly(+d[serie]);
      } else {
        d_string += "L " + (Ax(d.date)+Ax.bandwidth()*0.5) + " " + Ly(+d[serie]);
      } 
    })
    ////////////////////////////////////////////////////////////////////

    lineMain.selectAll("volume")
      .data(dataRect)
      .enter()
      .append("rect")
      .attr("class", "volume")
      .attr("x", function(d) { return Ax(d.date)+Ax.bandwidth()*0.25; })
      .attr("y", function(d) { return Ly_rect(+d[serie]); })
      .attr("width", Ax.bandwidth()*0.5)
      .attr("height", function(d) { return  Lheight - Ly_rect(+d[serie]); })
      .attr("fill", "#8552a1")
      .attr("opacity", 0.3);

    path
        .enter()
        .append('path')
        .attr("class", "path_line")
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('d', d_string)
        .style("stroke-dasharray", ("3, 3"));


    lineMain.selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 11)
      .attr("cx", function(d) { return Ax(d.date)+Ax.bandwidth()*0.5; })
      .attr("cy", function(d) { return Ly(+d[serie]); })
      .attr("stroke", "#019ad6")
      .attr("stroke-width", "3px")
      .attr("fill", "white");
      // .on("mouseover", function(d) {console.log(d)})


    lineMain.selectAll("label_rect")
      .data(dataRect)
      .enter()
      .append("text")
      .attr("class", "label_rect")
      .attr("x", function(d) { 
          if (Lheight - Ly_rect(+d[serie])<10) {
            return Ax(d.date)+Ax.bandwidth()*0.9; 
          } else {
            return Ax(d.date)+Ax.bandwidth()*0.5; 
          }
        })
      .attr("y", function(d) { 
          if (Lheight - Ly_rect(+d[serie])<10) {
            return Lheight;
          } else {
            return Ly_rect(+d[serie]) + 12; 
          }
        })
      .attr("fill", "#8552a1")
      .text(function(d) {return Math.round(+d[serie]) })
      .attr("text-anchor", 'middle')
      .attr("font-size", '10px')
      .attr("font-weight", 500);


    lineMain.selectAll("label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", function(d) { return Ax(d.date)+Ax.bandwidth()*0.5 ; })
      .attr("y", function(d) { return Ly(+d[serie]) + 4; })
      .attr("fill", "#019ad6")
      .text(function(d) {return Math.round(+d[serie]) })
      .attr("text-anchor", 'middle')
      .attr("font-size", '10px')
      .attr("font-weight", 500);


    lineLegend = lineMain.append("g")
                .attr("class","Linelegend")
                .attr("transform", "translate(" + (Lwidth+Lmargin.left+Amargin.right*0.1) + "," + Lmargin.top + ")");


    lineLegend.append("text")
              .attr("transform", "translate(" + (30) + "," + Lmargin.top + ")")
              .text("No. of Deals");
    lineLegend.append("circle")
              .attr("transform", "translate(" + (18) + "," + (Lmargin.top - 5) + ")")
              .attr("r", 6)
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("stroke", "#019ad6")
              .attr("stroke-width", "3px")
              .attr("fill", "white");

    lineLegend.append("text")
              .attr("transform", "translate(" + (30) + "," + 2*Lmargin.top + ")")
              .text("Funding Amount");

    lineLegend.append("rect")
              .attr("transform", "translate(" + (12) + "," + (2*Lmargin.top - 10) + ")")
              .attr("x", 0)
              .attr("y", 0)
              .attr("width", 12)
              .attr("height", 12)
              .attr("fill", "#8552a1")
              .attr("opacity", 0.3);

    lineTopic = lineMain.append("g")
                .attr("class","Linelegend")
                .attr("transform", "translate(" + (Lwidth*0.5) + "," + (-15) + ")");


    lineTopic.append("text")
              .text("Investment Growth In Sub-market_" + serie)
              .attr("text-anchor", 'middle')
              .attr("font-size", '14px')
              .attr("font-weight", 600)
              .attr("fill", "#666");

  }



function type(d, i, columns) {
  // d.date = parseDate(d.date);
  for (i = 3, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;

}

//////////////////////////////////
function mouseOver(d,i){

  // console.log(d,i)

  d3.select(this)
    .selectAll("rect")
    .transition()
    .duration(200)
    .attr("opacity", 1)
    .attr("stroke-width", "3px");

  d3.select(this)
    .select("text")
    .transition()
    .duration(200)
    .style("fill",  Az(d.key))
    .style("font", "12px sans-serif")
    .style("font-weight", "bold");

};

function mouseMove(d){
  tooltip
      .style('top', (d3.event.pageY -15) + "px")
      .style('left', (d3.event.pageX +15) + "px");
};

function mouseOut(d){

  d3.select(this)
    .selectAll("rect")
    .transition()
    .duration(200)
    .attr("opacity", 0.6)
    .attr("stroke-width", "0px");

  d3.select(this)
    .select("text")
    .transition()
    .duration(200)
    .style("fill",  "#000")
    .style("font", "10px sans-serif")
    .style("font-weight", "normal");

  tooltip
    .style('display', 'none');
};


var pre_key;

function click (d){

  drawLineChart(d.key)
  drawBarChart(d.key)
};



parsePercent = d3.format(".1%")