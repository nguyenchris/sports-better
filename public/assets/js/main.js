// Click Listener for logout button
$('.logout').on('click', function () {
    $.post('/api/logout', function (data, result) {
        if (result == 'success') {
            window.location.assign('/');
        }
    })
});












// // getCharts()
// //     function getCharts() {
//         var donutEl = document.getElementById("myChart").getContext("2d");
//         var donut = new Chart(donutEl).Doughnut(
//             // Datas
//             [{
//                     value: 77,
//                     color: "#F7464A",
//                     highlight: "#FF5A5E",
//                     label: "Red"
//                 },
//                 {
//                     value: 33,
//                     color: "#FDB45C",
//                     highlight: "#FFC870",
//                     label: "Yellow"
//                 }
//             ],
//             // Options
//             {
//                 segmentShowStroke: true,
//                 segmentStrokeColor: "#fff",
//                 segmentStrokeWidth: 2,
//                 percentageInnerCutout: 40,
//                 animationSteps: 100,
//                 animationEasing: "easeOutBounce",
//                 animateRotate: true,
//                 animateScale: false,
//                 responsive: true,
//                 maintainAspectRatio: true,
//                 showScale: true,
//                 animateScale: true
//             });
//     // }