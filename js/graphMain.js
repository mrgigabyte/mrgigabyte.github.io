Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

$('document').ready(function(){
  // get the data
  d3.json("../data/graph.json", function(error, graphData) {
    var nodesData = graphData.nodes;
    var links = graphData.links;
    
    // var nodes = {}; // d3.range(links.length).map(function() { return {radius:  nodeRadius }; }); // Do not understand what happens here

    function grabNode(id) {
      return nodesData[id-1];
    }

    function filter(links, type) {
      // Iterate over links
      // if links  source or target has the same type as we are looking for (2nd argument)
      //  put them in a separate array
      //  return that array
      
      
      var filtered_links = links.filter(function(link) {
        if ( grabNode(link.source).type === type || grabNode(link.target).type === type ){
          return link;
        }
      });
      return filtered_links;
    }

    function render_map(links_input) {

      var links = JSON.parse(JSON.stringify(links_input));
      var nodes =  {}; //d3.range(links.length).map(function() { return {radius:  nodeRadius }; });

      // Compute the distinct nodes from the links.
      links.forEach(function(link) {
          link.source = nodes[link.source] || 
              (nodes[link.source] = {name: link.source, links: link.link});
          link.target = nodes[link.target] || 
              (nodes[link.target] = {name: link.target, links: link.link});
      });
      
      // nodes.clean(undefined);
    
      var force = d3.layout.force()
          .nodes(d3.values(nodes))
          .links(links)
          .size([document.getElementById("graph").offsetWidth, document.getElementById("graph").offsetHeight])
          .linkDistance(linkdistance)
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

      // define the nodes
      var node = svg.selectAll(".node")
          .data(force.nodes())    
          .enter().append("g")
          .attr("class", "node")
          .call(force.drag);
          
     // add the text 
      node.append("text")
          .attr("x", 12)
          .attr("dy", ".35em")
          .text(function(d) { return d.name; });

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
          

      // add the curvy lines
      function tick() {
           node.each(collide(0.5))
           path.attr('style',function(d){
                   return `stroke:  ${stroke_color[d.link]}`
           })
              path.attr("d", function(d) {
              var dx = d.target.x - d.source.x,
                  dy = d.target.y - d.source.y,
                  dr = Math.sqrt(dx * dx + dy * dy);
              var a,b,c,e;
              a = d.source.x;
              b = d.source.y;
              c = d.target.x;
              e = d.target.y;
              return "M" + 
                  a + "," + 
                  b + "A" + 
                  dr + "," + dr + " 0 0,1 " + 
                  c + "," + 
                  e ;
          });

          node
              .attr("transform", function(d) { 
              return "translate(" + d.x+ "," + d.y + ")"; });
              
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
