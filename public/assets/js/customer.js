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
        fetch('/chart_customers')
            .then(response => response.json())
            .then(data => {
                const data1 = data.results;
                var ctx1 = $("#worldwide-sales").get(0).getContext("2d");
                 var myChart1 = new Chart(ctx1, {
                 type: "bar",
                data: {
                labels: [data1[0].name,data1[1].name,data1[2].name,data1[3].name,data1[4].name,data1[5].name,data1[6].name],//customerid
             datasets: [
                {
                    label: "Orders",
                    data: [data1[0].total_orders,data1[1].total_orders,data1[2].total_orders,data1[3].total_orders,data1[4].total_orders,data1[5].total_orders,data1[6].total_orders],//no of orders from each customerid
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
            labels: [data1[0].name,data1[1].name,data1[2].name,data1[3].name,data1[4].name,data1[5].name,data1[6].name],//cutomerid
            datasets: [
                {
                    label: "Revenue",
                    data: [(data1[0].total_spent).toFixed(2),(data1[1].total_spent).toFixed(2),(data1[2].total_spent).toFixed(2),(data1[3].total_spent).toFixed(2),(data1[4].total_spent).toFixed(2),(data1[5].total_spent).toFixed(2),(data1[6].total_spent).toFixed(2)],//totalamount spent from each customerid
                    backgroundColor: "rgba(235, 22, 22, .5)",
                    fill: true
                }
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
    
    
})(jQuery);

