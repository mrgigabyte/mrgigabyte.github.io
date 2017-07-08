var graphwidth = "100%"; //sets the width of the graph <svg>
var graphheight = "100%"; //sets the height of the graph <svg>

//data for the nodes 
var graphnodes = {
    "Transport":{
                "id":'Transport xx',
                "fadeout":"Transport_fadeout.png",
                "filterwidth":"40px",
                "filterheight":"50px",
                "image":"Transport.png",
                "width":"1", 
                "height":"1"},
    "Urban Development":{
                "id": "Urban Development",
                "fadeout":"Urban_Development_fadeout.png",
                "filterwidth":"60px",
                "filterheight":"50px",
                "image":"Urban_Development.png", 
                "width":"1", 
                "height":"1"},
    "Digital Connectivity":{
                "id": "Digital Connectivity",
                "fadeout":"Digital_Connectivity_fadeout.png",
                "filterwidth":"60px",
                "filterheight":"50px",
                "image":"Digital_Connectivity.png",
                "width":"0.7",
                "height":"0.7"},
    "Trade":{
                "id":'Trade xx',
                "fadeout":"Trade_Industry_services_fadeout.png",
                "filterwidth":"40px",
                "filterheight":"50px",
                "image":"Trade_Industry_services.png",
                "width":"1",
                "height":"1"}    
};

//data for the stroke color
var stroke={
                    1:{"color": "#FCCE75", width: "2.5px", "name":"Agreeing with", isfocusedWidth: 6  }, 
                    2:{"color": "#D17D91", width: "2.5px", "name":"Conflicting with",isfocusedWidth: 6 }, 
                    3:{"color": "#6AC2C3", width: "2.5px", "name":"Gaps",isfocusedWidth: 6 } 
                };

var fadeoutfilter_text = "#C9C9C9";  // when the filter option is not selected
var selectedfilter_text = "#00A99D"; // when the filter type is selected
var maxRadius = 80;     //sets the maxRadius
var clusterPadding = 6; //sets clusterpadding
var padding = 4.5;      //sets padding
var nodeRadius=20;      //sets radius of the circular node
var linkdistance = 70; //sets linkdistance in between the nodes
var charge = -250;      //sets the closeness of the different clusters, more negative = less closeness

//setting the position of label around the nodes ( wireframe-3)
var x_dist = "-36";
var y_dist = "3.25em";

var stroke_duration_in=750; //the time taken for the selected link to increase the stroke-width to max ( is focused width)
var stroke_duration_out=500; //the time taken for the link to comeback to normal when focused-out