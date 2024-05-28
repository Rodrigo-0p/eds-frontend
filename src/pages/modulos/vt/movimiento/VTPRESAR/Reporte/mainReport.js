// import Main  from "../../../../../../components/utils/Main";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Main  from '../../../../../../componente/util/main'
import Firma from '../firma/Firma.png'
const logo  = process.env.REACT_APP_BASEURL + sessionStorage.getItem("ruta_logo");

const main_presupuesto = async(data,cabecera)=>{
// Crea un nuevo objeto jsPDF
    let doc = new jsPDF('', 'pt', 'A4');
    let totalPagesExp   = "{total_pages_count_string}";

    let puntoMedio = (doc.internal.pageSize.getWidth() / 2);     
    let topTable   = 231.5
    
    var columns = [
      { dataKey : 'COD_ARTICULO'          , header  : 'Articulo'         },
      { dataKey : 'DESC_ARTICULO'         , header  : 'Descripción'      },
      { dataKey : 'CANTIDAD'              , header  : 'Cant.'            },
      { dataKey : 'PRECIO_UNITARIO_C_IVA' , header  : 'Precio'           },
      { dataKey : 'DESCUENTO'             , header  : 'Descuento'        },
      { dataKey : 'MONTO_TOTAL'           , header  : 'Total'            },
    ];
  
  doc.autoTable({
    // showHead: 'never',
    theme: 'plain',
    // theme: 'grid',
    columns: columns,
    body: data, 
    styles: {
      overflow: 'linebreak',
      fontSize: 7,
      textColor: [40,40,40],
      // fillColor: [240, 240, 240], // Color de fondo de la cabecera (gris claro)
      // lineColor: [0, 0, 0], // Color de los bordes de la tabla (negro)
      // lineWidth: 0.1, // Grosor de los bordes
      cellPadding: 2.5, // Espaciado interno de las celdas
    },
    columnStyles:{
      0: {halign: 'left'   ,  cellWidth:40 },
      1: {halign: 'left'   ,  cellWidth:310 },
      2: {halign: 'right'  ,  cellWidth:65 },
      3: {halign: 'right'  ,  cellWidth:55 },
      4: {halign: 'right'  ,  cellWidth:40 },
      5: {halign: 'right'  ,  cellWidth:65 },
    },
    margin:{ top:topTable,  left:10,  right:10, bottom:45},
    
    didParseCell:(data) => {
      if (data.cell && data.cell.section === 'head') {
        let center   = ['Precio Unitario Mejorado','Descuento']            
        let left     = ['Descripción','Articulo']
        if(center.includes(data.cell.raw)){
          data.cell.styles.halign = 'center'
          data.cell.styles.fillColor = [240, 240, 240]; // Gris claro 
        }else if(left.includes(data.cell.raw)){
          data.cell.styles.fillColor = [240, 240, 240]; // Gris claro 
          data.cell.styles.halign = 'left';
        }else{
          data.cell.styles.fillColor = [240, 240, 240]; // Gris claro 
          data.cell.styles.halign = 'right'
        }
      }  
      if (data.cell && data.cell.section === 'body') { 
        if(data.row.raw.ultimo && [0,1,3].includes(data.column.index)){
          
          data.cell.styles.valign    = 'middle'; // Centrado vertical
          if(data.column.index === 3){
            data.cell.styles.fillColor = [240, 240, 240]; // Gris claro 
            data.cell.colSpan          = 2;
          }

          // if([0,1].includes(data.column.index)){
          //   data.cell.styles.lineColor = [0, 0, 0]; 
          //   if(data.column.index === 0)data.cell.styles.lineWidth = {top: 0.1, left: 0.1, bottom: 0.1, right: 0}; // Borde solo en los otros lados            
          //   else data.cell.styles.lineWidth = {top: 0.1, left: 0, bottom: 0.1, right: 0.1};
          // } 
          

          if(data.column.index === 1){
            data.cell.styles.halign    = 'left'
            data.cell.colSpan          = 2;            
            data.cell.styles.fontStyle = 'italic';
          }else{
            data.cell.styles.halign    = 'center';
            data.cell.styles.fontStyle = 'bold';
          }          
        }else if(data.row.raw.ultimo && data.column.index === 5){
          data.cell.styles.valign      = 'middle'; // Centrado vertical
          data.cell.styles.fontStyle   = 'bold';
        }else if (data.row.raw.deleteLinea && [0,1,2,3,4,5].includes(data.column.index)){        
          data.cell.styles.lineColor = [0, 0, 0]; 
          data.cell.styles.lineWidth = {top: 0, left: 0.1, bottom: 0, right: 0.1}; 
        }      
      }       
    },
    didDrawPage: function () {
      header(doc,puntoMedio,cabecera);
    },
    willDrawCell:(data)=>{      
    },
  });  

  // doc.rect(10, tableHeight, (doc.internal.pageSize.getWidth() / 2)  - 25, 130);



  

  
  // Obtener la altura total de la tabla
  var tableHeight = doc.previousAutoTable.finalY + 1.5;

  doc.rect(10, topTable, 40,  doc.internal.pageSize.getHeight() - ( doc.previousAutoTable.finalY + 40  ) );
  doc.rect(50, topTable, 310,  doc.internal.pageSize.getHeight() - ( doc.previousAutoTable.finalY + 40  ) );
  doc.rect(360, topTable, 65,  doc.internal.pageSize.getHeight() - ( doc.previousAutoTable.finalY + 40  ) );
  doc.rect(425, topTable, 55,  doc.internal.pageSize.getHeight() - ( doc.previousAutoTable.finalY + 40  ) );
  doc.rect(480, topTable, 40,  doc.internal.pageSize.getHeight() - ( doc.previousAutoTable.finalY + 40  ) );
  doc.rect(520, topTable, 65,  doc.internal.pageSize.getHeight() - ( doc.previousAutoTable.finalY + 40  ) );

  doc.rect(10, doc.previousAutoTable.finalY - 20, 415,  20 );
  doc.rect(425, doc.previousAutoTable.finalY - 20, 95,  20 );
  doc.rect(520, doc.previousAutoTable.finalY - 20, 65,  20 );

  // ****************************************************************************************************
  //                                                                                                   //
  //                                  CONFIGURACIÓN FOOTER                                             //
  //                                                                                                   //
  // ****************************************************************************************************
  doc.rect(10, tableHeight, doc.internal.pageSize.getWidth() - 20, 130);                          // X, Y, WIDTH, HEIGHT
  doc.rect(10, tableHeight, (doc.internal.pageSize.getWidth() / 2)  - 25, 130);                   // X, Y, WIDTH, HEIGHT
  doc.line(10, tableHeight + 60, (doc.internal.pageSize.getWidth() / 2)  - 15, tableHeight + 60); // X1, Y1, X2, Y2
  // RECUADRO DE FIRMA 
  doc.setFillColor(240, 240, 240); // COLOR GRIS CLARO
  // ESTABLECE EL COLOR DE BORDE DEL RECTÁNGULO (NEGRO)
  doc.setDrawColor(0, 0, 0);       // COLOR NEGRO
  doc.rect((doc.internal.pageSize.getWidth() / 2 ) - 20, tableHeight, 100, 130,'FD')              // X, Y, WIDTH,HEIGHT 
  doc.rect(((doc.internal.pageSize.getWidth() / 2 ) - 20 + 100), tableHeight, 207.5, 45);
  //------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------------------
  
  // ****************************************************************************************************
  //                                                                                                   //
  //                           CONFIGURACIÓN RECUADRO PARA LOS VALORES                                 //
  //                                                                                                   //
  // ****************************************************************************************************
  let FormaDePago = cabecera.DESC_CONDICION_VENTA;
  doc.setFontSize(9.6);
  doc.setFont(undefined, 'bold'); 
  doc.text(`Presupuesto válido por 5 dias \n Forma de pago: ${FormaDePago}`, 73, tableHeight + 30);


  let descripcion = cabecera.DESC_PDF
  // 'En el presupuesto no esta incluido los servicios de Mantenimiento de la placa, se debe presupuestar previamiente a la reparacion del zoocalo, ya que puede ser que no sea necesario.'

  doc.setFontSize(9);
  doc.setFont(undefined, 'normal'); 
  doc.text(descripcion, 20, tableHeight + 75,{ maxWidth: (doc.internal.pageSize.getWidth() / 2)  - 41 });  

  let nombreAclaracion = 'ESEQUIAS DE SOUZA GOMES GERENTE'

  doc.setFontSize(9.6);
  doc.setFont(undefined, 'bold'); 
  doc.text(nombreAclaracion, (doc.internal.pageSize.getWidth() / 2 ) + 185 , tableHeight + 20,{ align: 'center', maxWidth: 150 });


  
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold'); 
  doc.text('Aprobado por:', (doc.internal.pageSize.getWidth() / 2 ) - 5,  tableHeight + 26);  
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold'); 
  doc.text('Firma:', (doc.internal.pageSize.getWidth() / 2 ) - 5,  tableHeight + 90);  
  doc.addImage(Firma, 'PNG', (doc.internal.pageSize.getWidth() / 2 ) + 82, tableHeight + 47, 203.5, 81); // X, Y, WIDTH, HEIGHT     
  

  
  if (typeof doc.putTotalPages === 'function') {
    doc.putTotalPages(totalPagesExp);
  }

  setTimeout( ()=>{
    window.open(doc.output('bloburl'));
  },50 )
}


const header = (doc,puntoMedio,cabecera)=>{
    let totalPagesExp   = "{total_pages_count_string}";
    var str = "Página " + doc.internal.getNumberOfPages();
    if (typeof doc.putTotalPages === 'function') {
      str = str + " de " + totalPagesExp;
    }
    doc.setFontSize(6);
    doc.setTextColor(40);
    doc.text(str,doc.internal.pageSize.getWidth() - 50,18,'left');

  // ****************************************************************************************************
  //                                                                                                   //
  //                                 CONFIGURACIÓN PARA LA CABECERA                                    //
  //                                                                                                   //
  // ****************************************************************************************************
    // Dibuja un recuadro en la cabecera
    doc.rect(10, 10, doc.internal.pageSize.getWidth() - 20, 80); // X, Y, WIDTH, HEIGHT
    doc.addImage(logo, 'PNG', 15, 15, 140, 70);                  // X, Y, WIDTH, HEIGHT      
    doc.line(160, 10, 160, 90);                                  // X, Y, WIDTH, HEIGHT DIBUJA UNA LÍNEA DIVISORIA ENTRE LAS DOS SECCIONES
  // --
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text(sessionStorage.getItem('desc_empresa')          , puntoMedio + 45, 33, null, null, 'center');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Dirección: ${cabecera.DIRECCION_EMPRESA}`, puntoMedio + 45, 50, null, null, 'center');
    doc.text(`Ruc: ${cabecera.RUC_EMPRESA} Teléfono: ${cabecera.TELEFONO_EMPRESA}`       , puntoMedio + 45, 61, null, null, 'center');
    // doc.text('Sitio web: www.datamode.com'                   , puntoMedio + 45, 85, null, null, 'center');
  // *****************************************************************************************************
  //------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------------------

  // ****************************************************************************************************
  //                                                                                                   //
  //                        CONFIGURACIÓN PARA LA DESCRIPCIONES                                        //
  //                                                                                                   //
  // ****************************************************************************************************
    doc.setFillColor(240, 240, 240);                      // COLOR GRIS CLARO
    // ESTABLECE EL COLOR DE BORDE DEL RECTÁNGULO (NEGRO)
    doc.setDrawColor(0, 0, 0);                            // COLOR NEGRO
    doc.rect(10, 91.3, puntoMedio - 200, 139,'FD')        // X, Y, WIDTH,HEIGHT 
    // -- 
    doc.setFont('helvetica', 'bold');
    doc.text('Fecha:'             , 20, 108);
    doc.text('Atención:'          , 20, 130);
    doc.text('Nombre del Cliente:', 20, 152);
    doc.text('Dirección:'         , 20, 175);
    doc.text('RUC:'               , 20, 198);
    doc.text('Teléfono.'          , 20, 218);    
    // RECUADRO Y COLOR DE FONDO PARA LA DESCRIPCION DE PRESUPUESTO
    doc.setFillColor(240, 240, 240);    
    doc.setDrawColor(0, 0, 0); 
    doc.rect(puntoMedio + 80, 91.3, 100 , 23,'FD')
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('Presupuesto Nro :', puntoMedio + 85, 107);
    // RECUADRO Y COLOR DE FONDO DESCRIPCION DE ASESOR
    doc.setFillColor(240, 240, 240);    
    doc.setDrawColor(0, 0, 0); 
    doc.rect(puntoMedio + 80, 115, 46 , 23,'FD')
    doc.setFontSize(9.5);
    doc.setFont(undefined, 'bold'); 
    doc.text('Asesor :', puntoMedio + 85, 130);

  // *****************************************************************************************************
  //------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------------------
  
  // ****************************************************************************************************
  //                                                                                                   //
  //                  CONFIGURACIÓN RECUADRO PARA LOS VALORES DE LA DESCRIPCION                        //
  //                                                                                                   //
  // ****************************************************************************************************
    // RECUADREO PARA LA FECHA Y ATENCION
    doc.setDrawColor(0, 0, 0);
    doc.rect(108.2, 91.3, puntoMedio - 29, 46.8);     // X, Y, WIDTH, HEIGHT
    doc.line(107.8, 114.10, puntoMedio + 79, 114.10); // X1, Y1, X2, Y2

    // RECUADREO PARA CLIENTE
    doc.setDrawColor(0, 0, 0);
    doc.rect(108.2, 138.1,puntoMedio + 179.3, 23);  // X, Y, WIDTH, HEIGHT

    // RECUADREO PARA DIRECCION, RUC, TELEF.
    doc.setDrawColor(0, 0, 0);
    doc.rect(108.2, 161.1,puntoMedio - 30, 23);     // X, Y, WIDTH, HEIGHT
    doc.rect(108.2, 184.2,puntoMedio - 30, 23);     // X, Y, WIDTH, HEIGHT
    doc.rect(108.2, 207.3,puntoMedio - 30, 23);     // X, Y, WIDTH, HEIGHT

    // RECUADREO PARA PRESUPUESTO, ASESOR
    doc.rect(puntoMedio + 180.5 ,91.3, 107, 23);    // X, Y, WIDTH, HEIGHT
    doc.rect(puntoMedio + 126.5 ,115, 161, 23);     // X, Y, WIDTH, HEIGHT
    
    // ESPACIO EN BLANCO
    doc.rect(puntoMedio + 78.5 ,161.4, 209, 68.9);    // X, Y, WIDTH, HEIGHT

  // *****************************************************************************************************
  //------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------------------
  
  // ****************************************************************************************************
  //                                                                                                   //
  //                                   VALORES DE LA DESCRIPCIONES                                     //
  //                                                                                                   //
  // ****************************************************************************************************
  let Fecha      = cabecera.FEC_COMPROBANTE
  let Atencion   = cabecera.DESC_CLIENTE
  let NombreClie = cabecera.CLIENTE
  let Direccion  = cabecera.DIRECCION
  let Ruc        = cabecera.RUC
  let Telefono   = cabecera.TELEFONO
  let NroPresu   = cabecera.NRO_COMPROBANTE
  let Asesor     = cabecera.ASESOR

  const fontSize  = 9.5;                // Tamaño de la fuente en puntos
  const rectWidthClie   = puntoMedio + 210.3; // Ancho del rectángulo en puntos    
  let AjustarNombreClie = Main.ajustarTexto(rectWidthClie,fontSize,NombreClie)

  const rectWidthDirc   = puntoMedio + 30;   // Ancho del rectángulo en punto    
  let AjustarDireccion  = Main.ajustarTexto(rectWidthDirc,fontSize,Direccion)

  const rectWidthAses   = puntoMedio - 150;   // Ancho del rectángulo en punto    
  let AjustarAsesor     = Main.ajustarTexto(rectWidthAses,fontSize,Asesor)

  doc.setFont(undefined, 'normal');
  doc.setFontSize(9.5);

  doc.text(Fecha             , 118, 108); 
  doc.text(Atencion          , 118, 130);
  doc.text(AjustarNombreClie , 118, 152);
  doc.text(AjustarDireccion  , 118, 175);
  doc.text(Ruc               , 118, 198);
  doc.text(Telefono          , 118, 218);
  // --
  doc.setFont(undefined, 'bold');
  doc.text(NroPresu          , puntoMedio + 190.5, 107);
  doc.setFont(undefined, 'normal');
  doc.text(AjustarAsesor     , puntoMedio + 136.5, 130);
  //------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------------------
}

const main = { main_presupuesto }

export default main