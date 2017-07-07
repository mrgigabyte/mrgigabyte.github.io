$( document ).ready(function() {
    basic();
});


function addfilter(){
  for(var key in graphnodes){
      var x = `../../Images/${graphnodes[key]["image"]}`;
      var height = `${graphnodes[key]["filterheight"]}`;
      var width = `${graphnodes[key]["filterwidth"]}`;
      var id=`${graphnodes[key]["id"]}`;
      $('.filter').append(`<div class="sub-filter filter_by" type="button"  data-filter_by="${key}"><div class='filter-img' style="background: url('${x}'); height: ${height}; width: ${width};" id = '${id}'></div>
                                <button type="button" class="filter_by" data-filter_by="${key}"  id = '${id}button' style="color:${selectedfilter_text}">
                                    ${key}
                                </button>
                            </div><br/>`);
  }
    $('.filter').append(`<div class="sub-filter"><div class="filter-img" style=" height: 50px; width: 40px;" id="Transport xx"></div>
                                <button type="button" id="all_nodes">
                                    All
                                </button>
                            </div><br/>`)
    $('#all_nodes').addClass('isDisabled');
    document.getElementById(id+"button").setAttribute("style", `color: ${selectedfilter_text};`);
};

function basic(){
    $('.filter').html("")
    addfilter();
    addlegends();
    $('#all_nodes').click(function(){
        
        for(var key in graphnodes){
                var newheight = `${graphnodes[key]["filterheight"]}`;
                var newwidth = `${graphnodes[key]["filterwidth"]}`;
                document.getElementById(graphnodes[key]["id"]).setAttribute("style", `transition: 'background 1s'; background: url('./../Images/${graphnodes[key]["image"]}'); height: ${newheight}; width: ${newwidth};`);
                document.getElementById(graphnodes[key]["id"]+"button").setAttribute("style", `color: ${selectedfilter_text};`);
    }
        
    $('#all_nodes').addClass('isDisabled'); 
    })
    
}


function addlegends(){
    for(var key in stroke){
        var color = stroke[key]["color"];
        var type = stroke[key]["name"];
        $('.legends').append(`<div class="legends-key ${type.replace(/\s+/, "")}" id="legendskey">${type} </div>`)
        document.styleSheets[0].insertRule(`.${type.replace(/\s+/, "")}::after { border-top: 1px solid ${color}; }`, 0);
    }
};
