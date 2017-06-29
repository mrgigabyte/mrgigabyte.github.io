var graphwidth = "100%"; //sets the width of the graph <svg>
var graphheight = 670; //sets the height of the graph <svg>

//data for the nodes 
var graphnodes = {
    "Transport":{
                "image":"Transport.png",
                "width":"1", 
                "height":"1"},
    "Urban Development":{
                "image":"Urban_Development.png", 
                "width":"1", 
                "height":"1"},
    "Digital connectivity":{
                "image":"Digital_Connectivity.png",
                "width":"0.7",
                "height":"0.7"},
    "Trade":{
                "image":"Trade_Industry_services.png",
                "width":"1",
                "height":"1"}    
};

//data for the stroke color
var stroke_color={
                    1:"#FCCE75", // agreeing with
                    2:"#D17D91", // conflicting with
                    3:"#6AC2C3"  // gaps
                };


var maxRadius = 80;     //sets the maxRadius
var clusterPadding = 6; //sets clusterpadding
var padding = 4.5;      //sets padding
var nodeRadius=20;      //sets radius of the circular node
var linkdistance = 70; //sets linkdistance in between the nodes
var charge = -200;      //sets the closeness of the different clusters, more negative = less closeness