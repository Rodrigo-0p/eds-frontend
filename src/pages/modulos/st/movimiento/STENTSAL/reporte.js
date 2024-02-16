
import Main     from "../../../../../componente/util/main";
import jsPDF    from 'jspdf';
import _        from "underscore";
import 'jspdf-autotable';

const rstensal = async(content,form) => {
  Main.desactivarSpinner();
  let info      = content;
  let sucursal  = `${form.getFieldValue('COD_SUCURSAL')} - ${form.getFieldValue('DESC_SUCURSAL')}`;
  let periodo   = `Desde el ${form.getFieldValue('FEC_ENT_SAL').format('DD/MM/YYYY')} Hasta el ${form.getFieldValue('FEC_ENT_SAL').format('DD/MM/YYYY')}`; 
  let estado    = form.getFieldValue('ESTADO') === 'P' ? 'Pendiente' : form.getFieldValue('ESTADO') === 'C' ? 'Confirmado' : 'Anulado';
  let motivo    = form.getFieldValue('DESC_MOTIVO');
  var columns   =  [
    { dataKey: 'COD_ARTICULO'   , header: 'Articulo (Cód. Descripción)' },
    { dataKey: 'DESC_UNIDAD'    , header: 'U.M'                         },
    { dataKey: 'NRO_LOTE'       , header: 'Nro. Lote'                   },
    { dataKey: 'FEC_VENCIMIENTO', header: 'Fec. Venc.'                  },
    { dataKey: 'CANTIDAD'       , header: 'Cantidad'                    },
    { dataKey: 'COSTO_UNITARIO' , header: 'Costo'                       },
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
    // theme: 'grid',
    columns: columns,
    body: info,
    tableWidth:'wrap',
    styles: {
        overflow: 'linebreak',
        fontSize: 7,
        cellPadding: 2,
        halign: 'right',
        cellWidth: 30,
        textColor: [40,40,40],
        // overflow: 'ellipsize'
    },
    columnStyles:{
      0: {halign: 'left'  , cellWidth:215},
      1: {halign: 'left'  , cellWidth:65 },
      2: {halign: 'right' , cellWidth:35 },
      3: {halign: 'center', cellWidth:40 },
      4: {halign: 'right' , cellWidth:70 },
      5: {halign: 'right' , cellWidth:70 },
      6: {halign: 'right' , cellWidth:70 },
    },
    margin:{top:75, left:15, right:15, bottom:25},
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
      pdfDoc.text('Ajuste de Stock ',(pdfDoc.internal.pageSize.getWidth() / 2),30,'center');
      pdfDoc.setLineWidth(1);
      pdfDoc.setDrawColor(30,30,30);
      pdfDoc.line(15, 33, pdfDoc.internal.pageSize.getWidth() - 15, 33, 'S');
      pdfDoc.setFont(undefined, 'normal');
      
      // PRIMERA COLUMNA
      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'normal');
      pdfDoc.text('Sucursal',15,42, 'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'bold');
      pdfDoc.text(`: ${sucursal}`, 60, 42, 'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'normal');
      pdfDoc.text('Articulo', 15,51,'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'bold');
      pdfDoc.text(`: Todos`, 60, 51, 'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'normal');
      pdfDoc.text('Familia', 15,60,'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'bold');
      pdfDoc.text(': Todos', 60, 60, 'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'normal');
      pdfDoc.text('Proveedor', 15,69,'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'bold');
      pdfDoc.text(': Todos', 60, 69, 'left');

      // SEGUNDA COLUMNA
      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'normal');
      pdfDoc.text('Rubro',230,42,'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'bold');
      pdfDoc.text(': Todos', 270, 42, 'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'normal');
      pdfDoc.text('Deposito',230,51,'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'bold');
      pdfDoc.text(': Todos', 270, 51, 'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'normal');
      pdfDoc.text('Estado',230,60,'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'bold');
      pdfDoc.text(`: ${estado}`, 270, 60, 'left');

      // TERCERA COLUMNA
      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'normal');
      pdfDoc.text('Motivo',380,42,'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'bold');
      pdfDoc.text(`: ${motivo}`, 425, 42, 'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'normal');
      pdfDoc.text('Tipo Ajuste',380,51,'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'bold');
      pdfDoc.text(': Todos', 425, 51, 'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'normal');
      pdfDoc.text('Fecha', 380,60,'left');

      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(40);
      pdfDoc.setFont(undefined, 'bold');
      pdfDoc.text(`: ${periodo}`, 425, 60, 'left');
      pdfDoc.line(15, 73, pdfDoc.internal.pageSize.getWidth() - 15, 73, 'S')
    },
    willDrawCell: function(data) {
      var rows = data.row.raw?.COD_ARTICULO;
      rows = rows?.trim();
      if(rows?.match(/Nro Ajuste:/) !== null || rows?.match(/Depósito:/) !== null || rows?.match(/Motivo:/) !== null || rows?.match(/Artículo/) !== null){
        pdfDoc.setFont(undefined, 'bold')
        pdfDoc.setTextColor(60, 60, 60)
        pdfDoc.setFontSize(7);
        if(rows?.match(/Nro Ajuste:/) !== null && rows?.match(/Nro Ajuste:/) !== undefined){
          if (data.section === 'body' && data.column.index === 1) {
            pdfDoc.text(data.row.raw.TIPO_AJUSTE, 230, data.cell.y + 8);
            pdfDoc.text(data.row.raw.ESTADO, 380, data.cell.y + 8);
            pdfDoc.text(data.row.raw.FEC_COMPROBANTE, 500, data.cell.y + 8);
          }
        }
        if(rows?.match(/Depósito:/) !== null && rows?.match(/Depósito:/) !== undefined){
          if (data.section === 'body' && data.column.index === 1) {
            pdfDoc.text(data.row.raw.COD_PROVEEDOR, 380, data.cell.y + 8);
            pdfDoc.text(data.row.raw.USUARIO, 500, data.cell.y + 8);
          }
        }
        if(rows?.match(/Motivo:/) !== null && rows?.match(/Motivo:/) !== undefined){
          if (data.section === 'body' && data.column.index === 1) {
            pdfDoc.text(data.row.raw.OBSERVACION, 230, data.cell.y + 8);
          }
        }
        if(rows?.match(/Artículo/) !== null && rows?.match(/Artículo:/) !== undefined){
          if (data.section === 'body' && data.column.index === 1) {
            pdfDoc.setLineWidth(1);
            pdfDoc.setDrawColor(30,30,30);
            pdfDoc.line(15, data.cell.y + 11, pdfDoc.internal.pageSize.getWidth() - 15, data.cell.y + 11, 'S')
          }
        }
      }
      var line = data.row?.raw?.COSTO_UNITARIO;
      if( line !== undefined && (_.isNumber(line) === false) ){
        if(line?.match(/TOTAL:/) !== null && line?.match(/TOTAL:/) !== undefined){
          pdfDoc.setLineWidth(0.5);
          pdfDoc.setDrawColor(30,30,30);
          pdfDoc.line(pdfDoc.internal.pageSize.getWidth() - 135, data.cell.y, pdfDoc.internal.pageSize.getWidth() - 15, data.cell.y, 'S')
        }
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
  pdfDoc.text(Main.currency(Total, { separator:'.',decimal:',',precision:0,symbol:'' } ).format() , pdfDoc.internal.pageSize.getWidth() - 15, pdfDoc.previousAutoTable.finalY + 15, 'right');

  if (typeof pdfDoc.putTotalPages === 'function') {
    pdfDoc.putTotalPages(totalPagesExp);
  }
  setTimeout( ()=>{
    window.open(pdfDoc.output('bloburl'));
  },50 )
}
// eslint-disable-next-line
export default {
  rstensal
}