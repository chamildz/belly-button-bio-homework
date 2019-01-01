function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


    // Reference to Panel element for sample metadata
    var sampleDataPanel = d3.select("#sample-metadata")
    // Clear any existing metadata
    sampleDataPanel.html("");
    // Loop through all of the keys in the json response and
    // create new metadata tags
    d3.json(`/metadata/${sample}`)
    .then(function(metaData) 
    {
      
      console.log(metaData);

      Object.entries(metaData).forEach(([key, value]) => {
        sampleDataPanel.append("h6").text(`${key}: ${value}`);
      });
      buildGauge(metaData.WFREQ);
    });
    
}

function buildCharts(sample) {
     d3.json(`/samples/${sample}`).then(function(sampleData){
      
      var bubbleChartLayout = {
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" }
      };

      var bubbleChartData = [
        {
          x: sampleData.otu_ids,
          y: sampleData.sample_values,
          text: sampleData.otu_labels,
          mode: "markers",
          marker: {
            size: sampleData.sample_values,
            color: sampleData.otu_ids,
            colorscale: "Earth"
          }
        }
      ];
  
      Plotly.plot("bubble", bubbleChartData, bubbleChartLayout);
  
      var pieChartData = [
        {
          values: sampleData.sample_values.slice(0, 10),
          labels: sampleData.otu_ids.slice(0, 10),
          hovertext: sampleData.otu_labels.slice(0, 10),
          hoverinfo: "hovertext",
          type: "pie"
        }
      ];
  
      var pieChartLayout = {
        margin: { t: 0, l: 0 }
      };
  
      Plotly.plot("pie", pieChartData, pieChartLayout);
    });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

function getData(sample, callback) {
  // Use a request to grab the json data needed for all charts
 
  Plotly.d3.json(`/metadata/${sample}`, function(error, metaData) {
      if (error) return console.warn(error);
      buildMetadata(metaData);
  })
  // BONUS - Build the Gauge Chart
  //buildGauge(sample);
}

// Initialize the dashboard
init();
