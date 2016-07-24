$(document).ready(function(){
  /* jQueryKnob */
  $(".bg-teal-gradient .knob").knob({
            'min':0,
            'max':100,
            'step': 1,
            'displayPrevious': true,
            'readOnly': true,
            'draw' : function () { $(this.i).val(this.cv + '%'); }
        });
  /*
  $('input.knob').each(function() {
    $(this).attr("value", $(this).attr("value") + "%");
  });
  */
})
