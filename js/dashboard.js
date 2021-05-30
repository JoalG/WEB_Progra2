// en estas const para manejar facilemtne la base de datos.
const database = firebase.database();
// referencia a la collection test_col para utilizar las funciones sobre esta colección
const rootRef = database.ref('/');
//
let sellerData = [];

function getData() {
    // once() method
    rootRef.on('value', (snap) => {
        sellerData = snap.val()[0];
        console.log(sellerData);
    });

}

function showData() {
    showCumplientoDeVentas();
    showCumplimiento();
    showProyectado();
    showPedidosAbiertos();
    showCotizaciones();
}


/* $(document).ready(function() {
    varGraphic()
}); */


function showCumplientoDeVentas() {

    document.getElementById('ventaActual').innerHTML = formatter.format(sellerData.infoResult.data[0].sale);
    document.getElementById('metaActual').innerHTML = formatter.format(sellerData.infoResult.data[0].budget);
    document.getElementById('diferenciaActual').innerHTML = formatter.format(sellerData.infoResult.data[0].sale - sellerData.infoResult.data[0].budget);

    var ctx = $("#chart-line");

    let weekResult = sellerData.weekResult.data;
    let sales = [];
    let budgets = [];
    let pastMonthSales = [];
    let pastYearSales = [];

    let sale = 0;
    let weigth = 0;
    for (let i = 0; i < weekResult.length; i++) {
        const week = weekResult[i];
        sale += week.sale;
        weigth += week.weekWeight / 100;

        sales.push(sale);
        budgets.push(sellerData.infoResult.data[0].budget * weigth);
        pastMonthSales.push(sellerData.infoResult.data[0].pastMonthSale * weigth);
        pastYearSales.push(sellerData.infoResult.data[0].pastYearSale * weigth);
    }



    var myLineChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4", "Semana 5", "Semana 6"],
            datasets: [{
                data: budgets,
                label: "Meta",
                borderColor: "#E74C3C",
                backgroundColor: '#E74C3C',
                fill: false
            }, {
                data: sales,
                label: "Venta",
                borderColor: "#2ECC71",
                fill: true,
                backgroundColor: '#2ECC71'
            }, {
                data: pastYearSales,
                label: "Año anterior",
                borderColor: "#566573",
                fill: false,
                backgroundColor: '#566573'
            }, {
                data: pastMonthSales,
                label: "Mes anterior",
                borderColor: "#808B96",
                fill: false,
                backgroundColor: '#808B96'
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Cumplimiento de ventas'
            },
            scales: {

                yAxes: [{
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {

                            return value > 1000000 ? '₡' + (value / 1000000).toFixed(0) + 'M' : formatter.format(value);
                        }
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function(t, d) {
                        var dstLabel = d.datasets[t.datasetIndex].label;
                        var yLabel = t.yLabel;
                        return dstLabel + ': ' + formatter.format(yLabel);
                    }
                }
            }


        }
    });
}



function showCumplimiento() {


    let sale = sellerData.infoResult.data[0].sale;
    let budget = sellerData.infoResult.data[0].budget;
    let percent = ((budget != 0) ? ((sale / budget) * 100) : 0).toFixed(2);

    let color = "";
    if (percent >= 100) {
        color = "#2ECC71";
    } else if (percent >= 80) {
        color = "#DFFF00";
    } else {
        color = "#E74C3C";
    }

    var optionsRadialChart1 = {
        chart: {
            type: "radialBar"
        },

        series: [percent],

        plotOptions: {
            radialBar: {
                hollow: {
                    margin: 15,
                    size: "70%"
                },

                dataLabels: {
                    showOn: "always",
                    name: {
                        offsetY: -10,
                        show: true,
                        color: color,
                        fontSize: "95%"
                    },
                    value: {
                        color: color,
                        show: true,
                        fontSize: "95%"
                    }
                },


            }
        },

        stroke: {
            lineCap: "round",
        },
        labels: ["Cumplimiento"],
        colors: [color]
    };

    var radialChart1 = new ApexCharts(document.querySelector("#radial-chart-1"), optionsRadialChart1);

    radialChart1.render();

}

function showProyectado() {


    let sale = sellerData.infoResult.data[0].sale;
    let budget = sellerData.infoResult.data[0].budget;
    let advancePercent = sellerData.infoResult.data[0].monthAdvance;

    let proyected = (advancePercent != 0) ? (sale * 100 / advancePercent) : 0;
    //console.log(proyected);


    let percent = (((budget != 0) ? (proyected / budget) : 0) * 100).toFixed(2);
    //console.log(percent);

    let elemProyectado = document.getElementById('proyectado');

    elemProyectado.innerHTML = formatter.format(proyected);

    let color = "";
    if (percent >= 100) {
        color = "#2ECC71";
        elemProyectado.classList.add('text-success');
    } else if (percent >= 80) {
        color = "#DFFF00";
        elemProyectado.classList.add('text-warning');
    } else {
        color = "#E74C3C";
        elemProyectado.classList.add('text-danger');
    }



    var optionsRadialChart2 = {
        chart: {
            type: "radialBar"
        },

        series: [percent],

        plotOptions: {
            radialBar: {
                hollow: {
                    margin: 15,
                    size: "70%"
                },

                dataLabels: {
                    showOn: "always",
                    name: {
                        offsetY: -10,
                        show: true,
                        color: color,
                        fontSize: "95%"
                    },
                    value: {
                        color: color,
                        show: true,
                        fontSize: "95%"
                    }
                },


            }
        },

        stroke: {
            lineCap: "round",
        },
        labels: ["Proyectado"],
        colors: [color]
    };


    var radialChart2 = new ApexCharts(document.querySelector("#radial-chart-2"), optionsRadialChart2);

    radialChart2.render();

}


function showPedidosAbiertos() {
    let salesOrders = sellerData.infoResult.data[0].salesOrders;
    document.getElementById('pedidosAbiertos').innerHTML = formatter.format(salesOrders);

}


function showCotizaciones() {
    let quotations = sellerData.infoResult.data[0].quotations;
    document.getElementById('cotizacionesAbiertas').innerHTML = formatter.format(quotations);

}







const formatter = new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0
});