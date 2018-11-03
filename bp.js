
// var color ={Elite:"#3366CC", Grand:"#DC3912",  Lite:"#FF9900", Medium:"#109618", Plus:"#990099", Small:"#0099C6"};

var color = {"K12":"#019ad6", "Vocational Edu.":"#90d7eb", "Language Learning":"#b3ec44", "Enrichment Programs":"#32df8c",  "Early Childhood Edu.":"#f05b71", "SaaS & Informatization":"#fab3af", "STEM" :"#ae4f39", "Study Abroad Services":"#ff781d", "Higher Edu.":"#ffbe78", "Paid Knowledge":"#ce74b8", "Others":"#8552a1"}
// "#b15928"
// "K12":"#a6cee3", "Vocational Edu.":"#1f78b4", "Language Learning":"#b2df8a", "Enrichment Programs":"#33a02c", "Early Childhood Edu.":"#fb9a99", "SaaS & Informatization":"#e31a1c", "STEM" :"#fdbf6f", "Study Abroad Services":"#ff7f00", "Higher Edu.":"#b15928", "Paid Knowledge":"#6a3d9a", "Others":"#ffff99"


var bpWidth = document.getElementById('vis').clientWidth;
var bpHeight = document.getElementById('vis').clientHeight;

var bpMargin = {top: 50, right: 220, bottom: 30, left: 220},
    bpWidth = bpWidth - bpMargin.left - bpMargin.right,
    bpHeight = bpHeight - bpMargin.top - bpMargin.bottom;

var bpSvg = d3.select("#vis").append("svg")
			.attr("width", bpWidth + bpMargin.left + bpMargin.right)
			.attr("height", bpHeight + bpMargin.top + bpMargin.bottom);

var topic = bpSvg.append("text")
	.attr("transform","translate(" + (bpWidth*0.5+ bpMargin.left) + "," + bpMargin.top*0.5 + ")")
	.attr("class","header")
	.text("No. of Edtech Companies Got funded")
	.attr("text-anchor", "middle")
	.attr("font-size", "13px")
	.attr("fill", "#666");

var bpVis =bpSvg.append("g").attr("transform","translate(" + bpMargin.left + "," + bpMargin.top + ")");


/////////////////////////////////////////////////////////////////////////////////
//processing data

var bpData=[]
var round_keys=[]
var track_keys=[]

d3.csv("DataSmallMulti.csv", type, function(error, data) {

	// data = data.filter(function(d) {return d.round!="新三板"})

  	if (error) throw error;

  	data.sort(function (a,b) {return a.date-b.date})

  	var data_nestByCompany = d3.nest()
    	.key(function(d) { return d.company })
    	.entries(data);

    // console.log(data_nestByCompany)

    var data_lastRound=[]
    data_nestByCompany.forEach(function (d) {
    	data_lastRound.push(d.values[d.values.length-1])
    })

    data_lastRound.forEach(function(d) {
    	d.pattern=[d.track,d.round]
    })

    // console.log(data_lastRound)

    var data_nestByTrack = d3.nest()
        .key(function(d) { return d.pattern })
		.rollup(function(v) { return v.length })
    	.entries(data_lastRound);

    // console.log(data_nestByTrack)

    round_keys = ["Seed/Angel", "Pre-A", "A", "B", "C", "D", "E", "Strategic Investment", "Pre-IPO", "NEEQ Fund-raising", "Undiscloused"]
	// track sort
	var data_sort = d3.nest()
	    .key(function(d) { return d.track })
	    .rollup(function(v) { return v.length})
	    .entries(data_lastRound);

	data_sort.sort(function (a,b) {return b.value-a.value})

	// console.log(data_sort)

	data_sort.forEach (function (d,i) {
		track_keys.push(d.key)
  	})
	// console.log(track_keys)

    data_nestByTrack.forEach(function (d) {
    	track=d.key.split(",")[0]
    	round=d.key.split(",")[1]
    	bpData.push([track, round, +d.value])
    })

    // console.log(bpData)

    drawBpVis(bpData)
})

function drawBpVis (bpData) {

	var bp=viz.biPartite()
		.data(bpData)
		.sortPrimary(sort(track_keys))
		.sortSecondary(sort(round_keys))
		.min(bpHeight/50)
		.height(bpHeight)
		.width(bpWidth)
		.barSize(35)
		.fill(d=>color[d.primary]);
		
	bpVis.call(bp)


	bpVis.selectAll(".viz-biPartite-mainBar")
		.on("mouseover",mouseover)
		.on("mouseout",mouseout);

	bpVis.selectAll("rect")
		.attr("opacity", 0.8);

	bpVis.selectAll(".viz-biPartite-mainBar").append("text").attr("class","label")
		.attr("x",d=>(d.part=="primary"? -20: 20))
		.attr("y",d=>+6)
		.text(d=>d.key)
		.attr("text-anchor",d=>(d.part=="primary"? "end": "start"))
		.attr("fill", function(d){if (d.percent>0.001) {return "#000"} else {return "#FFF"}});
	
	bpVis.selectAll(".viz-biPartite-mainBar")
		.append("text")
		.attr("class","perc")
		.attr("x",d=>(d.part=="primary"? -160: 160))
		.attr("y",d=>+6)
		.text(function(d) {return d3.format("0.1%")(d.percent)})
		.attr("text-anchor",d=>(d.part=="primary"? "end": "start"))
		.attr("fill", function(d){ if (d.percent>0.001) {return "#000"} else {return "#FFF"}});


	var bpIntro=bpSvg.append("g").attr("transform","translate(" + bpMargin.left + "," + bpMargin.top + ")").attr("class","bpIntro");

		bpIntro.append("text").attr("x",-bpMargin.left/3).attr("y",-8).style("text-anchor","middle").text("Sub-market").attr("font-weight","bold").attr("fill", "#666");

		bpIntro.append("text")
				.attr("transform","translate(" + bpWidth + "," + 0 + ")")
				.attr("x",bpMargin.left/3).attr("y",-8).style("text-anchor","middle").text("Latest Round").attr("font-weight","bold").attr("fill", "#666");
		
		bpIntro.append("line").attr("x1",-bpMargin.left/5*4).attr("x2",0);
		bpIntro.append("line").attr("transform","translate(" + bpWidth + "," + 0 + ")")
				.attr("x1",0).attr("x2",bpMargin.left/5*4);
		
		bpIntro.append("line").attr("transform","translate(" + 0 + "," + bpHeight + ")")
				.attr("x1",-bpMargin.left/5*4).attr("x2",0);
		bpIntro.append("line").attr("transform","translate(" + bpWidth + "," + bpHeight + ")")
				.attr("x1",0).attr("x2",bpMargin.left/5*4);


	d3.select(self.frameElement).style("height", bpHeight);

	function mouseover(d){
		bp.mouseover(d)
	
		bpVis.selectAll(".viz-biPartite-mainBar")
			.select(".perc")
			.text(function(d){ return d3.format(".1%")(d.percent) })
	}

	function mouseout(d){
		bp.mouseout(d)
		
		bpVis.selectAll(".viz-biPartite-mainBar")
			.select(".perc")
			.text(function(d){ return d3.format(".1%")(d.percent) })
	}
	
}


var parseDate = d3.timeParse("%b %Y");

function type(d) {
  	d.date = parseDate(d.date);
  	return d;
}

function sort(sortOrder){
  return function(a,b){ return d3.ascending(sortOrder.indexOf(a),sortOrder.indexOf(b)) }
}
