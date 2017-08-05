$(document).ready(function(){

	try{
		$('#search').on('click', function () {
		$.ajax({
        type: "GET",
        url: "http://localhost:1337/Cumbum.csv",
        dataType: "text",
        success: function(data) {plotCoconutWind(data);},
		error: function (request, status, error) {
			alert('Something went wrong. Please try again.');
		}
		});
	});
	
	}catch(e){
		alert('Something went wrong. Please try again.');
	}
	

});

function createZone(){
		// Tell World Wind to log only warnings.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the World Window.
        var ww = new WorldWind.WorldWindow("eFormerMap");

	   
		ww.addEventListener('click', function(){
		
			console.log(ww.getCurrentLocation());
		})
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
       


		
    
}



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
       
		if(!allText){
			console.log('No csv data found to create map. please verify csv file');
			return;
		}

        // Define the images we'll use for the placemarks.
        var placers = {
            "coconut farm" : "http://maps.google.com/mapfiles/ms/icons/green.png",
            "partly coconut farm" : "http://maps.google.com/mapfiles/ms/icons/yellow.png",
            "not coconut farm" : "http://maps.google.com/mapfiles/ms/icons/red.png"
        };
		
		
		var placemark,
            placemarkAttributes,
            highlightAttributes,
            placemarkLayer = new WorldWind.RenderableLayer("Placemarks"),
			label = "",
            latitude = 0,
            longitude = 0;//for cumbum
		
			 // 2 million meters above the ellipsoid
			
			
		var screenOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0);
		var screenImageLayer = new WorldWind.RenderableLayer();
        screenImageLayer.displayName = "Screen Images";
			
		  // Set up the common placemark attributes.
        //placemarkAttributes.imageScale = 0.5;
       /*  placemarkAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.3,
            WorldWind.OFFSET_FRACTION, 0.0);
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW; */
        //placemarkAttributes.drawLeaderLine = false;
        //placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;

		
	var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    for (var k=1; k<allTextLines.length; k++) {
        var data = allTextLines[k].split(',');
        if (data.length === 3) {
			latitude = data[0];
			longitude = data[1];
			label = data[2];
			
			if(k == 1){
				ww.navigator.range = 5000;
				new WorldWind.GoToAnimator(ww).goTo(new WorldWind.Location(latitude, longitude));
			}
		
		// For each placemark image, create a placemark with a label.
        //for (var i = 0, len = headers.length; i < len; i++) {
			
			
			  // Create the placemark and its label.
            placemark = new WorldWind.Placemark(new WorldWind.Position(latitude, longitude, 0), true, null);
           // placemark.label = label;
			placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

            // Create the placemark attributes for this placemark. Note that the attributes differ only by their
            // image URL.
            placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
			placemarkAttributes.imageScale = 0.5;
			placemarkAttributes.drawLeaderLine = false;
            placemarkAttributes.imageSource = placers[label];
            placemark.attributes = placemarkAttributes;

            // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
            // the default highlight attributes so that all properties are identical except the image scale. You could
            // instead vary the color, image, or other property to control the highlight representation.
            highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
            highlightAttributes.imageScale = 0.8;
			//highlightAttributes.imageSource = "http://localhost:1337/naveen.jpg"
            placemark.highlightAttributes = highlightAttributes;
			placemark.highlighted = false;
			

            // Add the placemark to the layer.
            placemarkLayer.addRenderable(placemark);
		//}
		
        }
    }
		
        // Add the placemarks layer to the World Window's layer list.
        ww.addLayer(placemarkLayer);
		
		
		 // Now set up to handle picking.

        // The common pick-handling function.
        var handlePick = function (o) {
            // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
            // the mouse or tap location.
            var x = o.clientX,
                y = o.clientY;

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            var pickList = ww.pick(ww.canvasCoordinates(x, y));

            if (pickList.objects.length > 0) {
                for (var p = 0; p < pickList.objects.length; p++) {
                    // If the compass is picked, reset the navigator heading to 0 to re-orient the globe.
                    if (pickList.objects[p].userObject instanceof WorldWind.Placemark) {
						var tPos = pickList.objects[p].userObject.position
						tPos['latitude']+','+tPos['latitude']+".jpg"
						// Create a screen image that uses a static image. Place it in the lower-left corner.
						var screenImage1 = new WorldWind.ScreenImage(screenOffset,"http://localhost:1337/naveen.jpg");
						screenImage1.imageOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0);
						screenImage1.imageScale = 0.5;
						screenImageLayer.addRenderable(screenImage1);
						break;
                    }
                }
            }
        };

        // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
        ww.addEventListener("click", handlePick);
		

        // Listen for taps on mobile devices and highlight the placemarks that the user taps.
        var tapRecognizer = new WorldWind.TapRecognizer(ww, handlePick);
		
		var highlightController = new WorldWind.HighlightController(ww);
		
		
		
		        
        
       
       

        // Add the screen images to a layer and the layer to the World Window's layer list.
        ww.addLayer(screenImageLayer);
		
}




   
