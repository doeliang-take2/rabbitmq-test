
function submitorder(){
    $.ajax({
        url: 'http://localhost:3000/api/v1/order',
        type: 'post',
        data: {'price':'235'},
        dataType: 'text',
        success: function (data) {
            window.location.href="http://localhost:3000/paypage.html"+"?oid="+data;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus.toString());
        }
    })
}

function proceeorder() {
    let params = parseQueryString();
    $.ajax({
        url: 'http://localhost:3000/api/v1/pay/'+params["oid"],
        type: 'post',
        data: {'oid':params["oid"]},
        dataType: 'text',
        success: function (data) {

            window.location.href="http://localhost:3000/orderlist.html";
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus.toString());
        }
    })
}

var parseQueryString = function() {

    var str = window.location.search;
    var objURL = {};

    str.replace(
        new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
        function( $0, $1, $2, $3 ){
            objURL[ $1 ] = $3;
        }
    );
    return objURL;
};
