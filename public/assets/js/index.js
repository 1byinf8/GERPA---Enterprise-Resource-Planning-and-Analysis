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
        fetch('/chart_home')
            .then(response => response.json())
            .then(data => {
                // Access each set of data individually
                const data1 = data.results;
                const data2 = data.results2;
                const data3 = data.results3;
                const data4 = data.results4;
                var ctx1 = $("#worldwide-sales").get(0).getContext("2d");
                var myChart1 = new Chart(ctx1, {
                    type: "bar",
                    data: {
                        labels: [data1[0].productid,data1[1].productid,data1[2].productid,data1[3].productid,data1[4].productid,data1[5].productid,data1[6].productid],//productid
                        datasets: [
                            {
                                label: "Sales",//sales
                                data: [data3[0].totalSales, data3[1].totalSales, data3[2].totalSales, data3[3].totalSales, data3[4].totalSales, data3[5].totalSales, data3[6].totalSales],
                                backgroundColor: "rgba(235, 22, 22, .5)"//amount earned from  on each product in sales
                            },
                            {
                                label: "Expenditure",//expenditure
                                data: [data2[0].totalExpens, data2[1].totalExpens, data2[2].totalExpens, data2[3].totalExpens, data2[4].totalExpens, data2[5].totalExpens, data2[6].totalExpens],//amount to purchase each product
                                backgroundColor: "rgba(235, 22, 22, .3)"
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
                        labels: [data4[0].category,data4[1].category,data4[2].category,data4[3].category,data4[4].category,data4[5].category,data4[6].category],//category
                        datasets: [{
                                label: "Purchases",
                                data: [data4[0].productCount,data4[1].productCount,data4[2].productCount,data4[3].productCount,data4[4].productCount,data4[5].productCount,data4[6].productCount],//no of products in each category
                                backgroundColor: "rgba(235, 22, 22, .7)",
                                fill: true
                            },
                        ]
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



    // Worldwide Sales Chart
  


    // Salse & Revenue Chart
   
    


    // Single Line Chart
    var ctx3 = $("#line-chart").get(0).getContext("2d");
    var myChart3 = new Chart(ctx3, {
        type: "line",
        data: {
            labels: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
            datasets: [{
                label: "Salse",
                fill: false,
                backgroundColor: "rgba(235, 22, 22, .7)",
                data: [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15]
            }]
        },
        options: {
            responsive: true
        }
    });


    // Single Bar Chart
    var ctx4 = $("#bar-chart").get(0).getContext("2d");
    var myChart4 = new Chart(ctx4, {
        type: "bar",
        data: {
            labels: ["Italy", "France", "Spain", "USA", "Argentina"],
            datasets: [{
                backgroundColor: [
                    "rgba(235, 22, 22, .7)",
                    "rgba(235, 22, 22, .6)",
                    "rgba(235, 22, 22, .5)",
                    "rgba(235, 22, 22, .4)",
                    "rgba(235, 22, 22, .3)"
                ],
                data: [55, 49, 44, 24, 15]
            }]
        },
        options: {
            responsive: true
        }
    });


    // Pie Chart
    var ctx5 = $("#pie-chart").get(0).getContext("2d");
    var myChart5 = new Chart(ctx5, {
        type: "pie",
        data: {
            labels: ["East", "West", "Central", "South"],
            datasets: [{
                backgroundColor: [
                    "rgba(235, 22, 22, .7)",
                    "rgba(235, 22, 22, .6)",
                    "rgba(235, 22, 22, .5)",
                    "rgba(235, 22, 22, .4)",
                    "rgba(235, 22, 22, .3)"
                ],
                data: [55, 49, 44, 24]
            }]
        },
        options: {
            responsive: true
        }
    });


    // Doughnut Chart
    var ctx6 = $("#doughnut-chart").get(0).getContext("2d");
    var myChart6 = new Chart(ctx6, {
        type: "doughnut",
        data: {
            labels: ["Technology", "Office Supplies", "Furniture"],
            datasets: [{
                backgroundColor: [
                    "rgba(235, 22, 22, .7)",
                    "rgba(235, 22, 22, .6)",
                    "rgba(235, 22, 22, .5)",
                    "rgba(235, 22, 22, .4)",
                    "rgba(235, 22, 22, .3)"
                ],
                data: [55, 49, 44]
            }]
        },
        options: {
            responsive: true
        }
    });

    
})(jQuery);

