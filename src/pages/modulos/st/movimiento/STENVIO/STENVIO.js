import React, { memo } from 'react';
import Main            from '../../../../../componente/util/main';
import Reporte         from './reporte';
import STENVIO,
       {columns}       from './view';
import mainUrl         from './url/mainUrl';
import mainInput       from './inputValida/mainInputValida'
import {objetoInicialCab,
        objetoInicialDet} 
                       from './ObjetoInicial/mainInicial'
const FormName     = 'STENVIO';
const TituloList   = "Notas de Envio entre Depósito";
const idComp       = `GRID_${FormName}`


var indice = 0
const setIndice = (e) => {
  Main.setIndiceCabecera(e,idComp);
  indice = e
}
const getIndice = () => {
  return indice
}

// CANTIDAD DE REGISTRO POR GET
const data_len = 100;
var mitad_data    	 = data_len / 2;

const MaiST = memo(() => {

  const [form]              = Main.Form.useForm()
  const defaultOpenKeys     = Main.DireccionMenu(FormName);
  const defaultSelectedKeys = Main.Menu(FormName);
  const cod_empresa         = sessionStorage.cod_empresa;

  // USESTATE
  const [shows, setShows] = React.useState(false);
  // USE REF
  const refData	            = React.useRef();
  const buttonSaveRef       = React.useRef();
  // BANDERA
  const refBandera          = React.useRef({bandNew:false,bandPost_Cab_Det:false,id_cabecera:''});
  const refCab              = React.useRef({ data: [], dataCan:[]   , delete:[]   , activateCambio:false
                                            , dataCanDet:[], deleteDet:[]});
  const refModalData        = React.useRef();
  const refBloqueo          = React.useRef();
  const refModal            = React.useRef({  modalColumn : []
                                            , data        : []
                                            , ModalTitle  : ''
                                            , idInput     : ''
                                            , dataParams  : ''
                                            , url_buscador: ''
                                            })

  React.useEffect(()=>{
    inicialForm()
    // eslint-disable-next-line
  },[])

  var idGrid = {
    grid:{
      [idComp] : refData  ,
    },
    columna:{
      [idComp] : columns
    }
  }    

  Main.useHotkeys(Main.Guardar, (e) =>{
		e.preventDefault();
		buttonSaveRef.current.click();
	},{enableOnFormTags: ['input', 'select', 'textarea']});
	Main.useHotkeys('f7', (e) => {
    e.preventDefault();
	});
  const getCambioDolares = async() => {
    try {
      let params ={ COD_MONEDA: 2}
			return await Main.Request(mainUrl.url_buscar_tipCambio,"POST",params).then((resp)=>{
        return resp.data ? resp.data : {}
      });
		} catch (error) {      
			console.log(error);
      return {}
		} finally {
			Main.desactivarSpinner();
		}
  }  
  const inicialForm = async (f7_delete = false, idFocus = 'COD_SUCURSAL')=>{
    setIndice(0);
    var tip_cambio          = await getCambioDolares()
    let valor  						  = await{...objetoInicialCab};
    if(Object.keys(tip_cambio).length > 0) valor   = {...valor, ...tip_cambio}    
    form.resetFields()
    var newKey 					    = Main.uuidID();
    valor.ID							  = newKey;
    valor.COD_SUCURSAL      = sessionStorage.cod_sucursal;
    valor.DESC_SUCURSAL     = sessionStorage.desc_sucursal;
    valor.COD_EMPRESA	      = sessionStorage.cod_empresa;		
    valor.COD_USUARIO     	= sessionStorage.cod_usuario;
    valor.FEC_COMPROBANTE   = Main.moment(new Date(),'DD MM YYYY');
    let date                = Main.moment().format('DD/MM/YYYY').toString()
    valor.FEC_COMPROBANTE   = Main.dayjs(date, 'DD/MM/YYYY');
    if(!f7_delete) form.setFieldsValue(valor);    
    else Main.desactivarSpinner();
    valor.FEC_COMPROBANTE   = Main.moment(valor.FEC_ENT_SAL).format('DD/MM/YYYY');
    refCab.current.data     = [valor]
    refCab.current.dataCan  = JSON.parse(JSON.stringify([valor]));
    
    getDetalle(newKey,false,0,f7_delete);
    setTimeout( ()=> {				
      document.getElementById(idFocus).focus();
		},100);
    document.getElementById("indice").textContent         = "1"
		document.getElementById("total_registro").textContent = "?";
		document.getElementById("mensaje").textContent 				= "";   
  }
  const getParamsDetalle = async (idCabecera = false, indexRow = 0)=>{
    var newKey            = Main.uuidID();
    var valor             = await {...objetoInicialDet};
    valor.ID	            = newKey;
    valor.COD_EMPRESA	    = refCab.current.data[indexRow === false ? 0 : indexRow].COD_EMPRESA ;
    valor.COD_SUCURSAL	  = refCab.current.data[indexRow === false ? 0 : indexRow].COD_SUCURSAL ;
    valor.NRO_COMPROBANTE = refCab.current.data[indexRow === false ? 0 : indexRow].NRO_COMPROBANTE ;
    valor.TIP_COMPROBANTE	= refCab.current.data[indexRow === false ? 0 : indexRow].TIP_COMPROBANTE ;
    valor.SER_COMPROBANTE	= refCab.current.data[indexRow === false ? 0 : indexRow].SER_COMPROBANTE ;   
    valor.CANTIDAD_ANT    = 0;
    valor.idCabecera      = idCabecera ? idCabecera : refCab.current.data[indexRow]?.ID;
    return valor;
  }
  const getDetalle = async (idCabecera, data = false,indexRow = 0,f7 = false)=>{

    let dataParams = data ? data : { COD_EMPRESA  : cod_empresa
                                  ,  NRO_COMPROBANTE:form.getFieldValue('NRO_COMPROBANTE')
                                  ,  TIP_COMPROBANTE:form.getFieldValue('TIP_COMPROBANTE')
                                  ,  SER_COMPROBANTE:form.getFieldValue('SER_COMPROBANTE')
                                  }
    var content = [];
    try {
      var info = await Main.Request(mainUrl.url_list_detalle,'POST',dataParams);

      if(info?.data?.rows?.length === 0 || info?.data?.rows === undefined){
        let valor = await getParamsDetalle(idCabecera,indexRow)
        content   = [valor]
        setTimeout(()=>{
          habilitar_columna(0)  
        },200)  
      }else{
        content = info.data.rows;
      }    
      refCab.current.dataCanDet = JSON.parse(JSON.stringify(content));
      refData.current?.hotInstance.loadData(content)
      Main.setFocusedRowIndex(0,undefined,refData,idComp);
      form.setFieldsValue({
        ...form.getFieldsValue(),
        DESC_DEPOSITO     : content[0].DESC_DEPOSITO,
        DESC_DEPOSITO_ENT : content[0].DESC_DEPOSITO_ENT,
        COSTO_ULTIMO      : content[0].COSTO_ULTIMO,      
        CANTIDAD_UB       : content[0].CANTIDAD_UB
      }); 
      ver_bloqueo(f7)
      setTimeout(()=>{
        setClickCell();
      },10)
    } catch (error) {
      console.log(error)
      Main.desactivarSpinner()
    }
  }
  // -----------------------------------------------------------------------
  const guardar = async ()=>{
    let exitInsertedBand 	   = false;
    let permisoActualizacion = false;
    let permisoIsertar 	     = false;
    
    if(refCab.current.delete.length === 0){
      let verificar_input_requerido = Main.validarCamposRequeridos();
      if(!verificar_input_requerido) return      
    }
 
    //GET TAB1 DET
    var update_insert_detalle = []
    if(refData.current.hotInstance) update_insert_detalle = refData.current.hotInstance.getSourceData();   
    if(refData.current){
      let idGrid = {
        grid:{
          [idComp] : refData,
        },
        columna:{
          [idComp] : columns
        }
      }
      const valor = await  Main.hotTableRequerido(idGrid,idComp,true);
      if(valor.Addband){
        setTimeout(()=>{
          Main.message.warning({
            content  : `Ingrese ${valor.columnaRequerido.label} para Continuar!!`,
            className: 'custom-class',
            duration : `${2}`,
            style    : {marginTop: '2vh'},
          });        
          refData.current.hotInstance.selectCell(valor.columnaRequerido.indexRow,valor.columnaRequerido.indexComun);
        },1)
        return
      }
    }

    // FILTER CAB
    var dependencia_cab     = [];
    // var rowCab              = refCab.current.data[getIndice()];
    let url_get_cab_cod     = `${mainUrl.url_buscar_comp}${cod_empresa}/${refCab.current.data[getIndice()].TIP_COMPROBANTE}/${refCab.current.data[getIndice()].SER_COMPROBANTE}`
    let infoCab      	      = await Main.GeneraUpdateInsertCab(refCab.current.data,'NRO_COMPROBANTE',url_get_cab_cod,dependencia_cab,true,false,true);
    var aux_cab	            = infoCab.rowsAux;
    var updateInserData     = infoCab.updateInsert;
    let keyCabecera 			  = infoCab.rowsAux.length > 0 ?  infoCab.rowsAux[getIndice()]?.NRO_COMPROBANTE : null;
    if(!permisoActualizacion) permisoActualizacion = infoCab.actualizar;
    if(!permisoIsertar)       permisoIsertar 	    = infoCab.insertar  ;
    var delete_cab          = refCab.current.delete[0] !== undefined && refCab.current.delete?.length > 0  ? refCab.current.delete : []
    exitInsertedBand        = infoCab.insertar;
      
    // FILTER DET
    var dependencia_det        = [];
    var add_cab_and_det        = ['COD_EMPRESA','COD_SUCURSAL','NRO_COMPROBANTE'];
    let url_get_det_cod        = `${mainUrl.url_buscar_nroOrd}${cod_empresa}/${refCab.current.data[getIndice()].TIP_COMPROBANTE}/${refCab.current.data[getIndice()].SER_COMPROBANTE}/${keyCabecera}`
    var infoDet     	    	   = await Main.GeneraUpdateInsertDet(update_insert_detalle,['NRO_ORDEN'],aux_cab,dependencia_det,'NRO_COMPROBANTE',url_get_det_cod,'NRO_ORDEN','ASC',add_cab_and_det);
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
      aux_updateInserData : [refCab.current.dataCan[getIndice()]],
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
            content  : `Procesado correctamente!!`,
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
          refCab.current.activateCambio = false;
          refCab.current.delete         = []

          let keyPamas = await getParmas(true)
          keyPamas.NRO_COMPROBANTE = infoCab.rowsAux[0].NRO_COMPROBANTE
          setTimeout(()=>{
            getDataCab(true,keyPamas)
          },4)
        }else{
          Main.desactivarSpinner();
          Main.alert(resp.data.p_mensaje, '¡Atención!', 'alert', 'OK')
        }            
      });
      
    } catch (error) {
      Main.desactivarSpinner();
      console.log('Error en la funcion de Guardar stenvio',error)
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
  const addRow = async (index = false)=>{
    if(!refBandera.current.bandNew && index === false){
      inicialForm();
    }else{
      let row = refCab.current.data[getIndice()]
      if(['C','A'].includes(row.ESTADO)) return  
      let valor = await  Main.hotTableRequerido(idGrid,idComp,false);
      if(valor.Addband){
        setTimeout(()=>{
          Main.message.warning({
            content  : `Ingrese ${valor.columnaRequerido.label} para Continuar!!`,
            className: 'custom-class',
            duration : `${2}`,
            style    : {marginTop: '2vh'},
          });
          refData.current.hotInstance.selectCell(valor.columnaRequerido.indexRow,valor.columnaRequerido.indexComun);
        },1)
        return
      }
      Main.modifico(FormName)
      let rowValue    = Main.g_getRowFocus(idComp);
      let rowIndex    = index.index ? index.index + 1 : rowValue[0].rowIndex === 0 ? rowValue[0].rowIndex + 1  : rowValue[0].rowIndex === -1 ? 0 : rowValue[0].rowIndex;
      let newRow      = await getParamsDetalle(false,getIndice());

      refData.current.hotInstance.alter('insert_row', rowIndex);
      refData.current.hotInstance.view.settings.data[rowIndex] = newRow;

      refData.current.hotInstance.updateSettings({      
        cellRow:rowIndex,
      });  

      refData.current.hotInstance.selectCell(rowIndex, 0);

      setTimeout(()=>{        
        typeEventDet(rowIndex)
      },100)
    }
  }
  const deleteRow =()=>{
    let row = refCab.current.data[getIndice()]
    if(['C','A'].includes(row.ESTADO)) return

    if(!refBandera.current.bandNew){
      setTimeout(()=>{
        Main.activarSpinner()
        form.resetFields();
        refCab.current.delete[0] = refCab.current.data[getIndice()]
        inicialForm(true,'COD_SUCURSAL',true)
        Main.modifico(FormName)
      },10)
    }else{
      Main.activarSpinner()
      setTimeout(async()=>{
        let rowCount       = refData.current.hotInstance.getSourceData().length;
        let rowInfo        = Main.g_getRowFocus(idComp)[0]
        let rowIndexFocus  = rowInfo.rowIndex - 1 === -1 ? 0 : rowInfo.rowIndex - 1;
        
        if(Main._.isUndefined(rowInfo?.inserted) && Main._.isUndefined(rowInfo?.insertDefault) ){
  
          if(refCab.current.deleteDet.length > 0){
            refCab.current.deleteDet = Main._.union(refCab.current.deleteDet, [rowInfo])
          }else{
            refCab.current.deleteDet = [...refCab.current.deleteDet,rowInfo]
          }
  
          refData.current.hotInstance.alter('remove_row',rowInfo.rowIndex);
          refData.current.hotInstance.selectCell(rowIndexFocus,rowInfo.columnIndex)
  
          Main.modifico(FormName)
          Main.setCambiosPendiente(idComp,true)
  
          if(rowCount === 1){
            refBandera.current.bandNew = true;
            addRow({index:-1});
          }
          Main.desactivarSpinner()
        }else if(rowCount === 1){
          refBandera.current.bandNew = true;
          refData.current.hotInstance.alter('remove_row',rowInfo.rowIndex);
          addRow({index:-1});
          Main.desactivarSpinner()
        }else{
          Main.desactivarSpinner()
          refData.current.hotInstance.alter('remove_row',rowInfo.rowIndex);
          refData.current.hotInstance.selectCell(rowIndexFocus,rowInfo.columnIndex)
        }
      },5)
    }
  }
  const funcionCancelar =()=>{   
    form.resetFields();    
    Main.setCambiosPendiente(idComp,false)
    refBandera.current.bandNew = false;
    // eslint-disable-next-line
    mainInput.restablecerValida()
    Main.activarSpinner()
    Main.setModifico(FormName);
    refCab.current.activateCambio = false;
    refCab.current.delete         = []
    refCab.current.deleteDet      = []
    Main.setBuscar(FormName,false);
    if(refCab.current.data[getIndice()].insertDefault || refCab.current.data[getIndice()].inserted){
      Main.desactivarSpinner()
      inicialForm()
    }else{
      refCab.current.data       = JSON.parse(JSON.stringify(refCab.current.dataCan))
      refCab.current.dataCan    = JSON.parse(JSON.stringify(refCab.current.data));
      Main.desactivarSpinner()      
      loadForm(refCab.current.data,getIndice())      
      setTimeout(()=>{
        document.getElementById('COD_SUCURSAL').focus();  
      },200)
    }
  }
  const funcionBuscar = (e)=>{
    if(e){
      if(!refCab.current.activateCambio){
        Main.setModifico(FormName);        
        getDataCab(true);
      }else{
        Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,funcionCancelar)
      }
    }else{
      manejaF7('NRO_COMPROBANTE')
    };
    Main.setBuscar(FormName,!e)
  }
  const NavigateArrow = (id)=>{
    Main.activarSpinner()
    switch (id) {
      case 'left':
        leftData();  
        break;
      case 'right':
        rightData();
        break;
      case 'next-left':
        if(refCab.current.data.length > 1){setIndice(0);leftData();} 
        else Main.desactivarSpinner();
        break;
      case 'next-right':
        if(refCab.current.data.length > 1){
          let index =  refCab.current.data.length - 1
          setIndice(index);
          loadForm(refCab.current.data,index);
          document.getElementById("indice").textContent = refCab.current.data.length;
        }
        else Main.desactivarSpinner();
        break;
      default:
        break;
    }
  }
  //************** Change ***********************/ 
  const handleInputChange = (e) => {
    Main.modifico(FormName)
    try {
      refCab.current.data[getIndice()][e?.target?.id ? e?.target?.id : e.target.name ] = e?.target?.value;  
    } catch (error) {
      console.log(error)
    }
    typeEvent()
  }
  const manejaF7 = (idFocus)=>{
    Main.activarSpinner()
    form.resetFields(); 
    refCab.current.activateCambio = false    
    setTimeout(()=>{    
      if(!Main.getViewBuscar(FormName))Main.setBuscar(FormName,true);
      Main.desactivarSpinner()      
      inicialForm(true,idFocus)
    },10)
  }
  const getParmas = (retornaNull = false) =>{
    var data = {
      COD_EMPRESA         : sessionStorage.getItem('cod_empresa'),
      COD_SUCURSAL        : retornaNull ? '' : form.getFieldValue('COD_SUCURSAL')           !== undefined ? form.getFieldValue('COD_SUCURSAL')                  : '',
      NRO_COMPROBANTE     : retornaNull ? '' : form.getFieldValue('NRO_COMPROBANTE')        !== undefined ? form.getFieldValue('NRO_COMPROBANTE')               : '',
      FEC_COMPROBANTE	    : retornaNull ? '' : form.getFieldValue('FEC_COMPROBANTE')        !== undefined ? refCab.current.data[getIndice()]['FEC_COMPROBANTE'] : '',
      // COD_MOTIVO          : retornaNull ? '' : form.getFieldValue('COD_MOTIVO')          !== undefined ? form.getFieldValue('COD_MOTIVO')                : '',
      // COD_DEPOSITO        : retornaNull ? '' : form.getFieldValue('COD_DEPOSITO')        !== undefined ? form.getFieldValue('COD_DEPOSITO')              : '',
      // COD_PROVEEDOR       : retornaNull ? '' : form.getFieldValue('COD_PROVEEDOR')       !== undefined ? form.getFieldValue('COD_PROVEEDOR')             : '',
      // COD_MONEDA          : retornaNull ? '' : form.getFieldValue('COD_MONEDA')          !== undefined ? form.getFieldValue('COD_MONEDA')                : '',
      // ESTADO              : retornaNull ? '' : form.getFieldValue('ESTADO')              !== undefined ? form.getFieldValue('ESTADO')                    : '',
      // TIP_COMPROBANTE_REF : retornaNull ? '' : form.getFieldValue('TIP_COMPROBANTE_REF') !== undefined ? form.getFieldValue('TIP_COMPROBANTE_REF')       : '',
      // SER_COMPROBANTE_REF : retornaNull ? '' : form.getFieldValue('SER_COMPROBANTE_REF') !== undefined ? form.getFieldValue('SER_COMPROBANTE_REF')       : '',
      // NRO_COMPROBANTE_REF : retornaNull ? '' : form.getFieldValue('NRO_COMPROBANTE_REF') !== undefined ? form.getFieldValue('NRO_COMPROBANTE_REF')       : '',
    }
    return data
  } 
  const getDataCab = (buttonF8=false,data = false)=>{
    let params = data === false ? getParmas() : data
    params.INDICE = 0;
    params.LIMITE = data_len;
    Main.activarSpinner()    
    try {
      Main.Request(mainUrl.url_list_cab, "POST", params).then((resp) => {
        let response = resp?.data?.rows;
        if (response.length > 0) {
          
          // LIMPIAR EL DELETE
          refCab.current.delete         = []
          refCab.current.deleteDet      = []
  
          if(response.length === 1) document.getElementById("total_registro").textContent = "1";
          else document.getElementById("total_registro").textContent = "?"
          refCab.current.data    = response;
          refCab.current.dataCan = JSON.parse(JSON.stringify(response));
          setIndice(0);
          setTimeout(()=>{
            loadForm(response,getIndice())                    
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
  const loadForm = async (data = [] , indice = false)=>{
    let index  = await indice ? indice : getIndice()
    let value  = await data[index] === undefined ? data : data[index];
       
    form.setFieldsValue({
      ...value,
      FEC_COMPROBANTE : Main.dayjs(value?.FEC_COMPROBANTE ? value?.FEC_COMPROBANTE : null, 'DD/MM/YYYY'),
    });
    Main.desactivarSpinner();
    // nextValida();
    getDetalle(false, { COD_EMPRESA     : value.COD_EMPRESA
                      , TIP_COMPROBANTE : value.TIP_COMPROBANTE
                      , SER_COMPROBANTE : value.SER_COMPROBANTE
                      , NRO_COMPROBANTE : value.NRO_COMPROBANTE},indice); 
  } 
  //********** VALIDADORES ONKEYDOWN  ***************/ 
  const getData = async (data, url) => {
    try {
      let params = await data;
      return await Main.Request(url, "POST", params).then(resp => { return resp.data.rows });
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  const onKeyDown = async (e)=>{
    if (['Enter', 'Tab'].includes(e.key)) {
      e.preventDefault()
      switch (e.target.id) {
        case "NRO_COMPROBANTE":
          document.getElementById('FEC_COMPROBANTE').focus();            
        break;
        case "FEC_COMPROBANTE":
          setTimeout(()=>{
            document.getElementsByClassName('ant-picker-dropdown')[0].style.visibility = 'collapse'
          })
          document.getElementById('NRO_PLANILLA').focus();            
        break;
        case "NRO_PLANILLA":
          document.getElementById('TIP_COMPROBANTE_REF').focus();            
        break;
        case "TIP_COMPROBANTE_REF":
            document.getElementById('SER_COMPROBANTE_REF').focus();            
        break;
        case "SER_COMPROBANTE_REF":
            document.getElementById('NRO_COMPROBANTE_REF').focus();
        break;
        case "NRO_COMPROBANTE_REF":
            document.getElementById('COMENTARIO').focus();            
        break;
        case "COMENTARIO":
          setTimeout(()=>{
            refData.current?.hotInstance?.selectCell(0,0);
            // refData.current?.hotInstance?.getActiveEditor().beginEditing();
          })
        break;
        default:
          break;
      }
      if (['COD_SUCURSAL','COD_MOTIVO','COD_DEPOSITO','COD_PROVEEDOR','COD_MONEDA'].includes(e.target.id)) {
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
    } else if (e.key === 'F9' && 
      ['COD_SUCURSAL','COD_MOTIVO','COD_DEPOSITO','COD_PROVEEDOR','COD_MONEDA'].includes(e.target.id)) {
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
          aux = await getData({ valor: 'null',cod_empresa }, mainUrl.url_buscar_sucursal);
          refModal.current.data = aux
          refModal.current.dataParams = { cod_empresa }
        break;
        case "COD_MOTIVO":
          aux = await getData({ valor: 'null',cod_empresa, cod_sucursal:form.getFieldValue('COD_SUCURSAL')}, mainUrl.url_buscar_motivo);
          refModal.current.data = aux
          refModal.current.dataParams = { cod_empresa, cod_sucursal:form.getFieldValue('COD_SUCURSAL') }
        break;     
        default:
          break;
      }
      Main.desactivarSpinner()
      setShows(true)
    }
  }
  // -----------------------------------------------------------------------
  const leftData = async() => {
    if(!refCab.current.activateCambio){
      var index = getIndice() - 1;
      if(index < 0){
        index = 0;
        document.getElementById("mensaje").textContent = "Haz llegado al primer registro";
      }else{
        document.getElementById("mensaje").textContent = "";
      }
      document.getElementById("indice").textContent = index + 1;
      document.getElementById("total_registro").textContent = refCab.current.data.length
      setIndice(index);
      var row = refCab.current.data[getIndice()]
      if( refBandera.current.id_cabecera !== row.ID ) refBandera.current.id_cabecera = row.ID;
      loadForm(refCab.current.data);
      Main.quitarClaseRequerido();
    }else{
      Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,funcionCancelar)
    }
  }
  const rightData = async() => {
    if(!refCab.current.activateCambio){
      if(refCab.current.data.length !== 1){
        var index = getIndice() + 1;
        if( refBandera.current.id_cabecera !== refCab.current.data[index]?.ID && !Main._.isUndefined(refCab.current.data[index]?.ID)){
          refBandera.current.id_cabecera = refCab.current.data[index].ID;
          setIndice(index);
          loadForm(refCab.current.data,index)   
          document.getElementById("total_registro").textContent = refCab.current.data.length
          document.getElementById("mensaje").textContent = "";
          document.getElementById("indice").textContent  = index + 1;
          if(getIndice() > mitad_data && refBandera.current.bandPost_Cab_Det){
            refBandera.current.bandPost_Cab_Det = false;
            let params = { INDICE  : refCab.current.data.length, 
                            LIMITE  : data_len
                          };  
            try {
              await Main.Request(mainUrl.url_list_cab,'POST',params)
                .then(async (resp) => {              
                  let response = await resp?.data?.rows;
                  refBandera.current.bandPost_Cab_Det = true;
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
  //********** VALIDADORES GENERICO  ***************/ 
  const nextValida = async ()=>{   
  }
  const ValidarUnico = async (input, value) => {
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
        refCab.current.data[getIndice()][x] = '';
      });
      // eslint-disable-next-line
      valorValida.rel.map((x) => {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          [x]: ''
        });
        refCab.current.data[getIndice()][x] = '';
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
            value = fieldValue;          
            data = { ...data, [x]:value, } }
          );
        data = { ...data, valor };
        await Main.Request(valorValida.url, 'POST', data).then((resp) => {
          if (resp.data.outBinds.ret === 1) {
            valorValida.valor_ant = valor
            // eslint-disable-next-line
            valorValida.out.map((x) => {
              form.setFieldsValue({
                ...form.getFieldsValue(),
                [x]: resp.data.outBinds[x]
              });
              refCab.current.data[getIndice()][x] = resp.data.outBinds[x];
            })
            // eslint-disable-next-line
            valorValida.rel.map(x => {
              form.setFieldsValue({
                ...form.getFieldsValue(),
                [x]: ''
              });
              refCab.current.data[getIndice()][x] = null;
            });
            if (valorValida?.idFocus) document.getElementById(valorValida.next).focus();
            else if (valorValida?.idSelect) document.getElementById(valorValida.next).select();
            if(valorValida.nextEjecute) nextValida(valorValida)
          } else {            
            Main.alert(resp.data.outBinds.p_mensaje, '¡Atención!', 'alert', 'OK')
          }
        })
      } catch (error) {
        console.log('valida frontend', error)
      }
    }    
  }
  const eventoClick = async (data) => {
    let valorValida = await mainInput.validaInput.find(item => item.input === refModal.current.idInput);
    setShows(!shows)
    setTimeout(()=>{
      if (Object.keys(data).length > 0) {
        for (let key in data) {
          form.setFieldsValue({
            ...form.getFieldsValue(),
            [key]: data[key]
          });
          refCab.current.data[getIndice()][key] = data[key]
        }
      }
      Main.modifico(FormName)
      typeEvent()
      if(valorValida.nextEjecute) nextValida(valorValida);
    })    
  }
  const ver_bloqueo= async() =>{
    let p_boqueo = form.getFieldValue('NRO_COMPROBANTE') === '' || form.getFieldValue('NRO_COMPROBANTE') === undefined ? false : true;
    let input = document.getElementsByClassName(`${FormName}_BLOQUEO`)

    for (let i = 0; i < input.length; i++) {
      const element = input[i];
      element.readOnly = p_boqueo;
    }
    Main.setBloqueoFecha(`${FormName}_FEC_COMPROBANTE`,p_boqueo);

    setTimeout(()=>{
      habilitar_columna()
    },1);
  }
  const habilitar_columna = (p_boqueo)=>{
    p_boqueo = form.getFieldValue('NRO_COMPROBANTE') === '' || form.getFieldValue('NRO_COMPROBANTE') === undefined ? false : true;
    
    let row = refData?.current ? refData?.current?.hotInstance?.getSourceData() : [];
    if(row.length > 0){
      for (let i = 0; i < row.length; i++) {
        const meta = refData.current.hotInstance.getCellMetaAtRow(i);
        meta[0].readOnly = p_boqueo;
        meta[1].readOnly = true
        meta[2].readOnly = p_boqueo
        meta[3].readOnly = p_boqueo
        meta[4].readOnly = p_boqueo;
        meta[5].readOnly = true;
        meta[6].readOnly = form.getFieldValue('ESTADO') === 'P' ? false : true;
        meta[7].readOnly = true;
        meta[8].readOnly = form.getFieldValue('ESTADO') === 'P' ? false : true;  
        meta[9].readOnly = true;  
        refData.current.hotInstance.setCellMetaObject(i, meta);
      }
      refData?.current?.hotInstance?.updateSettings({});
      let p_bloqueo = form.getFieldValue('ESTADO') === 'P' ? false : true
      Main.setBloqueoRadio(`${FormName}_ESTADO`,p_bloqueo);   
      document.getElementsByClassName(`${FormName}_COMENTARIO`)[0].readOnly = p_bloqueo;
    }
  }
  const typeEvent = ()=>{
    if(refCab.current.data[getIndice()]['insertDefault']){
      refCab.current.data[getIndice()].insertDefault      = false;
      refCab.current.data[getIndice()].inserted 		      = true;
      refCab.current.data[getIndice()].COD_USUARIO	      = sessionStorage.getItem('cod_usuario');
    
    }
    if(!refCab.current.data[getIndice()]['updated'] && refCab.current.data[getIndice()]['inserted'] !== true){
      refCab.current.data[getIndice()]['updated']      = true;
      refCab.current.data[getIndice()].COD_USU_MODI	  = sessionStorage.cod_usuario;
      refCab.current.activateCambio = true;      
      if(form.getFieldValue('ESTADO') === 'C') refCab.current.data[getIndice()].FEC_ESTADO = Main.moment().format('DD/MM/YYYY HH:mm:ss');
    }
    Main.modifico(FormName);
  }
  const typeEventDet = (indexRow = false)=>{
    let rowValue = indexRow === false ? Main.g_getRowFocus(FormName)[0] : {rowIndex:indexRow};
    if(refData.current.hotInstance.view.settings.data[rowValue.rowIndex]['insertDefault']){
       refData.current.hotInstance.view.settings.data[rowValue.rowIndex].insertDefault      = false;
       refData.current.hotInstance.view.settings.data[rowValue.rowIndex].inserted 		      = true;
    }else if(!refData.current.hotInstance.view.settings.data[rowValue.rowIndex]['updated'] && 
              refData.current.hotInstance.view.settings.data[rowValue.rowIndex]['inserted'] !== true){
       refData.current.hotInstance.view.settings.data[rowValue.rowIndex]['updated']         = true;
       refData.current.activateCambio = true;
       Main.modifico(FormName);
    } 
  }
  const activateButtonCancelar = async(e,nameInput)=>{
    refCab.current.data[getIndice()][nameInput] = await e !== null ? Main.format_N(e.$d) : Main.moment(new Date(),'DD MM YYYY');    
		typeEvent()    
    setTimeout(()=>{
      document.getElementById('NRO_PLANILLA').focus();
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
  // --------------------------------------------
  const setClickCell  = React.useCallback((id = 'DET')=>{
    // let rowIndex  = Main.g_getRowFocus(idComp)[0] ? Main.g_getRowFocus(idComp)[0].rowIndex : 0;
    if(id === "CAB"){
      refBandera.current.bandNew = false;
      document.getElementById("total_registro").textContent = "?";
      document.getElementById("mensaje").textContent 				=  "";   
    }else{
      refBandera.current.bandNew = true;
    }
    // eslint-disable-next-line
  },[])
  //********** VALIDADORES GENERICO  ***************/ 
  const setfocusRowIndex   = React.useCallback((valor,row,col)=>{
    refBandera.current.bandNew = true;
    let resulCounto        =  refData.current.hotInstance.countRows() === 0 ? 1 : refData.current.hotInstance.countRows();
    form.setFieldsValue({
      ...form.getFieldsValue(),
      DESC_DEPOSITO     : valor.DESC_DEPOSITO,
      DESC_DEPOSITO_ENT : valor.DESC_DEPOSITO_ENT,
      COSTO_ULTIMO      : valor.COSTO_ULTIMO,      
    });              
    document.getElementById("total_registro").textContent = resulCounto
   
    setTimeout(()=>{
      setClickCell();
    },10)
    // eslint-disable-next-line 
  },[]);
  const setLastFocusNext = React.useCallback((e,row,rowCount,rowindex)=>{
    if(e.keyCode === 13){
      setTimeout(()=>{
        addRow({index:rowindex})
      },2)
    }
    // eslint-disable-next-line
  },[])

  // ************ REPORTE ****************************/
  const renvio = async() => {
    let data = { P_COD_EMPRESA    : sessionStorage.getItem('cod_empresa'),
                 P_COD_SUCURSAL   : form.getFieldValue('COD_SUCURSAL')   ,
                 P_NRO_COMPROBANTE: form.getFieldValue('NRO_COMPROBANTE'),
                }
   try {
    await Main.Request(mainUrl.url_reporte, 'POST', data)
      .then( response => {        
        if( response.data.rows.length > 0 ){          
          Main.activarSpinner();
          buildReport(response.data.rows)          
        }else{
          Main.message.info({
            content  : `No se encontraron registros`,
            className: 'custom-class',
            duration : `${2}`,
            style    : {marginTop: '2vh'},
          });        
        }
      })
   } catch (error) {
    Main.desactivarSpinner()
    console.log(error);
   }    
  }
  const buildReport = async(data) => {
    var rows = []
    let sucursales = Main._.uniq( data, (item)=>{return item.COD_SUCURSAL;});
    sucursales.sort( function(a,b){
      if ( parseInt(a.COD_SUCURSAL) > parseInt(b.COD_SUCURSAL) ) { return  1;}
      else if ( parseInt(a.COD_SUCURSAL) < parseInt(b.COD_SUCURSAL) ) { return -1;}
      else return 0;
    });
    // eslint-disable-next-line
    sucursales.map( (sucursal) => {
      rows = [ ...rows, { COD_ARTICULO: `Sucursal: ${sucursal.COD_SUCURSAL} ${sucursal.DESC_SUCURSAL}` } ];
      let motivos = data.filter( item => item.COD_SUCURSAL = sucursal.COD_SUCURSAL );
      motivos = Main._.uniq( motivos, (item)=>{ return item.COD_MOTIVO; });
      motivos.sort( function(a,b){
        if ( parseInt(a.COD_MOTIVO) > parseInt(b.COD_MOTIVO) ) { return  1;
        }else if ( parseInt(a.COD_MOTIVO) < parseInt(b.COD_MOTIVO) ) { return -1;}
        else return 0
      });
      // eslint-disable-next-line
      motivos.map( motivo => {
        rows = [ ...rows, { COD_ARTICULO: `Motivo: ${motivo.DESC_MOTIVO}` }];
        let comprobantes = data.filter( item => item.COD_SUCURSAL === sucursal.COD_SUCURSAL && item.COD_MOTIVO === motivo.COD_MOTIVO);
        comprobantes = Main._.uniq( comprobantes, (item)=>{ return item.NRO_COMPROBANTE; });
        comprobantes.sort( function(a,b){
          if ( parseInt(a.NRO_COMPROBANTE) > parseInt(b.NRO_COMPROBANTE) ) { return  1;}
          else if ( parseInt(a.NRO_COMPROBANTE) < parseInt(b.NRO_COMPROBANTE) ) { return -1;}
          else return 0;
        });
        // eslint-disable-next-line
        comprobantes.map( comprobante => {
          rows = [ ...rows, 
            { COD_ARTICULO: `Comprobante Nro: ${comprobante.NRO_COMPROBANTE}`, FEC_COMPROBANTE: `Fecha: ${Main.moment(comprobante.FEC_COMPROBANTE).format('DD/MM/YYYY')}`, ESTADO: `Estado: ${comprobante.ESTADO}` },
            { COD_ARTICULO: 'Artículo (Cód. Descripción)', DESC_UNIDAD: 'U.M', FEC_VENCIMIENTO: 'Fec. Venc.', CANTIDAD: 'Cantidad', DESCRIPCION:'Descripción', DESC_DEP_SAL: 'Salida', DESC_DEP_ENT: 'Entrada', MONTO_TOTAL: 'Total' }
          ];
          let articulos = data.filter( item => item.COD_SUCURSAL === sucursal.COD_SUCURSAL && item.COD_MOTIVO === motivo.COD_MOTIVO && item.NRO_COMPROBANTE === comprobante.NRO_COMPROBANTE );
          // eslint-disable-next-line
          articulos.map( item => {
            rows = [ ...rows, {
              COD_ARTICULO: `${item.COD_ARTICULO} ${item.DESC_ARTICULO}`,
              DESC_UNIDAD: item.DESC_UNIDAD,
              FEC_VENCIMIENTO: Main.moment(item.FEC_VENCIMIENTO).format('DD/MM/YYYY'),
              CANTIDAD: item.CANTIDAD,
              DESCRIPCION: item.DESCRIPCION,
              DESC_DEP_SAL: item.DESC_DEP_SAL,
              DESC_DEP_ENT: item.DESC_DEP_ENT,
              MONTO_TOTAL: Main.currency(item.MONTO_TOTAL, { separator:'.',decimal:',',precision:0,symbol:'' } ).format(),
              MONTO_TOTAL_no_format: item.MONTO_TOTAL
            }]
          });
          let total = Main._.reduce(Main._.map( articulos ,function(map) {
            return parseFloat(map.MONTO_TOTAL);
          }),function(memo, num) {
              return memo + num;
          },0);
          rows = [...rows, {DESC_DEP_ENT: 'TOTAL: ', MONTO_TOTAL: Main.currency(total, { separator:'.',decimal:',',precision:0,symbol:'' } ).format() }];
        });
      });
    });
    Reporte.renvio(rows,form);
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
        footer={null}/>
    
    
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
              NavigateArrow={NavigateArrow}
              reporte={renvio}            
            />
            
            
            <STENVIO
              form={form}
              FormName={FormName}
              refGrid={refData}            
              idComp={idComp}
              handleInputChange={handleInputChange}
              handleKeyDown={onKeyDown}
              handleKeyUp={handleKeyUp}
              setfocusRowIndex={setfocusRowIndex}
              dataRef={refCab}
              // validaExterno={validaDetalle}
              setClickCell={setClickCell}
              activateButtonCancelar={activateButtonCancelar}
              refBloqueo={refBloqueo}
              setLastFocusNext={setLastFocusNext}
            />  


          </Main.Paper>        
        </Main.AntLayout>
      </Main.Spin>
    </>
  );
});

export default MaiST;