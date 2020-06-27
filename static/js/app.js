function getData(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(m => m.id == sample);
    var result = resultArray[0];
    var demo = d3.select("#sample-metadata");
    demo.html("");
    Object.entries(result).forEach(([key, value]) => {
      demo.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}


function optionChanged(newSample) {
  getData(newSample);
  barChart(newSample);
  buildGauge(newSample);
}

function init() {
  var dropDown = d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
    var identity = data.names;
    identity.forEach((sample) => {
      dropDown
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  
    var Sample1 = identity[0];
    getData(Sample1);
    barChart(Sample1);
  });
}

init();

function barChart(sample) {
  d3.json("samples.json").then((data) => {
      var val = data.samples;
      
      var t = val.filter(v => v.id == sample);
     
      barData=[];
      
      for (var i = 0; i < t.length; i++) {
          var sampleD = t[i].sample_values;
          var id = t[i].otu_ids;
          var label = t[i].otu_labels;
          for (var d = 0; d < sampleD.length; d++) {
              barData.push({"otu_ids": id[d], 
                            "otu_labels":label[d], 
                            "sample_values":sampleD[d]});
          };
      };

      bardata = barData
      bardata.sort((a, b) => b.sample_values - a.sample_values);
      bardata = bardata.slice(0, 10);
      bardata = bardata.reverse();
      //console.log(barD);

      var trace1 = {
          x: bardata.map(row => row.sample_values),
          y: bardata.map(row => "OTU " + row.otu_ids.toString()),
          text: bardata.map(row => row.otu_labels),
          type: "bar",
          orientation: "h"
          }; 
      var bar=[trace1];
      var layout1 = {
          showlegend: false,
        };
      Plotly.newPlot("bar", bar, layout1);
  
      
      var trace2 = {
          x: bardata.map(row => row.otu_ids),
          y: bardata.map(row => row.sample_values),
          type: 'scatter',
          mode: 'markers', 
          marker:{
              size: barData.map(row => row.sample_values),
              color: barData.map(row => row.otu_ids)
          },
          text: barData.map(row => row.otu_labels)
      };
      var bubble=[trace2]
      var layout2 = {
          xaxis: {
              title: "OTU ID",
              tickmode: "linear",
              tick0: 0,
              dtick: 500
          },
          showlegend: false,
          height: 600,
        };
      Plotly.newPlot("bubble", bubble,layout2);
  });
};