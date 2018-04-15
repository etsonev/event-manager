jQuery('#startDate').datetimepicker({
  onChangeDateTime:function(dp,$input){
    console.log(new Date($input.val()))
  }
});
jQuery('#endDate').datetimepicker({
  onChangeDateTime:function(dp,$input){
    console.log(new Date($input.val()));
  }
});