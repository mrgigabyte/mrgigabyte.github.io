Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};


function clickcancel() {
      var event = d3.dispatch('click', 'dblclick');
      function cc(selection) {
        var down,
        tolerance = 5,
        last,
        wait = null;
        // euclidean distance
        function dist(a, b) {
          return Math.sqrt(Math.pow(a[0] - b[0], 2), Math.pow(a[1] - b[1], 2));
        }
        selection.on('mousedown', function() {
          down = d3.mouse(document.body);
          last = +new Date();
        });
        selection.on('mouseup', function() {
          if (dist(down, d3.mouse(document.body)) > tolerance) {
            return;
          } else {
            if (wait) {
              window.clearTimeout(wait);
              wait = null;
              event.dblclick(d3.event);
            } else {
              wait = window.setTimeout((function(e) {
                return function() {
                  event.click(e);
                  wait = null;
                };
              })(d3.event), 300);
            }
          }
        });
      };
      return d3.rebind(cc, event, 'on');
    }



$('document').ready(function(){
    
  // get the data
  d3.json("../data/graph.json", function(error, graphData) {
    var nodesData = graphData.nodes;
    var links = graphData.links;
    
    // var nodes = {}; // d3.range(links.length).map(function() { return {radius:  nodeRadius }; }); // Do not understand what happens here

    function grabNode(id) {
      return nodesData[id-1];
    }
      
      
    nodesData.filter(function(val) {
            if(links.findIndex(x => x.source == val.id || x.target == val.id)==-1)
                {
                
                    links.push({"source": val.id, "target": val.id, "link":"orphan"})
                }
        })
      
    
    function filter(links, type) {
      // Iterate over links
      // if links  source or target has the same type as we are looking for (2nd argument)
      //  put them in a separate array
      //  return that array

        
        
        // for filter layout
        if(graphnodes.hasOwnProperty(type)){
        var height = `${graphnodes[type]["filterheight"]}`;
        var width = `${graphnodes[type]["filterwidth"]}`;
        var id=`${graphnodes[type]["id"]}`;
        
        for(var key in graphnodes){
            if(graphnodes[key]["id"] !== id){
                var newheight = `${graphnodes[key]["filterheight"]}`;
                var newwidth = `${graphnodes[key]["filterwidth"]}`;
                document.getElementById(graphnodes[key]["id"]).setAttribute("style", ` background: url('./../Images/${graphnodes[key]["fadeout"]}'); height: ${newheight}; width: ${newwidth};`);
                document.getElementById(graphnodes[key]["id"]+"button").setAttribute("style", `color: ${fadeoutfilter_text};`);
                document.getElementById('all_nodes').setAttribute("style", `color: ${fadeoutfilter_text};`);
            }
        }
        document.getElementById(id).setAttribute("style", `background: url('./../Images/${graphnodes[type]["image"]}'); height: ${height}; width: ${width};`);
        document.getElementById(id+"button").setAttribute("style", `color: ${selectedfilter_text};`);}
        
      var filtered_links = links.filter(function(link) {
           if(graphnodes.hasOwnProperty(type)){
               
        if ( grabNode(link.source).type === type || grabNode(link.target).type === type ){
          return link;
        }}
        else{
            var parentNode = parseInt(type.split("@")[0]);
            if ( link.target.name == parentNode || link.source.name == parentNode){
                
                var filterlink = {source: link.source.name, target: link.target.name, link: link.link}
          return filterlink;
        }
        }
      });
        
        filtered_links.forEach(function(link){
            if(typeof(link.source)==="object" && typeof(link.target)==="object"){
                link.source = link.source.name;
                link.target = link.target.name;
            }
        })
        
      return filtered_links;
    }

    function render_map(links_input) {

      var links = JSON.parse(JSON.stringify(links_input));

      var nodes = {};

        
        
      // Compute the distinct nodes from the links.
      links.forEach(function(link) {
          link.source = nodes[link.source] || 
              (nodes[link.source] = {name: link.source, links: link.link});
          link.target = nodes[link.target] || 
              (nodes[link.target] = {name: link.target, links: link.link});
      });
      
        
        
      // nodes.clean(undefined);
    
      // Adding radius key to nodes
//      Object.keys(nodes).forEach(function(node) {
//        nodes[node].radius = nodeRadius;
//      }) 

      var force = d3.layout.force()
          .nodes(d3.values(nodes))
          .links(links)
          .size([document.getElementById("graph").offsetWidth, document.getElementById("graph").offsetHeight]).linkDistance(linkdistance)
               .charge(charge)
               .on("tick", tick)
                .start();
        d3.select(".graph").html("")

      var svg = d3.select(".graph").append("svg")
          .attr("width", graphwidth)
          .attr("height", graphheight);

      // add the links and the arrows
      var path = svg.append("svg:g").selectAll("path")
          .data(force.links())
          .enter().append("svg:path")
          .attr("class", "link")
          .attr("marker-end", "url(#end)");
          
          
      var nodeImagesArray = function(m){
          var nodeArr = [];
          for(var key in m){
              var x = {};
              x.type = key;
              x.img = m[key].image;
              x.id = key.replace(/\s+/, ""); 
              x.width = m[key].width;
              x.height = m[key].height;
              nodeArr.push(x);
          }
          return nodeArr;
      }
      
      var cc = clickcancel();

      // define the nodes
      var node = svg.selectAll(".node")
          .data(force.nodes())    
          .enter().append("g")
          .attr("class", "node")
          .call(force.drag)
          .call(cc);
//          
//     // add the text 
//      node.append("text")
//          .attr("x", 12)
//          .attr("dy", ".35em")
//          .text(function(d) { return d.name; });
     
      //    defining a defs container that keeps elements that will be used throughout the code (quite often)
      var defs = svg.append("svg:defs").selectAll('defs').data(nodeImagesArray(graphnodes))
                    .enter().append('pattern')
                    .each(function(d,i){
                      var g = d3.select(this);
                      g.attr("id",d.id)
                       .attr("patternContentUnits","objectBoundingBox")
                       .attr("height","100%")
                       .attr("width","100%")
                       .append('image')
                       .attr("xlink:href", `../Images/${d.img}`)
                       .attr('width',d.width)
                       .attr('height',d.height);});
    
    
          
          
      //    adding circular nodes and filling it with the image
          node.append("circle")
              .attr("fill",function(d){
                  for(var x in nodesData)
                  {
                      if(nodesData[x].id==parseInt(d.name))
                      {
                          
                          for(var key in graphnodes){
                          
                              if(nodesData[x].type===key){
                                  
                                  var m = `url(#${key.replace(/\s+/, "")})`
                                  return m;
                              }
                          
                          }
                      }
                  }
              })
              .attr('r',nodeRadius)
          
        
 
cc.on('dblclick', function(d) {
       var me  = d3.select(d.srcElement);
       var meNode = me.data()[0].name;
//    linkdistance = 200;
    render_map(filter(links, meNode.toString()+"@specific"));
    })

//      add the curvy lines
function tick() {
     node.each(collide(0.5))
     path.attr('style',function(d){
         
             if(d.link==="orphan"){
                 return `stroke: none;`
             }
            
             return `stroke:  ${stroke[d.link]["color"]};stroke-width:  ${stroke[d.link]["width"]} `
     })
//     path.attr('style',function(d){
//             return `stroke-width:  ${stroke[d.link]["width"]}`
//     })
     path.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy),
            a = d.source.x,
            b = d.source.y,
            c = d.target.x,
            e = d.target.y;
            
        //      for self linking of nodes
        if(a==c && b==e){
                var xRotation = -45,
                    largeArc=1,
                    drx = 30,
                    dry = 20,
                    sweep=1;
                    c +=1;
                    e +=1;
                    return "M" + a + "," + b + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + c + "," + e;    
                
                }
        return "M" + 
            a + "," + 
            b + "A" + 
            dr + "," + dr + " 0 0,1 " + 
            c + "," + 
            e ;
    });

    node.attr("transform", function(d) { 
        var width = document.getElementById("graph").offsetWidth, 
            height =document.getElementById("graph").offsetHeight;
        d.x = Math.max(nodeRadius, Math.min(width - nodeRadius, d.x));
        d.y = Math.max(nodeRadius, Math.min((height-100) - nodeRadius, d.y));
      
  	    return "translate(" + d.x+ "," + d.y + ")"; 
        });    
    }

        
        function collide(alpha) {
          var quadtree = d3.geom.quadtree(nodes);
          return function(d) {

              if(typeof d === 'object'){
              var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                  nx1 = d.x - r,
                  nx2 = d.x + r,
                  ny1 = d.y - r,
                  ny2 = d.y + r;
                 

              quadtree.visit(function(quad, x1, y1, x2, y2) {
             
             
                 if (quad.point && (quad.point !== d)) {
                      var x = d.x - quad.point.x,
                          y = d.y - quad.point.y,
                          l = Math.sqrt(x * x + y * y),
                          r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                      if (l < r) {
                          l = (l - r) / l * alpha;
                          d.x -= x *= l;
                          d.y -= y *= l;
                          quad.point.x += x;
                          quad.point.y += y;
                      }
                  }
                 return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
              });

          };
          }
      }

    }
       
    
    render_map(links);

    $('.filter_by').on('click', function(){
      render_map(filter(links, $(this).data('filter_by')));
    })
    
    $('#all_nodes').on('click', function(){
      render_map(links);
    })
  });
});