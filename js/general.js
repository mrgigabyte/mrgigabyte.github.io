$( document ).ready(function() {
    addfilter();
    
    $('#all_nodes').click(function(){
        
        for(var key in graphnodes){
                var newheight = `${graphnodes[key]["filterheight"]}`;
                var newwidth = `${graphnodes[key]["filterwidth"]}`;
                document.getElementById(graphnodes[key]["id"]).setAttribute("style", `transition: 'background 1s'; background: url('./../Images/${graphnodes[key]["fadeout"]}'); height: ${newheight}; width: ${newwidth};`);
                document.getElementById(graphnodes[key]["id"]+"button").setAttribute("style", `color: ${fadeoutfilter_text};`);
    }
        
        
        document.getElementById('all_nodes').setAttribute("style", `color: ${selectedfilter_text};`);})
});
function addfilter(){
  for(var key in graphnodes){
      var x = `../../Images/${graphnodes[key]["fadeout"]}`;
      var height = `${graphnodes[key]["filterheight"]}`;
      var width = `${graphnodes[key]["filterwidth"]}`;
      var id=`${graphnodes[key]["id"]}`;
      $('.filter').append(`<div class="sub-filter filter_by" type="button"  data-filter_by="${key}"><div class='filter-img' style="background: url('${x}'); height: ${height}; width: ${width};" id = '${id}'></div>
                                <button type="button" class="filter_by" data-filter_by="${key}"  id = '${id}button'>
                                    ${key}
                                </button>
                            </div><br/>`);
  }
    $('.filter').append(`<div class="sub-filter"><div class="filter-img" style=" height: 50px; width: 40px;" id="Transport xx"></div>
                                <button type="button" id="all_nodes">
                                    All
                                </button>
                            </div><br/>`);
    
}
