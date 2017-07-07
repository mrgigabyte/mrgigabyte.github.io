Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

//for checking the number of clicks
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
    var queue = {}; //a queue for making changes in the graph which are exclusively for the 3rd wireframe
    var nodes={};
    // var nodes = {}; // d3.range(links.length).map(function() { return {radius:  nodeRadius }; }); // Do not understand what happens here

    function grabNode(id) {
      return nodesData[id-1];
    }
      
    //adding orphan nodes  
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
            var height =  `${graphnodes[type]["filterheight"]}`; //custom height for each filter-icon
            var width  =  `${graphnodes[type]["filterwidth"]}`;  //custom width  for each filter-icon
            var id     =  `${graphnodes[type]["id"]}`;
            for(var key in graphnodes){
                //for unselected filter buttons
                if(graphnodes[key]["id"] !== id){
                    var newheight = `${graphnodes[key]["filterheight"]}`;
                    var newwidth  = `${graphnodes[key]["filterwidth"]}` ;
                    document.getElementById(graphnodes[key]["id"]).setAttribute("style", ` background: url('./../Images/${graphnodes[key]["fadeout"]}'); height: ${newheight}; width: ${newwidth};`); //setting the filter-icon
                    document.getElementById(graphnodes[key]["id"]+"button").setAttribute("style", `color: ${fadeoutfilter_text};`); //text for the filter
                    document.getElementById('all_nodes').setAttribute("style", `color: ${fadeoutfilter_text};`); //adding "All" param in the filters.
                }
            }   
            
            //for the selected filter type
            document.getElementById(id).setAttribute("style", `background: url('./../Images/${graphnodes[type]["image"]}'); height: ${height}; width: ${width};`);
            document.getElementById(id+"button").setAttribute("style", `color: ${selectedfilter_text};`);
        }
        
        
     // filter mechanism    
      var filtered_links = links.filter(function(link) {
           if(graphnodes.hasOwnProperty(type)){ // checks if the filter function was called via the filter panel or not
                if (grabNode(link.source).type === type || grabNode(link.target).type === type ){
                    return link;
                }
            }
            else{
                
                // checks if its for the 3rd wireframe
                var parentNode = parseInt(type.split("@")[0]);
                console.log(queue)
                if ( link.target.name == parentNode || link.source.name == parentNode){
                    var filterlink = {source: link.source.name, target: link.target.name, link: link.link}
                    return filterlink;
                }
            }
      });
        
      // quick hack for making the 3rd wireframe compatible. since target and source have objects instead of a 'single' value.    
      filtered_links.forEach(function(link){
            if(typeof(link.source)==="object" && typeof(link.target)==="object"){
                link.source = link.source.name;
                link.target = link.target.name;
            }
       })
        
      return filtered_links; //returning the filtered_links. I guess the name explains :P
    }

    function render_map(links_input) {

      var links = JSON.parse(JSON.stringify(links_input)); 

      var nodes = {};

        
      // Compute the distinct nodes from the links.
      links.forEach(function(link) {
          link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, links: link.link});
          link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, links: link.link});
      });
      console.log(nodes)
    var newnodes = nodes;
        
        
    
      // Adding radius key to nodes
//      Object.keys(nodes).forEach(function(node) {
//        nodes[node].radius = nodeRadius;
//      }) 
        
       //checks if the 3rd wireframe is active
      if(queue.id===3){
          console.log( newnodes);
            var force = d3.layout.force()
                          .nodes(d3.values(nodes))
                          .links(links)
                          .size([document.getElementById("graph").offsetWidth, document.getElementById("graph").offsetHeight]).linkDistance(200)
                          .charge(-1000)
                          
                          .on("tick", tick)
                          .start();
            
          
      }
        
      else{
            var force = d3.layout.force()
                          .nodes(d3.values(nodes))
                          .links(links)
                          .size([document.getElementById("graph").offsetWidth, document.getElementById("graph").offsetHeight]).linkDistance(linkdistance)
                          .charge(charge)
                          .on("tick", tick)
                          .start();

      }
      
        
      d3.select(".graph").html("") //sets the html of as empty  
    
      var svg = d3.select(".graph").append("svg")
                  .attr("width", graphwidth)
                  .attr("height", graphheight);
                  
                  
      // add the links a.k.a path
      var path = svg.append("svg:g").selectAll("path")
                    .data(force.links())
                    .enter().append("svg:path")
                    .attr("class", "link")
                    .attr("marker-end", "url(#end)");
          
      // a function for generating run-time data from the config. (used for the node-images)      
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
      
      //initialises the 'click' function for the respective nodes
      var cc = clickcancel();

      // define the nodes
      var node = svg.selectAll(".node")
          .data(force.nodes())    
          .enter().append("g")
          .attr("class", "node")
        
          .call(force.drag)
          .call(cc);
//          
     // add the text 
        
          
  node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });
        
//        if(queue.id===3){
//      node.append("svg:foreignObject")
//            .attr("width", 250)
//            .attr("height", 20)
//            .html(function(d) { return grabNode(d.name).desc; });
//        
//        
//        }
    
     
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
        
        
        // for clicking in the background of the third wireframe to go back to wireframe1
        if(queue.id===3){  
            $('svg').dblclick(function(){
                                if(queue.id===3){
                                    $('.left-panel-content').removeClass('isDisabled')
                                    $('.left-panel-linkdiscpt').addClass('isDisabled')
                                    queue = {}; 
                                    console.log(queue)
                                    $('.right-panel').removeClass('isDisabled')
                                    render_map(graphData.links);
                             
                                }
                            })
        }
 
        
        // checks for double click
        cc.on('dblclick', function(d) {
            $('.left-panel-content').addClass('isDisabled')
            $('.left-panel-linkdiscpt').removeClass('isDisabled')
            var me  = d3.select(d.srcElement);
            var meNode = me.data()[0].name;
            queue.id = 3;
            queue.pnode = parseInt(meNode);
            console.log(queue,queue.pnode)
            $('.right-panel').addClass('isDisabled');
            render_map(filter(links, meNode.toString()+"@specific"));
        })

        
function tick() {
    
//    if(queue.id === 3){
//        
////        if(!nodes[parseInt(queue.pnode)]){
////            console.log('okay')
////            var meNode = queue.pnode
////            nodes = {};
////            render_map(filter(links, meNode.toString()+"@specific"));
////        }
//        console.log(newnodes)
//        newnodes[parseInt(queue.pnode)].x = document.getElementById("graph").offsetWidth/ 2;
//        newnodes[parseInt(queue.pnode)].y = document.getElementById("graph").offsetHeight / 2;
//    }

     node.each(collide(0.5))
     path.attr('style',function(d){
         
             if(d.link==="orphan"){
                 return `stroke: none;`
             }
            
             return `stroke:  ${stroke[d.link]["color"]}; stroke-width:  ${stroke[d.link]["width"]} `
     })
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
    })  .on("mouseenter", function(d){if(queue.id===3){
            $('.left-panel-linkdiscpt').html(d.desc)    
//            var reqddesc = [d.target.name,d.source.name]
//            node.append("svg:foreignObject")
//                .attr("width", 250)
//                .attr("height", 20)
//                .html(function(d) {
//                    for(var m in reqddesc){
//                        if(d.name===reqddesc[m]){
//                            return grabNode(d.name).desc;
//                            
//                        }
//                        
//                    }
//                
//                })
//                d3.selectAll("circle")
//                  .attr('fill',function(d){ 
//                        if(reqddesc.indexOf(d.name)!== -1){
//                            for(var x in nodesData){
//                                if(nodesData[x].id==parseInt(d.name)){
//                          
//                                    for(var key in graphnodes){
//                          
//                                            if(nodesData[x].type===key){
//                                  
//                                                var m = `url(#${key.replace(/\s+/, "")})`
//                                                return m;
//                                            }
//                          
//                                        }
//                                    }
//                                }
//                            }
//                        else{
//                            return `none`;
//                        }
//                  })
//                 d3.selectAll("path")
//                  .attr('style',function(d){ 
//                        if(reqddesc.indexOf(d.source.name)!== -1){
//        
//                            return `stroke:  ${stroke[d.link]["color"]}; stroke-width:  3px `
//                            }
//                        else{
//                            return `stroke: none;`
//                        }
//                  })
         d3.select(this).transition()
      .duration(750)
      .style('stroke-width', 6) 
//         
//                }});
//        .on("mouseout", function(){if(queue.id===3){
//         console.log('true')
//            node.append("svg:foreignObject")
//                .attr("width", 250)
//                .attr("height", 20)
//                .html("")
                }})
    .on("mouseout", function(){if(queue.id===3){
         if(queue.id===3){
            $('.left-panel-linkdiscpt').html("")
            d3.select(this).transition()
      .duration(750)
      .style('stroke-width', function(d){return stroke[d.link].width}) }}})  

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
        queue = {};
      render_map(filter(links, $(this).data('filter_by')));
    })
    
    $('#all_nodes').on('click', function(){
        queue={};
      render_map(links);
    })
  });
});
