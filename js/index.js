const firebaseConfig = {
    apiKey: "AIzaSyC0XqH0p0bPE29I1LRdV2HZ59bllUiEqgI",
    authDomain: "tec2021-1795b.firebaseapp.com",
    databaseURL: "https://tec2021-1795b-default-rtdb.firebaseio.com",
    projectId: "tec2021-1795b",
    storageBucket: "tec2021-1795b.appspot.com",
    messagingSenderId: "86528278955",
    appId: "1:86528278955:web:f046bc8ac9c05a499652ee",
    measurementId: "G-FEQR97R2EC"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();



// en estas const para manejar facilemtne la base de datos.
const database = firebase.database();
// referencia a la collection test_col para utilizar las funciones sobre esta colección
const rootRef = database.ref('/');
//
let ventas = [];

// se agrega el listener al botón remove


/* function getData() {
    // once() method
    rootRef.on('value', (snap) => {
        ventas = snap.val();
        console.log(ventas);
    });
    

} */

function getDataPromise() {
    return new Promise((resolve, reject) => {
        rootRef.on('value', (snap) => {
            resolve(snap.val());
        });
    });
}


async function dummy() {
    await getDataPromise()
        .then(
            json => {
                ventas = json;
                showData();
            })
        .catch(error => { console.log(error) });
    console.log(ventas);
}

$(document).ready(function() {
    console.log('ready')
    dummy();
});







function showData() {
    displayData();
    datatableProperties();
}

function datatableProperties() {
    $('#table1TableID').DataTable({
        "bSort": true,
        "paging": true,
        "pageLength": 10,
        "language": {
            "search": "Buscar",
            "paginate": {
                "show": "Mostrando",
                "first": "Primer",
                "previous": "Anterior",
                "next": "Siguiente",
                "last": "Ultimo"
            },
            "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            "infoEmpty": "No hay datos",
            "lengthMenu": "Mostrando _MENU_ entradas",
            "emptyTable": "No hay datos por el momento"
        }
    });
}





function displayData() {
    let tableHtml = '';

    ventas.forEach((venta, index) => {
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

        tableHtml += '<td class= "text-truncate text-center">';
        tableHtml += '<a href="dashboard.html">';
        tableHtml += '<button onclick="callDashboard(this)" type="button" class="btn btn-outline-success"><i class="fas fa-arrow-right"></i></button>';
        tableHtml += '</a>';
        tableHtml += '</td>';
        tableHtml += '</tr>';

    });

    document.getElementById('tbodytable1ID').innerHTML = tableHtml;

}


function callDashboard(elem) {
    let tr = elem.closest('tr');
    passValue(tr.getAttribute('saleId'));
}

function passValue(index) {
    let ventaIndex = index;
    localStorage.setItem("ventaIndex", ventaIndex);
    return false;
}


const formatter = new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0
});