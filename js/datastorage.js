var orderJson = '[     {         "Title": "Drinks",         "SubTitle": [             "Thirst Quenchers",             "Juices",             "Tea Coffee",             "Shakes",             "Beer",             "Wines"         ]     },     {         "Title": "Starters",         "SubTitle": [             "Soups and salads"         ]     },     {         "Title": "Main",         "SubTitle": [             "Mains",             "Burgers",             "Kids", "Christmas Menu"         ]     },     {         "Title": "Dessert",         "SubTitle": [             "Desserts"         ]     } ]';

function storage(key,data){
    sessionStorage.setItem(key,data);
   // setCookie(key, data);
  //  console.log(localStorage.getItem('order'));
}

function setCookie(c_name,value,exdays){
  var exdate=new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
  document.cookie=c_name + "=" + c_value;
}

function delCookie(name)
{
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getCookie(c_name) {
/*
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
	*/
	if(sessionStorage.getItem(c_name) != null && sessionStorage.getItem(c_name) != "")
	 return sessionStorage.getItem(c_name);
	
    return "";
	
}


function saveGestDetails(){
  var date = new Date();
   var month = date.getMonth() + 1;
  var currentdate = date.getDate()+"/"+month+"/"+date.getFullYear();
  var time = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
  var myOrder= new Array();
  myOrder['date'] = currentdate;
  myOrder['time'] = time;
 	if ($('#table-num option:selected').val() != "")
	    myOrder['table'] = $("#table-num").val();
	else
		myOrder['table'] = $("#txt-table-num").val();
  
  myOrder['waiter'] = $("#server-num").val();
  myOrder['pax'] = $("#pax").val();
  myOrder['menu'] = $("#menu-item").val();
  myOrder['ordertype'] = $("#menu-type").val();
  myOrder['pref'] = new Array();
  myOrder['cart'] = new Array();
  myOrder = $.extend({},myOrder);
  
  /* For Repeat Order */
  
  if ($('#table-num option:selected').val() != "")
	    $('#hdnRepeat').attr('data-table',$("#table-num").val());
	else
		$('#hdnRepeat').attr('data-table',$("#txt-table-num").val());
$('#hdnRepeat').attr('data-repeat',$("#menu-type").val());
$('#hdnRepeat').attr('data-date',currentdate);
$('#hdnRepeat').attr('data-time',time);

 /* --------------- */

 if($('#menu-type option:selected').val() != "New")
   storage("close","yes");
   else
     storage("close","no");

 storage("order",JSON.stringify(myOrder));
storage("spOrder",JSON.stringify(myOrder));
window.location.href='aboutus.html';
}

function getCustomerPref(){

  var myorder = jQuery.parseJSON(getCookie('order'));
  //console.log(myorder['pref'].length);
  var pref_array = new Array();
  pref_array['veg'] = $('input:radio[name=food-veg]:checked').val();
  pref_array['alcohol'] = $('input:radio[name=drink-alcohol]:checked').val();
  pref_array['spicy'] =  $('input:radio[name=spicy-food]:checked').val();
  myorder['customername'] = $('#customer-name').val();
  myorder['email'] = $('#customer-email').val();
  myorder['mobile'] = $('#customer-mobile').val();

  pref_array = $.extend({}, pref_array);
  myorder['pref'] = pref_array;
  var res = JSON.stringify(myorder);
  storage("order",res);
  // console.log(jQuery.parseJSON(localStorage.getItem("order")));
  window.location.href='aboutus.html';
}

function renderFoodOrderSummery(){
    var myorder = jQuery.parseJSON(getCookie('order'));
    var mysporder = jQuery.parseJSON(getCookie('spOrder'));
    var grand_total=0;
    var SITotol = 0;
    $.each(myorder.cart,function(k,v){
    if(v){
	if(v.special == 1)
	{
	 	   
	  for(var j=1; j<= v.qty ; j++)
	  {	     
	      var html1 = "<tr><td  style='width:70%'><img src='"+v.img+"'><h3>"+v.name+"</h3></td><td><span>1</span>x<span>"+v.unit_price+"</span></td><td style='width:30%'><a href='javascript:void(0)' class='cart-btn'><img class='cartsub' src='img/minus.png' alt='substract' data-qty = "+j+" data-id='"+v.item_id+"'></a></td></tr>";
	       $("#tbody").append(html1);
	
		 for(var i=0 ; i< mysporder.cart.length ;i++)
		   {
			  if(mysporder.cart[i] != null && mysporder.cart[i].item_id == v.item_id+(j.toString()))
			 {
		
			    var	html2 = "<tr><td><h3 style='margin-left:100px'>"+mysporder.cart[i].name+"</h3></td><td><span>"+mysporder.cart[i].qty+"</span>x<span>"+mysporder.cart[i].unit_price+"</span></td></tr>";
             	$("#tbody").append(html2);		 
			    SITotol = parseFloat(mysporder.cart[i].unit_price)*parseInt(mysporder.cart[i].qty);
			 }
		   }
		    $("#tbody").append("<tr><td colspan='3' style= 'border-bottom:1px solid #000000'><p></p></td></tr>" );	   
	   }
	    
	}
	else
	{
      var html3 = "<tr><td style='width:70%'><img src='"+v.img+"'><h3>"+v.name+"</h3></td><td><span>"+v.qty+"</span>x<span>"+v.unit_price+"</span></td><td style='width:30%'><a href='javascript:void(0)' class='cart-btn cartadd'  data-id='"+v.item_id+"'><img src='img/plus.png' alt='add' class='' ></a><a href='javascript:void(0)' class='cart-btn'><img class='cartsub' src='img/minus.png' alt='substract' data-qty = '' data-id='"+v.item_id+"'></a><a href='javascript:void(0)' class='cart-btn'><img src='img/delete.png' alt='delete' data-id='"+v.item_id+"' class='cartdel'></a></td></tr>";
	   html3 = html3 +"<tr><td colspan='3' style= 'border-bottom:1px solid #000000'><p></p></td></tr>";
	  $("#tbody").append(html3);
    }
	// ANUBHAV 8 / 7 / 2013
	  	 	  
      var total = parseFloat(v.unit_price)*parseInt(v.qty)+ parseFloat(SITotol) ;
      grand_total = parseFloat(parseFloat(total)+parseFloat(grand_total)).toFixed(1);
      }
   });
   
     $(".grand_total").html(grand_total);

     $('.cartadd').click(function(e){
        var id = $(e.currentTarget).data('id');
        addCart(id);
      });

      $('.cartsub').click(function(e){
        var id = $(e.currentTarget).data('id');
		var qty = $(e.currentTarget).data('qty');
        subCart(id,qty);
      });

      $('.cartdel').click(function(e){
        var id = $(e.currentTarget).data('id');
        deleteCartItem(id);
      });
}

function addCart(id){
   var myorder = jQuery.parseJSON(getCookie('order'));
   $.each(myorder.cart,function(key,val){
      if(val){
        if(val.item_id==id){
          val.qty=parseInt(val.qty)+parseInt(1);
        }
      }
     });
     storage("order",JSON.stringify(myorder));
     window.location.reload();
	 
}

function subCart(id,qnty){
   var myorder = jQuery.parseJSON(getCookie('order'));
   var mysporder = jQuery.parseJSON(getCookie('spOrder'));

   $.each(myorder.cart,function(key,val){
     if(val){
      if(val.item_id==id){	  
        if(val.qty>1){	
	
			  for (var p=0;p<mysporder.cart.length;p++)
			  {
			
			     if(mysporder.cart[p] != null && mysporder.cart[p].item_id == val.item_id+qnty.toString())
				 {
				 
				//	mysporder.cart.splice(p,1);
						
					delete mysporder.cart[p];
				 }
				    
			  }
	  
		
         val.qty = parseInt(val.qty)-parseInt(1);
        }else{
		     for (var p=0;p<mysporder.cart.length ; p++)
			  {
			   
			     if(mysporder.cart[p] != null && mysporder.cart[p].item_id == val.item_id+qnty.toString())
				 {
				
				//	mysporder.cart.splice(p,1);
					
				     delete mysporder.cart[p];
				 }
			  }
          var cart = myorder.cart;
             // cart.splice(key,1);
               delete cart[key];
        }						  
      }
    }
   });
   
   storage("order",JSON.stringify(myorder));
    storage("spOrder",JSON.stringify(mysporder));
    ReconstructJson(id);
	
   window.location.reload();
}


// METHOD ADDDED BY ANUBHAV 
function ReconstructJson(id)
{
  var myorder = jQuery.parseJSON(getCookie('order'));
   var mysporder = jQuery.parseJSON(getCookie('spOrder'));

  	/* this reconstructs the json */
	$.each(myorder.cart,function(key,val){
		if(val){
			if(val.item_id==id){	  
				if(val.qty>0){	
					for (var p=0;p<mysporder.cart.length ; p++)
					{
					  
						if(mysporder.cart[p] != null && mysporder.cart[p].item_id.slice(0,-1) == val.item_id)
						{	
				
							if(val.qty == 1 && mysporder.cart[p].item_id.charAt( mysporder.cart[p].item_id.length-1 ) > 1)
							{
							  mysporder.cart[p].item_id = (parseInt(mysporder.cart[p].item_id) - 1).toString();
							
							  }
							
						  if(mysporder.cart[p].item_id.charAt( mysporder.cart[p].item_id.length-1 ) > 1 && mysporder.cart[p].item_id.charAt( mysporder.cart[p].item_id.length-1 ) >= val.qty)
							  {
					
								mysporder.cart[p].item_id = (parseInt(mysporder.cart[p].item_id) - 1).toString();
								 
							}
						}
					}
				}
			}
		}
	});
	 
	 storage("spOrder",JSON.stringify(mysporder));
	/* ************************** */
}

function deleteCartItem(id){
     var myorder = jQuery.parseJSON(getCookie('order'));
     $.each(myorder.cart,function(key,val){
      if(val){
        if(val.item_id==id){
            var cart = myorder.cart;
            delete cart[key];
        }
      }
    });
   
	 storage("order",JSON.stringify(myorder));	  	  
     window.location.reload();
}

function checkOut(){
	var myorder = jQuery.parseJSON(getCookie('order'));
if(JSON.stringify(myorder.cart) == "[]")
	   $("#tbody").html("<h3 style='text-align:center;color:#ff0000'>Cart is Empty</h1>");		 
else
{
	 myorder['request'] = $('#request').val();
	 storage("order",JSON.stringify(myorder));
	 window.location.href='cart.html';
}
}

function placeOrder(){
  var myorder = jQuery.parseJSON(getCookie('order'));
  var BroadCtg = jQuery.parseJSON(orderJson);
   var date = new Date();
    var month = date.getMonth() + 1;
    var currentdate = date.getDate()+"/"+month+"/"+date.getFullYear();
	
if(getCookie("odt") != null && getCookie("odt") != "" && getCookie("odt") == currentdate)   /* odt contains the date of last order*/
	{
		if(currentdate == myorder.date)
		{

			if(getCookie("odn") != null && getCookie("odn") != "" && getCookie("odn") != NaN)
			{
				var newOdn = parseInt(getCookie("odn")) + parseInt("1");
				storage("odn", newOdn);
			}
			else
				storage("odn", "1");
		}
		else
			storage("odn", "1");
	}
else
	storage("odn", "1");
	   
	   
  $('#printCtg').val(JSON.stringify(BroadCtg));
  
  var orders = null;
  if(!getCookie('orders')){
    orders= new Array();
  }else{
    orders = jQuery.parseJSON(getCookie('orders'));
  }
  orders.push(jQuery.parseJSON(getCookie('order')));
  //console.log(orders);
  storage('orders', JSON.stringify(orders));
   var html = "";
   var prevCat = "";
   var cat = new Array();
   var mysporder = jQuery.parseJSON(getCookie('spOrder'));
	
	/*   JSON ARRAY FOR PRINTING   */

  var myPrintOrder= new Array();
  myPrintOrder['Header'] = new Array();
  myPrintOrder['Cart'] = new Array();
  myPrintOrder = $.extend({},myPrintOrder);
   
	var head_array = new Array();
	head_array['OrderNo'] = getCookie("odn");
	head_array['Date'] = myorder.date;
	head_array['Time'] = myorder.time;
	head_array['Table No'] = myorder.table;
	head_array['Server'] = myorder.waiter;
	head_array['Pax'] = myorder.pax;
	head_array['Menu'] = myorder.menu;
	head_array['name'] = "";
	head_array['email'] = "";
	head_array['mobile'] = "";
	head_array['ccc'] = "";
	head_array['OrderType'] = myorder.ordertype;
	head_array['total'] = $(".grand_total").html();
	head_array['Request Note'] = myorder.request;
	head_array = $.extend({},head_array);
	myPrintOrder['Header'] = head_array;
  
  for(var p = 0; p<BroadCtg.length;p++)
  {    
	$.each(BroadCtg[p].SubTitle,function(k,q){
		
				var j;
		
		  for(var i=0 ; i< myorder.cart.length ;i++)
		  {
			var x= myorder.cart[i];
			
			if(x != null && cat.indexOf(x.category) == -1 && x.category == q)
			{			
				for(j=i;j<myorder.cart.length ;j++)
				{
					var y= myorder.cart[j];
					if(y != null)
					{
						if( x.category == y.category && cat.indexOf(x.category) == -1 )
							cat.push(x.category);
							
						if(x.special == 1)
						{
							if(x.category == y.category)
								{  
								for(var n=1; n<= y.qty ; n++){
									var cart_array = new Array();
									cart_array['Category'] = y.category;
									cart_array['Item_id'] = y.item_id.toString();
									cart_array['Item'] = y.name;
									cart_array['Qty'] = "1";
									cart_array['Unit_Price'] = y.unit_price.toString();
									cart_array['Price'] = y.price.toString();
									cart_array['Sub'] = new Array;
									
									for(var k=0 ; k< mysporder.cart.length ;k++)
									{
										if( mysporder.cart[k] != null &&  mysporder.cart[k].item_id == y.item_id + n.toString())
										{
											var sub_array = new Array();
											sub_array['Item'] = mysporder.cart[k].name;
											sub_array['Qty'] = mysporder.cart[k].qty.toString();
											sub_array['Price'] = mysporder.cart[k].unit_price.toString();
											sub_array = $.extend({},sub_array);
											cart_array['Sub'].push(sub_array);
										}						
									}
									cart_array = $.extend({},cart_array);
									
									myPrintOrder['Cart'].push(cart_array); 
									}
								} 						    
						}		
							else
						{
							if(x.category==y.category)
							{  
								var cart_array = new Array();
								cart_array['Category'] = y.category;
								cart_array['Item_id'] = y.item_id.toString();
								cart_array['Item'] = y.name;
								cart_array['Qty'] = y.qty.toString();
								cart_array['Unit_Price'] = y.unit_price.toString();
								cart_array['Price'] = y.price.toString();
								cart_array['Sub'] = new Array;
								
								for(var k=0 ; k< mysporder.cart.length ;k++)
								{
									if( mysporder.cart[k] != null && mysporder.cart[k].item_id == y.item_id+y.qty.toString())
									{
										var sub_array = new Array();
										sub_array['Item'] = mysporder.cart[k].name;
										sub_array['Qty'] = mysporder.cart[k].qty.toString();
										sub_array = $.extend({},sub_array);
										cart_array['Sub'].push(sub_array);
									}						
								}
								cart_array = $.extend({},cart_array);								
								myPrintOrder['Cart'].push(cart_array); 
							} 
						}				
					
					}
				}
			}
		} 
  	
	});
	
}
 // alert(JSON.stringify(myPrintOrder));
  storage("close","no");
  $('#printHtml').val(JSON.stringify(myPrintOrder));
}

/* BELOW METHODS ARE ADDED BY ANUBHAV */
function WhatNext(printerAvailable,Success)
{
var myorder = jQuery.parseJSON(getCookie('order'));
   if(printerAvailable == 1 && Success == 1)
   {
	  if(myorder.customername==''||myorder.email==''||myorder.mobile==''){
		window.location.href='details_reminder.html';
	  } else{
		window.location.href='index.html';			
	  }
   }
   
 if(printerAvailable == 2 && Success == 2)
   {
	 
		window.location.href='table_details.html';
   }    
}

// Below function validates mandatory instruction selection
function ValidateSpecialIntruction(mode){
	var result=false;
	
	if(mode == "ib")
	{
		 if($('input[name="patty"]').is(':checked') && $('input[name="side"]').is(':checked')) {
			result = true;
		 }
		 
		 else
		 {
		   result=false; 
		   $().toastmessage('showWarningToast', "Please select both Patty and Side"); 
		   }
	}
	
	if(mode == "mw" || mode == "rare"){
		 if($('input[name="patty"]').is(':checked')) {
			result = true;
		 }
		 else
		 {
		   result=false; 
		   $().toastmessage('showWarningToast', "Please select Patty"); 
		   }
	}
	
    if(mode == "ib1" || mode== "fs" || mode == "sauce"){
		if($('input[name="side"]').is(':checked')) {
		   result = true;
		}
		else
		   {
		   result=false; 
		   $().toastmessage('showWarningToast', "Please select Side"); 
		   }
	}
	return result;
}

function CollectSpecialInstruction(mode) {

  AddToCartSpecial();
var instr = eval(spJson); 
var k = $('#hdnSp').val();
var mysporder = jQuery.parseJSON(getCookie('spOrder'));	
var myorder = jQuery.parseJSON(getCookie('order'));	
var cart_obj = myorder.cart;
var spcart_obj = mysporder.cart;
var item = null;
var qnty= "1";
for(var i=0; i<myorder.cart.length;i++)
{
   if(myorder.cart[i] != null && myorder.cart[i].item_id == instr[k].id && myorder.cart[i].qty > 1)
   {
		qnty = myorder.cart[i].qty.toString();
   }
}
//var itemFound = false;

            var Patty = $('input[name="patty"]:checked').val();
            var Side = $('input[name="side"]:checked').val();
            var hdnPatty = $('input[for="' + Patty + '"]').val();
            var hdnSide = $('input[for="' + Side + '"]').val();
		 
		  if($('input[name="patty"]').is(':checked')) {
			if(mode == "ib" || mode == "mw" || mode == "rare"){
			
				 item = 
				{
					sp_id : instr[k].spid,
					item_id: instr[k].id+qnty,
					name: "<b>"+Patty+"</b>",
					qty: 1,
					desc: "",
					img: "",
					unit_price: hdnPatty,
					price: hdnPatty
				}
			   
				 spcart_obj.push(item);
			 } 
		  }
		      if($('input[name="side"]').is(':checked')) {
			if(mode == "ib" || mode == "ib1" || mode== "fs" || mode == "sauce"){
			
				   item = 
				{
					sp_id : instr[k].spid,
					item_id: instr[k].id+qnty,
					name: "<b>"+Side+"</b>",
					qty: 1,
					desc: "",
					img: "",
					unit_price: hdnSide,
					price: hdnSide
				}
			   
				 spcart_obj.push(item);
				
			}
		}
		 
		 if(mode == "ib" || mode == "ib1" || mode == "ib2" || mode == "sauce"){
	            if ($('input[name="Add Cheese"]').prop('checked')) {
				item = 
					{
						sp_id : instr[k].spid,
						item_id: instr[k].id+qnty,
						name: "<b>Add Cheese</b>",
						qty: 1,
						desc: "",
						img: "",
						unit_price: 2,
						price: 2
					}
			   
					spcart_obj.push(item);
				}
				
				if ($('input[name="Add Bacon"]').prop('checked')) {
					item = 
					{
						sp_id : instr[k].spid,
						item_id: instr[k].id+qnty,
						name: "<b>Add Bacon</b>",
						qty: 1,
						desc: "",
						img: "",
						unit_price: 3,
						price: 3
					}
			   
					spcart_obj.push(item);
				}
				if ($('input[name="Add Sunny Side Up"]').prop('checked')) {
					 item = 
					{
						sp_id : instr[k].spid,
						item_id: instr[k].id+qnty,
						name: "<b>Add Sunny Side Up</b>",
						qty: 1,
						desc: "",
						img: "",
						unit_price: 2.8,
						price: 2.8
					}
			   
					spcart_obj.push(item);
				}
				
				if ($('input[name="Make it a Happy Meal"]').prop('checked')) {
					 item = 
					{
						sp_id : instr[k].spid,
						item_id: instr[k].id+qnty,
						name: "<b>Make it a Happy Meal (32.9)</b>",
						qty: 1,
						desc: "",
						img: "",
						unit_price: 0,
						price: 0
					}
			   
					spcart_obj.push(item);
				}
			}
			
			 if (mode == "ni" || mode == "nis")
			{
			     if ($('input[name="No Ice"]').prop('checked')) {
					 item = 
					{
						sp_id : instr[k].spid,
						item_id: instr[k].id+qnty,
						name: "<b>No Ice</b>",
						qty: 1,
						desc: "",
						img: "",
						unit_price: 0,
						price: 0
					}
			   
					spcart_obj.push(item);
				}
			}
			
			 if( mode == "nis")
			{
			    if ($('input[name="No Sugar"]').prop('checked')) {
					 item = 
					{
						sp_id : instr[k].spid,
						item_id: instr[k].id+qnty,
						name: "<b>No Sugar</b>",
						qty: 1,
						desc: "",
						img: "",
						unit_price: 0,
						price: 0
					}
			   
					spcart_obj.push(item);
				}
			}
			
			 if( mode == "nb")
			{
			    if ($('input[name="No Beans"]').prop('checked')) {
					 item = 
					{
						sp_id : instr[k].spid,
						item_id: instr[k].id+qnty,
						name: "<b>No Beans</b>",
						qty: 1,
						desc: "",
						img: "",
						unit_price: 0,
						price: 0
					}
			   
					spcart_obj.push(item);
				}
			}
						
			 if( mode == "ls")
			{
			    if ($('input[name="Less Spicy"]').prop('checked')) {
					 item = 
					{
						sp_id : instr[k].spid,
						item_id: instr[k].id+qnty,
						name: "<b>Less Spicy</b>",
						qty: 1,
						desc: "",
						img: "",
						unit_price: 0,
						price: 0
					}
			   
					spcart_obj.push(item);
				}
			}
			
			 if( mode == "ds" || mode == "dsaf")
			{
			    if ($('input[name="Dressing on the side"]').prop('checked')) {
					 item = 
					{
						sp_id : instr[k].spid,
						item_id: instr[k].id+qnty,
						name: "<b>Dressing on the side</b>",
						qty: 1,
						desc: "",
						img: "",
						unit_price: 0,
						price: 0
					}
			   
					spcart_obj.push(item);
				}
			}
			
			 if( mode == "af" )
			{
			    if ($('input[name="Add Focaccia bread to Mushroom Soup"]').prop('checked')) {
					 item = 
					{
						sp_id : instr[k].spid,
						item_id : instr[k].id+qnty,
						name: "<b>Add Focaccia bread to Mushroom Soup</b>",
						qty: 1,
						desc: "",
						img: "",
						unit_price: 1.5,
						price: 1.5
					}
			   
					spcart_obj.push(item);
				}
			}
			
			if( mode == "dsaf")
			{			  			
			    if ($('input[name="Add Focaccia bread to Tuna Salad"]').prop('checked')) {
					 item = 
					{
						sp_id : instr[k].spid,
						item_id: instr[k].id+qnty,
						name: "<b>Add Focaccia bread to Tuna Salad</b>",
						qty: 1,
						desc: "",
						img: "",
						unit_price: 1.5,
						price: 1.5
					}
			   
					spcart_obj.push(item);
				}
			}
			
			 if( mode == "ns")
			{
			    if ($('input[name="Not Spicy"]').prop('checked')) {
					 item = 
					{
						sp_id : instr[k].spid,
						item_id: instr[k].id+qnty,
						name: "<b>Not Spicy</b>",
						qty: 1,
						desc: "",
						img: "",
						unit_price: 0,
						price: 0
					}
			   
					spcart_obj.push(item);
				}
			}
			
			 if( mode == "hl")
			{
			    if ($('input[name="Hold"]').prop('checked')) {
					 item = 
					{
						sp_id : instr[k].spid,
						item_id: instr[k].id+qnty,
						name: "<b>Hold</b>",
						qty: 1,
						desc: "",
						img: "",
						unit_price: 0,
						price: 0
					}
			   
					spcart_obj.push(item);
				}
			}
			
			 if( mode == "of" || mode == "af")
			{
			    if ($('input[name="OutFirst"]').prop('checked')) {
					 item = 
					{
						sp_id : instr[k].spid,
						item_id: instr[k].id+qnty,
						name: "<b>OutFirst</b>",
						qty: 1,
						desc: "",
						img: "",
						unit_price: 0,
						price: 0
					}
			   
					spcart_obj.push(item);
				}
			}
			
		
			
			 if(mode != "cmt")
			{
			    var Note = $('textarea[name="Request Note"]').val();
				if(Note != ""){
					 item = 
					{
						sp_id : instr[k].spid,
						item_id: instr[k].id+qnty,
						name: "<p><b>"+Note+"</b></p>",
						qty: 1,
						desc: "",
						img: "",
						unit_price: 0,
						price: 0
					}
			   
					spcart_obj.push(item);
			   }	
			}
			
				if( mode == "exs")
			{
			    if ($('input[name="Add Extra Shot"]').prop('checked')) {
					 item = 
					{
						sp_id : instr[k].spid,
						item_id: instr[k].id+qnty,
						name: "<b>Add Extra Shot</b>",
						qty: 1,
						desc: "",
						img: "",
						unit_price: 0.5,
						price: 0.5
					}
			   
					spcart_obj.push(item);
				}
			}
			
				if( mode == "ai" || mode == "exs" || mode == "sk" || mode == "dcf")
			{
			    if ($('input[name="Add Ice"]').prop('checked')) {
					 item = 
					{
						sp_id : instr[k].spid,
						item_id: instr[k].id+qnty,
						name: "<b>Add Ice</b>",
						qty: 1,
						desc: "",
						img: "",
						unit_price: 1,
						price: 1
					}
			   
					spcart_obj.push(item);
				}
			}
			
							if( mode == "exs" || mode == "sk" || mode == "dcf")
			{
			    if ($('input[name="Decaf"]').prop('checked')) {
					 item = 
					{
						sp_id : instr[k].spid,
						item_id: instr[k].id+qnty,
						name: "<b>Decaf</b>",
						qty: 1,
						desc: "",
						img: "",
						unit_price: 0,
						price: 0
					}
			   
					spcart_obj.push(item);
				}
			}
			
				if(mode == 'sk')
					{	
						if ($('input[name="Skinny"]').prop('checked')) {
						 item = 
						{
							sp_id : instr[k].spid,
							item_id: instr[k].id+qnty,
							name: "<b>Skinny</b>",
							qty: 1,
							desc: "",
							img: "",
							unit_price: 0,
							price: 0
						}
				   
						spcart_obj.push(item);
					}
				}
				
				if(mode == "sauce") {
					if ($('input[name="Sauce On the Side"]').prop('checked')) {
						 item = 
						{
							sp_id : instr[k].spid,
							item_id: instr[k].id+qnty,
							name: "<b>Sauce On the Side</b>",
							qty: 1,
							desc: "",
							img: "",
							unit_price: 0,
							price: 0
						}
				   
						spcart_obj.push(item);
					}
				}
				
			 if( mode == "cmt")
			{
			    var Note = $('textarea[name="Special Comments"]').val();
				if(Note != ""){
					 item = 
					{
						sp_id : instr[k].spid,
						item_id: instr[k].id+qnty,
						name: "<p><b>"+Note+"</b></p>",
						qty: 1,
						desc: "",
						img: "",
						unit_price: 0,
						price: 0
					}
			   
					spcart_obj.push(item);
			   }	
			}	
				
			
            //if(!itemFound){

		//	}
			storage("spOrder",JSON.stringify(mysporder));
           // alert(JSON.stringify(mysporder));
       
	  $('.simplemodal-close').click();
	    
  }
  
function AddToCartSpecial(spid)
{
     var store = new Array();
      store = getCookie('mystore');  //name,desc,logo,price,id,category
	  store = store.split(";$");
	   var myorder = jQuery.parseJSON(getCookie('order'));	   
       var price = store[3];
       var unit_price= price;
       var id = store[4];
	   
       var qty = 1;
       var name =  store[0];
       var desc = store[1];
	   var category = store[5];
       var imgsrc = store[2];
       var cart_obj = myorder.cart;
       var new_cart = new Array();
       var item = null;
       var itemFound = false;
		
       for(i = 0; i < cart_obj.length;i++){
          var item = cart_obj[i];
		
          if(item){
		 
            if(item.item_id == id){			 
              item.qty++;
			  $('#sp_'+item.item_id).html(item.qty); 			  
              itemFound = true;
          //  item.desc = item.desc;
              item.name = item.name;
			  item.category = item.category;
			  item.unit_price = item.unit_price;
			  item.price = item.qty * item.unit_price;	
			
            }			
          }
       }
	   
       if(!itemFound){
        item = {
              item_id:id,
              name: name,
              qty: 1,
            //  desc: desc,
              img: imgsrc,
			  category: category,
              unit_price: unit_price,
              price: price,
			  special:1
			
            }
            cart_obj.push(item);
			 $('#sp_'+item.item_id).html(item.qty); 
       }

      storage("order",JSON.stringify(myorder));
	  //alert(JSON.stringify(myorder));
  }
  
function AddItemToCart(name,desc,logo,price,id,category,special){
name = unescape(name);
desc = unescape(desc);
	if( special == 1)
	{
	   var instr = eval(spJson); 
	   var store = name+";$"+desc+";$"+logo+";$"+price+";$"+id+";$"+category;
		storage("mystore",store);
			for(var k = 0; k < instr.length; k++)
			{			   
				if(id == instr[k].id)
				{
					$('#hdnSp').val(k);
					$('#basic-modal-content').html(window[instr[k].specialinstruction]);
					$('#basic-modal-content').modal();
				}
			}
	}
	else
	{
		   var myorder = jQuery.parseJSON(getCookie('order'));	   
		   var price = price;
		   var unit_price= price;
		   var id = id;	   
		   var qty = 1;
		   var name =  name;
		   var desc = desc;
		   var category = category;
		   var imgsrc = logo;
		   var cart_obj = myorder.cart;
		   var new_cart = new Array();
		   var item = null;
		   var itemFound = false;
			
		   for(i = 0; i < cart_obj.length;i++){
			  var item = cart_obj[i];
			
			  if(item){
			 
				if(item.item_id == id){			 
				  item.qty++;
				  $('#sp_'+item.item_id).html(item.qty); 			  
				  itemFound = true;
				 // item.desc = item.desc;
				  item.name = item.name;
				  item.category = item.category;
				  item.unit_price = item.unit_price;
				  item.price = item.qty * item.unit_price;			 
				}			
			  }
		   }
		   
		   if(!itemFound){
			item = {
				  item_id:id,
				  name: name,
				  qty: 1,
				  //desc: desc,
				  img: imgsrc,
				  category: category,
				  unit_price: unit_price,
				  price: price,
				  special:0
				}
				cart_obj.push(item);
				 $('#sp_'+item.item_id).html(item.qty); 
		   }

		  storage("order",JSON.stringify(myorder));
		
		  $('.simplemodal-close').click();
	}
}

/* FOR DISPLAYING DESCRIPTION OF ITEM IN POP UP */
function showDesc(name,desc,logo,price,id,category,special){
	var dishname = unescape(name);
	var dishdisc = unescape(desc);
	var str = "";
	str = str +"<table style='width:100%'>";
	str = str +"<tr><td style='width:20%'><img src='"+logo+"' alt='logo' /></td><td style='text-align: center; width:80%'><p style='font-size:1.5em;line-height:30px'>"+dishname+"</p></td></tr>";
	str = str +"<tr><td style='width:20%'>Price : "+price+"</td><td style='text-align: center; width:80%'><p style='font-size:1em'>"+dishdisc+"</p></td></tr>";
	str = str +"</table>";
	str = str +"<div class=\"btn-group pull-right\"> <a href=\"#\" onclick=\"AddItemToCart('"+name+"','"+desc+"','"+logo+"','"+price+"','"+id+"','"+category+"','"+special+"');\" ><img src='img/add.png' /></a><a href=\"#\" onclick=\"$(\'.simplemodal-close\').click();\" ><img src='img/close.png' /></a> </div>";
	$('#basic-modal-content').html(str);
	$('#basic-modal-content').modal();
}

function valid()
{
     //$("#table-num").css('border','.5px solid #454545');
	// $("#server-num").css('border','.5px solid #454545')
	// $("#menu-item").css('border','.5px solid #454545')
    var res = false;
    if($("#table-num").val() == "" && $("#txt-table-num").val() == "" )
	{
	//  $("#table-num").css('border','.5px solid #FF0000')
	$().toastmessage('showWarningToast', "Please select a table"); 
	}
	else if($("#server-num").val() == "")
	{
	//  $("#server-num").css('border','.5px solid #FF0000')
	$().toastmessage('showWarningToast', "Please select a server"); 
	}
	else if($("#menu-item").val() == "")
	{
	  //$("#menu-item").css('border','.5px solid #FF0000')
	  $().toastmessage('showWarningToast', "Please choose a menu"); 
	}
	else
	{
	// $("#table-num").css('border','.5px solid #454545');
	// $("#server-num").css('border','.5px solid #454545')
	// $("#menu-item").css('border','.5px solid #454545')
	   res = true;
	}
	   
	return res;    
}

function validRepeat()   // This function checks whether only table is entered before selecting Repeat order
{
	// $("#table-num").css('border','.5px solid #454545');
    var res = false;
    if($("#table-num").val() == "" && $("#txt-table-num").val() == "" )
	{
	$().toastmessage('showWarningToast', "Please select a table"); 
	  //$("#table-num").css('border','.5px solid #FF0000')
	}
	else if($("#menu-type option:selected").val() == "New")
	{
	$().toastmessage('showWarningToast', "Please select repeat order"); 
	  //$("#table-num").css('border','.5px solid #FF0000')
	}
	else
	{
	 //$("#table-num").css('border','.5px solid #454545');
	   res = true;
	}
	   
	return res;
}

function validTable()   // This function checks whether only table is entered before selecting Repeat order
{
	// $("#table-num").css('border','.5px solid #454545');
    var res = false;
    if($("#table-num").val() == "" && $("#txt-table-num").val() == "" )
	{
	$().toastmessage('showWarningToast', "Please select a table"); 
	  //$("#table-num").css('border','.5px solid #FF0000')
	}
	
	else
	{
	 //$("#table-num").css('border','.5px solid #454545');
	   res = true;
	}
	   
	return res;
}

function showPrvOrder()  //   For Showing previous orders
{

 var html ="<div style='position:absolute; top:1%; width:99%; left:0.5%;height:5%;background-color:#757575;border-radius: 5px 5px 5px 5px;color:#FFFFFF;font-size:1.3em;padding-top:4px;'>My last order</div><table style='width:100%;margin-top:7%;'><tr><td style='border-bottom:1px solid #000000;width:80%'><b>Item</b></td><td style='width:20%;border-bottom:1px solid #000000'><b>Qty</b></td></tr>"; 
	
	if(getCookie("prOrder") != "" && getCookie("prOrder") != null){

		var pjson = unescape(getCookie("prOrder"));

		pjson = pjson.replace(/\\"/g,'&quot;');

		var myorder = jQuery.parseJSON(pjson);
		
		$.each(myorder.Cart,function(k,v){
			if(v){
			html = html + "<tr><td style='width:70%'><h3>"+v.Item+"</h3></td><td><span>"+v.Qty+"</span></td></tr>";
			$.each(v.Sub,function(l,m){
				if(m){
				   html = html + "<tr><td style='padding-left:13%'> "+m.Item+"</td><td> "+m.Qty+"</td></tr>";
				}
			});
				}
				else
				   html = html + '<tr></td><h3>No Order Found</h3></td></tr>';
		});	
	
	}
	else
	{

		 html = html + '<tr><td><h3>No Order Found</h3></td></tr>';
	}
	html = html + '</table><div class="btn-group pull-right"><a href="inapp://capture" onclick="$(\'.simplemodal-close\').click();" ><img src="img/print.png" /></a><a href="#" onclick="$(\'.simplemodal-close\').click();" ><img src="img/close.png" /></a> </div> </div>';	
	$('#basic-modal-content').html(html);
	$('#basic-modal-content').modal();
	storage("close","no");
}

function releaseTable()
{

if(validTable()) { 
var date = new Date();
			var month = date.getMonth() + 1;
			var currentdate = date.getDate()+"/"+month+"/"+date.getFullYear();
  storage("prOrder","");
  storage("order","");
  if ($('#table-num option:selected').val() != "")
			{
		        storage("close",$("#table-num").val() +";" + currentdate);						
			}
			else
			{
				 storage("close",$("#txt-table-num").val()+";" + currentdate);
			}
			
  location.reload();
  }
  else
  return false
}

function showComOrder()
{ 
	var date = new Date();
	var month = date.getMonth() + 1;
	var currentdate = date.getDate()+"/"+month+"/"+date.getFullYear();
			
	if ($('#table-num option:selected').val() != "")
	    $('#hdnRepeat').attr('data-table',$("#table-num").val());
	else
		$('#hdnRepeat').attr('data-table',$("#txt-table-num").val());

	$('#hdnRepeat').attr('data-date',currentdate);
	window.location.href = 'CompleteOrder.html';
}
