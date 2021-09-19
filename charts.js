function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    // verify samples.json is functional source of data by logging to console
    // console.log(data) - verified

    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    // console.log(result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_Ids = [];
    var otu_Labels = [];
    var sample_Values = [];

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last.
    
    otu_Ids = Array.from(result.otu_ids).slice(0,10).reverse();
    otu_Labels = Array.from(result.otu_labels).slice(0,10).reverse();
    sample_Values = Array.from(result.sample_values).slice(0,10).reverse();
    //console.log(otu_Ids); - verified
    var yticks = [];
    prefix = 'OTU ';
    var yticks = otu_Ids.map(x => prefix + x);
    
    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sample_Values,
      y: yticks,
      type: "bar",
      text: otu_Labels,
      orientation: 'h'
    };
    
    var barData = [trace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "" },
      yaxis: {title: ""},
      hovermode: "closest"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar-plot", barData, barLayout)

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_Ids,
      y: sample_Values,
      text: otu_Labels,
      mode: 'markers',
      marker: {
        color: otu_Ids,
        size: sample_Values
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title:'Bacteria Cultures Per Sample',
      xaxis: {title: "OTU ID"},
      showlegend: false
    };

    var config = {responsive: true}

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, config); 


   // 3. Create a variable that holds the washing frequency.
   var metadata = data.metadata;
   // Filter the data for the object with the desired sample number
   var mResultArray = metadata.filter(sampleObj => sampleObj.id == sample);
   var mResult = mResultArray[0];
   var wFreq = parseFloat(mResult.wfreq);
   console.log(wFreq);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {x: [0,2], y: [0,2]},
      value: wFreq,
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      type: "indicator",
      gauge: {
        axis: { range: [null, 10]},
        bar: { color: "black"},
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "greenyellow"},
          {range: [8, 10], color: "green"}
        ]
        },
      
      mode: "gauge+number"
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600,
      height: 500,
      margin: {t: 0, b: 0}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
