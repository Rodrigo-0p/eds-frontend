import Main     from "../../../../../componente/util/main";
import jsPDF    from 'jspdf';
// import _        from "underscore";
import 'jspdf-autotable';

export const Report = async(info)=>{
  var columns    =  [
    { dataKey: 'COD_BARRA_ART' , header: 'Código de Barra'       },
    { dataKey: 'DESC_ARTICULO' , header: '(Código - Descripción)'},
    { dataKey: 'DESC_UM'       , header: 'U.M'                   },
    { dataKey: 'CANTIDAD'      , header: 'Cant.'                 },
    { dataKey: 'COD_DIRECCION' , header: 'Dirección'             },    
  ];
  var head = {  cod_sucursal     : info[0].COD_SUCURSAL    ? info[0].COD_SUCURSAL    : ' - ',
                referencia       : info[0].REFERENCIA      ? info[0].REFERENCIA      : ' - ',
                cod_deposito     : info[0].COD_DEPOSITO    ? info[0].COD_DEPOSITO    : ' - ',
                nro_comprobante  : info[0].NRO_COMPROBANTE ? info[0].NRO_COMPROBANTE : ' - '
              }
  var pdfDoc          = new jsPDF('', 'pt', 'A4');
  var totalPagesExp   = "{total_pages_count_string}";

  pdfDoc.autoTable({
    theme: 'plain',
    columns: columns,
    body: info,
    tableWidth:'wrap',
    styles: {
      // overflow: 'linebreak',
      fontSize: 7,
      cellPadding: 2,
      cellWidth: 30,
      textColor: [40,40,40],
      overflow: 'ellipsize',
    },
    columnStyles:{
      0: {halign: 'left'  ,  cellWidth:85 },
      1: {halign: 'left'  ,  cellWidth:215},
      2: {halign: 'left'  ,  cellWidth:130},
      3: {halign: 'right',  cellWidth:65 },
      4: {halign: 'center'  ,  cellWidth:65 },
    },
    margin:{ top:80,  left:15,  right:15, bottom:20},
    didParseCell: data => {
      if (data.cell && data.cell.section === 'head') {
        switch (data.cell.raw) {
          case "Código de Barra":
              data.cell.styles.halign = 'left'
            break;
          case "(Código - Descripción)":
              data.cell.styles.halign = 'left'
            break;
          case "U.M":
              data.cell.styles.halign = 'left'
            break;
          case "Cant.":
            data.cell.styles.halign   = 'right'
          break;
          default:
            data.cell.styles.halign   = 'center'
            break;
        }
      }
    },
    didDrawPage: function (data) {
      retorna_header(pdfDoc,head, data );
    },
  })

  if (typeof pdfDoc.putTotalPages === 'function') {
    pdfDoc.putTotalPages(totalPagesExp);
  }
  
  setTimeout( ()=>{
    window.open(pdfDoc.output('bloburl'));
  },50 )
} 
const retorna_header = (pdfDoc,head,data) => {
  var totalPagesExp   = "{total_pages_count_string}";
  pdfDoc.setFontSize(6);
  pdfDoc.setTextColor(40);
  pdfDoc.text('Fecha:' + Main.moment().format('DD/MM/YYYY HH:mm:ss'),15,18,'left');
  var str = "Página " + data.pageCount;
  if (typeof pdfDoc.putTotalPages === 'function') {
    str = str + " de " + totalPagesExp;
  }
  pdfDoc.setFontSize(6);
  pdfDoc.setTextColor(40);
  pdfDoc.text(str,530,18,'left');

  pdfDoc.setFontSize(6);
  pdfDoc.setTextColor(40);
  pdfDoc.text('Usuario: '+sessionStorage.getItem("cod_usuario"),15,30,'left');

  pdfDoc.setFontSize(7);
  pdfDoc.setTextColor(40);
  pdfDoc.setFont(undefined, 'bold');
  pdfDoc.text(sessionStorage.getItem("desc_empresa"),(pdfDoc.internal.pageSize.getWidth() / 2),18,'center');

  pdfDoc.setFontSize(15);
  pdfDoc.setTextColor(40);
  pdfDoc.setFont(undefined, 'bold');
  pdfDoc.text("Resumen de Facturas",(pdfDoc.internal.pageSize.getWidth() / 2),35,'center');

  pdfDoc.setLineWidth(1);
  pdfDoc.setDrawColor(40);
  pdfDoc.line(15, 40, pdfDoc.internal.pageSize.getWidth() - 15, 40, 'S');
  pdfDoc.setFont(undefined, 'normal');

  // PRIMERA COLUMNA
  pdfDoc.setFontSize(8);
  pdfDoc.setTextColor(40);
  pdfDoc.setFont(undefined, 'normal');
  pdfDoc.text('Sucursal ',15,55,'left');

  pdfDoc.setFontSize(8);
  pdfDoc.setTextColor(40);
  pdfDoc.setFont(undefined, 'bold');
  pdfDoc.text(`: ${head.cod_sucursal}`,60,55,'left');

  pdfDoc.setFontSize(8);
  pdfDoc.setTextColor(40);
  pdfDoc.setFont(undefined, 'normal');
  pdfDoc.text('Nro. Factura',15,70, 'left');

  pdfDoc.setFontSize(8);
  pdfDoc.setTextColor(40);
  pdfDoc.setFont(undefined, 'bold');
  pdfDoc.text(`: ${head.referencia}`,60,70,'left');

  // SEGUNDA COLUMNA
  pdfDoc.setFontSize(8);
  pdfDoc.setTextColor(40);
  pdfDoc.setFont(undefined, 'normal');
  pdfDoc.text('Jaula Número ', 210,55,'left');

  pdfDoc.setFontSize(8);
  pdfDoc.setTextColor(40);
  pdfDoc.setFont(undefined, 'bold');
  pdfDoc.text(`: ${head.cod_deposito}`,265,55,'left');


  pdfDoc.setFontSize(8);
  pdfDoc.setTextColor(40);
  pdfDoc.setFont(undefined, 'normal');
  pdfDoc.text('Número Int.', 210,70,'left');

  pdfDoc.setFontSize(8);
  pdfDoc.setTextColor(40);
  pdfDoc.setFont(undefined, 'bold');
  pdfDoc.text(`: ${head.nro_comprobante}`,265,70,'left');

  // LINEA
  pdfDoc.setFontSize(8);
  pdfDoc.setTextColor(40);
  pdfDoc.setFont(undefined, 'bold');
  pdfDoc.line(15, 80, pdfDoc.internal.pageSize.getWidth() - 15, 80, 'S');

  pdfDoc.setFontSize(8);
  pdfDoc.setTextColor(40);
  pdfDoc.setFont(undefined, 'bold');
  pdfDoc.line(15, 91, pdfDoc.internal.pageSize.getWidth() - 15, 91, 'S');
}