var ctx = document.getElementById("canvas").getContext('2d');

var options = {
    responsive: true, 
    maintainAspectRatio: false, 

    title: {
        display: true,
        fontColor: 'white',
        fontSize: 40,
        text: 'Mean squared error'
    },

    scales: {
        yAxes: [{
            gridLines: {
                display: true,
                color: "#FFFFFF"
            },
            ticks: {
                beginAtZero: true,
                max: 0.5,
                fontColor: 'white',
                fontSize: 15
            }
        }],

        xAxes: [{
            gridLines: {
                display: true,
                color: "#FFFFFF"
            },
            display: true,
            offset: true,
            ticks: {
                fontColor: 'white',
                fontSize: 15
            }
        }]

    },

    legend: {
        onClick: function(event, legendItem) {},
        display: false
    }
};

var myChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
            //label: 'Mean squared error',
            data: [], 
            fill: false,
            borderColor: '#2196f3',             
            backgroundColor: '#2196f3', 
        }]
    },
    options: options
});