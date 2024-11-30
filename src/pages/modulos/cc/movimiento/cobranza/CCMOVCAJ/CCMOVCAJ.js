import React, { memo }  from 'react';
import CCMOVCAJ         from './view';
import Main             from '../../../../../../componente/util/main.js';
import mainUrl          from './url/mainUrl';
import mainInput        from './inputValida/mainInputValida';
import mainInicial      from './ObjetoInicial/mainInicial';
import mainColumn       from './columnModal/mainColumn';
import './CCMOVCAJ.css'
const FormName   = 'CCMOVCAJ';
const TituloList = "Movimiento de Caja";
const idCompRef  = `GRIDREF_${FormName}`
const idCompDet  = `GRIDDET_${FormName}`

// CANTIDAD DE REGISTRO POR GET
const data_len = 100;
var mitad_data = data_len / 2;

const MainCc = memo(({history, location}) => {

  const defaultOpenKeys     = Main.DireccionMenu(FormName);
  const defaultSelectedKeys = Main.Menu(FormName);    

  const [form]              = Main.Form.useForm();
  //  UseRef
  const buttonSaveRef       = React.useRef();
  const refRef              = React.useRef();
  const refDet              = React.useRef();
  const refhasontable       = React.useRef({stopFoscus:false})
  const refCab              = React.useRef({  indice:0      , bandNew:false, id_cabecera:'', dataPreForm:{}, bandIndex:-1
                                            , data:[]       , dataCan:[]   , delete:[]     , activateCambio: false
                                            , deleteDet:[]  , deleteRef:[] , activateCambio: false
                                            , bandNew :false});
  const banHotInstance      = React.useRef({ [idCompRef] :refRef 
                                           , [idCompDet] :refDet
                                            //--- F7 AND F8
                                            , mangerF7:{[idCompRef]:false,[refDet]:false}
                                            , objetoF7:{[idCompRef]:{}   ,[refDet]:{}   }
                                            })
  const refBloqueo         = React.useRef({ COD_MONEDA   : false
                                          , COD_CLIENTE  : false
                                          , NRO_COMPR_REF: false
                                          , TIP_COMPR_REF: false
                                          , NRO_MOV_CAJ  : false
                                          // REF
                                          , deleteCab    : false
                                          , deleteRef    : false
                                          , deleteDet    : false
                                        })
  // USESTATE
  const [ shows        , setShows         ] = React.useState(false);         
  const [ activateAtras, setActivateAtras ] = React.useState(false);

  // MODAL F9
  const refModalData        = React.useRef();
  const refModal            = React.useRef({  modalColumn    : []
                                            , data           : []
                                            , ModalTitle     : ''
                                            , idInput        : ''
                                            , dataParams     : ''
                                            , url_buscador   : ''
                                            // ---
                                            , refGrid        : ''
                                            , tipoDeBusqueda : ''
                                            , searchColumns  : ''
                                            , indexRow       : ''
                                            , grilla         : false
                                            });
  // ==========================================================
  let idGrid = {
    grid:{
      [idCompDet] : refDet
    },
    columna:{
      [idCompDet] : mainColumn.columns_det
    }
  }

  Main.useHotkeys(Main.Guardar, (e) =>{
    e.preventDefault();
    buttonSaveRef.current.click();
  },{enableOnFormTags: ['input', 'select', 'textarea']});
  Main.useHotkeys('f7', (e) => {
    e.preventDefault();
  });

  React.useEffect(()=>{
    get_PreFrom();
    // eslint-disable-next-line
  },[])
 
  const get_PreFrom = async() => {
    try {
      limpiarBandera();
      let params  = {
                      COD_EMPRESA : sessionStorage.getItem('cod_empresa'),
                      COD_SUCURSAL: sessionStorage.getItem('cod_sucursal'),
                      COD_MODULO  : 'CC',
                      FORMNAME    : FormName    ,
                      COD_USUARIO : sessionStorage.getItem('cod_usuario')
                    }
			await Main.Request(mainUrl.url_listar_preform,"POST",params).then((resp)=>{
        refCab.current.dataPreForm = resp.data;

        if(location?.rutaAtras !== undefined){
          setActivateAtras(true);
          if (  Main.nvl(location.ORIGEN, 'X' )     == 'R'   && 
                Main.nvl(location.NRO_MOV_CAJ,null) == null  &&
	              Main.nvl(location.EXISTE, 'N' )     == 'N'  ){

              if (Main.nvl(location.CARGO_COBRANZA,'N' )   == 'N') {
                if (location.p_tip_comprobante.includes('RES','REC')) {
                  console.log('CARGA_COBRO_RECIBO');
                }else{
                  console.log('CARGA_COBRO_REPARTO');
                };
              };

           }else if(  Main.nvl(location.ORIGEN, 'X' )     == 'C'   && 
                      Main.nvl(location.NRO_MOV_CAJ,null) == null  &&
                      Main.nvl(location.EXISTE, 'N' )     == 'N'  ){
              if (Main.nvl(location.CARGO_COBRANZA,'N' ) == 'N') {
            
                let valor  = JSON.parse(JSON.stringify({...mainInicial.inicialCab}));
                valor      = {...valor, ...refCab.current.dataPreForm}
                valor.COD_SUCURSAL      = sessionStorage.getItem('cod_sucursal');
                valor.COD_EMPRESA       = sessionStorage.getItem('cod_empresa');
                valor.FEC_MOV_CAJ       = Main.moment().format('DD/MM/YYYY');
                valor.SER_MOV_CAJ       = 'A';
                valor.TIP_COMPR_REF     = location.TIP_PLANILLA;
                valor.NRO_COMPR_REF     = location.NRO_PLANILLA;
                valor.COD_CLIENTE       = location.COD_CLIENTE;
                valor.COD_MONEDA        = location.COD_MONEDA;
                valor.NRO_CUENTA        = location.NRO_CUENTA;
                valor.COD_USUARIO       = sessionStorage.getItem('cod_usuario')
                refCab.current.data     = [valor]
                refCab.current.dataCan  = JSON.parse(JSON.stringify([valor]));
                form.setFieldsValue(valor);
                let newKey              = Main.uuidID()
                valor.ID	              = newKey;
                
                try {
                  getReferencia(newKey,valor,0,undefined,mainUrl.url_buscar_cargaCobroCobra).then((resp)=>{
                    getDetalle(valor.ID,valor); 
                    setTimeout(()=>ver_bloqueo(valor),150)
                    typeEvent(true)
                  })
                } catch (error) {
                  console.log(error);
                }
              };
           }
        }else{
          inicialForm();
        }
      });
		} catch (error) {      
			console.log(error);
      return {}
		} finally {
			Main.desactivarSpinner();
		}
  }
  const inicialForm = async(f7_delete = false,idFocus = 'NRO_MOV_CAJ')=>{
    form.resetFields();
    let valor          = JSON.parse(JSON.stringify({...mainInicial.inicialCab}));
    let newKey         = Main.uuidID()
    valor.ID	         = newKey;
    valor.COD_EMPRESA  = sessionStorage.getItem('cod_empresa');
    valor.COD_SUCURSAL = sessionStorage.getItem('cod_sucursal');
    valor.FEC_MOV_CAJ  = Main.moment().format('DD/MM/YYYY');
    let result_preForm = await refCab.current.dataPreForm;
    if(Object.keys(result_preForm).length > 0) valor   = {...valor, ...result_preForm}
    if(!f7_delete) form.setFieldsValue(valor);
    else Main.desactivarSpinner();
    refCab.current.data     = [valor]
    refCab.current.dataCan  = JSON.parse(JSON.stringify([valor]));
    if(!f7_delete)loadForm(newKey,0);
    else{
      refRef.current?.hotInstance.loadData([]);
      refDet.current?.hotInstance.loadData([]);
    } 
    setTimeout( ()=> {				
      document.getElementById(idFocus).select();
		},20);
    document.getElementById("indice").textContent         = "1";
		document.getElementById("total_registro").textContent = "?";
		document.getElementById("mensaje").textContent 				= "";
  }

  const getParamsRef = async (idCabecera = false, indexRow = 0)=>{
    var newKey            = Main.uuidID();
    var valor             = await {...mainInicial.inicialRef};
    valor.ID	            = newKey;
    valor.COD_EMPRESA	    = sessionStorage.getItem('cod_empresa');
    valor.idCabecera      = idCabecera ? idCabecera : refCab.current.data[indexRow]?.ID;    
    return valor;
  }
  const getReferencia = async (idCabecera, data = false,indexRow = 0,indexcolumn = -1, url = mainUrl.url_listar_ref)=> new Promise(async (resolve)=> {
    let dataParams = data ? data : await getParamsRef(idCabecera,indexRow);
    var content    = [];
    try {
      var info = await Main.Request(url,'POST',dataParams);
      if(info?.data?.rows?.length === 0 || info?.data?.rows === undefined){
        if(indexcolumn !== -1){
          Main.message.info({
            content  : `No se han encontrado registros!!`,
            className: 'custom-class',
            duration : `${2}`,
            style    : { marginTop: '2vh'},
          });
        }
        content = [dataParams];
      }else content = info.data.rows
    
      mainInput.IdGrid[idCompRef].cabecera_can = JSON.parse(JSON.stringify(content));
      refRef.current?.hotInstance.loadData(content);
      resolve(JSON.stringify(content))
      setTimeout(()=>{         
        Main.desactivarSpinner()       
        if(indexcolumn !== -1)refRef.current.hotInstance.selectCell(indexRow,indexcolumn);
        tot_nro_mov_caja()
        setfocusRowIndex(content[0],0,0,idCompRef,true)
      },15);
    } catch (error) {
      console.error(error);
    }
  })
  
  const getParamsDetalle = async (idCabecera = false, indexRow = 0)=>{
    var newKey            = Main.uuidID();
    var valor             = await {...mainInicial.inicialDet};
    valor.ID	            = newKey;
    valor.COD_EMPRESA	    = sessionStorage.getItem('cod_empresa');
    valor.TIPO_TRANS	    = Main.nvl(refCab.current.data[indexRow]?.TIPO_TRANS,'');
    valor.CARGA_BANCO_CLI = 'N'
    valor.idCabecera      = idCabecera ? idCabecera : refCab.current.data[indexRow]?.ID;    
    return valor;
  }
  const getDetalle = async (idCabecera, data = false,indexRow = 0,indexcolumn = -1)=> new Promise(async (resolve)=> {
    let dataParams = data ? data : await getParamsDetalle(idCabecera,indexRow);
    dataParams.COD_MODULO = 'CC';
    var content           = [];
    try {
      var info = await Main.Request(mainUrl.url_listar_det,'POST',dataParams);
      if(info?.data?.rows?.length === 0 || info?.data?.rows === undefined){
        if(indexcolumn !== -1){
          Main.message.info({
            content  : `No se han encontrado registros!!`,
            className: 'custom-class',
            duration : `${2}`,
            style    : { marginTop: '2vh'},
          });
        }
        if(data !== false) data.idCabecera = idCabecera;
        content = [dataParams];
        
      }else content = info.data.rows
    
      mainInput.IdGrid[idCompDet].cabecera_can = JSON.parse(JSON.stringify(content));
      refDet.current?.hotInstance.loadData(content);
      resolve(JSON.stringify(content))
      setTimeout(()=>{         
        Main.desactivarSpinner()       
        if(indexcolumn !== -1)refDet.current.hotInstance.selectCell(indexRow,indexcolumn);
        setfocusRowIndexDet(content[0],0,0,idCompDet,true)
        total_det()
      },15);
    } catch (error) {
      console.error(error);
    }
  })
  const ver_bloqueo = (rowCab = {})=>{
    let rowRefer = refRef.current.hotInstance ? refRef.current.hotInstance.getSourceData()[0] : {}
    
    // BLOQUEAR_REFERENCIA
    if(Main.nvl(rowCab.NRO_MOV_CAJ,null)        === null && 
       Main.nvl(rowRefer?.NRO_COMPROBANTE,null) !== null){   
      bloquear_referencia(true,rowRefer,rowCab)
      // BLOQUEAR_MOVIMIENTO
    }else if(Main.nvl(rowRefer?.NRO_COMPROBANTE,null) !== null ){
      bloquear_movimiento(true,rowCab)
    }else{
      bloquear_movimiento(false,rowCab)
    }
  }
  const bloquear_referencia = (p_bloqueo = false,rowRefer,rowCab)=>{
    Object.keys(refBloqueo.current).map((key)=>{
      if(!['deleteCab','deleteRef','deleteDet'].includes(key)){
        refBloqueo.current[key]               = p_bloqueo;
        document.getElementById(key).readOnly = p_bloqueo;
      }
    })

    // refBloqueo.current.COD_MONEDA                     = p_bloqueo;
    // refBloqueo.current.COD_CLIENTE                    = p_bloqueo;
    // refBloqueo.current.NRO_COMPR_REF                  = p_bloqueo;
    // refBloqueo.current.TIP_COMPR_REF                  = p_bloqueo;
    // refBloqueo.current.NRO_MOV_CAJ                    = p_bloqueo;
    // // 
    // document.getElementById('COD_MONEDA').readOnly    = p_bloqueo;
    // document.getElementById('COD_CLIENTE').readOnly   = p_bloqueo;
    // document.getElementById('NRO_COMPR_REF').readOnly = p_bloqueo;
    // document.getElementById('TIP_COMPR_REF').readOnly = p_bloqueo;
    // document.getElementById('NRO_MOV_CAJ').readOnly   = p_bloqueo;

    refBloqueo.current.deleteRef                      = p_bloqueo;
    refBloqueo.current.deleteDet                      = p_bloqueo;
    bloqueoGrilla(p_bloqueo, refRef.current.hotInstance,mainColumn.next_ref);

    if(Main.nvl(rowCab.NRO_MOV_CAJ,null)        === null && 
       Main.nvl(rowRefer?.NRO_COMPROBANTE,null) !== null){   
       p_bloqueo = false
    }
    
    bloqueoGrillaDet(p_bloqueo, refDet.current.hotInstance,mainColumn.next_det);
  }
  const bloqueoGrilla  = (p_bloqueo = false, hotInstance,column)=>{
    if (hotInstance) {
      hotInstance.updateSettings({
        cells(row, col) {
          const cellProperties = {};
          if(column.includes(col)){
            cellProperties.readOnly = p_bloqueo;
          }
          return cellProperties;
        }
      });
    }
  }
  const bloqueoGrillaDet  = (p_bloqueo = false, hotInstance, column)=>{
    if (hotInstance) {
      hotInstance.updateSettings({
        cells(row, col) {
          const cellProperties = {};
          if(column.includes(col)){
            cellProperties.readOnly = p_bloqueo;
          }
          return cellProperties;
        }
      });
    }
  }
  const bloquear_movimiento = (p_bloqueo = false,rowCab)=>{
    const fechaActual     = Main.moment();
    const fechaMovimiento = Main.moment(rowCab.FEC_MOV_CAJ, "DD/MM/YYYY");
    const diferenciaDias  = fechaActual.diff(fechaMovimiento, 'days');

    if(Main.nvl(refCab.PERMITIR_BORRAR,'N') === 'S' && Main.nvl(diferenciaDias,0) < 2){
      refBloqueo.current.deleteCab = true;
    }else{
      refBloqueo.current.deleteCab = false;
    }
    bloquear_referencia(p_bloqueo,{},rowCab)
  }
  const ver_bloqueo_concepto = ()=>{
    let valor_cab = form.getFieldValue();
    let rowRefer  = refRef.current.hotInstance ? refRef.current.hotInstance.getSourceData()[0] : {}
    
    if(Main.nvl(valor_cab.NRO_MOV_CAJ,null) === null && 
       Main.nvl(rowRefer.NRO_COMPROBANTE,null) !== null){
      bloqueoGrillaDet(true,refRef.current.hotInstance,[0]);
    }else{
      bloqueoGrillaDet(false,refRef.current.hotInstance,[0]);
    }
  }
  // ==========================================================
  const addRow = async (index = false)=>{
    if(!refCab.current.bandNew && index === false){
      get_PreFrom();
    }else{
      let hotInstance = refDet.current.hotInstance
      let isEnable    = Main.nvl(hotInstance.getActiveEditor(),false);
      if(banHotInstance.current.mangerF7[idCompDet] || (!isEnable && index !== -1)) return

      let valor = await  Main.hotTableRequerido(idGrid,idCompDet,false);
      if(valor.Addband){
        setTimeout(()=>{
          Main.message.warning({
            content  : `Ingrese ${valor.columnaRequerido.label} para Continuar!!`,
            className: 'custom-class',
            duration : `${2}`,
            style    : {marginTop: '2vh'},
          });
           hotInstance.selectCell(valor.columnaRequerido.indexRow,valor.columnaRequerido.indexComun);
        },5)
        return
      }

      Main.modifico(FormName)
      let refGrid     = mainInput.IdGrid[idCompDet]
      let rowValue    = Main.nvl(refGrid.rowsValue,{});
      delete rowValue.inserted
      delete rowValue.insertDefault
      let rowIndex    = index !== false ? index + 1 : refGrid.rowsIndex === 0 ? refGrid.rowsIndex + 1  : refGrid.rowsIndex === -1 ? 0 : refGrid.rowsIndex;
      let newRow      = await getParamsDetalle(false,refCab.current.indice);
      newRow          = JSON.parse(JSON.stringify({...rowValue,...newRow}));
      newRow.insertDefault = true
      newRow.COD_EMPRESA   = sessionStorage.getItem('cod_empresa');
      hotInstance.alter('insert_row', rowIndex);
      hotInstance.view.settings.data[rowIndex] =  JSON.parse(JSON.stringify({...newRow}));

      hotInstance.updateSettings({      
        cellRow:rowIndex,
      });  
      setTimeout(()=>{        
        typeDataHadsontable(rowIndex,idCompDet);
        hotInstance.selectCell(rowIndex, 0)
      },20)
    }
  }
  
  const guardar = async ()=>{  
    let permisoActualizacion = false;
    let permisoIsertar 	     = false;
    let exitInsertedBand     = false;
    let p_mensaje            = '';
    
    if(refCab.current.delete.length === 0){
      let verificar_input_requerido = Main.validarCamposRequeridos();
      if(!verificar_input_requerido) return   
    }
    Main.quitarClaseRequerido();

    let update_insert_referencia = []
    if(refRef.current.hotInstance) update_insert_referencia = refRef.current.hotInstance.getSourceData();

    let update_insert_detalle = []
    if(refDet.current.hotInstance) update_insert_detalle = refDet.current.hotInstance.getSourceData();
    if(refDet.current){
      const valor = await  Main.hotTableRequerido(idGrid,idCompDet,true);
      if(valor.Addband){
        setTimeout(()=>{
          Main.message.warning({
            content  : `Ingrese ${valor.columnaRequerido.label} para Continuar!!`,
            className: 'custom-class',
            duration : `${2}`,
            style    : {marginTop: '2vh'},
          });        
          refDet.current.hotInstance.selectCell(valor.columnaRequerido.indexRow,valor.columnaRequerido.indexComun);
        },1)
        return
      } 
    }

    
    // FILTER CAB
    var dependencia_cab  = [];
    let vcod_empresa     = sessionStorage.getItem('cod_empresa')
    var rowCab           = refCab.current.data[refCab.current.indice];
    let vtotal           = parseFloat(form.getFieldValue('TOTAL'))
    vtotal               = (isNaN(vtotal) ? 0 : vtotal);

    if(Main.nvl(vtotal,0) <= 0){
      refhasontable.current.stopFoscus = true;
      finalFocus(refDet.current.hotInstance)
      Main.message.error({
        content  : `EL totol debe ser mayor a 0.-`,
        className: 'custom-class',
        duration : `${2}`,
        style    : {marginTop: '2vh'},
      });
      return
    }


    let url_get_nroAuto     = `${mainUrl.url_abm}/${vcod_empresa}/${rowCab.TIP_MOV_CAJ}/${rowCab.SER_MOV_CAJ}`;
    let url_get_cab_cod     = refCab.current.delete?.length > 0 ? null : url_get_nroAuto;

    let infoCab       	     = await Main.GeneraUpdateInsertCab(refCab.current.data,'NRO_MOV_CAJ',url_get_cab_cod,dependencia_cab,true,false,true);
    var aux_cab	             = infoCab.rowsAux;
    var updateInserData      = infoCab.updateInsert;
    let keyCabecera 			   = infoCab.rowsAux.length > 0 ?  infoCab.rowsAux[refCab.current.indice]?.NRO_MOV_CAJ : Main.nvl(aux_cab.NRO_MOV_CAJ,null);
    if(!permisoActualizacion) permisoActualizacion = infoCab.actualizar;
    if(!permisoIsertar)       permisoIsertar 	     = infoCab.insertar  ;
    var delete_cab          = refCab.current.delete !== undefined && refCab.current.delete?.length > 0  ? refCab.current.delete : []
    aux_cab.ID              = rowCab.ID 

    // FILTER DET
    var dependencia_ref        = [];
    var add_cab_and_ref        = ['TIP_MOV_CAJ','SER_MOV_CAJ','NRO_MOV_CAJ'];
    let url_get_det_ref        = undefined;
    var infoDet     	    	   = await Main.GeneraUpdateInsertDet(update_insert_referencia,['NRO_COMPROBANTE'],aux_cab,dependencia_ref,'NRO_MOV_CAJ',url_get_det_ref,'NRO_COMPROBANTE','ASC',add_cab_and_ref);
    var updateInserDataRef     = infoDet.updateInsert;
    if(!permisoActualizacion) permisoActualizacion = infoDet.actualizar;
    if(!permisoIsertar) permisoIsertar             = infoDet.insertar;

    // FILTER DET
     var dependencia_det        = [];
     var add_cab_and_det        = ['TIP_MOV_CAJ','SER_MOV_CAJ','NRO_MOV_CAJ'];
     let url_get_det_cod        = `${url_get_cab_cod}/${keyCabecera}`
     var infoDet     	    	    = await Main.GeneraUpdateInsertDet(update_insert_detalle,['NRO_SECUENCIA'],aux_cab,dependencia_det,'NRO_MOV_CAJ',url_get_det_cod,'NRO_SECUENCIA','ASC',add_cab_and_det);
     var updateInserDataDet     = infoDet.updateInsert;
     if(!permisoActualizacion) permisoActualizacion = infoDet.actualizar;
     if(!permisoIsertar) permisoIsertar             = infoDet.insertar;
     var delete_Det             = refCab.current.deleteDet && refCab.current.deleteDet?.length > 0 && refCab.current.deleteDet !== undefined ? refCab.current.deleteDet : []
    
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
   
     var auditoria = {"cod_usuario": sessionStorage.getItem('cod_usuario'),"cod_empresa": sessionStorage.getItem('cod_empresa')};
 
     var data = {
      updateInserData       ,
      aux_updateInserData   : [refCab.current.dataCan[refCab.current.indice]],
      delete_cab	          , 

      updateInserDataRef    ,
      aux_updateInserDataRef : mainInput.IdGrid[idCompRef].cabecera_can,
      
      updateInserDataDet    ,
      aux_updateInserDataDet : mainInput.IdGrid[idCompDet].cabecera_can,
      delete_Det	         , 

      auditoria            ,      
    }
    
    try {
      if(updateInserData.length   > 0 || delete_cab.length > 0 ||
        updateInserDataRef.length > 0 || updateInserDataDet.length > 0 || 
        delete_Det.length > 0 
      ){
        await Main.Request(mainUrl.url_abm,"POST",data).then(async(resp) => {
          Main.desactivarSpinner()
          if(resp.data.ret === 1){
            
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
            
            refCab.current.delete         = []
            refCab.current.deleteDet      = []
            
            refCab.current.data        = infoCab.rowsAux
            refCab.current.dataCan     = JSON.parse(JSON.stringify(refCab.current.data));

            if(refCab.current.delete.length > 0){
              setTimeout(()=>inicialForm()); 
            }else{
              let rowValue = await getParmas()
              rowValue.NRO_MOV_CAJ = keyCabecera;
              getDataCab(rowValue)
            } 
            setTimeout(()=>{
              refCab.current.activateCambio = false;
            })
            
          }else{
            Main.alert(resp.data.p_mensaje, '¡Atención!', 'alert', 'OK',undefined,false,false,FormName);
          }            
        });
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
    } catch (error) {
      Main.desactivarSpinner();
      console.log('Error en la funcion de Guardar ccncrdef',error)
    }


  }


  const deleteRow = ()=>{
    if(!refCab.current.bandNew){
      if(refBloqueo.current.deleteCab === false){
        document.getElementById('mensaje').innerHTML = "No puede eliminar el registro porque no posee permisos suficientes."
        setTimeout(()=>document.getElementById('mensaje').innerHTML = "",5000)
        document.getElementById('NRO_MOV_CAJ').focus()
      }else if(!refCab.current.data[refCab.current.indice].insertDefault && !refCab.current.data[refCab.current.indice].inserted){
        Main.activarSpinner()
        form.resetFields();
        refCab.current.activateCambio = true;
        refCab.current.delete[0] = refCab.current.data[refCab.current.indice]
        inicialForm(true);
        Main.modifico(FormName)
      }
      document.getElementById('NRO_MOV_CAJ').focus()
    }else{
      let hotInstance = refDet.current.hotInstance
      let refGrid     = mainInput.IdGrid[idCompDet]

      if(refBloqueo.current.deleteDet === false){
        document.getElementById('mensaje').innerHTML = "No puede eliminar el registro porque no posee permisos suficientes."
        setTimeout(()=>document.getElementById('mensaje').innerHTML = "",5000)
        hotInstance.selectCell(Main.nvl(refGrid.rowsIndex,0),0)
      }else{
        Main.activarSpinner();
        setTimeout(async()=>{
          let rowCount       = hotInstance.getSourceData().length;
          let rowInfo        = hotInstance.getSourceDataAtRow(refGrid.rowsIndex)
          let rowIndexFocus  = refGrid.rowsIndex - 1 === -1 ? 0 : refGrid.rowsIndex - 1;
          
          if(!rowInfo?.inserted && !rowInfo?.insertDefault){
    
            if(refCab.current.deleteDet.length > 0){
              refCab.current.deleteDet = Main._.union(refCab.current.deleteDet, [rowInfo])
            }else{
              refCab.current.deleteDet = [...refCab.current.deleteDet,rowInfo]
            }
    
            hotInstance.alter('remove_row',refGrid.rowsIndex);
            hotInstance.selectCell(rowIndexFocus,0)
    
            Main.modifico(FormName)
            if(rowCount === 1){
              refCab.current.bandNew = true;
              addRow(-1);
            }
            Main.desactivarSpinner()
          }else if(rowCount === 1){
            refCab.current.bandNew = true;
            hotInstance.alter('remove_row',rowInfo.rowIndex);
            addRow(-1);
            Main.desactivarSpinner()
          }else{
            Main.desactivarSpinner()
            hotInstance.alter('remove_row',rowInfo.rowIndex);
            hotInstance.selectCell(rowIndexFocus,0)
          }
        },10)
      }
    }
  }
  // ==========================================================
  const limpiarBandera = ()=>{
    [idCompRef,idCompDet].map((key)=>{
      banHotInstance.current.mangerF7[key] = false;
      banHotInstance.current.objetoF7[key] = {};
      if(mainInput.IdGrid[key]){
        mainInput.IdGrid[key].cabecera_can = [];
        mainInput.IdGrid[key].cabecera_del = [];
        mainInput.IdGrid[key].rowsIndex    = 0;
        mainInput.IdGrid[key].columnIndex  = 0;
        mainInput.IdGrid[key].rowsValue    = {};
      } 
    })
    refCab.current.delete    = []
    refCab.current.deleteRef = []
    refCab.current.deleteDet = []
    mainInput.restablecerValida();
    refCab.current.bandIndex = -1
  }
  const cancelar = ()=>{
    try {
      limpiarBandera()
      Main.setModifico(FormName);
      refRef.current?.hotInstance.loadData([]);
      refDet.current?.hotInstance.loadData([]);      
      if(location?.rutaAtras !== undefined){
        get_PreFrom();
      }else{
        if(refCab.current.data[refCab.current.indice].insertDefault || refCab.current.data[refCab.current.indice].inserted){
          Main.desactivarSpinner()
          setTimeout(() =>inicialForm());  
        }else{
          refCab.current.data       = JSON.parse(JSON.stringify(refCab.current.dataCan))
          refCab.current.dataCan    = JSON.parse(JSON.stringify(refCab.current.data));
          Main.desactivarSpinner()      
          loadForm(refCab.current.data,refCab.current.indice)      
          setTimeout(()=>{
            document.getElementById('NRO_MOV_CAJ').focus();  
          },200)
        }      
      }
      
    } catch (error) {
      Main.setModifico(FormName);
      console.log(error)
      setTimeout(() =>inicialForm());
    }
  }
  const funcionBuscar = (e)=>{    
    if(e){
      if(!refCab.current.activateCambio){
        Main.setModifico(FormName);        
        getDataCab();
      }else{
        Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,cancelar)
      }
    }else{
      manejaF7('NRO_MOV_CAJ')
    };
    Main.setBuscar(FormName,!e)
  }
  const navigateArrow = (id) => {
    Main.activarSpinner()
    switch (id) {
      case 'left':
         leftData();  
        break;
      case 'right':
         rightData();
        break;
      case 'next-left':
        if(refCab.current.data.length > 1){refCab.current.indice = 0;leftData();} 
        else Main.desactivarSpinner();
        break;
      case 'next-right':
        if(refCab.current.data.length > 1){
          let index =  refCab.current.data.length - 1
          refCab.current.indice = index
          loadForm(refCab.current.data[index],index);
          document.getElementById("indice").textContent = refCab.current.data.length;
        }
        else Main.desactivarSpinner();
        break;
      default:
        break;
    }  
  }
  const loadForm = async (data = [] , indice = false)=>{
    let index  = await indice ? indice : refCab.current.indice
    let value  = await refCab.current.data[index] === undefined ? data : refCab.current.data[index];
    value      = {...refCab.current.dataPreForm,...value}
    form.setFieldsValue(value);
    getReferencia(value.ID,value); 
    getDetalle(value.ID,value); 
    setTimeout(()=>ver_bloqueo(value),150)
  }
  //************** CHANGE CAB ***********************/ 
  const handleInputChange = (e) => {
    let value_ant = refCab.current.data[refCab.current.indice].TIP_COMPR_REF
    if(refBloqueo.current[e.target.id] === true){
      form.setFieldsValue({
        ...form.getFieldsValue(), 
        [e.target.id]:value_ant,
      }); 
      return    
    } 
    Main.modifico(FormName)
    try {
      refCab.current.data[refCab.current.indice][e?.target?.id ? e?.target?.id : e.target.name ] = e?.target?.value;  
    } catch (error) {
      console.log(error)
    }
    typeEvent()
  }
  const typeEvent = (p_total_sum = false)=>{
    let indiceCab = refCab.current.indice;    
    if(refCab.current.data[indiceCab]['insertDefault']){
      refCab.current.data[indiceCab].insertDefault = false;
      refCab.current.data[indiceCab].inserted 		 = true;
    }
    if(!refCab.current.data[indiceCab]['updated'] && refCab.current.data[indiceCab]['inserted'] !== true){
      refCab.current.data[indiceCab]['updated']   = true;
      // refCab.current.activateCambio = true;      
    }
   if(!p_total_sum)Main.modifico(FormName);
  }
  const tot_nro_mov_caja = ()=>{
    if(refRef.current){
      let resul       = refRef.current?.hotInstance.getSourceData()
      const columnSum = resul.reduce((acc, row) => acc + parseFloat(row.IMPORTE || 0), 0);      
      let p_decimales = 0;
      refCab.current.data[refCab.current.indice]['TOT_NRO_MOV_CAJ'] = columnSum;
      form.setFieldsValue({
        ...form.getFieldsValue(), 
        TOT_NRO_MOV_CAJ : Main.currency(columnSum, { separator:'.',decimal:',',precision:p_decimales,symbol:''}).format(),
      }); 
    } 
  }
  const setClickCell = React.useCallback((idcom = 'DET',event, dbclick = false)=>{
    if(idcom === "CAB"){
      refCab.current.bandNew = false;
      document.getElementById("total_registro").textContent = "?";
      document.getElementById("mensaje").textContent 				=  "";   
    }else{
      let hotInstance = banHotInstance.current[idcom].current.hotInstance
      refCab.current.bandNew = true;
      document.getElementById("total_registro").textContent = Main.nvl(hotInstance.countRows(),'?');
    }
    // eslint-disable-next-line
  },[])
  const total_det = ()=>{
    if(refDet.current){
      let resul             = refDet.current?.hotInstance.getSourceData()
      let vtot_nro_mov_caj  = refCab.current.data[refCab.current.indice].TOT_NRO_MOV_CAJ;
      let vdiferencia       = 0;
      const vtotal          = resul.reduce((acc, row) => acc + parseFloat(row.IMPORTE || 0), 0);
      let p_decimales       = 2;

      if (Main.nvl( vtotal ,0) > Main.nvl( vtot_nro_mov_caj,0) ){ 
        vdiferencia  =  Main.nvl( vtotal,0) - Main.nvl(vtot_nro_mov_caj,0) ;
      }

      form.setFieldsValue({
        ...form.getFieldsValue(), 
        TOTAL      : Main.currency(vtotal, { separator:'.',decimal:',',precision:p_decimales,symbol:''}).format(),
        DIFERENCIA : vdiferencia
      }); 
      refCab.current.data[refCab.current.indice].DIFERENCIA = vdiferencia;
    } 
  }
  // ==========================================================
  const handleInputMascara = (e)=>{    
    Main.mascFecha(e).then((value)=>{
    refCab.current.validarFecha = true;
    refCab.current.data[refCab.current.indice][e?.target?.id] = value;  
      typeEvent();
    });  
  }
  const manejaF7 = (idFocus)=>{
    Main.activarSpinner()
    form.resetFields(); 
    refCab.current.activateCambio = false  
    refCab.current.indice = 0;
    refCab.current.id_cabecera = -1
    setTimeout(()=>{    
      if(!Main.getViewBuscar(FormName))Main.setBuscar(FormName,true);
      Main.desactivarSpinner()      
      inicialForm(true,idFocus)
      setTimeout(()=>ver_bloqueo(refCab.current.data[refCab.current.indice]),10)
    },10)
  }
  const handleKeyDown = async (e)=>{
    let f9_valida = ['COD_MONEDA','COD_CLIENTE']
    if (['Enter', 'Tab'].includes(e.key)) {
      e.preventDefault();
      switch (e.target.id) {        
        case "TIP_MOV_CAJ":
          document.getElementById('SER_MOV_CAJ').focus();
        break;
        case "SER_MOV_CAJ":
          document.getElementById('NRO_MOV_CAJ').focus();
        break;
        case "NRO_MOV_CAJ":
          document.getElementById('FEC_MOV_CAJ').focus();
        break;
        case "FEC_MOV_CAJ":
          document.getElementById('COD_MONEDA').focus();
        break;
        case "NRO_CUENTA":
          document.getElementById('COD_CLIENTE').focus();
        break;
        default:
          break;
      }
      f9_valida.push('NRO_COMPR_REF')
      if(f9_valida.includes(e.target.id)){
        if(refBloqueo.current[e.target.id] === true){
          e.preventDefault();
          return
        }
        Main.modifico(FormName)
        ValidarUnico(e.target.id, e.target.value);
      }
    }else if (e.key === 'F9' && f9_valida.includes(e.target.id)) {
      e.preventDefault()
      let aux = [];
      refModal.current.grilla  = false;
      refModal.current.idInput = e.target.id
      let items = mainInput.ModalF9[e.target.id]
      refModal.current.dataParams   = { COD_EMPRESA:sessionStorage.getItem('cod_empresa') }
      refModal.current.ModalTitle   = items.title;
      refModal.current.modalColumn  = items.column;
      refModal.current.url_buscador = items.url;

      let data_int = mainInput.validaInput.filter((resul)=> resul.input === e.target.id)
      data_int && data_int[0]?.data.map((keyName)=>{
        if(keyName){
          refModal.current.dataParams[keyName.toLocaleLowerCase()] = form.getFieldValue(keyName)
        }
      })

      Main.activarSpinner()
      aux = await Main.getData(refModal.current.dataParams,refModal.current.url_buscador);      
      refModal.current.data = aux ? aux : []
      Main.desactivarSpinner()
      setTimeout(() => {
        setShows(true)  
      },5);

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
        Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,cancelar)
      }
    }else{
      if(refBloqueo.current[e.target.id] === true){
        e.preventDefault();
        return
      } 
    }
  }
  const getParmas = (retornaNull = false) =>{
    var data = {
      COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),  
      FEC_MOV_CAJ   : retornaNull ? '' : form.getFieldValue('NRO_MOV_CAJ')   !== undefined ? form.getFieldValue('NRO_MOV_CAJ')    : '', 
      NRO_MOV_CAJ   : retornaNull ? '' : form.getFieldValue('FEC_MOV_CAJ')   !== undefined ? form.getFieldValue('FEC_MOV_CAJ')    : '',  
      COD_CLIENTE   : retornaNull ? '' : form.getFieldValue('COD_CLIENTE')   !== undefined ? form.getFieldValue('COD_CLIENTE')    : '',    
      NRO_COMPR_REF : retornaNull ? '' : form.getFieldValue('NRO_COMPR_REF') !== undefined ? form.getFieldValue('NRO_COMPR_REF')  : '',
      TIP_COMPR_REF : retornaNull ? '' : form.getFieldValue('TIP_COMPR_REF') !== undefined ? form.getFieldValue('TIP_COMPR_REF')  : '',
    }
    return data
  } 
  const getDataCab = (data = false)=>{
    let params = data === false ? getParmas() : data
    params.INDICE = 0;
    params.LIMITE = data_len;
    Main.activarSpinner()    
    try {
      Main.Request(mainUrl.url_listar_cab, "POST", params).then((resp) => {
        let response = resp?.data?.rows;
        if (response.length > 0) {
          
          // LIMPIAR EL DELETE
          refCab.current.delete         = []
          refCab.current.deleteDet      = []
  
          if(response.length === 1) document.getElementById("total_registro").textContent = "1";
          else document.getElementById("total_registro").textContent = "?"
          refCab.current.data    = response;
          refCab.current.dataCan = JSON.parse(JSON.stringify(response));
          refCab.current.indice = 0;
          setTimeout(()=>{
            loadForm(response,refCab.current.indice)                    
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
  // -----------------------------------------------------------------------
  const leftData = async() => {
    if(!refCab.current.activateCambio){
      var index = refCab.current.indice - 1;
      if(index < 0){
        index = 0;
        document.getElementById("mensaje").textContent = "Haz llegado al primer registro";
      }else{
        document.getElementById("mensaje").textContent = "";
      }
      document.getElementById("indice").textContent = index + 1;
      document.getElementById("total_registro").textContent = refCab.current.data.length
      refCab.current.indice = index;
      var row = refCab.current.data[refCab.current.indice]
      if( refCab.current.id_cabecera !== row.ID ) refCab.current.id_cabecera = row.ID;
      loadForm(refCab.current.data);
      Main.quitarClaseRequerido();
    }else{
      Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,cancelar)
    }
  }
  const rightData = async() => {  
    if(!refCab.current.activateCambio){
      if(refCab.current.data.length !== 1){
        var index = refCab.current.indice + 1;
        if( refCab.current.id_cabecera !== refCab.current.data[index]?.ID && !Main._.isUndefined(refCab.current.data[index]?.ID)){
          refCab.current.id_cabecera = refCab.current.data[index].ID;
          refCab.current.indice = index;
          loadForm(refCab.current.data,index)   
          document.getElementById("total_registro").textContent = refCab.current.data.length
          document.getElementById("mensaje").textContent = "";
          document.getElementById("indice").textContent  = index + 1;
          if(refCab.current.indice > mitad_data && refCab.current.bandPost_Cab_Det){
            refCab.current.bandPost_Cab_Det = false;
            let params = { INDICE  : refCab.current.data.length, 
                           LIMITE  : data_len
                         };  
            try {
              await Main.Request(mainUrl.url_listar_cab,'POST',params)
                .then(async (resp) => {              
                  let response = await resp?.data?.rows;
                  refCab.current.bandPost_Cab_Det = true;
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
      Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,cancelar)
    }
  }
  const handleKeyUp = async(e) => {
    if(e.keyCode === 40){e.preventDefault(); Main.activarSpinner(); rightData();}
    if(e.keyCode === 38){e.preventDefault(); Main.activarSpinner(); leftData(); }
  }
  // ==========================================================
  const ValidarUnico = async (input, value) => {
    let intOutDate = []
    let indice = refCab.current.indice;
    let valorValida = await mainInput.validaInput.find(item => item.input === input);
    if (!Main._.isObject(valorValida)) return;
    let valor = await !isNaN(value) ? value : value.trim();

    if (valor?.length === 0 && !valorValida.requerido && valorValida.validaNull) {
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
    if (form.getFieldValue(valorValida.input) !== valorValida.valor_ant || !valorValida.validaNull) {
      try {
        let data = {COD_EMPRESA:sessionStorage.getItem('cod_empresa')}
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
        
            Main.alert(resp.data.outBinds.p_mensaje, '¡Atención!', 'alert', 'OK');
          }
        })
      } catch (error) {
        console.log('valida frontend', error)
      }
    }else if(valorValida.validaNull){
      if (valorValida.next !== ""){
        if (valorValida?.idFocus) document.getElementById(valorValida.next).focus();
        else if (valorValida?.idSelect) document.getElementById(valorValida.next).select();
      }
    }    
  }
  const eventoClick = async (data) => {
    let indice = refCab.current.indice;
    setShows(!shows)
    if(refModal.current.grilla == true){
      let hotInstance = refModal.current.refGrid;
      let keyFocus    = idCompDet;
  
      if (Main._.keys(data).length > 0) {
        for (let key in data) {
          if( key !== 'ID'){
            let columnIndex  = hotInstance.propToCol(key)                  
            if(!Main._.isNull(hotInstance.toVisualColumn(columnIndex))){
              hotInstance.setDataAtCell(refModal.current.indexRow,columnIndex,data[key])
            }else{
              hotInstance.view.settings.data[Main.nvl(refModal.current.indexRow,columnIndex,0)][key] = data[key];
            }
          }
        }
      }
      setTimeout(()=>{
        if(refModal.current.tipoDeBusqueda === 'SUB_TIPO_TRANS') funcionValidaHadsontable(refModal.current.tipoDeBusqueda,data)
        banHotInstance.current.objetoF7[keyFocus] = hotInstance.view.settings.data[refModal.current.indexRow] 
        let columnIndex  = hotInstance.propToCol(refModal.current.tipoDeBusqueda)      
        hotInstance.selectCell(refModal.current.indexRow,columnIndex);
        typeDataHadsontable(false,keyFocus);
        form.setFieldsValue({
          ...form.getFieldsValue(),
          DESC_TRANSACCION : Main.nvl(data.DESC_TRANSACCION,''),
          NOM_PER_JURIDICA : Main.nvl(data.NOM_PER_JURIDICA,''),
        });
      }); 
      
    }else{
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
      })    
    }
  }
  const onChangeModal = async (e) => {
    let valor = e.target.value;
    if (valor.trim().length === 0) valor = 'null';
    let url = refModal.current.url_buscador;
    let data = 
    { valor, ...refModal.current.dataParams }
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
  // ==========================================================
  const setfocusRowIndex = (rowValue, rowsIndex, columnIndex, keyTab, cabecera = false)=>{
    rowValue.columnIndex = columnIndex < 0 ? 0 : columnIndex;
    mainInput.IdGrid[keyTab].rowsValue = {...mainInput.IdGrid[keyTab].rowsValue,...rowValue}
    if(refCab.current.bandIndex !== rowsIndex || cabecera) refCab.current.bandIndex = rowsIndex;
    else return
    rowValue.rowsIndex   = rowsIndex < 0 ? 0 : rowsIndex;
    let newRowValue      = refCab.current.data[refCab.current.indice];
    rowValue             = {...JSON.parse(JSON.stringify(newRowValue)),...rowValue}
    mainInput.IdGrid[keyTab].rowsIndex   = rowsIndex;
    mainInput.IdGrid[keyTab].columnIndex = columnIndex;
    mainInput.IdGrid[keyTab].rowsValue   = rowValue;
  }
  const setfocusRowIndexDet = (rowValue, rowsIndex, columnIndex, keyTab, cabecera = false)=>{
    rowValue.columnIndex               = columnIndex < 0 ? 0 : columnIndex;
    mainInput.IdGrid[keyTab].rowsValue = {...mainInput.IdGrid[keyTab].rowsValue,...rowValue}
     form.setFieldsValue({
      ...form.getFieldsValue(),
      DESC_TRANSACCION: Main.nvl(rowValue.DESC_TRANSACCION,''),
      NOM_PER_JURIDICA: Main.nvl(rowValue.NOM_PER_JURIDICA,'')
    });
    if(refCab.current.bandIndex !== rowsIndex || cabecera) refCab.current.bandIndex = rowsIndex;
    else return    
    rowValue.rowsIndex   = rowsIndex < 0 ? 0 : rowsIndex;
    let newRowValue      = refCab.current.data[refCab.current.indice];
    rowValue             = {...JSON.parse(JSON.stringify(newRowValue)),...rowValue}
    mainInput.IdGrid[keyTab].rowsIndex   = rowsIndex;
    mainInput.IdGrid[keyTab].columnIndex = columnIndex;    
  }
  const getData = async (data, url) => {
		try {
			return await Main.Request(url,"POST",data).then((resp) => {return resp.data.rows});
		} catch (error) {
			console.log(error);
      return [];
		}
	};
  const finalFocus = async(hotInstance)=>{
    hotInstance.deselectCell();
    let activeEditor = hotInstance?.getActiveEditor();
    if (activeEditor) activeEditor.finishEditing();
  }
  const isLastRowFocused = (hotInstance,lastRow = 0, lasColumn = 0) => {
    const rowColumn = hotInstance.getSelectedLast() ? hotInstance.getSelectedLast()[1] : false;
    const rowCount  = hotInstance.countRows();
    if(lastRow === rowCount - 1 && lasColumn == rowColumn) return true;
    else return false;
  };
  const typeDataHadsontable = (Indexrow = false, tabKey = idCompDet)=>{
    
    let hotInstance = banHotInstance.current[tabKey].current.hotInstance 
    let refGrid     = mainInput.IdGrid[tabKey];
    let rowIndex    = Indexrow !== false ? Indexrow : refGrid.rowsIndex;
    
    if(banHotInstance.current.mangerF7[tabKey] === true) return;
    rowIndex = rowIndex === -1 ? 0 : rowIndex
  
    try {
      if(hotInstance.view.settings.data[rowIndex]['InsertDefault']){        
        hotInstance.view.settings.data[rowIndex].InsertDefault  = false;
        hotInstance.view.settings.data[rowIndex].inserted 		  = true;
      }
      if(!hotInstance.view.settings.data[rowIndex]['updated'] && !hotInstance.view.settings.data[rowIndex]['inserted']){
        hotInstance.view.settings.data[rowIndex]['updated'] 	  = true;         
      }  
      Main.modifico(FormName);
    } catch (error) {
      console.log(error);
    }
  }
  const funcionValidaHadsontable = (input,data)=>{
    if(input === 'NRO_CUOTA'){
      if(Main.nvl(data.CARGARCAB,null) !== null){
       let rowValue = refRef.current.hotInstance.getSourceData()

       if(rowValue.length > 0){
        try {
          refCab.current.data[refCab.current.indice]['TIP_CAMBIO'] = data.TIP_CAMBIO;  
          form.setFieldsValue({
            ...form.getFieldsValue(),
            TIP_CAMBIO: data.TIP_CAMBIO
          });
        } catch (error) {
          console.log(error)
        }
       }

      }
    } if(['MONTO','TIP_CAMBIO'].includes(input)) setTimeout(()=>total_det(),100);
    else if(input === 'SUB_TIPO_TRANS'){
      ver_bloqueo_concepto()
    }else{
      refCab.current.data[refCab.current.indice]['TOT_NRO_MOV_CAJ'] = data.TOT_NRO_MOV_CAJ;
      form.setFieldsValue({
        ...form.getFieldsValue(), 
        TOT_NRO_MOV_CAJ : Main.currency(data.TOT_NRO_MOV_CAJ, { separator:'.',decimal:',',precision:0,symbol:''}).format(),
      });
      setTimeout(()=>tot_nro_mov_caja(),100)
    }
  }
  const validaHandsontable = async(input,hotInstance,value,keyTab)=>{
    let refGrid     = mainInput.IdGrid[keyTab];
    let columnFocus = refGrid.columnIndex
    const selected  = hotInstance?.getSelected() ? hotInstance?.getSelected()[0] : [0,0,columnFocus,0];
    selected[0]     = selected[0] < 0 ? 0 : selected[0];
    let newRowValue = refCab.current.data[refCab.current.indice];
    let rowValue    = {...JSON.parse(JSON.stringify(newRowValue)),...refGrid.rowsValue};
    let listValida  = mainInput.validaInputGrid[keyTab]
    let item        = listValida.find( item => item.input == input);
    let indice      = rowValue.rowsIndex < 0 ? 0 : refGrid.rowsIndex < 0 ? 0 : refGrid.rowsIndex
    let row         = hotInstance.getSourceDataAtRow(Main.nvl(indice,0))
    rowValue        = {...row,...rowValue}
    if(rowValue[input] === value){
      refhasontable.current.stopFoscus = false;
      let addValue = false;
      if(item && item.addRow) addValue = isLastRowFocused(hotInstance,selected[0], item.addRow.maxColumn);
      if(!addValue){
        setTimeout(()=>hotInstance?.selectCell(selected[0], item.nexFocus ? item.nexFocus : selected[1]))
      }else{
        addRow();
      } 
      return
    }
    try {
      let paramsValue ={} 
      if(['NRO_CUOTA'].includes(item.input)){
        let valor_cab = form.getFieldValue();
        paramsValue = { COD_MONEDA_CAB: valor_cab.COD_MONEDA,
                        COD_MONEDA_REF: row.COD_MONEDA      ,
                        TIP_CAMBIO    : row.TIP_CAMBIO
                      }
      }else if(['TOT_COMPROBANTE'].includes(item.input)){
        let valor_cab = form.getFieldValue();
        paramsValue = { COD_MONEDA_CAB  : valor_cab.COD_MONEDA      ,
                        COD_MONEDA_CAB  : valor_cab.TIP_CAMBIO      ,
                        TOT_NRO_MOV_CAJ : valor_cab.TOT_NRO_MOV_CAJ ,
                        COD_MONEDA_REF  : row.COD_MONEDA            ,
                        TIP_CAMBIO_REF  : row.TIP_CAMBIO            ,
                        IMPORTE         : row.IMPORTE               ,
                        IMPORTE_ANT     : row.IMPORTE_ANT           ,
                      }
      }else if(['SUB_TIPO_TRANS'].includes(item.input)){
        let valor_cab = form.getFieldValue();
        paramsValue = { COD_MODULO  : 'CC'
                      , TIPO_TRANS  : Main.nvl(row.TIPO_TRANS,'')
                      , COD_CLIENTE : valor_cab.COD_CLIENTE
                      }
      }else if(['NRO_CUENTA'].includes(item.input)){
        let valor_cab = form.getFieldValue();
        paramsValue = {COD_CLIENTE      : valor_cab.COD_CLIENTE,
                       COD_BANCO        : row.COD_BANCO,
                       NRO_CUENTA       : row.NRO_CUENTA,
                       CARGA_CUENTA_CLI : row.CARGA_CUENTA_CLI
                      }               
      }else if(['COD_MONEDA_COBRO'].includes(item.input)){
        let valor_cab = form.getFieldValue();
        paramsValue = { FEC_MOV_CAJ     : valor_cab.FEC_MOV_CAJ,
                        CARGA_RETENCION : row.CARGA_RETENCION,
                        COD_USUARIO     : sessionStorage.getItem('cod_usuario')
                      }
      }else if(['TIP_CAMBIO'].includes(item.input)){
        let valor_cab = form.getFieldValue();
        paramsValue = { MONTO             : row.MONTO,
                        COD_MONEDA_COBRO  : row.COD_MONEDA_COBRO,
                        COD_MONEDA        : valor_cab.COD_MONEDA,
                        TIP_CAMBIO_CAB    : valor_cab.TIP_CAMBIO,
                      }
      }else if(['MONTO'].includes(item.input)){
        let valor_cab = form.getFieldValue();
        paramsValue = { MONTO            : row.MONTO
                      , CONCEPTO         : row.CONCEPTO
                      , COD_MONEDA_COBRO : row.COD_MONEDA_COBRO
                      , TIP_CAMBIO       : row.TIP_CAMBIO
                      , TIP_DOCUMENTO    : row.TIP_DOCUMENTO
                      , SER_DOCUMENTO    : row.SER_DOCUMENTO
                      , NRO_DOCUMENTO    : row.NRO_DOCUMENTO
                      , TOTAL            : valor_cab.TOTAL
                      , TOT_NRO_MOV_CAJ  : valor_cab.TOT_NRO_MOV_CAJ
                      , COD_MONEDA       : valor_cab.COD_MONEDA
                      , TIP_CAMBIO_CAB   : valor_cab.TIP_CAMBIO
                      , COD_MONEDA_BASE  : valor_cab.COD_MONEDA_BASE
                      }
      }else{
        item.params.map( x => {
          paramsValue = { ...paramsValue,[x]:rowValue[x]}
        })
      }
      paramsValue.COD_EMPRESA         = sessionStorage.getItem('cod_empresa');
      paramsValue.COD_SUCURSAL_LOCAL  = sessionStorage.getItem('cod_sucursal');
      paramsValue.valor               = value;
      Main.activarSpinner();
      await Main.Request( item.url_valida, 'POST', paramsValue ).then((resp)=>{
      Main.desactivarSpinner()
      if(resp.data.ret === 1){
        typeDataHadsontable(false,keyTab);
        let columnIndex  = hotInstance.propToCol(input)
        hotInstance?.selectCell(selected[0], columnIndex)
        hotInstance.setDataAtCell(selected[0],columnIndex,value);
        for(var i in resp.data){
          if(i !== 'ret' && i !== 'p_mensaje'){
            let columnIndex  = hotInstance.propToCol(i)
            if(!Main._.isNull(hotInstance.toVisualColumn(columnIndex))){
              let rvalue = Main.nvl(resp.data[i],'');
              hotInstance.setDataAtCell(selected[0],columnIndex,`${rvalue}`)
            }else{
              hotInstance.view.settings.data[selected[0]][i] = resp.data[i];
            }
          }            
        }
        let addValue = false    
        if(item && item.ejecuteFuncion) funcionValidaHadsontable(item.input,resp.data)
        if(item && item.addRow) addValue = isLastRowFocused(hotInstance,selected[0], item.addRow.maxColumn);
        if(item && item.nexFocus !== null && item.nexFocus !== "" && !addValue) hotInstance?.selectCell(selected[0], item.nexFocus);
        else if(addValue){
          setTimeout(()=>addRow(selected[0]))
        } 
      }else{
        let columnIndex  = hotInstance.propToCol(input)
        refGrid.columnIndex = columnIndex;
        hotInstance.setDataAtCell(selected[0],columnIndex,rowValue[input])
        for(var i in resp.data){
          if(i !== 'ret' && i !== 'p_mensaje'){
            let columnIndex  = hotInstance.propToCol(i)
            if(!Main._.isNull(hotInstance.toVisualColumn(columnIndex))){
              hotInstance.setDataAtCell(selected[0],columnIndex,rowValue[i])
            }else{
              hotInstance.view.settings.data[selected[0]][i] = resp.data[i];
            }
          }
        }        
        Main.alert(resp.data.p_mensaje, '¡Atención!', 'alert', 'OK',undefined,()=>{
          setTimeout(()=>hotInstance.selectCell(Main.nvl(refGrid.rowsIndex,rowValue.rowsIndex), Main.nvl(rowValue.columnIndex,columnIndex)));
        },false,FormName)
      }
        refhasontable.current.stopFoscus = false;
      })
    } catch (error) {
      Main.desactivarSpinner()
      console.log(error)
    }
  }
  const actualizarIndice = (hotInstance)=>{
    let indice = hotInstance.countRows() === 0 ? 1 : hotInstance.countRows();
    document.getElementById("indice").textContent = indice;
  }
  const onKeyDownGrill = (e,focusTab)=>{
    let hotInstance = banHotInstance.current[focusTab].current.hotInstance
    if(hotInstance){
      if([118,119].includes(e.keyCode)){
        e.preventDefault();
        const selected  = hotInstance?.getSelected() ? hotInstance?.getSelected()[0] : [0,0,0,0];
        if(selected[0] !== -1) selected[0] = 0;
        let refGrid     = mainInput.IdGrid[focusTab];
        let columnIndex = refGrid.indexColumnF7;
        Main.activarSpinner(); 
        
        if(e.keyCode === 118){
    
          if(columnIndex.includes(selected[1]) ){

            let inicialData   = JSON.parse(JSON.stringify(refGrid.inicialData));
            let newRowVapllue = refCab.current.data[refCab.current.indice];
            inicialData       = {...JSON.parse(JSON.stringify(newRowVapllue)),...inicialData}
            inicialData.ID    = Main.uuidID();

            banHotInstance.current.mangerF7[focusTab] = true;
            refCab.current.bandIndex = -1;
            Main.setBuscar(FormName,true);
            hotInstance.loadData([]);
            let valor                = JSON.parse(JSON.stringify(inicialData));
            valor.COD_EMPRESA        = sessionStorage.getItem('cod_empresa');
            valor.COD_SUCURSAL_LOCAL = sessionStorage.getItem('cod_sucursal');
            banHotInstance.current.objetoF7[focusTab] = valor;
            hotInstance.loadData([valor]);
            setTimeout(()=>{              
              const meta = hotInstance.getCellMetaAtRow(0);
              columnIndex.map((indice)=>{
                meta[indice].readOnly = false;  
              })
              hotInstance.selectCell(0, selected[1]);
              Main.desactivarSpinner();           
            })
          }else Main.desactivarSpinner();          
        
        }else if(e.keyCode === 119){     
          banHotInstance.current.mangerF7[focusTab] = false;
          if(columnIndex.includes(selected[1])){
            Main.setBuscar(FormName,false);
            try {
              let data = banHotInstance.current.objetoF7[focusTab] || {};
              if(data && Object.keys(data).length === 0){
                Main.desactivarSpinner()
                setTimeout(()=>hotInstance.selectCell(selected[0],selected[1]));                
                return
              }
              data.COD_EMPRESA = sessionStorage.getItem('cod_empresa');
              let nameColumn   = refGrid.viewColumn[selected[1]].data;
              data[nameColumn] = e.target.value && e.target.value.length  > 0 ? 
                                 e.target.value.trim().length             > 0 ? 
                                 e.target.value.trim()                    : data[nameColumn] : data[nameColumn];

              Main.desactivarSpinner();
              finalFocus(hotInstance)
              try {
                if(focusTab === idCompRef){
                  Main.activarSpinner();
                  let rowIDCab = refCab.current.data[refCab.current.indice].ID;
                  getReferencia(rowIDCab,data,selected[0],selected[1]).then((row)=>{                    
                    if(row  && JSON.parse(row).length > 0) actualizarIndice(hotInstance);
                  })  
                }else{
                  Main.activarSpinner();
                  let rowIDCab = refCab.current.data[refCab.current.indice].ID;
                  getDetalle(rowIDCab,data,selected[0],selected[1]).then((row)=>{                    
                    if(row  && JSON.parse(row).length > 0) actualizarIndice(hotInstance);
                  })
                }
              } catch (error) {
                Main.desactivarSpinner()
                console.log(error)
              }

            } catch (error) {
              Main.desactivarSpinner()
              console.log(error)
            }
          }else Main.desactivarSpinner();
        }
      }else if([117,13,9,120,40,38].includes(e.keyCode)){
        e.preventDefault();
        const selected  = hotInstance?.getSelected() ? hotInstance?.getSelected()[0] : [0,0,0,0];
        if(selected[0] !== -1) selected[0] = 0;
        let refGrid     = mainInput.IdGrid[focusTab];
        let listColumn  = refGrid.viewColumn ;
        let listInput   = refGrid.validaInput;
        
        if([13,9].includes(e.keyCode)){
          if(banHotInstance.current.mangerF7[focusTab] === true)return
          let activeEditor = hotInstance?.getActiveEditor(); 
          if(activeEditor && activeEditor.isOpened() && listInput.includes(listColumn[selected[1]].data)){
            refhasontable.current.stopFoscus = true;
            validaHandsontable(listColumn[selected[1]].data,hotInstance,e.target.value,focusTab)
          }else if(['MONTO'].includes(listColumn[selected[1]].data)){
            let columnIndex  = hotInstance.propToCol(listColumn[selected[1]].data);
            let addvalue     = isLastRowFocused(hotInstance,selected[0],columnIndex);
            if(addvalue){
              mainInput.IdGrid[focusTab].columnIndex = columnIndex;
              addRow();
            }
          }    
        }else if(e.keyCode === 117){     
        if(banHotInstance.current.mangerF7[focusTab])return 
        addRow();
        }else if(e.keyCode === 120 && listInput.includes(listColumn[selected[1]].data)){
          e.preventDefault(); 
          let isEnable    = Main.nvl(hotInstance.getActiveEditor(),false);
          if(banHotInstance.current.mangerF7[focusTab] || !isEnable) return

          let rowValue    = Main.nvl(refGrid.rowsValue,{});
          if(banHotInstance.current.mangerF7[focusTab]) Main.setBuscar(FormName,true);
          let listValida  = mainInput.validaInputGrid[focusTab]
          let item        = listValida.find( item => item.input == listColumn[selected[1]].data);
          if(Main._.isUndefined(item.url_buscar)) return
          let paramsValue = { COD_EMPRESA       : sessionStorage.getItem('cod_empresa')  ,
                              COD_SUCURSAL_LOCAL: sessionStorage.getItem('cod_sucursal') ,
                              COD_USUARIO       : sessionStorage.getItem('cod_usuario') ,
                            }
          item.params.map( x => {paramsValue = { ...paramsValue,[x]:rowValue[x]}})
          let paramsCab                    = form.getFieldsValue()
          paramsValue.COD_MONEDA_CAB       = paramsCab.COD_MONEDA;
          paramsValue.TIP_CAMBIO_CAB       = paramsCab.TIP_CAMBIO_CAB;
          paramsValue.COD_MODULO           = 'CC';
          refModal.current.refGrid         = hotInstance
          refModal.current.tipoDeBusqueda  = listColumn[selected[1]].data
          refModal.current.dataParams      = paramsValue;
          refModal.current.url_buscador    = item.url_buscar;
          refModal.current.ModalTitle      = item.title;
          refModal.current.modalColumn     = item.columnModal;
          refModal.current.indexRow        = refGrid.rowsIndex;          
          refModal.current.grilla          = true;
          try {
            Main.activarSpinner()
            getData(refModal.current.dataParams, item.url_buscar).then((resp)=>{
              if(resp && Object.keys(resp).length > 0) refModal.current.data = resp;
              else refModal.current.data = [];
              setTimeout(()=>{
                Main.desactivarSpinner();
                setShows(true)
              },5)
            });
          } catch (error) {
            Main.desactivarSpinner();
            console.log(error);
          }
          finalFocus(hotInstance);                  
        }

      }
    } 
  }
  const handlechangeGri = React.useCallback((e,idcomp)=>{
    typeDataHadsontable(e[0][0],idcomp);
  },[])
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
      Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,cancelar)
    }
  }

  return (
    <Main.Spin spinning={false} delay={500}>
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
            cancelar={cancelar}
            formName={FormName}
            vprinf={false}
            refs={{ref:buttonSaveRef}}
            funcionBuscar={funcionBuscar}
            NavigateArrow={navigateArrow}
            activateAtras={activateAtras}
            funcionAtras={funcionAtras} 
          />

          <CCMOVCAJ
            form={form}
            FormName={FormName}
            refRef={refRef}
            idCompRef={idCompRef}
            refDet={refDet}     
            idCompDet={idCompDet}
            refhasontable={refhasontable}
            handleInputChange={handleInputChange}
            handleInputMascara={handleInputMascara}
            handleKeyDown={handleKeyDown}
            onKeyDownGrill={onKeyDownGrill}
            setfocusRowIndex={setfocusRowIndex}
            setfocusRowIndexDet={setfocusRowIndexDet}
            handleKeyUp={handleKeyUp}
            handlechangeGri={handlechangeGri}
            setClickCell={setClickCell}
          />

        </Main.Paper>        
      </Main.AntLayout>
    </Main.Spin>
  );
});

export default MainCc;