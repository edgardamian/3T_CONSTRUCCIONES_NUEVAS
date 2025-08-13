// Panels are the main container widgets
var mainPanel = ui.Panel({
  style: {width: '300px'}
});

var title = ui.Label({
  value: 'Dynamic World Change Detection for Morelia, Michoacan',
  style: {'fontSize': '24px'}
});
mainPanel.add(title);

var adminLabel = ui.Label('Select a region');
mainPanel.add(adminLabel);

var adminPanel = ui.Panel({
  layout: ui.Panel.Layout.flow('horizontal'),
});
mainPanel.add(adminPanel);

var adminSelector = ui.Select();
adminPanel.add(adminSelector);

// Load FAO administrative boundaries (ADM2 level)
var admin2 = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level2');

// Filter to Mexico and Michoacan
var mexicoAdmin2 = admin2.filter(ee.Filter.eq('ADM0_NAME', 'Mexico'))
                         .filter(ee.Filter.eq('ADM1_NAME', 'Michoacan'));  // Sin acento

// Get all ADM2 names within Michoacan (including Morelia)
var michoacanAdmin2Names = mexicoAdmin2.aggregate_array('ADM2_NAME');

// Populate the dropdown with the list of regions in Michoacan
michoacanAdmin2Names.evaluate(function(michoacanAdmin2NamesList) {
  print('Available regions:', michoacanAdmin2NamesList);  // Print to check available names

  // Ensure there are names to populate the dropdown
  if (michoacanAdmin2NamesList && michoacanAdmin2NamesList.length > 0) {
    adminSelector.items().reset(michoacanAdmin2NamesList);
    
    // Check if "Morelia" is in the list, otherwise set to the first option
    if (michoacanAdmin2NamesList.indexOf('Morelia') !== -1) {
      adminSelector.setValue('Morelia');  // Set default to Morelia if available
    } else {
      adminSelector.setValue(michoacanAdmin2NamesList[0]);  // Set default to the first region if "Morelia" not found
    }
  } else {
    print('No regions found in the selected area.');
  }
});

// Define start and end year selectors
var yearLabel = ui.Label('Select the time period (start and end year)');
mainPanel.add(yearLabel);

var yearPanel = ui.Panel({
  layout: ui.Panel.Layout.flow('horizontal'),
});
mainPanel.add(yearPanel);

var startYearSelector = ui.Select();
var endYearSelector = ui.Select();

yearPanel.add(startYearSelector);
yearPanel.add(endYearSelector);

// Define years range
var startYears = ee.List.sequence(2017, 2024);
var endYears = ee.List.sequence(2018, 2024);

// Convert years to strings and populate the dropdowns
var startYearsStrings = startYears.map(function(year){
  return ee.Number(year).format('%04d');
});

var endYearsStrings = endYears.map(function(year){
  return ee.Number(year).format('%04d');
});

// Evaluate the results and populate the dropdown
startYearsStrings.evaluate(function(yearList) {
  startYearSelector.items().reset(yearList);
  startYearSelector.setValue(yearList[0]);
});

endYearsStrings.evaluate(function(yearList) {
  endYearSelector.items().reset(yearList);
  endYearSelector.setValue(yearList[yearList.length -1]);
});

// Select a band
var bandPanel = ui.Panel({
  layout: ui.Panel.Layout.flow('horizontal'),
});
var probabilityBands = [
    'water', 'trees', 'grass', 'flooded_vegetation', 'crops',
    'shrub_and_scrub', 'built', 'bare', 'snow_and_ice'
];
var bandLabel = ui.Label('Select a band');
mainPanel.add(bandLabel);

var bandSelector = ui.Select({
  items: probabilityBands,
  value: 'built'
});
bandPanel.add(bandSelector);
mainPanel.add(bandPanel);

// Threshold slider for detecting change
var thresholdLabel = ui.Label('Set the change threshold');
mainPanel.add(thresholdLabel);
var thresholdPanel = ui.Panel({
  layout: ui.Panel.Layout.flow('horizontal'),
  style: {width: '250px'}
});
mainPanel.add(thresholdPanel);

var slider = ui.Slider({
  min: 0.1,
  max: 0.9,
  value: 0.5,
  step: 0.1,
  style: {width: '200px'}
});
thresholdPanel.add(slider);

// Button to show changes
var button = ui.Button('Show Changes');
mainPanel.add(button);

// Function to show change detection
var showChange = function() {
  var startYear = startYearSelector.getValue();
  var endYear = endYearSelector.getValue();
  var band = bandSelector.getValue();
  var threshold = slider.getValue();
  var admin2Value = adminSelector.getValue();
  
  var selectedAdmin2 = admin2.filter(ee.Filter.eq('ADM2_NAME', admin2Value));
  var geometry = selectedAdmin2.geometry();

  var beforeStart = ee.Date.fromYMD(ee.Number.parse(startYear), 1, 1);
  var beforeEnd = beforeStart.advance(1, 'year');
  
  var afterStart = ee.Date.fromYMD(ee.Number.parse(endYear), 1, 1);
  var afterEnd = afterStart.advance(1, 'year');
  
  var dw = ee.ImageCollection('GOOGLE/DYNAMICWORLD/V1')
    .filterBounds(geometry).select(band);

  var beforeDw = dw
    .filter(ee.Filter.date(beforeStart, beforeEnd))
    .mean();
    
  var afterDw = dw
    .filter(ee.Filter.date(afterStart, afterEnd))
    .mean();

  var diff = afterDw.subtract(beforeDw);
  var change = diff.abs().gt(threshold);
  
  var changeVisParams = {min: 0, max: 1, palette: ['white', 'red']};
  // Reemplaza Map.centerObject(geometry); con:
  if (admin2Value === 'Morelia') {
    Map.setCenter(-101.194, 19.704, 11);  // Coordenadas específicas de Morelia con zoom 11
  } else {
    Map.centerObject(geometry, 10);
  }
  Map.addLayer(change.clip(geometry), changeVisParams, 'Change');
};
button.onClick(showChange);

// Add the main panel to the UI
ui.root.add(mainPanel);

// Set initial map view
Map.setCenter(-101.194, 19.704, 8);  // Coordinates centered on Morelia
