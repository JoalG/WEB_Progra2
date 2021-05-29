// en estas const para manejar facilemtne la base de datos.
const database = firebase.database();
// referencia a la collection test_col para utilizar las funciones sobre esta colección
const rootRef = database.ref('/');
//
let jsonData = [];

// se agrega el listener al botón remove


function getData() {
    // once() method
    rootRef.on('value', (snap) => {
        jsonData = snap.val();
        //console.log(jsonData);
    });

}


function showData() {


    displayData();
    datatableProperties();
}

function datatableProperties() {
    $('#table1TableID').DataTable({
        "bSort": true,
        "paging": true,
        "pageLength": 10
    });
}





function displayData() {
    let tableHtml = '';

    jsonData.forEach((venta, index) => {
        let sale = venta.infoResult.data[0].sale;
        let budget = venta.infoResult.data[0].budget;

        tableHtml += '<tr saleId = "' + index + '"> ';
        tableHtml += '<td class= "text-truncate text-center">' + venta.infoResult.data[0].slpName + '</td>';
        tableHtml += '<td class= "text-truncate text-center">' + formatter.format(sale) + '</td>';
        tableHtml += '<td class= "text-truncate text-center">' + formatter.format(budget) + '</td>';
        tableHtml += '<td class= "text-truncate text-center">' + formatter.format(sale - budget) + '</td>';

        let percent = ((budget != 0) ? ((sale / budget) * 100) : 0).toFixed(2);
        tableHtml += '<td class= "text-truncate text-center">';

        if (percent >= 100) {
            tableHtml += '<span class="badge badge-success" style="background-color:green">' + percent + '%' + '</span>';
        } else if (percent >= 80) {
            tableHtml += '<span class="badge badge-warning" style="background-color:yellow">' + percent + '%' + '</span>';
        } else {
            tableHtml += '<span class="badge badge-danger"  style="background-color:red">' + percent + '%' + '</span>';
        }

        tableHtml += '</td>';

        tableHtml += '<td class= "text-truncate text-center">' + '<button type="button" class="btn btn-outline-success"><i class="fas fa-arrow-right"></i></button>' + '</td>';
        tableHtml += '</tr>';

    });

    document.getElementById('tbodytable1ID').innerHTML = tableHtml;
    //console.log(tableHtml);

}

const formatter = new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0
});