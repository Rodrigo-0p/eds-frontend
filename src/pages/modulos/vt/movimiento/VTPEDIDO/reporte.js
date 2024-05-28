
import Main     from "../../../../../componente/util/main";
import jsPDF    from 'jspdf';
import _        from "underscore";
import currency from 'currency.js';
import 'jspdf-autotable';

const renvio = async(content,form) => {
  Main.desactivarSpinner();
  let info = content;
  let sucursal = `${form.getFieldValue('COD_SUCURSAL')} - ${form.getFieldValue('DESC_SUCURSAL')}`;
  let periodo  = `Desde el ${form.getFieldValue('FEC_COMPROBANTE').format('DD/MM/YYYY')} Hasta el ${form.getFieldValue('FEC_COMPROBANTE').format('DD/MM/YYYY')}`; 
  let estado   = form.getFieldValue('ESTADO') === 'P' ? 'Pendiente' : form.getFieldValue('ESTADO') === 'C' ? 'Confirmado' : 'Anulado';
  let numero   = `Desde el ${form.getFieldValue('NRO_COMPROBANTE')} Hasta el ${form.getFieldValue('NRO_COMPROBANTE')}`;
  var columns  =  [
    { dataKey: 'COD_ARTICULO'   , header: 'Articulo (Cód. Descripción)' },
    { dataKey: 'DESC_UNIDAD'    , header: 'U.M'                         },
    { dataKey: 'FEC_VENCIMIENTO', header: 'Fec. Venc.'                  },
    { dataKey: 'CANTIDAD'       , header: 'Cantidad'                    },
    { dataKey: 'DESCRIPCION'    , header: 'Descripción'                 },
    { dataKey: 'DESC_DEP_SAL'   , header: 'Salida'                      },
    { dataKey: 'DESC_DEP_ENT'   , header: 'Entrada'                     },
    { dataKey: 'MONTO_TOTAL'    , header: 'Total'                       },
  ];
  var Total = _.reduce(_.map(info,function(map) {
    if(map.MONTO_TOTAL_no_format !== undefined){
      return parseFloat(map.MONTO_TOTAL_no_format);
    }else{
      return 0;
    }
  }),function(memo, num) {
    return memo + num;
  },0);
  var pdfDoc          = new jsPDF('', 'pt', 'A4');
  var totalPagesExp   = "{total_pages_count_string}";
  pdfDoc.autoTable({
    showHead: 'never',
    theme: 'plain',
    columns: columns,
    body: info,
    tableWidth:'wrap',
    styles: {
        // overflow: 'linebreak',
        fontSize: 7,
        cellPadding: 2,
        halign: 'right',
        cellWidth: 30,
        textColor: [40,40,40],
        overflow: 'ellipsize'
    },
    columnStyles:{
      0: {halign: 'left', cellWidth:160},
      1: {halign: 'left', cellWidth:60},
      2: {halign: 'left', cellWidth:40},
      3: {halign: 'right', cellWidth:40},
      4: {halign: 'left',  cellWidth:70},
      5: {halign: 'left',  cellWidth:75},
      6: {halign: 'left',  cellWidth:75},
      7: {halign: 'right',  cellWidth:46},
    },
    margin:{top:65, left:15, right:15, bottom:25},
    didDrawPage: function (data) {
      pdfDoc.setFontSize(6);
      pdfDoc.setTextColor(40);
      pdfDoc.text('Fecha: ' + Main.moment().format('DD/MM/YYYY HH:mm:ss'),15,20,'left');
      var str = "Página " + data.pageCount;
      if (typeof pdfDoc.putTotalPages === 'function') {
          str = str + " de " + totalPagesExp;
      }
      pdfDoc.setFontSize(6);
      pdfDoc.setTextColor(40);
      pdfDoc.text(str,15,27,'left');
      pdfDoc.setFontSize(7);
      pdfDoc.setTextColor(40);
      pdfDoc.text(sessionStorage.getItem("desc_empresa"),(pdfDoc.internal.pageSize.getWidth() / 2),20,'center');
      pdfDoc.setFontSize(10);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'bold');
      pdfDoc.text('Listado de Notas de Envio ',(pdfDoc.internal.pageSize.getWidth() / 2),30,'center');
      pdfDoc.setLineWidth(1);
      pdfDoc.setDrawColor(30,30,30);
      pdfDoc.line(15, 32, pdfDoc.internal.pageSize.getWidth() - 15, 32, 'S');
      pdfDoc.setFont(undefined, 'normal');
      // PRIMERA COLUMNA
      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'normal');
      pdfDoc.text('Sucursal',15,42, 'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'bold');
      pdfDoc.text(`: ${sucursal}`, 50, 42, 'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'normal');
      pdfDoc.text('Periodo', 15,51,'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'bold');
      pdfDoc.text(`: ${periodo}`, 50, 51, 'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'normal');
      pdfDoc.text('Estado',300,42,'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'bold');
      pdfDoc.text(`: ${estado}`, 335, 42, 'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'normal');
      pdfDoc.text('Números',300,51,'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'bold');
      pdfDoc.text(`: ${numero}`, 335, 51, 'left');

      pdfDoc.line(15, 55, pdfDoc.internal.pageSize.getWidth() - 15, 55, 'S')
    },
    willDrawCell: function(data) {
      var rows = data.row.raw?.COD_ARTICULO;
      rows = rows?.trim();
      if(rows?.match(/Motivo:/) !== null || rows?.match(/Comprobante Nro:/) !== null || rows?.match(/Artículo/) !== null){
        pdfDoc.setFont(undefined, 'bold')
        pdfDoc.setTextColor(60, 60, 60)
        pdfDoc.setFontSize(7);
        if(rows?.match(/Motivo:/) !== null && rows?.match(/Motivo:/) !== undefined){
          if (data.section === 'body' && data.column.index === 5) {
            pdfDoc.setLineWidth(0.5);
            pdfDoc.setDrawColor(30,30,30);
            pdfDoc.setFillColor(210, 210, 210);
            pdfDoc.rect(15, data.cell.y, pdfDoc.internal.pageSize.getWidth() - 30,  12, 'F');
            pdfDoc.text(data.row.raw.COD_ARTICULO, 18, data.cell.y + 8);
          }
        }
        if(rows?.match(/Comprobante Nro:/) !== null && data.row.raw.FEC_COMPROBANTE !== undefined){
          if (data.section === 'body' && data.column.index === 5) {
            pdfDoc.text(data.row.raw.FEC_COMPROBANTE, 140, data.cell.y + 8);
            pdfDoc.text(data.row.raw.ESTADO, 220, data.cell.y + 8);
            pdfDoc.text('Depósito', 440, data.cell.y + 8);
            pdfDoc.setLineWidth(0.5);
            pdfDoc.setDrawColor(30,30,30);
            pdfDoc.line(385, data.cell.y + 10, 535, data.cell.y + 10, 'S')
          }
        }
        if(rows?.match(/Artículo/) != null){
          if (data.section === 'body' && data.column.index === 5) {
            pdfDoc.setLineWidth(1);
            pdfDoc.setDrawColor(30,30,30);
            pdfDoc.line(15, data.cell.y + 11, pdfDoc.internal.pageSize.getWidth() - 15, data.cell.y + 11, 'S')
          }
        }
      }
      var line = data.row.raw?.DESC_DEP_ENT;
      line = line?.trim();
      if(line?.match(/TOTAL:/) !== null && line?.match(/TOTAL:/) !== undefined){
        pdfDoc.setLineWidth(0.5);
        pdfDoc.setDrawColor(30,30,30);
        pdfDoc.line(pdfDoc.internal.pageSize.getWidth() - 135, data.cell.y, pdfDoc.internal.pageSize.getWidth() - 15, data.cell.y, 'S')
      }
    },
  });
  pdfDoc.line(15, pdfDoc.previousAutoTable.finalY + 5, pdfDoc.internal.pageSize.getWidth() - 15, pdfDoc.previousAutoTable.finalY + 5, 'S')
  pdfDoc.setFontSize(8);
  pdfDoc.setTextColor(40);
  pdfDoc.text('TOTAL GENERAL: ',pdfDoc.internal.pageSize.getWidth() - 150, pdfDoc.previousAutoTable.finalY + 15, 'left');
  pdfDoc.setFontSize(8);
  pdfDoc.setTextColor(40);
  pdfDoc.setFont(undefined, 'bold');
  pdfDoc.text( currency(Total, { separator:'.',decimal:',',precision:0,symbol:'' } ).format() , pdfDoc.internal.pageSize.getWidth() - 15, pdfDoc.previousAutoTable.finalY + 15, 'right');
  if (typeof pdfDoc.putTotalPages === 'function') {
      pdfDoc.putTotalPages(totalPagesExp);
  }
  setTimeout( ()=>{
    window.open(pdfDoc.output('bloburl'));
  },50 )
}
// eslint-disable-next-line
export default {
  renvio
}