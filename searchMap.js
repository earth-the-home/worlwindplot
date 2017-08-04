$(document).ready(function(){

	$('#search').on('click', function () {
		$.ajax({
        type: "GET",
        url: "http://localhost:1337/Pollachi-1.csv",
        dataType: "text",
        success: function(data) {plotCoconutWind(data);}
		});
	});

});



function plotCoconutWind(allText){
		// Tell World Wind to log only warnings.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the World Window.
        var ww = new WorldWind.WorldWindow("eFormerMap");

	   
		var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(ww), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(ww), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            ww.addLayer(layers[l].layer);
        }
       

        // Define the images we'll use for the placemarks.
        var placers = {
            "coconut farm" : "http://maps.google.com/mapfiles/ms/icons/green.png",
            "partly coconut farm" : "http://maps.google.com/mapfiles/ms/icons/yellow.png",
            "not coconut farm" : "http://maps.google.com/mapfiles/ms/icons/red.png"
        };
		
		
		var placemark,
            placemarkAttributes = new WorldWind.PlacemarkAttributes(null),
            highlightAttributes,
            placemarkLayer = new WorldWind.RenderableLayer("Placemarks"),
			goToAnimator = new WorldWind.GoToAnimator(ww),
			label = "",
            latitude = 9.7344,
            longitude = 77.2807;//for cumbum
			
			goToAnimator.goTo(new WorldWind.Location(latitude, longitude));
			
			
		  // Set up the common placemark attributes.
        placemarkAttributes.imageScale = 20;
        placemarkAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.3,
            WorldWind.OFFSET_FRACTION, 0.0);
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
        placemarkAttributes.drawLeaderLine = true;
        placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;

		
	var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    for (var k=1; k<allTextLines.length; k++) {
        var data = allTextLines[k].split(',');
        if (data.length === headers.length) {
		
		
		// For each placemark image, create a placemark with a label.
        for (var i = 0, len = headers.length; i < len; i++) {
			latitude = data[0];
			longitude = data[1];
			label = data[2];
			
			  // Create the placemark and its label.
            placemark = new WorldWind.Placemark(new WorldWind.Position(latitude, longitude, 1e2), true, null);
			 ww.redraw(); 
            placemark.label = label + "\n"
            + "Lat " + placemark.position.latitude.toString() + "\n"
            + "Lon " + placemark.position.longitude.toString();
            placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

            // Create the placemark attributes for this placemark. Note that the attributes differ only by their
            // image URL.
            placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
            placemarkAttributes.imageSource = placers[label];
            placemark.attributes = placemarkAttributes;

            // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
            // the default highlight attributes so that all properties are identical except the image scale. You could
            // instead vary the color, image, or other property to control the highlight representation.
            highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
            highlightAttributes.imageScale = 1.2;
            placemark.highlightAttributes = highlightAttributes;

            // Add the placemark to the layer.
            placemarkLayer.addRenderable(placemark);
		}
		
        }
    }
		
        // Add the placemarks layer to the World Window's layer list.
        ww.addLayer(placemarkLayer);

		
    
}


   
