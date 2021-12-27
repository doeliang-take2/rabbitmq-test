$(function () {
    queryAll();
});

function queryAll() {
    $.ajax({
        url: 'http://localhost:3000/api/v1/orderlist',
        type: 'GET',
        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            var tbodyHtml = "";
            for (let i = 1;i<=data.length;i++) {

                let status = "";
                if (data[i].status == 0) {
                    status = "未支付";
                } else if (data[i].status == 1) {
                    status = "已支付";
                } else if (data[i].status == 2) {
                    status = "订单超时取消";
                }
                $(".table").find('tbody').append("<tr><th scope='row'>"+i+"</th><th>"+data[i].price+"</th><th class='paystatus' onclick='payorder("+data[i].status+","+data[i].id+")'>"+status+"</th></tr>");
            }
        }
    })
}

function payorder(status,id) {
    console.log(status);
    if (status == 0){
        window.location.href="http://localhost:3000/paypage.html"+"?oid="+id;
    } else {
        alert("该订单已支付或过期")
    }
}
