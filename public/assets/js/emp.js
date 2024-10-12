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
        fetch('/chart_home_admin')
            .then(response => response.json())
            .then(data => {
                // Access each set of data individually
                const data1 = data.results;
                const data2 = data.results2;
                console.log(data2[0].noofsales);
                var ctx1 = $("#worldwide-sales").get(0).getContext("2d");
                var myChart1 = new Chart(ctx1, {
                    type: "bar",
                    data: {
                        labels: [data1[0].name,data1[1].name,data1[2].name,data1[3].name,data1[4].name,data1[5].name,data1[6].name],//productid
                        datasets: [
                            {
                                label: "no of purchases",
                                data: [data1[0].number_of_orders,data1[1].number_of_orders,data1[2].number_of_orders,data1[3].number_of_orders,data1[4].number_of_orders,data1[5].number_of_orders,data1[6].number_of_orders],//orders from each product id 
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
                        labels: [data2[0].employeename,data2[1].employeename,data2[2].employeename,data2[3].employeename,data2[4].employeename,data2[5].employeename,data2[6].employeename],//months
                        datasets: [{
                                label: "Salse",
                                data: [data2[0].noofsales,data2[1].noofsales,data2[2].noofsales,data2[3].noofsales,data2[4].noofsales,data2[5].noofsales,data2[6].noofsales],//orders by the employee from each month
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


    // sales report


    // your performance
  
    


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
            labels: ["Italy", "France", "Spain", "USA", "Argentina"],///category
            datasets: [{
                backgroundColor: [
                    "rgba(235, 22, 22, .7)",
                    "rgba(235, 22, 22, .6)",
                    "rgba(235, 22, 22, .5)",
                    "rgba(235, 22, 22, .4)",
                    "rgba(235, 22, 22, .3)"
                ],
                data: [55, 49, 44, 24, 15]//sales from each category
            }]
        },
        options: {
            responsive: true
        }
    });



    
})(jQuery);

