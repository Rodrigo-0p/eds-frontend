import React, { memo } from 'react' ;
import CMFACTUR
     ,{columns}        from './view';
import mainUrl         from './url/mainUrl'
import Main            from '../../../../../componente/util/main';
import {objetoInicialCab,
        objetoInicialDet}
                       from './ObjetoInicial/mainInicial'
import mainInput       from './InputValida/mainInputValida'
import './styles/CMFACTUR.css';

const FormName   = "CMFACTUR";
const TituloList = "Factura por Compra Local"
const idComp     = `GRID_${FormName}`;

let data_len   = 100
var mitad_data = data_len / 2;

const MainCM = memo(({history, location}) => {

  const [form]              = Main.Form.useForm()  
  const cod_empresa         = sessionStorage.cod_empresa;
  const cod_sucursal        = sessionStorage.cod_sucursal;
  const defaultOpenKeys     = Main.DireccionMenu(FormName);
  const defaultSelectedKeys = Main.Menu(FormName);
  // USESTATE
  const [ shows        , setShows         ] = React.useState(false);
  const [ activateAtras, setActivateAtras ] = React.useState(false);
  // USE REF
  const banRef              = React.useRef({indice:0,bandNew:false, id_cabecera:'', bandPost_Cab_Det : false, banCambioPrecio:true,
                                            b_bloqueo:false,b_bloqueo_aux:false,
                                            refFec_comp:'',refFec_rec:'',refFec_emb:''})
  const refGrid	            = React.useRef();
  const refCab              = React.useRef({ data: [{}], dataCan:[]   , delete:[]   , activateCambio:false
                                        , dataCanDet:[], deleteDet:[] });
  const buttonSaveRef       = React.useRef();
  // MODAL F9
  const refModalData        = React.useRef();
  const refModal            = React.useRef({  modalColumn : []
                                            , data        : []
                                            , ModalTitle  : ''
                                            , idInput     : ''
                                            , dataParams  : ''
                                            , url_buscador: ''
                                            });
  React.useEffect(()=>{
      if(location.state !== undefined){
        setActivateAtras(true)
        let rowData = getParmas(true);
        rowData.NRO_COMPROBANTE   = location.state.NRO_COMPROBANTE;
        rowData.IND_COMPRA_LOCAL  = 'S';
        rowData.SER_COMPROBANTE   = 'A';
        rowData.TIP_COMPROBANTE   = 'FAC';
        setTimeout(()=>{
          getDataCab(rowData);
        })
      }else{
        inicialForm();
      }
    // eslint-disable-next-line
  },[])

  Main.useHotkeys(Main.Guardar, (e) =>{
		e.preventDefault();
		buttonSaveRef.current.click();
	},{enableOnFormTags: ['input', 'select', 'textarea']});
	Main.useHotkeys('f7', (e) => {
    e.preventDefault();
	});

  const get_PreFrom = async() => {
    try {
      let params  = {
                      COD_EMPRESA : cod_empresa ,
                      COD_SUCURSAL: cod_sucursal,
                      FORMNAME    : FormName    ,
                    }
			return await Main.Request(mainUrl.url_buscar_preForm,"POST",params).then((resp)=>{
        return resp.data ? resp.data : {}
      });
		} catch (error) {      
			console.log(error);
      return {}
		} finally {
			Main.desactivarSpinner();
		}
  }
  const inicialForm = async(f7_delete = false, idFocus = 'COD_SUCURSAL')=>{
    try {
      let result_preForm = await get_PreFrom();
      banRef.current.indice = 0;
      let valor   = {...objetoInicialCab}
      if(Object.keys(result_preForm).length > 0) valor   = {...valor, ...result_preForm}
      form.resetFields();
      let newKey = Main.uuidID()
      valor.ID							  = newKey;
      valor.COD_EMPRESA       = sessionStorage.cod_empresa;
      valor.COD_SUCURSAL      = sessionStorage.cod_sucursal;
      valor.DESC_SUCURSAL     = sessionStorage.desc_sucursal;
      let date                = Main.moment().format('DD/MM/YYYY').toString();
      valor.FEC_COMPROBANTE   = Main.dayjs(date,'DD/MM/YYYY');
      valor.FEC_RECEPCION     = Main.dayjs(date,'DD/MM/YYYY');
      if(!f7_delete) form.setFieldsValue(valor);
      else Main.desactivarSpinner();
      valor.FEC_COMPROBANTE   = Main.moment(valor.FEC_COMPROBANTE).format('DD/MM/YYYY');
      valor.FEC_RECEPCION     = Main.moment(valor.FEC_RECEPCION).format('DD/MM/YYYY');
      refCab.current.data     = [valor]
      refCab.current.dataCan  = JSON.parse(JSON.stringify([valor]));
      
      if(!f7_delete)getDetalle(newKey,false,0);
      else refGrid.current?.hotInstance.loadData([])
  
      setTimeout( ()=> {				
        if(document.getElementById(idFocus)){
          document.getElementById(idFocus).select();
          document.getElementById("indice").textContent         = "1"
          document.getElementById("total_registro").textContent = "?";
          document.getElementById("mensaje").textContent 				= ""; 
        }
      },20);      
    } catch (error) {
      console.log(error)
      Main.desactivarSpinner()
    }    
  }
  const getParamsDetalle = async (idCabecera = false, indexRow = 0)=>{
    var newKey            = Main.uuidID();
    var valor             = await {...objetoInicialDet};
    valor.ID	            = newKey;
    valor.COD_EMPRESA	    = refCab.current.data[indexRow].COD_EMPRESA    ;
    valor.COD_SUCURSAL    = refCab.current.data[indexRow].COD_SUCURSAL   ;
    valor.COD_PROVEEDOR   = refCab.current.data[indexRow].COD_PROVEEDOR  ;
    valor.NRO_COMPROBANTE = refCab.current.data[indexRow].NRO_COMPROBANTE;
    valor.TIP_COMPROBANTE = refCab.current.data[indexRow].TIP_COMPROBANTE;
    valor.SER_COMPROBANTE = refCab.current.data[indexRow].SER_COMPROBANTE;
    valor.idCabecera      = idCabecera ? idCabecera : refCab.current.data[indexRow]?.ID;
    return valor;
  }
  const getDetalle = async (idCabecera, data = false,indexRow = 0,guardar = false)=>{
    try {
      let dataParams = data ? data : await getParamsDetalle(idCabecera,indexRow);
      var content = [];
      var info = await Main.Request(mainUrl.url_list_detalle,'POST',dataParams);
      if(info?.data?.rows?.length === 0 || info?.data?.rows === undefined) content = [dataParams];
      else content = info.data.rows
    
      refCab.current.dataCanDet = JSON.parse(JSON.stringify(content));
      refGrid.current?.hotInstance.loadData(content);

      setTimeout(()=>{                
        ver_bloqueo();
        addClassAddGrid()
        if(refGrid.current) setTimeout(()=>Main.setFocusedRowIndex(0,undefined,refGrid,idComp),10);
        if(guardar)refGrid.current.hotInstance.selectCell(0,0);
      },15);
    } catch (error) {
      Main.desactivarSpinner()
      console.error(error);
    }
  }
  const addClassAddGrid = async ()=>{  
    try {
      let row = await  refGrid.current ? refGrid.current.hotInstance.getSourceData() : [];
      for (let a = 0; a < row.length; a++) {
        const items = row[a];
        if(items.IND_NUEVO === 'S'){
          for (let b = 0; b < 2; b++) {
            refGrid.current.hotInstance.setCellMeta(a, b, 'className', 'lightblue-bg-verd');         
          }
        }
        if(items.IND_BLOQ === 'S'){
          for (let c = 3; c < columns.length; c++) {
            refGrid.current.hotInstance.setCellMeta(a, c, 'className', 'lightblue-bg-amar');          
          }
        }
        refGrid.current.__hotInstance.updateSettings({      
          cellRow:a
        },);
      }      
    } catch (error) {
      console.log(error)
    }
  }
  const quitarClassAddGrid = (rowIndex)=>{
    for (let i = 3; i < columns.length; i++) {
      refGrid.current.hotInstance.removeCellMeta(rowIndex, i, 'className', 'lightblue-bg-amar');
      refGrid.current.__hotInstance.updateSettings({      
        cellRow:rowIndex
      },);
    }
  }
  // ------------------------------------------------------------------------------------
  const guardar = async ()=>{
    let permisoActualizacion = false;
    let permisoIsertar 	     = false;
    let exitInsertedBand     = false;
    let p_mensaje            = '';

    if(refCab.current.delete.length === 0){
      let verificar_input_requerido = Main.validarCamposRequeridos();
      if(!verificar_input_requerido) return    
       // eslint-disable-next-line
      refCab.current.data.filter( item =>{
        if(item.inserted){
          if(item.TOT_RECARGO > 0){
            refCab.current.data[banRef.current.indice].BLOQ_X_OTROS = 'N';
            item.BLOQ_X_OTROS = 'N'
          }else{
            refCab.current.data[banRef.current.indice].BLOQ_X_OTROS = 'S';
            item.BLOQ_X_OTROS = 'S'
          } 

          if((item.BLOQ_X_PREC  === 'N'  || 
              item.BLOQ_X_COND  === 'N'  || 
              item.BLOQ_X_FLETE === 'N'  ||  
              item.BLOQ_X_OTROS === 'N') && (item.ESTADO !== 'A') ){
            refCab.current.data[banRef.current.indice].ESTADO_AUT = 'P';          
          }else{
            refCab.current.data[banRef.current.indice].ESTADO_AUT = 'C';
          }
        }
        if(item.inserted || item.updated){
          if(item.inserted) exitInsertedBand = true
          if(item.FEC_COMPROBANTE    === ""){
            p_mensaje = `El campo FEC_COMPROBANTE es requerido`;
            
          }else if(item.FEC_EMBARQUE === ""){
            p_mensaje = `El campo Fecha (ETD)     es requerido`;
            
          }if(item.FEC_RECEPCION     === ""){
            p_mensaje = `El campo Fecha Recep.    es requerido`;
            
          }else if(item?.NRO_TIMBRADO !== ""){
            if(item?.NRO_TIMBRADO?.toString().trim().length !== 8){
              p_mensaje = 'La cantidad de digitos del timbrado debe ser igual a 8.';
            }
          }else if(item?.NRO_TIMBRADO === ""){
            p_mensaje = 'Es necesario que ingrese el Nro. de Timbrado.';            
          }
        }      
      });
      
      if(p_mensaje.length > 0){
        Main.message.warning({
          content  : p_mensaje,
          className: 'custom-class',
          duration : `${2}`,
          style    : {marginTop: '2vh'},
        });
        return
      }
    }
     
    Main.quitarClaseRequerido();

    //GET TAB1 DET
    let update_insert_detalle = []
    if(refGrid.current.hotInstance) update_insert_detalle = refGrid.current.hotInstance.getSourceData();   
    if(refGrid.current){
      let idGrid = {
        grid:{
          [idComp] : refGrid,
        },
        columna:{
          [idComp] : columns
        }
      }
      const valor = await  Main.hotTableRequerido(idGrid,idComp);
      if(valor.Addband){
        setTimeout(()=>{
          Main.message.warning({
            content  : `Ingrese ${valor.columnaRequerido.label} para Continuar!!`,
            className: 'custom-class',
            duration : `${2}`,
            style    : {marginTop: '2vh'},
          });        
          refGrid.current.hotInstance.selectCell(valor.columnaRequerido.indexRow,valor.columnaRequerido.indexComun);
        },1)
        return
      }
    }

    // FILTER CAB
    var dependencia_cab     = [{ 'COD_SUCURSAL':'COD_SUCURSAL_ANT'},{ 'TOT_RECARGO':'TOT_RECARGO_ANT'},{ 'TOT_DESCUENTO':'TOT_DESCUENTO_ANT'}];
    var rowCab              = refCab.current.data[banRef.current.indice];
    let url_get_cab_cod     = `${mainUrl.url_buscar_nro_compr}${cod_empresa}/${rowCab.SER_COMPROBANTE}/${rowCab.TIP_COMPROBANTE}`
    let infoCab      	      = await Main.GeneraUpdateInsertCab(refCab.current.data,'NRO_COMPROBANTE',url_get_cab_cod,dependencia_cab,true,false,true);
    var aux_cab	            = infoCab.rowsAux;
    var updateInserData     = infoCab.updateInsert;
    let keyCabecera 			  = infoCab.rowsAux.length > 0 ?  infoCab.rowsAux[banRef.current.indice]?.NRO_COMPROBANTE : null;
    if(!permisoActualizacion) permisoActualizacion = infoCab.actualizar;
    if(!permisoIsertar)       permisoIsertar 	     = infoCab.insertar  ;
    var delete_cab          = refCab.current.delete[0] !== undefined && refCab.current.delete?.length > 0  ? refCab.current.delete : []
    exitInsertedBand        = infoCab.insertar;
  

    // FILTER DET
    var dependencia_det        = [{'TOTAL_IVA':'IVA_ANT'},{'PORCENTAJE_IVA':'PORC_IVA_ANT'},{'MONTO_TOTAL':'IMPORTE_ANT'}];
    var add_cab_and_det        = ['COD_DEPOSITO','COD_MONEDA','DECIMALES'];
    let url_get_det_cod        = `${mainUrl.url_buscar_nro_orden}${cod_empresa}/${rowCab.SER_COMPROBANTE}/${rowCab.TIP_COMPROBANTE}/${keyCabecera}`
    var infoDet     	    	    = await Main.GeneraUpdateInsertDet(update_insert_detalle,['NRO_ORDEN'],aux_cab,dependencia_det,'NRO_COMPROBANTE',url_get_det_cod,'NRO_ORDEN','ASC',add_cab_and_det);
    var updateInserDataDet     = infoDet.updateInsert;
    if(!permisoActualizacion) permisoActualizacion = infoDet.actualizar;
    if(!permisoIsertar) permisoIsertar             = infoDet.insertar;
    var delete_Det             = refCab.current.deleteDet[0] && refCab.current.deleteDet?.length > 0 && refCab.current.deleteDet !== undefined ? refCab.current.deleteDet : []
 
    var bandPermiso = false
    if(permisoActualizacion){
      let Permiso  = Main.VerificaPermiso(FormName)
      if(Permiso.update !== 'S'){
        Main.message.warning({
          content  : `No cuenta con los permisos para Actualizar!`,
          className: 'custom-class',
          duration : `${2}`,
          style    : {marginTop: '2vh'},
        });
        bandPermiso = true
      }
    }
    if(permisoIsertar){
      let Permiso  = Main.VerificaPermiso(FormName)
      if(Permiso.insert !== 'S'){
        Main.message.warning({
          content  : `No cuenta con los permisos para Insertar!`,
          className: 'custom-class',  
          duration : `${2}`,
          style    : {marginTop: '2vh'},
        });
        bandPermiso = true
      }
    }
    if(bandPermiso) return
 
    var AditionalData = [{"cod_usuario": sessionStorage.getItem('cod_usuario'),"cod_empresa": sessionStorage.getItem('cod_empresa')}];

    var data = {
      updateInserData      ,
      aux_updateInserData : [refCab.current.dataCan[banRef.current.indice]],
      delete_cab	         , 

      updateInserDataDet   ,
      aux_updateInserDataDet : refCab.current.dataCanDet,
      delete_Det	         , 
      
      AditionalData        ,
      exitInsertedBand
    }

    Main.activarSpinner();
    if(updateInserData.length   > 0 ||  
      delete_cab.length         > 0 ||
      updateInserDataDet.length > 0 ||
      delete_Det.length         > 0){

        try {
          await Main.Request(mainUrl.url_abm,"POST",data).then(async(resp) => {
            if(resp.data.ret === 1){
              Main.desactivarSpinner()
              Main.setModifico(FormName)
              
              Main.message.success({
                content  : resp.data.p_mensaje !== '' && resp.data.p_mensaje !== 'OK'? resp.data.p_mensaje : 'Procesado correctamente!!',
                className: 'custom-class',
                duration : 2,
                style    : {
                marginTop: '4vh',
                },
              });
              
              // eslint-disable-next-line
              mainInput.validaInput.map( item => {
                item.valor_ant = null;
              });
              if(refCab.current.delete.length > 0) setTimeout(()=>inicialForm()); 
              refCab.current.activateCambio = false;
              refCab.current.delete         = []
              refCab.current.deleteDet      = []
              
              refCab.current.data        = infoCab.rowsAux
              refCab.current.dataCan     = JSON.parse(JSON.stringify(refCab.current.data));

              loadForm(infoCab.rowsAux,banRef.current.indice,refCab.current.delete.length === 0 ? false : true );
              setTimeout(()=>document.getElementById('COD_SUCURSAL').focus())
            }else{
              Main.desactivarSpinner();
              Main.alert(resp.data.p_mensaje, '¡Atención!', 'alert', 'OK')
            }            
          });
          
        } catch (error) {
          Main.desactivarSpinner();
          console.log('Error en la funcion de Guardar stentsal',error)
        }
    }else{
      Main.message.info({
        content  : `No encontramos cambios para guardar`,
        className: 'custom-class',
        duration : `${2}`,
        style    : {
            marginTop: '2vh',
        },
      });
      Main.desactivarSpinner();
      Main.setModifico(FormName);
    }
  }
  const addRow = async(index = false)=>{
    if(!banRef.current.bandNew && index === false){
      inicialForm();
    }else if(!banRef.current.b_bloqueo_aux){
      let row = refCab.current.data[banRef.current.indice]
      if(['C','A'].includes(row.ESTADO)) return  
      var idGrid = {
        grid:{
          [idComp] : refGrid
        },
        columna:{
          [idComp] : columns
        }
      }
      let valor = await  Main.hotTableRequerido(idGrid,idComp,false);
      if(valor.Addband){
        setTimeout(()=>{
          Main.message.warning({
            content  : `Ingrese ${valor.columnaRequerido.label} para Continuar!!`,
            className: 'custom-class',
            duration : `${2}`,
            style    : {marginTop: '2vh'},
          });
          refGrid.current.hotInstance.selectCell(valor.columnaRequerido.indexRow,valor.columnaRequerido.indexComun);
        },1)
        return
      }
      Main.modifico(FormName)
      let rowValue    = Main.g_getRowFocus(idComp);
      let rowIndex    = index.index ? index.index + 1 : rowValue[0].rowIndex === 0 ? rowValue[0].rowIndex + 1  : rowValue[0].rowIndex === -1 ? 0 : rowValue[0].rowIndex;
      let newRow      = await getParamsDetalle(false,banRef.current.indice);

      refGrid.current.hotInstance.alter('insert_row', rowIndex);
      refGrid.current.hotInstance.view.settings.data[rowIndex] =  JSON.parse(JSON.stringify(newRow));

      refGrid.current.hotInstance.updateSettings({      
        cellRow:rowIndex,
      });  

      refGrid.current.hotInstance.selectCell(rowIndex, 0);

      setTimeout(()=>{        
        typeEventDet(rowIndex)
      },100)
    }
  }
  const deleteRow = async()=>{
    if(!banRef.current.bandNew){
      if(!banRef.current.b_bloqueo_aux){
        setTimeout(()=>{
          Main.activarSpinner()
          form.resetFields();
          refCab.current.delete[0] = refCab.current.data[banRef.current.indice]
          inicialForm(true,'COD_SUCURSAL');
          Main.modifico(FormName)
        },10)
      }      
    }else if(!banRef.current.b_bloqueo_aux){
      Main.activarSpinner()
      setTimeout(async()=>{
        let rowCount       = refGrid.current.hotInstance.getSourceData().length;
        let rowInfo        = Main.g_getRowFocus(idComp)[0]
        let rowIndexFocus  = rowInfo.rowIndex - 1 === -1 ? 0 : rowInfo.rowIndex - 1;
        
        if(!rowInfo?.inserted && !rowInfo?.insertDefault){
  
          if(refCab.current.deleteDet.length > 0){
            refCab.current.deleteDet = Main._.union(refCab.current.deleteDet, [rowInfo])
          }else{
            refCab.current.deleteDet = [...refCab.current.deleteDet,rowInfo]
          }
  
          refGrid.current.hotInstance.alter('remove_row',rowInfo.rowIndex);
          refGrid.current.hotInstance.selectCell(rowIndexFocus,rowInfo.columnIndex)
  
          Main.modifico(FormName)
          Main.setCambiosPendiente(idComp,true)
  
          if(rowCount === 1){
            banRef.current.bandNew = true;
            addRow({index:-1});
          }
          Main.desactivarSpinner()
        }else if(rowCount === 1){
          banRef.current.bandNew = true;
          refGrid.current.hotInstance.alter('remove_row',rowInfo.rowIndex);
          addRow({index:-1});
          Main.desactivarSpinner()
        }else{
          Main.desactivarSpinner()
          refGrid.current.hotInstance.alter('remove_row',rowInfo.rowIndex);
          refGrid.current.hotInstance.selectCell(rowIndexFocus,rowInfo.columnIndex)
        }
      },10)
    }
  }
  const funcionCancelar = ()=>{
    let indice = banRef.current.indice;
    form.resetFields();
    Main.setCambiosPendiente(idComp,false);
    banRef.current.bandNew = false;
    mainInput.restablecerValida();
    Main.activarSpinner();
    Main.setModifico(FormName);
    refCab.current.activateCambio = false;
    refCab.current.delete         = [];
    refCab.current.deleteDet      = [];
    banRef.current.refFec_comp    = '';
    banRef.current.refFec_emb     = '';
    banRef.current.refFec_rec     = '';
    Main.setBuscar(FormName,false);
    if(refCab.current.data[indice].insertDefault || refCab.current.data[indice].inserted){
      inicialForm()
    }else{
      refCab.current.data    = JSON.parse(JSON.stringify(refCab.current.dataCan));
      refCab.current.dataCan = JSON.parse(JSON.stringify(refCab.current.data))   ;
      loadForm(refCab.current.data,indice) 
      setTimeout(()=>{
        document.getElementById('COD_SUCURSAL').focus();  
      },200)
    }
    setTimeout(()=>Main.desactivarSpinner())
  }
  const loadForm = async (data = [] , indice = false,guardar = false)=>{
    let index  = await indice ? indice : banRef.current.indice;
    let value  = await data[index] === undefined ? data : data[index];
       
    form.setFieldsValue({
      ...value,
      FEC_COMPROBANTE : value?.FEC_COMPROBANTE ? Main.dayjs(value?.FEC_COMPROBANTE , 'DD/MM/YYYY') : null,
      FEC_EMBARQUE    : value?.FEC_EMBARQUE    ? Main.dayjs(value?.FEC_EMBARQUE    , 'DD/MM/YYYY') : null,
      FEC_RECEPCION   : value?.FEC_RECEPCION   ? Main.dayjs(value?.FEC_RECEPCION   , 'DD/MM/YYYY') : null,
    });
    Main.desactivarSpinner();
    nextValida({input:'COD_MONEDA'},false);
    getDetalle(false, { COD_EMPRESA     : value.COD_EMPRESA
                      , NRO_COMPROBANTE : value.NRO_COMPROBANTE
                      , TIP_COMPROBANTE : value.TIP_COMPROBANTE
                      , SER_COMPROBANTE : value.SER_COMPROBANTE},indice,guardar); 
  } 
  const funcionBuscar = (e)=>{
    if(e){
      if(!refCab.current.activateCambio){
        Main.setModifico(FormName);        
        getDataCab();
      }else{
        Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,funcionCancelar)
      }
    }else{
      manejaF7('NRO_COMPROBANTE')
    };
    Main.setBuscar(FormName,!e)
  }
  const navigateArrow = (id)=>{
    Main.activarSpinner()
    switch (id) {
      case 'left':
        leftData();  
        break;
      case 'right':
        rightData();
        break;
      case 'next-left':
        if(refCab.current.data.length > 1){banRef.current.indice=0;leftData();} 
        else Main.desactivarSpinner();
        break;
      case 'next-right':
        if(refCab.current.data.length > 1){
          let index =  refCab.current.data.length - 1
          banRef.current.indice = index;
          loadForm(refCab.current.data,index);
          document.getElementById("indice").textContent = refCab.current.data.length;
        }
        else Main.desactivarSpinner();
        break;
      default:
        break;
    }
  }
  const leftData = async() => {
    if(!refCab.current.activateCambio){
      var index = banRef.current.indice - 1;
      if(index < 0){
        index = 0;
        document.getElementById("mensaje").textContent = "Haz llegado al primer registro";
      }else{
        document.getElementById("mensaje").textContent = "";
      }
      document.getElementById("indice").textContent = index + 1;
      document.getElementById("total_registro").textContent = refCab.current.data.length
      banRef.current.indice = index;
      var row = refCab.current.data[banRef.current.indice]
      if( banRef.current.id_cabecera !== row.ID ) banRef.current.id_cabecera = row.ID;
      loadForm(refCab.current.data);
      Main.quitarClaseRequerido();
    }else{
      Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,funcionCancelar)
    }
  }
  const rightData = async() => {
    if(!refCab.current.activateCambio){
      if(refCab.current.data.length !== 1){
        var index = banRef.current.indice + 1;
        if( banRef.current.id_cabecera !== refCab.current.data[index]?.ID && !Main._.isUndefined(refCab.current.data[index]?.ID)){
          banRef.current.id_cabecera = refCab.current.data[index].ID;
          banRef.current.indice = index;
          loadForm(refCab.current.data[index],index)
          document.getElementById("total_registro").textContent = refCab.current.data.length
          document.getElementById("mensaje").textContent = "";
          document.getElementById("indice").textContent  = index + 1;
          if(banRef.current.indice > mitad_data && banRef.current.bandPost_Cab_Det){
            banRef.current.bandPost_Cab_Det = false;
            let params = { INDICE  : refCab.current.data.length, 
                           LIMITE  : data_len
                         };  
            try {
              await Main.Request(mainUrl.url_list_cabecera,'POST',params)
                .then(async (resp) => {              
                  let response = await resp?.data?.rows;
                  banRef.current.bandPost_Cab_Det = true;
                  refCab.current.data      = [ ...refCab.current.data, ...response ];
                  refCab.current.dataCan   = JSON.parse(JSON.stringify([refCab.current.data]))
                  Main.desactivarSpinner();
                })
            } catch (error) {
              Main.desactivarSpinner();
              console.log(error)
            }
          }
        }else{
          Main.desactivarSpinner(); 
        }
      }else{
        document.getElementById("mensaje").textContent = "";
        Main.desactivarSpinner(); 
      }
      Main.quitarClaseRequerido();
    }else{
      Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,funcionCancelar)
    }
  }
  const handleKeyUp = async(e) => {
    if(e.keyCode === 40){e.preventDefault(); Main.activarSpinner(); rightData();}
    if(e.keyCode === 38){e.preventDefault(); Main.activarSpinner(); leftData(); }
  }
  //**************************** Change *********************/ 
  const handleInputChange = (e) => {
    Main.modifico(FormName)
    try {
      refCab.current.data[banRef.current.indice][e?.target?.id ? e?.target?.id : e.target.name ] = e?.target?.value;  
    } catch (error) {
      console.log(error)
    }
    typeEvent()
  }  
  const handleInputChangeNumber = (e)=>{
    const { id, value} = e.target
    Main.modifico(FormName)
    try {
      refCab.current.data[banRef.current.indice][id] = Main.numerico(value);
    } catch (error) {
      console.log(error)
    }
    typeEvent()
  }
  const manejaF7 = (idFocus)=>{
    Main.activarSpinner()
    form.resetFields(); 
    refCab.current.activateCambio = false    
    refGrid.current?.hotInstance.loadData([]) 
    banRef.current.refFec_comp    = '';
    banRef.current.refFec_emb     = '';
    banRef.current.refFec_rec     = '';
    setTimeout(()=>{    
      if(!Main.getViewBuscar(FormName))Main.setBuscar(FormName,true);
      Main.desactivarSpinner()      
      inicialForm(true,idFocus);      
      ver_bloqueo(true)
    })
  }
  const onkeyDown = async(e)=>{
    if(['TOT_DESCUENTO','TOT_RECARGO','TOT_FLETE'].includes(e.target.id) && banRef.current.b_bloqueo_aux) e.preventDefault();
    else if(!['TOT_DESCUENTO','TOT_RECARGO','TOT_FLETE'].includes(e.target.id) && banRef.current.b_bloqueo) e.preventDefault();
    if([40,38].includes(e.keyCode)) e.preventDefault();
    if(e.target.id === 'FEC_COMPROBANTE') banRef.current.refFec_comp   = e.target.value;
    else if(e.target.id === 'FEC_RECEPCION') banRef.current.refFec_rec = e.target.value;
    else if(e.target.id === 'FEC_EMBARQUE') banRef.current.refFec_emb  = e.target.value;
    if (['Enter', 'Tab'].includes(e.key)) {
      let indice = banRef.current.indice;
      e.preventDefault()
      switch (e.target.id) {
        case "NRO_COMPROBANTE":
          document.getElementById('FEC_COMPROBANTE').focus();
        break;
        case "FEC_EMBARQUE":
          setTimeout(()=>{
            document.getElementsByClassName('ant-picker-dropdown')[1].style.visibility = 'collapse'
          })
          document.getElementById('FEC_RECEPCION').focus();            
        break;
        case "FEC_RECEPCION":
          setTimeout(()=>{
            document.getElementsByClassName('ant-picker-dropdown')[2].style.visibility = 'collapse'
          })
          document.getElementById('COD_PROVEEDOR').focus();            
        break;
        case 'COD_PROVEEDOR':
          let info = refCab.current.data[indice]
          if(!info.inserted && info.insertDefault === undefined){
            if(info.COD_CONDICION_COMPRA === '' || info.COD_PROVEEDOR_ANT !== info.COD_PROVEEDOR){
              info.COD_PROVEEDOR_ANT = info.COD_PROVEEDOR
              ValidarUnico(e.target.id, e.target.value);
            }else{
              document.getElementById("COD_PROVEEDOR_ANT").select()
            }
          }else{
            info.COD_PROVEEDOR_ANT = info.COD_PROVEEDOR
            ValidarUnico(e.target.id, e.target.value);
          }
        break;
        case "NRO_TIMBRADO":
          let infoData = refCab.current.data[banRef.current.indice]
          if(infoData.IND_TIMBRADO === 'S' && infoData.IND_TIPO === 'F'){
            if(e.target.value.trim() === ""){
              Main.alert('Es necesario que ingrese el Nro. de Timbrado.', '¡Atención!', 'alert', 'OK')
            }else if(e.target.value.length !== 8){
              Main.alert('La cantidad de digitos del timbrado debe ser igual a 8.', '¡Atención!', 'alert', 'OK')              
              form.setFieldsValue({
                ...form.getFieldsValue(),
                NRO_TIMBRADO : ''
              });
              refCab.current.data[banRef.current.indice].NRO_TIMBRADO = ''
            }else{
              document.getElementById('REFERENCIA').focus();
            }
          }else{
            document.getElementById('REFERENCIA').focus();
          }
        break;
        case "TOT_DESCUENTO":
          const rowCab_desc = refCab.current.data[banRef.current.indice];
          if (rowCab_desc.TOT_DESCUENTO > 0){
            Main.alert('¿El descuento que se desea aplicar Realmente Corresponde?','Atención','confirm','Aceptar','Cancelar',()=>procesa_desc_rec(rowCab_desc),()=>Main.Modal.destroyAll());
          }else{
            refCab.current.data[banRef.current.indice].TOT_DESCUENTO = 0;
            form.setFieldsValue({
              ...form.getFieldsValue(),
              TOT_DESCUENTO : 0
            });
            procesa_desc_rec(rowCab_desc)
            typeEvent()
          }
        break;
        case "TOT_RECARGO":
          const rowCab_rec = refCab.current.data[banRef.current.indice];
          if (rowCab_rec.TOT_RECARGO > 0){
            procesa_desc_rec(rowCab_rec);
            refCab.current.data[banRef.current.indice].BLOQ_X_OTROS = 'N';
            Main.message.info({
              content  : `Se generará una autorización por los Recargos`,
              className: 'custom-class',
              duration : `${2}`,
              style    : {
                  marginTop: '2vh',
              },
            });
          }else{
            refCab.current.data[banRef.current.indice].BLOQ_X_OTROS = 'S';
          }
          typeEvent();
        break;
        case "TOT_FLETE":
          const rowCab_fle = refCab.current.data[banRef.current.indice];
          if (rowCab_fle.TOT_FLETE > 0){
            procesa_desc_rec(rowCab_fle);
            refCab.current.data[banRef.current.indice].BLOQ_X_FLETE = 'N';
            Main.message.info({
              content  : `Se generará una autorización por flete`,
              className: 'custom-class',
              duration : `${2}`,
              style    : {
                  marginTop: '2vh',
              },
            });
          }else{
            refCab.current.data[banRef.current.indice].BLOQ_X_FLETE = 'S';
          }
          typeEvent();
        break;
        default:
          break;
      }
      if (['COD_SUCURSAL','COD_PROVEEDOR_ANT','FEC_COMPROBANTE','COD_CONDICION_COMPRA',
           'COD_MONEDA','COD_DEPOSITO','REFERENCIA'].includes(e.target.id) && !banRef.current.b_bloqueo) {
        if(e.target.id === 'FEC_COMPROBANTE'){
          setTimeout(()=>{
            document.getElementsByClassName('ant-picker-dropdown')[0].style.visibility = 'collapse'
          })
        }
        ValidarUnico(e.target.id, e.target.value);
      }
    }else if (['F7', 'F8'].includes(e.key)) {
      e.preventDefault()
      if(!refCab.current.activateCambio){
        Main.setModifico(FormName)
        if('F7' === e.key){
          manejaF7(e.target.id);
        }else{
          if(Main.getViewBuscar(FormName))Main.setBuscar(FormName,false);
          getDataCab()
        }
      }else{
        Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,funcionCancelar)
      }
    }else if (e.key === 'F9' && ['COD_SUCURSAL','COD_PROVEEDOR_ANT','COD_PROVEEDOR',
                                'COD_CONDICION_COMPRA','COD_MONEDA','COD_DEPOSITO'].includes(e.target.id) && !banRef.current.b_bloqueo) {
      e.preventDefault()
      let aux = '';

      refModal.current.idInput = e.target.id
      let items = mainInput.ModalF9[e.target.id]
    
      refModal.current.ModalTitle   = items.title;
      refModal.current.modalColumn  = items.column;
      refModal.current.url_buscador = items.url;
      
      Main.activarSpinner()
      switch (e.target.id) {
        case "COD_SUCURSAL":
          aux = await Main.getData({ valor: 'null',cod_empresa },refModal.current.url_buscador);
          refModal.current.data = aux ? aux : []
          refModal.current.dataParams = { cod_empresa }
        break;
        case "COD_PROVEEDOR":
          aux = await Main.getData({valor:'null',cod_empresa },  refModal.current.url_buscador);
          refModal.current.data = aux ? aux : []
          refModal.current.dataParams = { cod_empresa }
        break;
        case "COD_PROVEEDOR_ANT":
          aux = await Main.getData({valor:'null',cod_empresa },  refModal.current.url_buscador);
          refModal.current.data = aux ? aux : []
          refModal.current.dataParams = { cod_empresa }
        break;
        case "COD_CONDICION_COMPRA":
          aux = await Main.getData({valor:'null',cod_empresa },  refModal.current.url_buscador);
          refModal.current.data = aux ? aux : []
          refModal.current.dataParams = { cod_empresa }
        break;
        case "COD_MONEDA":
          aux = await Main.getData({valor:'null',cod_empresa,cod_sucursal:form.getFieldValue('COD_SUCURSAL') },  refModal.current.url_buscador);
          refModal.current.data = aux ? aux : []
          refModal.current.dataParams = { cod_empresa,cod_sucursal:form.getFieldValue('COD_SUCURSAL') }
        break;
        case "COD_DEPOSITO":
          aux = await Main.getData({valor:'null',cod_empresa,cod_sucursal:form.getFieldValue('COD_SUCURSAL') },  refModal.current.url_buscador);
          refModal.current.data = aux ? aux : []
          refModal.current.dataParams = { cod_empresa,cod_sucursal:form.getFieldValue('COD_SUCURSAL') }
        break;
        default:
        break;
      }    
      Main.desactivarSpinner()
      setTimeout(() => {
        setShows(true)  
      }, 5);      
    }
  }
  const procesa_desc_rec = async (row)=>{
    let rowDet      = refGrid.current.hotInstance.getSourceData();
    let p_decimales = row.DECIMALES;
    if(rowDet.length > 0 && rowDet[0].COD_ARTICULO !== ""){
      if(row.TOT_DESCUENTO > 0 || row.TOT_RECARGO > 0 || row.TOT_FLETE){

        row.PORC_DESCUENTO = Main.round( Main.nvl( row.TOT_DESCUENTO, 0 ) / Main.nvl( row.TOT_COMPROBANTE, 0 ), 10 ) ;
        row.PORC_RECARGO   = Main.round( Main.nvl( row.TOT_RECARGO  , 0 ) / Main.nvl( row.TOT_COMPROBANTE, 0 ), 10 ) ;
        row.PORC_FLETE     = Main.round( Main.nvl( row.TOT_FLETE    , 0 ) / Main.nvl( row.TOT_COMPROBANTE, 0 ), 10 ) ;
       
        let difdescuento = Main.nvl( row.TOT_DESCUENTO ,0 );
        let difrecargo   = Main.nvl( row.TOT_RECARGO   ,0 );
        let difflete     = Main.nvl( row.TOT_FLETE     ,0 );
        
        for (let i = 0; i < rowDet.length; i++) {
          
            rowDet[i].DESCUENTO = Main.round ( Main.nvl( rowDet[i].MONTO_TOTAL_C_IVA, 0 ) * Main.nvl( row.PORC_DESCUENTO, 0) , 0 ) ;
            rowDet[i].RECARGO   = Main.round ( Main.nvl( rowDet[i].MONTO_TOTAL_C_IVA, 0 ) * Main.nvl( row.PORC_RECARGO  , 0) , 0 ) ;
            rowDet[i].FLETE     = Main.round ( Main.nvl( rowDet[i].MONTO_TOTAL_C_IVA, 0 ) * Main.nvl( row.PORC_FLETE    , 0) , 0 ) ;
          
            difdescuento        = Main.round ( Main.nvl( difdescuento , 0 ) - Main.nvl( rowDet[i].DESCUENTO, 0 ), 0 ) ;
            difrecargo          = Main.round ( Main.nvl( difrecargo   , 0 ) - Main.nvl( rowDet[i].RECARGO  , 0 ), 0 ) ;
            difflete            = Main.round ( Main.nvl( difflete     , 0 ) - Main.nvl( rowDet[i].FLETE    , 0 ), 0 ) ;

          if(i === (rowDet.length - 1)){
            rowDet.DESCUENTO  = Main.nvl( await Main.numerico_grilla(rowDet.DESCUENTO,p_decimales) , 0 )  + Main.nvl( difdescuento , 0 );
        	  rowDet.RECARGO    = Main.nvl( await Main.numerico_grilla(rowDet.RECARGO  ,p_decimales) , 0 )  + Main.nvl( difrecargo   , 0 );
        	  rowDet.FLETE      = Main.nvl( await Main.numerico_grilla(rowDet.FLETE    ,p_decimales) , 0 )  + Main.nvl( difflete     , 0 );
          }

          refGrid.current.hotInstance.view.settings.data[i].DESCUENTO = rowDet[i].DESCUENTO;
          refGrid.current.hotInstance.view.settings.data[i].RECARGO   = rowDet[i].RECARGO;
          refGrid.current.hotInstance.view.settings.data[i].FLETE     = rowDet[i].FLETE;

          rowDet[i].rowIndex = i;
          refGrid.current.hotInstance.updateSettings({cellRow:i});
          calcular_ant(rowDet[i]);
          calculos(rowDet[i],true);
        }
        setTimeout(()=>Main.setFocusedRowIndex(0,undefined,refGrid,idComp),10);
      }else{
        Main.alert('El monto del descuento tiene que ser mayor a "CERO"', '¡Atención!', 'alert', 'OK')
      }
    }else{
      refCab.current.data[banRef.current.indice].TOT_DESCUENTO = 0;
        form.setFieldsValue({
          ...form.getFieldsValue(),
        TOT_DESCUENTO : 0
      });
    }
  }
  const getParmas = (retornaNull = false,indice) =>{
    var data = {
      COD_EMPRESA           : sessionStorage.getItem('cod_empresa'),
      COD_SUCURSAL          : retornaNull ? '' : form.getFieldValue('COD_SUCURSAL')                  !== undefined ? form.getFieldValue('COD_SUCURSAL')                   : '',
      TIP_COMPROBANTE       : retornaNull ? '' : refCab.current.data[indice]['TIP_COMPROBANTE']      !== undefined ? refCab.current.data[indice]['TIP_COMPROBANTE']       : '',
      IND_COMPRA_LOCAL      : retornaNull ? '' : refCab.current.data[indice]['IND_COMPRA_LOCAL']     !== undefined ? refCab.current.data[indice]['IND_COMPRA_LOCAL']      : '',
      SER_COMPROBANTE       : retornaNull ? '' : refCab.current.data[indice]['SER_COMPROBANTE']      !== undefined ? refCab.current.data[indice]['SER_COMPROBANTE']       : '',
      NRO_COMPROBANTE       : retornaNull ? '' : refCab.current.data[indice]['NRO_COMPROBANTE']      !== undefined ? refCab.current.data[indice]['NRO_COMPROBANTE']       : '',
      FEC_COMPROBANTE       : retornaNull ? '' : banRef.current.refFec_comp                          !== ''        ? banRef.current.refFec_comp                           : '',
      FEC_RECEPCION         : retornaNull ? '' : banRef.current.refFec_emb                           !== ''        ? banRef.current.refFec_emb                            : '',
      FEC_EMBARQUE          : retornaNull ? '' : banRef.current.refFec_rec                           !== ''        ? banRef.current.refFec_rec                            : '',
      COD_PROVEEDOR         : retornaNull ? '' : refCab.current.data[indice]['COD_PROVEEDOR']        !== undefined ? refCab.current.data[indice]['COD_PROVEEDOR']         : '',
      COD_PROVEEDOR_ANT     : retornaNull ? '' : refCab.current.data[indice]['COD_PROVEEDOR_ANT']    !== undefined ? refCab.current.data[indice]['COD_PROVEEDOR_ANT']     : '',
      COD_CONDICION_COMPRA  : retornaNull ? '' : refCab.current.data[indice]['COD_CONDICION_COMPRA'] !== undefined ? refCab.current.data[indice]['COD_CONDICION_COMPRA']  : '',
      COD_MONEDA            : retornaNull ? '' : refCab.current.data[indice]['COD_MONEDA']           !== undefined ? refCab.current.data[indice]['COD_MONEDA']            : '',
      COD_DEPOSITO          : retornaNull ? '' : refCab.current.data[indice]['COD_DEPOSITO']         !== undefined ? refCab.current.data[indice]['COD_DEPOSITO']          : '',
      NRO_TIMBRADO          : retornaNull ? '' : refCab.current.data[indice]['NRO_TIMBRADO']         !== undefined ? refCab.current.data[indice]['NRO_TIMBRADO']          : '',
      REFERENCIA            : retornaNull ? '' : refCab.current.data[indice]['REFERENCIA']           !== undefined ? refCab.current.data[indice]['REFERENCIA']            : '',
    }
    return data
  } 
  const getDataCab = async(data = false)=>{ 
    let indice = banRef.current.indice;
    let params = data === false ? getParmas(false,indice) : data
    params.INDICE = 0;
    params.LIMITE = data_len;
    Main.activarSpinner()    
    try {
      Main.Request(mainUrl.url_list_cabecera, "POST", params).then((resp) => {
        let response = resp?.data?.rows;
        if (response && response?.length > 0) {
          
          // LIMPIAR EL DELETE
          refCab.current.delete         = []
          refCab.current.deleteDet      = []
  
          if(response.length === 1) document.getElementById("total_registro").textContent = "1";
          else document.getElementById("total_registro").textContent = "?"
          refCab.current.data    = response;
          refCab.current.dataCan = JSON.parse(JSON.stringify(response));
          banRef.current.indice = 0;
          setTimeout(()=>{
            loadForm(response,0);                    
          })
        }else{
          Main.desactivarSpinner();
          Main.message.info({
            content  : `No se han encontrado registros`,
            className: 'custom-class',
            duration : `${2}`,
            style    : {
              marginTop: '2vh',
            },
          });
        }
      }); 
    } catch (error) {
      Main.desactivarSpinner();
      console.error(error);
    }  
  }
  //********** VALIDADORES GENERICO  ***************/ 
  const nextValida = async (value,focus = true)=>{
    if(value.input === 'COD_MONEDA'){
      let valor = refCab.current.data[banRef.current.indice];  
      setTimeout(()=>{
        const currentColumnSettings = refGrid.current.hotInstance.getSettings().columns;
        currentColumnSettings[7] = {
          ...currentColumnSettings[7],
          type: 'numeric',
          numericForma1t: {pattern: `0,0.${'0'.repeat(valor.DECIMALES)}`},
        };
        currentColumnSettings[8] = {
          ...currentColumnSettings[8],
          type: 'numeric',
          numericFormat: {pattern: `0,0.${'0'.repeat(valor.DECIMALES)}`},
        };
        currentColumnSettings[9] = {
          ...currentColumnSettings[9],
          type: 'numeric',
          numericFormat: {pattern: `0,0.${'0'.repeat(valor.DECIMALES)}`},
        };
        currentColumnSettings[10] = {
          ...currentColumnSettings[10],
          type: 'numeric',
          numericFormat: {pattern: `0,0.${'0'.repeat(valor.DECIMALES)}`},
        };
  
        refGrid.current.hotInstance.updateSettings({columns: currentColumnSettings})
        Main.setFocusedRowIndex(0,undefined,refGrid,idComp);
       if(focus)document.getElementById('COD_DEPOSITO').focus();        
      },10)
    }else{
      refGrid?.current?.hotInstance?.selectCell(0,0);
    }
  }
  const ValidarUnico = async (input, value) => {
    let intOutDate = ['FEC_COMPROBANTE']
    let indice = banRef.current.indice;
    let valorValida = await mainInput.validaInput.find(item => item.input === input);
    if (!Main._.isObject(valorValida)) return;
    let valor = await !isNaN(value) ? value : value.trim();

    if (valor?.length === 0 && !valorValida.requerido && !valorValida.validaNull) {
      valorValida.valor_ant = null;
      // eslint-disable-next-line
      valorValida.out.map((x) => {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          [x]: ''
        });
        refCab.current.data[indice][x] = '';
      });
      // eslint-disable-next-line
      valorValida.rel.map((x) => {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          [x]: ''
        });
        refCab.current.data[indice][x] = '';
      });
      if (valorValida.next !== ""){
        if (valorValida?.idFocus) document.getElementById(valorValida.next).focus();
        else if (valorValida?.idSelect) document.getElementById(valorValida.next).select();
      }
      return;
    }
    if (form.getFieldValue(valorValida.input) !== valorValida.valor_ant || valorValida.validaNull === true) {
      try {
        let data = {COD_EMPRESA:cod_empresa}
        // eslint-disable-next-line
        valorValida.data.map((x) => {
          let value;
          const fieldValue = form.getFieldValue(x);
            value = x === 'FEC_COMPROBANTE' ? Main.moment(fieldValue).format('DD/MM/YYYY') : fieldValue;          
            data = { ...data, [x]:value, } }
          );
        data = { ...data, valor };
        await Main.Request(valorValida.url, 'POST', data).then((resp) => {
          if (resp.data.outBinds.ret === 1) {
            valorValida.valor_ant = valor
            // eslint-disable-next-line
            valorValida.out.map((x) => {
              if(intOutDate.includes(x)){ 
                form.setFieldsValue({
                  ...form.getFieldsValue(),
                  [x]: Main.dayjs(resp.data.outBinds[x],'DD/MM/YYYY')
                });
                refCab.current.data[indice][x] = resp.data.outBinds[x];
              }else{
                form.setFieldsValue({
                  ...form.getFieldsValue(),
                  [x]: resp.data.outBinds[x]
                });
                refCab.current.data[indice][x] = resp.data.outBinds[x];
              }               
            })
            // eslint-disable-next-line
            valorValida.rel.map(x => {
              form.setFieldsValue({
                ...form.getFieldsValue(),
                [x]: ''
              });
              refCab.current.data[indice][x] = null;
            });
            if (valorValida?.idFocus) document.getElementById(valorValida.next).focus();
            else if (valorValida?.idSelect) document.getElementById(valorValida.next).select();
            if(valorValida.nextEjecute) nextValida(valorValida)
          } else {            
            // eslint-disable-next-line
            valorValida.out.map((x) => {
              if(intOutDate.includes(x)){               
                form.setFieldsValue({
                  ...form.getFieldsValue(),
                  [x]:  Main.dayjs(resp.data.outBinds[x],'DD/MM/YYYY')
                });
              }
              refCab.current.data[indice][x] = resp.data.outBinds[x];
            })

            Main.alert(resp.data.outBinds.p_mensaje, '¡Atención!', 'alert', 'OK')
          }
        })
      } catch (error) {
        console.log('valida frontend', error)
      }
    }    
  }
  const typeEvent = ()=>{
    let indice = banRef.current.indice;
    if(refCab.current.data[indice]['insertDefault']){
      refCab.current.data[indice].insertDefault    = false;
      refCab.current.data[indice].inserted 		     = true;
      refCab.current.data[indice].COD_USUARIO	     = sessionStorage.getItem('cod_usuario');
    }
    if(!refCab.current.data[indice]['updated'] && refCab.current.data[indice]['inserted'] !== true){
      refCab.current.data[indice]['updated']       = true;
      refCab.current.data[indice].COD_USU_ESTADO	 = sessionStorage.cod_usuario;
      refCab.current.activateCambio = true;
    }
    Main.modifico(FormName);
  }
  const typeEventDet = (indexRow = false)=>{
    let rowValue = indexRow === false ? Main.g_getRowFocus(FormName)[0] : {rowIndex:indexRow};
    if(refGrid.current.hotInstance.view.settings.data[rowValue.rowIndex]['insertDefault']){
       refGrid.current.hotInstance.view.settings.data[rowValue.rowIndex].insertDefault      = false;
       refGrid.current.hotInstance.view.settings.data[rowValue.rowIndex].inserted 		      = true;
    }else if(!refGrid.current.hotInstance.view.settings.data[rowValue.rowIndex]['updated'] && 
              refGrid.current.hotInstance.view.settings.data[rowValue.rowIndex]['inserted'] !== true){
       refGrid.current.hotInstance.view.settings.data[rowValue.rowIndex]['updated']         = true;
       refGrid.current.activateCambio = true;
       Main.modifico(FormName);
    } 
  }  
  const ver_bloqueo= async(f7 = false) =>{
    try {
      let p_bloqueo_aux = form.getFieldValue('ESTADO') !== 'P' ? true : false;
      let p_bloqueo     = form.getFieldValue('NRO_COMPROBANTE') === '' || form.getFieldValue('NRO_COMPROBANTE') === undefined ? false : true;
      let input         = document.getElementsByClassName(`${FormName}_BLOQUEO`);
      let input_aux     = document.getElementsByClassName(`${FormName}_BLOQUEO_AUX`);
      
      for (let i = 0; i < input.length; i++) {
        const element = input[i];
        element.readOnly = p_bloqueo;
      }
  
      for (let i = 0; i < input_aux.length; i++) {
        const element = input_aux[i];
        element.readOnly = p_bloqueo_aux;
      }
  
      banRef.current.b_bloqueo     = p_bloqueo;
      banRef.current.b_bloqueo_aux = p_bloqueo_aux;
      let nro_comprobante = document.getElementsByClassName(`${FormName}_BLOQUEO_NRO_COMP`)
      if(nro_comprobante && nro_comprobante.length > 0){
        document.getElementsByClassName(`${FormName}_BLOQUEO_NRO_COMP`)[0].readOnly = !f7
        Main.setBloqueoFecha(`${FormName}_FEC_COMPROBANTE`,p_bloqueo);
        Main.setBloqueoFecha(`${FormName}_FEC_EMBARQUE`   ,p_bloqueo_aux);
        Main.setBloqueoFecha(`${FormName}_FEC_RECEPCION`  ,p_bloqueo_aux);
    
        Main.setBloqueoRadio(`${FormName}_IND_TIPO_FACTURA`,p_bloqueo);   
    
    
        setTimeout(()=>{
          habilitar_columna()
        },1); 
      }      
    } catch (error) {
      Main.desactivarSpinner()
      console.log(error);
    }
  }
  const habilitar_columna = (vbloqueo)=>{
    vbloqueo = form.getFieldValue('ESTADO') !== 'P' ? true : false;
    
    let row = refGrid?.current ? refGrid?.current?.hotInstance?.getSourceData() : []; 
    if(row.length > 0){
      for (let i = 0; i < row.length; i++) {
        const meta = refGrid?.current?.hotInstance?.getCellMetaAtRow(i);
        meta[0].readOnly   = vbloqueo;
        meta[1].readOnly   = true;
        meta[2].readOnly   = vbloqueo;
        meta[3].readOnly   = vbloqueo;
        meta[4].readOnly   = true;
        meta[5].readOnly   = true;
        meta[6].readOnly   = vbloqueo;
        meta[7].readOnly   = vbloqueo;
        meta[8].readOnly   = true;  
        meta[9].readOnly   = vbloqueo;
        meta[10].readOnly  = true;
        meta[11].readOnly  = true;
        meta[12].readOnly  = vbloqueo;
        
        refGrid.current.hotInstance.setCellMetaObject(i, meta);
      }
      refGrid?.current?.hotInstance?.updateSettings({});
    }
  }
  //************************* MODAL F9 ******************************/ 
  const eventoClick = async (data) => {
    let indice = banRef.current.indice;
    let valorValida = await mainInput.validaInput.find(item => item.input === refModal.current.idInput);
    setShows(!shows)
    setTimeout(()=>{
      if (Object.keys(data).length > 0) {
        for (let key in data) {
          form.setFieldsValue({
            ...form.getFieldsValue(),
            [key]: data[key]
          });
          refCab.current.data[indice][key] = data[key]
        }
      }
      Main.modifico(FormName)
      typeEvent()
      if(valorValida.nextEjecute) nextValida(valorValida);
    })    
  }
  const onChangeModal = async (e) => {
    let valor = e.target.value;
    if (valor.trim().length === 0) valor = 'null';
    let url = refModal.current.url_buscador;
    let data = { valor, ...refModal.current.dataParams }
    try {
      await Main.Request(url, 'POST', data).then(resp => {
        if (resp.status === 200) {
          refModalData.current.loadData(resp.data.rows)
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  //*****************************************************************/ 
  const setfocusRowIndex = React.useCallback((valor,row,col)=>{
    banRef.current.bandNew = true;
    let resul       = refGrid.current.hotInstance.getSourceData();
    if(!Main._.isNull(valor)){
      form.setFieldsValue({
        ...form.getFieldsValue(),
        RECARGO               : valor.RECARGO,
        DESC_PROVEEDOR_REC    : valor.DESC_PROVEEDOR_REC,
      });
    }
    document.getElementById("total_registro").textContent = resul.length;
    setTimeout(()=>{
      setClickCell();
    },10)
    // eslint-disable-next-line 
  },[]);
  const apcetaAumentoCosto = (values)=>{
    Main.Modal.destroyAll();
    refGrid.current.hotInstance.selectCell(values.rowIndex,9);
    refGrid.current.hotInstance.setDataAtCell(values.rowIndex, 11, 'S');
    addClassAddGrid();
    setTimeout(()=>{
      banRef.current.banCambioPrecio = true
    },30)
  }
  const cancelarAumentoCosto = (values)=>{
    Main.Modal.destroyAll();
    refGrid.current.hotInstance.setDataAtCell(values.rowIndex, 7, values.PRECIO_UNITARIO_C_IVA_ANT);
    values.PRECIO_UNITARIO_C_IVA_ANT = values.PRECIO_UNITARIO_C_IVA;
    refGrid.current.hotInstance.selectCell(values.rowIndex,7);
    setTimeout(()=>{
      banRef.current.banCambioPrecio = true
    },30)
  }
  const validaDetalle = React.useCallback(async(row,name,enter)=>{
    
    if(name === "IND_BON" && row[name] === "S" ){
      row.PRECIO_UNITARIO_C_IVA = 0;
      row.DESCUENTO             = 0;
      row.RECARGO               = 0;
      row.CANTIDAD              = 0;
      form.setFieldsValue({
        ...form.getFieldsValue(),
        TOT_DESCUENTO: 0,
        TOT_RECARGO  : 0,
      })
    }else if(name === "IND_BON"){
      row.PRECIO_UNITARIO_C_IVA = refGrid.current.hotInstance.view.settings.data[row.rowIndex].PRECIO_UNITARIO_C_IVA_ANT;
      row.DESCUENTO             = refGrid.current.hotInstance.view.settings.data[row.rowIndex].DESCUENTO_ANT;
      row.CANTIDAD              = refGrid.current.hotInstance.view.settings.data[row.rowIndex].CANTIDAD_ANT;
    }

    if(name === 'PRECIO_UNITARIO_C_IVA' && banRef.current.banCambioPrecio){
      let p_ultimo_costo  = row.PRECIO_ULTIMO_COSTO ? row.PRECIO_ULTIMO_COSTO : 0;
      if(row[name] > p_ultimo_costo && (row.IND_BLOQ === 'N' || row.IND_BLOQ === '')){
        banRef.current.banCambioPrecio = false;
        refGrid.current.hotInstance.deselectCell();    
        Main.alert('¿Desea confirmar el aumento de Precio Compra?','Atencion!','confirm','Guardar','Cancelar',
        ()=>apcetaAumentoCosto(row),()=>cancelarAumentoCosto(row)); 
      }else if(row[name] <= p_ultimo_costo && row.IND_BLOQ === 'S'){
        refGrid.current.hotInstance.setDataAtCell(row.rowIndex, 7, row[name]);
        refGrid.current.hotInstance.setDataAtCell(row.rowIndex, 11, 'N');
        quitarClassAddGrid(row.rowIndex);
        setTimeout(()=>{    
          if(enter === 13)refGrid.current.hotInstance.selectCell(row.rowIndex,9);
        },10)  
      }else{
        setTimeout(()=>{
          refGrid.current.hotInstance.setDataAtCell(row.rowIndex, 7, row[name]);
          setTimeout(()=>{    
            if(enter === 13)refGrid.current.hotInstance.selectCell(row.rowIndex,9);
          },10)  
        })
      }
    }
    let p_decimales  = refCab.current.data[banRef.current.indice].DECIMALES ? refCab.current.data[banRef.current.indice].DECIMALES : 0;
    let columnIndex  = name === 'CANTIDAD' ? 6 : 9; 
    let p_cantidad   = '';
    let p_descuento  = '';
    
    // VALIDACIO CANTIDAD
    if(typeof row.CANTIDAD === 'string'){
      if(row.CANTIDAD.startsWith("-")) p_cantidad = Number(row.CANTIDAD_ANT);
      else p_cantidad = row.CANTIDAD ? Main.numerico_grilla(row.CANTIDAD,p_decimales) : 0;
    }else{
      p_cantidad = row.CANTIDAD ? Main.numerico_grilla(row.CANTIDAD,p_decimales) : 0;
    }
    // VALIDACION DESCUENTO
    if(typeof row.DESCUENTO === 'string'){
      if(row.DESCUENTO.startsWith("-")) p_descuento = Number(row.DESCUENTO_ANT);
      else p_descuento = row.DESCUENTO !== '' && row.DESCUENTO !== null ? Main.numerico_grilla(row.DESCUENTO,p_decimales) : 0;
    }else{
      p_descuento = row.DESCUENTO !== '' && row.DESCUENTO !== null ? Main.numerico_grilla(row.DESCUENTO,p_decimales) : 0;
    }
    
    if(name !== "IND_BON"){
      refGrid.current.hotInstance.view.settings.data[row.rowIndex].CANTIDAD_ANT  = p_cantidad
      refGrid.current.hotInstance.view.settings.data[row.rowIndex].DESCUENTO_ANT = p_descuento
    }
    
    let total        = (p_cantidad * row.PRECIO_UNITARIO_C_IVA) - p_descuento;    
    refGrid.current.hotInstance.setDataAtCell(row.rowIndex, 10, total);    
    if(!['PRECIO_UNITARIO_C_IVA'].includes(name)){
      if(enter === 13 ){
        setTimeout(()=>{    
          refGrid.current.hotInstance.selectCell(row.rowIndex,name === 'CANTIDAD' ? 7 : 12);
        },10)  
        refGrid.current.hotInstance.setDataAtCell(row.rowIndex, columnIndex, row[name]);
      }
    }
    setTimeout(()=>{
      setClickCell();
      calculos(row)
    },10);
    // eslint-disable-next-line
  },[])
  const setClickCell  = React.useCallback((id = 'DET')=>{
    let indice    = banRef.current.indice;
    if(id === "CAB"){
      banRef.current.bandNew = false;
      document.getElementById("total_registro").textContent = "?";
      document.getElementById("mensaje").textContent 				=  "";   
    }else{
      banRef.current.bandNew = true;
    }

    if(refGrid.current){
      let resul       = refGrid.current.hotInstance.getSourceData()
      const columnSum = resul.reduce((acc, row) => acc + parseFloat(row.MONTO_TOTAL_C_IVA || 0), 0);
      let p_decimales = refCab.current.data[indice].DECIMALES ? refCab.current.data[indice].DECIMALES : 0
      form.setFieldsValue({
        ...form.getFieldsValue(), 
        TOT_COMPROBANTE : p_decimales === 0 || p_decimales === "0" ? columnSum : Main.currency(columnSum, { separator:'.',decimal:',',precision:p_decimales,symbol:''}).format(),
      });    
      refCab.current.data[indice].TOT_COMPROBANTE = columnSum;
    }
    // eslint-disable-next-line
  },[])
  const nextValidaInput = React.useCallback((name,rows)=>{
    calculos(rows)
    // eslint-disable-next-line
  },[])
 
  const calculos = async (rows,p_cabecere = false)=>{
    let viva        = 0
    let indice      = banRef.current.indice;
    let rowIndex    = rows.rowIndex
    let p_decimales = refCab.current.data[banRef.current.indice].DECIMALES;
    
    const calcula_monto_anterior = async()=>{
      // ---------------------------------------------------------------------------------
      // --                     Se descuenta el monto anterior                          --
      // ---------------------------------------------------------------------------------
      if(refCab.current.data[indice].PORC_IVA_ANT === 5){
        refCab.current.data[indice].GRAV5 = refCab.current.data[indice].GRAV5 - refCab.current.data[indice].IMPORTE_ANT
        refCab.current.data[indice].IVA5  = refCab.current.data[indice].IVA5  - refCab.current.data[indice].IVA_ANT
      }else if(refCab.current.data[indice].PORC_IVA_ANT === 10){
        refCab.current.data[indice].GRAV10 = refCab.current.data[indice].GRAV10 - refCab.current.data[indice].IMPORTE_ANT
        refCab.current.data[indice].IVA10  = refCab.current.data[indice].IVA10  - refCab.current.data[indice].IVA_ANT
      }

      if(refCab.current.data[indice].PORC_IVA_ANT > 0){
        refCab.current.data[indice].TOT_GRAVADAS  = refCab.current.data[indice].TOT_GRAVADAS - refCab.current.data[indice].IMPORTE_ANT
        refCab.current.data[indice].TOT_IVA       = refCab.current.data[indice].TOT_IVA      - refCab.current.data[indice].IVA_ANT
      }else{
        refCab.current.data[indice].TOT_EXENTAS   = refCab.current.data[indice].TOT_EXENTAS  - refCab.current.data[indice].IMPORTE_ANT
      }

    }
    calcula_monto_anterior();
    let p_cantidad          = await Main.numerico(rows.CANTIDAD,p_decimales)
    refGrid.current.hotInstance.view.settings.data[rowIndex].CANTIDAD_UB = p_cantidad * rows.MULT / rows.DIV;
    let vprecio_unitario_c_iva = Main.numerico_grilla(rows.PRECIO_UNITARIO_C_IVA,p_decimales)
    let vmonto_total_c_iva  = (((p_cantidad * vprecio_unitario_c_iva) - rows.DESCUENTO) + rows.RECARGO);
    refGrid.current.hotInstance.view.settings.data[rowIndex].MONTO_TOTAL_C_IVA = await Main.numerico_grilla(vmonto_total_c_iva,p_decimales);
    rows.MONTO_TOTAL_C_IVA = refGrid.current.hotInstance.view.settings.data[rowIndex].MONTO_TOTAL_C_IVA;

    if(rows.MONTO_TOTAL_C_IVA === 0) refGrid.current.hotInstance.view.settings.data[rowIndex].IND_BON = 'S';
    else refGrid.current.hotInstance.view.settings.data[rowIndex].IND_BON = 'N'
    
    if(rows.PORCENTAJE_IVA > 0 && refCab.current.data[banRef.current.indice].EXENTO !== 'S'){
      let p_resultado = rows.MONTO_TOTAL_C_IVA - ( rows.MONTO_TOTAL_C_IVA / ( ( 100 + rows.PORCENTAJE_IVA ) / 100 ) );
      refGrid.current.hotInstance.view.settings.data[rowIndex].TOT_IVA = Main.numerico_grilla( p_resultado, p_decimales )

      let result_iva = rows.PRECIO_UNITARIO_C_IVA - ( rows.PRECIO_UNITARIO_C_IVA / ( 1 + rows.PORCENTAJE_IVA  / 100 ) );
      viva = Main.numerico_grilla(result_iva,p_decimales);

      refGrid.current.hotInstance.view.settings.data[rowIndex].PRECIO_UNITARIO = ( rows.PRECIO_UNITARIO_C_IVA - viva);
    }else{
      refGrid.current.hotInstance.view.settings.data[rowIndex].TOT_IVA = 0;
      refGrid.current.hotInstance.view.settings.data[rowIndex].PRECIO_UNITARIO = rows.PRECIO_UNITARIO_C_IVA;
    }

    refGrid.current.hotInstance.view.settings.data[rowIndex].MONTO_TOTAL = rows.MONTO_TOTAL_C_IVA - rows.TOTAL_IVA;
    // eslint-disable-next-line
    if ( refGrid.current.hotInstance.view.settings.data[rowIndex].PORCENTAJE_IVA = 5 ){  
      refCab.current.data[banRef.current.indice].GRAV5  = refCab.current.data[banRef.current.indice].GRAV5  +  refGrid.current.hotInstance.view.settings.data[rowIndex].MONTO_TOTAL;
      refCab.current.data[banRef.current.indice].IVA5   = refCab.current.data[banRef.current.indice].IVA5   +  refGrid.current.hotInstance.view.settings.data[rowIndex].TOTAL_IVA;
      // eslint-disable-next-line
    }else if( refGrid.current.hotInstance.view.settings.data[rowIndex].PORCENTAJE_IVA = 10){
      refCab.current.data[banRef.current.indice].GRAV10 = refCab.current.data[banRef.current.indice].GRAV10 +  refGrid.current.hotInstance.view.settings.data[rowIndex].MONTO_TOTAL;
      refCab.current.data[banRef.current.indice].IVA10  = refCab.current.data[banRef.current.indice].IVA10  +  refGrid.current.hotInstance.view.settings.data[rowIndex].TOTAL_IVA;
    };

    if(refGrid.current.hotInstance.view.settings.data[rowIndex].PORCENTAJE_IVA > 0 ){
      refCab.current.data[banRef.current.indice].TOT_GRAVADAS = refCab.current.data[banRef.current.indice].TOT_GRAVADAS + refGrid.current.hotInstance.view.settings.data[rowIndex].MONTO_TOTAL;
      refCab.current.data[banRef.current.indice].TOT_IVA      = refCab.current.data[banRef.current.indice].TOT_IVA      + refGrid.current.hotInstance.view.settings.data[rowIndex].TOTAL_IVA  ;
    }else{
      refCab.current.data[banRef.current.indice].TOT_EXENTAS  = refCab.current.data[banRef.current.indice].TOT_EXENTAS  + refGrid.current.hotInstance.view.settings.data[rowIndex].MONTO_TOTAL;
    }
    refGrid.current.hotInstance.updateSettings({      
      cellRow:rowIndex,
    },);
    calcular_ant(rows)
    setTimeout(setClickCell('DET'));
    typeEventDet(rowIndex); 
  }
  const calcular_ant = async (rows)=>{
    refCab.current.data[banRef.current.indice].IMPORTE_ANT  = rows.MONTO_TOTAL   ;
    refCab.current.data[banRef.current.indice].IVA_ANT      = rows.TOTAL_IVA     ;
    refCab.current.data[banRef.current.indice].PORC_IVA_ANT = rows.PORCENTAJE_IVA;
  }
  const setLastFocusNext = React.useCallback((e,row,rowCount,rowindex)=>{
    if(e.keyCode === 13){
      setTimeout(()=>{
        addRow({index:rowindex})
      },2)
    }
    // eslint-disable-next-line
  },[]);
  const activateButtonCancelar = async(e,nameInput)=>{
    refCab.current.data[banRef.current.indice][nameInput] = await e !== null ? Main.format_N(e.$d) : Main.moment(new Date(),'DD MM YYYY');    
		typeEvent();  
  }
  const funcionAtras = async()=>{
    if(!refCab.current.activateCambio){
      setActivateAtras(false)
      setTimeout(()=>{
        history.push({ 
          pathname     :`${location.rutaAtras}`,
          rowData      : location.rowData,
          rows         : location.state,
          rowIndex     : location.rowIndex    ? location.rowIndex    : 0,
          tabkey       : location.tabkey      ? location.tabkey      : 0,
          columnIndex  : location.columnIndex ? location.columnIndex : 0,
        })
      })      
    }else{
      Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,funcionCancelar)
    }
  }

  return (
    <>
    <Main.FormModalSearch
      setShowsModal={setShows}
      open={shows}
      title={shows ? refModal.current.ModalTitle : refModal.current.ModalTitle}
      className='Modal-contenet'
      component={
        <Main.ModalHadsontable
          refData={refModalData}
          data={shows ? refModal.current.data : refModal.current.data}
          columns={shows ? refModal.current.modalColumn : refModal.current.modalColumn}
          onChange={onChangeModal}
          eventoClick={eventoClick}
          idComp={FormName}
        />
      }
      footer={null}
    />
    <Main.Spin spinning={false} delay={500}>
      <Main.AntLayout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
        <Main.Paper className="paper-style">
          <div className="paper-header">
            <Main.Title level={4} className="title-color">
              {TituloList}<div level={5} style={{ float: 'right', marginTop: '10px', marginRight: '5px', fontSize: '10px' }} className="title-color">{FormName}</div>
            </Main.Title>
          </div>

          <Main.HeaderMenu
            AddForm={()=>addRow()}
            SaveForm={guardar}
            deleteRows={deleteRow}
            cancelar={funcionCancelar}
            formName={FormName}
            vprinf={false}
            refs={{ref:buttonSaveRef}}
            funcionBuscar={funcionBuscar}
            NavigateArrow={navigateArrow}
            activateAtras={activateAtras}
            funcionAtras={funcionAtras}
          />

          
          <CMFACTUR
            form={form}
            FormName={FormName}
            refGrid={refGrid}
            idComp={idComp}
            dataRef={refCab}
            handleKeyDown={onkeyDown}
            refIndex={banRef}
            handleInputChange={handleInputChange}
            handleInputChangeNumber={handleInputChangeNumber}
            setfocusRowIndex={setfocusRowIndex}
            handleKeyUp={handleKeyUp}
            validaAllExterno={validaDetalle}
            nextValidaInput={nextValidaInput}
            setClickCell={setClickCell}
            setLastFocusNext={setLastFocusNext}
            activateButtonCancelar={activateButtonCancelar}
          />

          
        </Main.Paper>        
      </Main.AntLayout>
    </Main.Spin>
    </>
  );
});

export default MainCM;