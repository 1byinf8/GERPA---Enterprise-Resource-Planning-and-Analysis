(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Sidebar Toggler
    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content').toggleClass("open");
        return false;
    });


    // Progress Bar
    $('.pg-bar').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Calender
    $('#calender').datetimepicker({
        inline: true,
        format: 'L'
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
        nav : false
    });


    // Chart Global Color
    Chart.defaults.color = "#6C7293";
    Chart.defaults.borderColor = "#000000";


    document.addEventListener('DOMContentLoaded', function () {
        // Fetch data from the server
        fetch('/chart_insights')
            .then(response => response.json())
            .then(data => {
                // Access each set of data individually
                const data1 = data.results;
                const data2 = data.results2;
                const data3 = data.results3;
                const data4 = data.results4;
                const data5 = data.results5;
                const data6 = data.results6;
                console.log(data6[0].num_products);
                var ctx1 = $("#worldwide-sales").get(0).getContext("2d");
    var myChart1 = new Chart(ctx1, {
        type: "bar",
        data: {
            labels: [data1[0].productName,data1[1].productName,data1[2].productName,data1[3].productName,data1[4].productName,data1[5].productName,data1[6].productName],//product id
            datasets: [{
                    label: "Home Office",
                    data: [data1[0].quantity,data1[1].quantity,data1[2].quantity,data1[3].quantity,data1[4].quantity,data1[5].quantity,data1[6].quantity],//quantity from product table
                    backgroundColor: "rgba(235, 22, 22, .7)"
                },
                {
                    label: "Corporate",
                    data: [data1[0].price,data1[1].price,data1[2].price,data1[3].price,data1[4].price,data1[5].price,data1[6].price],//price from product table
                    backgroundColor: "rgba(235, 22, 22, .5)"
                }
            ]
            },
        options: {
            responsive: true
        }
    });
    var ctx2 = $("#salse-revenue").get(0).getContext("2d");
    var myChart2 = new Chart(ctx2, {
        type: "line",
        data: {
            labels: [data2[0].orderid,data2[1].orderid,data2[2].orderid,data2[3].orderid,data2[4].orderid,data2[5].orderid,data2[6].orderid],//order id frist 5 or 10
            datasets: [{
                    label: "Sales",
                    data: [data2[0].totalamount,data2[1].totalamount,data2[2].totalamount,data2[3].totalamount,data2[4].totalamount,data2[5].totalamount,data2[6].totalamount],//totalamount from order table
                    backgroundColor: "rgba(235, 22, 22, .7)",
                    fill: true
                },
            ]
            },
        options: {
            responsive: true
        }
    });
    var ctx3 = $("#line-chart").get(0).getContext("2d");
    var myChart3 = new Chart(ctx3, {
        type: "line",
        data: {
            labels: [data3[0].productid,data3[1].productid,data3[2].productid,data3[3].productid,data3[4].productid,data3[5].productid,data3[6].productid],//productid
            datasets: [{
                label: "Sales",
                fill: false,
                backgroundColor: "rgba(235, 22, 22, .7)",
                data: [data3[0].quantity,data3[1].quantity,data3[2].quantity,data3[3].quantity,data3[4].quantity,data3[5].quantity,data3[6].quantity]//no of orders with product id
            }]
        },
        options: {
            responsive: true
        }
    });
    var myChart4 = new Chart(ctx4, {
        type: "bar",
        data: {
            labels: [data4[0].purchaseid,data4[1].purchaseid,data4[2].purchaseid,data4[3].purchaseid,data4[4].purchaseid,data4[5].purchaseid,data4[6].purchaseid],//purchaseid
            datasets: [{
                label:"Cost",
                backgroundColor: [
                    "rgba(235, 22, 22, .7)",
                    "rgba(235, 22, 22, .6)",
                    "rgba(235, 22, 22, .5)",
                    "rgba(235, 22, 22, .4)",
                    "rgba(235, 22, 22, .3)"
                ],
                data: [data4[0].totalamount,data4[1].totalamount,data4[2].totalamount,data4[3].totalamount,data4[4].totalamount,data4[5].totalamount,data4[6].totalamount]//totalcost from purchase table
            }]
        },
        options: {
            responsive: true
        }
    });
    var ctx5 = $("#pie-chart").get(0).getContext("2d");
    var myChart5 = new Chart(ctx5, {
        type: "pie",
        data: {
            labels: [data5[0].employeename,data5[1].employeename,data5[2].employeename,data5[3].employeename,data5[4].employeename,data5[5].employeename],//employee id 
            datasets: [{
                backgroundColor: [
                    "rgba(235, 22, 22, .7)",
                    "rgba(235, 22, 22, .6)",
                    "rgba(235, 22, 22, .5)",
                    "rgba(235, 22, 22, .4)",
                    "rgba(235, 22, 22, .3)"
                ],
                data: [data5[0].noofsales,data5[1].noofsales,data5[2].noofsales,data5[3].noofsales,data5[4].noofsales,data5[5].noofsales]//noofsales from employee table
            }]
        },
        options: {
            responsive: true
        }
    });
    var ctx6 = $("#doughnut-chart").get(0).getContext("2d");
    var myChart6 = new Chart(ctx6, {
        type: "doughnut",
        data: {
            labels: [data6[0].category,data6[1].category,data6[2].category,data6[3].category,data6[4].category,data6[5].category,data6[6].category,data6[7].category,data6[8].category],//category
            datasets: [{
                backgroundColor: [
                    "rgba(235, 22, 22, .7)",
                    "rgba(235, 22, 22, .6)",
                    "rgba(235, 22, 22, .5)",
                    "rgba(235, 22, 22, .4)",
                    "rgba(235, 22, 22, .3)"
                ],
                data: [data6[0].num_products,data6[1].num_products,data6[2].num_products,data6[3].num_products,data6[4].num_products,data6[5].num_products,data6[6].num_products,data6[7].num_products,data6[8].num_products]//no of products int he category
            }]
        },
        options: {
            responsive: true
        }
    });


            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }); 




    // Single Bar Chart
    var ctx4 = $("#bar-chart").get(0).getContext("2d");



    // Pie Chart
    


    // Doughnut Chart
   
    
})(jQuery);

