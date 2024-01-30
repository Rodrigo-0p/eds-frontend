import React, { memo } from 'react';
import Main            from '../../../../../componente/util/main';
import STENTSAL
     ,{columns}        from './view';
import mainUrl         from './url/mainUrl';
import mainInput       from './inputValida/mainInputValida'
import {objetoInicialCab,
        objetoInicialDet} 
                       from './ObjetoInicial/mainInicial'
import dayjs from 'dayjs';
import './styles/STENTSAL.css'

const FormName     = 'STENTSAL';
const TituloList   = "Ajustes de Stock";
const idComp       = `GRID_${FormName}`


var id_cabecera    	  = '';
const set_id_cabecera = (e)=>{
  id_cabecera = e;
}
const get_id_cabecera = ()=>{
  return id_cabecera;
}
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
const set_mitad_data = (e)=>{
  mitad_data = e;
}
// BANDERA
var bandPost_Cab_Det = true;

const MainST = memo(() => {

  const [form]              = Main.Form.useForm()
  const defaultOpenKeys     = Main.DireccionMenu(FormName);
  const defaultSelectedKeys = Main.Menu(FormName);
  const cod_empresa         = sessionStorage.cod_empresa;
  
  // USESTATE
  const [shows, setShows] = React.useState(false);
  // USE REF
  const refData	            = React.useRef();
  const buttonSaveRef       = React.useRef();
  const refAdd              = React.useRef({bandNew:false});
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

  Main.useHotkeys(Main.Guardar, (e) =>{
		e.preventDefault();
		buttonSaveRef.current.click();
	},{enableOnFormTags: ['input', 'select', 'textarea']});
	Main.useHotkeys('f7', (e) => {
    e.preventDefault();
	});
 
  const inicialForm = async (f7_delete = false, idFocus = 'COD_SUCURSAL')=>{
    setIndice(0);
    form.resetFields()
    var newKey 					    = Main.uuidID();
    let valor  						  = JSON.parse(JSON.stringify(objetoInicialCab));
    valor.ID							  = newKey;
    valor.COD_SUCURSAL      = sessionStorage.cod_sucursal;
    valor.DESC_SUCURSAL     = sessionStorage.desc_sucursal;
    valor.COD_EMPRESA	      = sessionStorage.cod_empresa;		
    valor.COD_USUARIO     	= sessionStorage.cod_usuario;
    // valor.FEC_ENT_SAL       = Main.moment(new Date(),'DD MM YYYY');
    let date                = Main.moment().format('DD/MM/YYYY').toString()
    valor.FEC_ENT_SAL       = dayjs(date, 'DD/MM/YYYY');
    valor.FEC_ALTA				  = Main.moment().format('DD/MM/YYYY HH:mm:ss');
    if(!f7_delete) form.setFieldsValue({...valor,MANEJA_COSTO : valor.MANEJA_COSTO === 'S' ? true : false});    
    else Main.desactivarSpinner();
    valor.FEC_ENT_SAL       = Main.moment(valor.FEC_ENT_SAL).format('DD/MM/YYYY');
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
    var newKey          = Main.uuidID();
    var valor           = await {...objetoInicialDet};
    valor.ID	          = newKey;
    valor.COD_EMPRESA	  = refCab.current.data[indexRow === false ? 0 : indexRow].COD_EMPRESA ;
    valor.NRO_ENT_SAL   = refCab.current.data[indexRow === false ? 0 : indexRow].NRO_ENT_SAL ;
    valor.IND_ENT_SAL   = refCab.current.data[indexRow === false ? 0 : indexRow].IND_ENT_SAL ;
    valor.AFECTA_COSTO  = refCab.current.data[indexRow === false ? 0 : indexRow].AFECTA_COSTO;
    valor.TIP_ENT_SAL	  = refCab.current.data[indexRow === false ? 0 : indexRow].TIP_ENT_SAL ;
    valor.SER_ENT_SAL	  = refCab.current.data[indexRow === false ? 0 : indexRow].SER_ENT_SAL ;   
    valor.CANTIDAD_ANT  = 0;    
    valor.idCabecera    = idCabecera ? idCabecera : refCab.current.data[indexRow]?.ID;
    return valor;
  }
  const getDetalle = async (idCabecera, data = false,indexRow = 0,f7 = false)=>{

    let dataParams = data ? data : {COD_EMPRESA  : cod_empresa, NRO_ENT_SAL:form.getFieldValue('NRO_ENT_SAL')}
    var content = [];
    try {
      var info = await Main.Request(mainUrl.url_list_detalle,'POST',dataParams);
    } catch (error) {
      console.log(error)
      Main.desactivarSpinner()
    }
    if(info?.data?.rows?.length === 0 || info?.data?.rows === undefined){
      let valor = await getParamsDetalle(idCabecera,indexRow)
      content   = [valor]
      // setTimeout(()=>{
        // habilitar_columna(0)  
      // },100)      
    }else{
      content = info.data.rows;
    }    
    refCab.current.dataCanDet = JSON.parse(JSON.stringify(content));
    refData.current?.hotInstance.loadData(content)
    Main.setFocusedRowIndex(0,undefined,refData,idComp);
    ver_bloqueo(f7)
    setTimeout(()=>{
      setClickCell();
    },10)
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
    let url_get_cab_cod     = `${mainUrl.url_buscar_ent_sal}${cod_empresa}`
    let infoCab      	      = await Main.GeneraUpdateInsertCab(refCab.current.data,'NRO_ENT_SAL',url_get_cab_cod,dependencia_cab,true,false,true);
    var aux_cab	            = infoCab.rowsAux;
    var updateInserData     = infoCab.updateInsert;
    let keyCabecera 			  = infoCab.rowsAux.length > 0 ?  infoCab.rowsAux[getIndice()]?.NRO_ENT_SAL : null;
    if(!permisoActualizacion) permisoActualizacion = infoCab.actualizar;
    if(!permisoIsertar)       permisoIsertar 	    = infoCab.insertar  ;
    var delete_cab          = refCab.current.delete[0] !== undefined && refCab.current.delete?.length > 0  ? refCab.current.delete : []
    exitInsertedBand        = infoCab.insertar;
     
    // FILTER DET
    var dependencia_det        = [];
    var add_cab_and_det        = ['COD_EMPRESA','COD_SUCURSAL','NRO_ENT_SAL','IND_ENT_SAL','AFECTA_COSTO'];
    let url_get_det_cod        = `${mainUrl.url_buscar_nro_Orden}${cod_empresa}/${keyCabecera}`
    var infoDet     	    	   = await Main.GeneraUpdateInsertDet(update_insert_detalle,['NRO_ORDEN'],aux_cab,dependencia_det,'NRO_ENT_SAL',url_get_det_cod,'NRO_ORDEN','ASC',add_cab_and_det);
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
          keyPamas.COD_PERSONA = infoCab.rowsAux[0].COD_PERSONA
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
      console.log('Error en la funcion de Guardar vtclient',error)
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
    if(!refAdd.current.bandNew && index === false){
      inicialForm();
    }else{
      let row = refCab.current.data[getIndice()]
      if(['C','A'].includes(row.ESTADO)) return  
      var idGrid = {
        grid:{
          [idComp] : refData
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

    if(!refAdd.current.bandNew){
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
            refAdd.current.bandNew = true;
            addRow({index:-1});
          }
          Main.desactivarSpinner()
        }else if(rowCount === 1){
          refAdd.current.bandNew = true;
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
    refAdd.current.bandNew = false;
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
      if( id_cabecera !== row.ID ) id_cabecera = row.ID;
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
        if( get_id_cabecera() !== refCab.current.data[index]?.ID && !Main._.isUndefined(refCab.current.data[index]?.ID)){
          set_id_cabecera(refCab.current.data[index].ID);
          setIndice(index);
          postQueryCab(refCab.current.data[index],false,index)
          document.getElementById("total_registro").textContent = refCab.current.data.length
          document.getElementById("mensaje").textContent = "";
          document.getElementById("indice").textContent  = index + 1;
          if(getIndice() > mitad_data && bandPost_Cab_Det){
            bandPost_Cab_Det = false;
            let params = { INDICE  : refCab.current.data.length, 
                           LIMITE  : data_len
                         };  
            try {
              await Main.Request(mainUrl.url_list_cab,'POST',params)
                .then(async (resp) => {              
                  let response = await resp?.data?.rows;
                  bandPost_Cab_Det = true;
                  refCab.current.data      = [ ...refCab.current.data, ...response ];
                  refCab.current.dataCan   = JSON.parse(JSON.stringify([refCab.current.data]))
                  set_mitad_data(refCab.current.data.length / 2);
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
  const funcionBuscar = (e)=>{
    if(e){
      if(!refCab.current.activateCambio){
        Main.setModifico(FormName);        
        getDataCab(true);
      }else{
        Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,funcionCancelar)
      }
    }else{
      manejaF7('NRO_ENT_SAL')
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
          postQueryCab(refCab.current.data[index],false,index);
          document.getElementById("indice").textContent = refCab.current.data.length;
        }
        else Main.desactivarSpinner();
        break;
      default:
        break;
    }  
  }
  const getData = async (data, url) => {
    try {
      let params = await data;
      return await Main.Request(url, "POST", params).then(resp => { return resp.data.rows });
    } catch (error) {
      console.log(error);
      return [];
    }
  };
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
      COD_SUCURSAL        : retornaNull ? '' : form.getFieldValue('COD_SUCURSAL')        !== undefined ? form.getFieldValue('COD_SUCURSAL')              : '',
      NRO_ENT_SAL         : retornaNull ? '' : form.getFieldValue('NRO_ENT_SAL')         !== undefined ? form.getFieldValue('NRO_ENT_SAL')               : '',
      FEC_ENT_SAL	        : retornaNull ? '' : form.getFieldValue('FEC_ENT_SAL')         !== undefined ? refCab.current.data[getIndice()]['FEC_ENT_SAL'] : '',
      COD_MOTIVO          : retornaNull ? '' : form.getFieldValue('COD_MOTIVO')          !== undefined ? form.getFieldValue('COD_MOTIVO')                : '',
      COD_DEPOSITO        : retornaNull ? '' : form.getFieldValue('COD_DEPOSITO')        !== undefined ? form.getFieldValue('COD_DEPOSITO')              : '',
      COD_PROVEEDOR       : retornaNull ? '' : form.getFieldValue('COD_PROVEEDOR')       !== undefined ? form.getFieldValue('COD_PROVEEDOR')             : '',
      COD_MONEDA          : retornaNull ? '' : form.getFieldValue('COD_MONEDA')          !== undefined ? form.getFieldValue('COD_MONEDA')                : '',
      ESTADO              : retornaNull ? '' : form.getFieldValue('ESTADO')              !== undefined ? form.getFieldValue('ESTADO')                    : '',
      TIP_COMPROBANTE_REF : retornaNull ? '' : form.getFieldValue('TIP_COMPROBANTE_REF') !== undefined ? form.getFieldValue('TIP_COMPROBANTE_REF')       : '',
      SER_COMPROBANTE_REF : retornaNull ? '' : form.getFieldValue('SER_COMPROBANTE_REF') !== undefined ? form.getFieldValue('SER_COMPROBANTE_REF')       : '',
      NRO_COMPROBANTE_REF : retornaNull ? '' : form.getFieldValue('NRO_COMPROBANTE_REF') !== undefined ? form.getFieldValue('NRO_COMPROBANTE_REF')       : '',
    }
    return data
  } 
  const getDataCab = (buttonF8=false,data = false)=>{
    let params = data === false ? getParmas() : data
    params.INDICE = 0;
    params.LIMITE = data_len;
    Main.activarSpinner()    
    Main.Request(mainUrl.url_list_cab, "POST", params).then((resp) => {
      let response = resp?.data?.rows;
      if (response.length > 0) {
        
        // LIMPIAR EL DELETE
        refCab.current.delete         = []
        refCab.current.deleteDet      = []

        if(response.length === 1) document.getElementById("total_registro").textContent = "1";
        else document.getElementById("total_registro").textContent = response.length
        refCab.current.data    = response;
        refCab.current.dataCan = JSON.parse(JSON.stringify(response));
        setIndice(0);
        setTimeout(()=>{
          postQueryCab(response[0],buttonF8,getIndice())                    
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
  }
  const postQueryCab = async(info,buttonF8 = false,indice) => {
    if(info){      
      let data = {   COD_EMPRESA    : info?.COD_EMPRESA    ? info?.COD_EMPRESA    : ''
                   , COD_SUCURSAL   : info?.COD_SUCURSAL   ? info?.COD_SUCURSAL   : ''                   
                   , COD_DEPOSITO   : info?.COD_DEPOSITO   ? info?.COD_DEPOSITO   : ''
                   , COD_MONEDA     : info?.COD_MONEDA     ? info?.COD_MONEDA     : ''
                   , COD_MOTIVO     : info?.COD_MOTIVO     ? info?.COD_MOTIVO     : ''
                   , COD_PROVEEDOR  : info?.COD_PROVEEDOR  ? info?.COD_PROVEEDOR  : ''
                   , TIP_ENT_SAL    : info?.TIP_ENT_SAL    ? info?.TIP_ENT_SAL    : ''
                   , SER_ENT_SAL    : info?.SER_ENT_SAL    ? info?.SER_ENT_SAL    : ''
                   , NRO_ENT_SAL    : info?.NRO_ENT_SAL    ? info?.NRO_ENT_SAL    : ''                   
                }
      try {
        await Main.Request(mainUrl.url_postQueryCab, "POST", data).then(async(resp) => {
          if(resp.data){
            // ver_bloqueo()
            refCab.current.data[indice] = {...refCab.current.data[indice], ...resp.data}
            refCab.current.dataCan[indice] = JSON.parse(JSON.stringify(refCab.current.data[indice]));
            loadForm(refCab.current.data,indice);            
            if(buttonF8) document.getElementById('NRO_ENT_SAL').focus() 
          }          
          Main.desactivarSpinner();          
        }); 
      } catch (error) {
        Main.desactivarSpinner();
        console.log(error)
      }  
    }else{
      Main.desactivarSpinner();
    }
  }
  const loadForm = async (data = [] , indice = false)=>{
    let index  = await indice ? indice : getIndice()
    let value  = await data[index] === undefined ? data : data[index];
       
    form.setFieldsValue({
      ...value,
      FEC_ENT_SAL : dayjs(value?.FEC_ENT_SAL ? value?.FEC_ENT_SAL : null, 'DD/MM/YYYY'),
    });
    Main.desactivarSpinner();
    nextValida();
    getDetalle(false, { COD_EMPRESA : value.COD_EMPRESA
                      , NRO_ENT_SAL : value.NRO_ENT_SAL},indice); 
  } 
  const onKeyDown = async (e)=>{
    if (['Enter', 'Tab'].includes(e.key)) {
      e.preventDefault()
      switch (e.target.id) {
        case "NRO_ENT_SAL":
          document.getElementById('FEC_ENT_SAL').focus();
        break;
        case "FEC_ENT_SAL":
          setTimeout(()=>{
            document.getElementsByClassName('ant-picker-dropdown')[0].style.visibility = 'collapse'
          })
          document.getElementById('COD_MOTIVO').focus();            
        break;
        case "TIP_COMPROBANTE_REF":
            document.getElementById('SER_COMPROBANTE_REF').focus();            
        break;
        case "SER_COMPROBANTE_REF":
            document.getElementById('NRO_COMPROBANTE_REF').focus();
        break;
        case "NRO_COMPROBANTE_REF":
            document.getElementById('OBSERVACION').focus();            
        break;
        case "OBSERVACION":
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
        case "COD_DEPOSITO":
          aux = await getData({ valor: 'null',cod_empresa,cod_sucursal:form.getFieldValue('COD_SUCURSAL') }, mainUrl.url_buscar_deposito);
          refModal.current.data = aux
          refModal.current.dataParams = { cod_empresa,cod_sucursal:form.getFieldValue('COD_SUCURSAL') }
        break;
        case "COD_PROVEEDOR":
          aux = await getData({ valor: 'null',cod_empresa }, mainUrl.url_buscar_proveedor);
          refModal.current.data = aux
          refModal.current.dataParams = { cod_empresa }
        break;
        case "COD_MONEDA":
          aux = await getData({ valor: 'null',cod_empresa }, mainUrl.url_buscar_moneda);
          refModal.current.data = aux
          refModal.current.dataParams = { cod_empresa }
        break;
        default:
          break;
      }
      Main.desactivarSpinner()
      setShows(true)
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
    let p_boqueo = form.getFieldValue('NRO_ENT_SAL') === '' ? false : true;
    let input = document.getElementsByClassName(`${FormName}_BLOQUEO`)

    for (let i = 0; i < input.length; i++) {
      const element = input[i];
      element.readOnly = p_boqueo;
    }
    Main.setBloqueoFecha(`${FormName}_FEC_ENT_SAL`,p_boqueo);

    setTimeout(()=>{
      habilitar_columna()
    },1);
  }
  const habilitar_columna = (p_boqueo)=>{
    p_boqueo = form.getFieldValue('NRO_ENT_SAL') === '' ? false : true;
    
    let row = refData.current.hotInstance.getSourceData();
    for (let i = 0; i < row.length; i++) {
      const meta = refData.current.hotInstance.getCellMetaAtRow(i);
      meta[0].readOnly = p_boqueo;
      meta[1].readOnly = true
      meta[2].readOnly = p_boqueo;
      meta[3].readOnly = true;
      meta[4].readOnly = form.getFieldValue('ESTADO') === 'P' ? false : true;
      meta[5].readOnly = form.getFieldValue('ESTADO') === 'P' ? false : true;
      meta[6].readOnly = true  
      refData.current.hotInstance.setCellMetaObject(i, meta);
    }
    refData.current.hotInstance.updateSettings({});
    let p_bloqueo = form.getFieldValue('ESTADO') === 'P' ? false : true
    Main.setBloqueoRadio(`${FormName}_ESTADO`,p_bloqueo);   
    document.getElementsByClassName(`${FormName}_OBSERVACION`)[0].readOnly = p_bloqueo;
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
  const nextValida = async ()=>{
    let valor = refCab.current.data[getIndice()]  
    setTimeout(()=>{
      const currentColumnSettings = refData.current.hotInstance.getSettings().columns;
      currentColumnSettings[6] = {
        ...currentColumnSettings[6],
        type: 'numeric',
        numericFormat: {pattern: `0,0.${'0'.repeat(valor.DECIMALES)}`},
      };
      currentColumnSettings[5] = {
        ...currentColumnSettings[5],
        type: 'numeric',
        numericFormat: {pattern: `0,0.${'0'.repeat(valor.DECIMALES)}`},
      };
      refData.current.hotInstance.updateSettings({
        columns: currentColumnSettings,
      })
    },10)    
  }
  //********** VALIDADORES GENERICO  ***************/ 
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
  const typeEvent = ()=>{
    if(refCab.current.data[getIndice()]['insertDefault']){
      refCab.current.data[getIndice()].insertDefault      = false;
      refCab.current.data[getIndice()].inserted 		      = true;
      refCab.current.data[getIndice()].COD_USUARIO_ALTA	  = sessionStorage.getItem('cod_usuario');
      refCab.current.data[getIndice()].FEC_ALTA           = Main.moment().format('DD/MM/YYYY');
    }
    if(!refCab.current.data[getIndice()]['updated'] && refCab.current.data[getIndice()]['inserted'] !== true){
      refCab.current.data[getIndice()]['updated']         = true;
      refCab.current.data[getIndice()].COD_USUARIO_MODI	  = sessionStorage.cod_usuario;
      refCab.current.data[getIndice()].FEC_MODI           = Main.moment().format('DD/MM/YYYY');
      refCab.current.activateCambio = true;            
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
      document.getElementById('COD_MOTIVO').focus();
    })
  }
  //********** VALIDADORES GENERICO  ***************/ 
  const setfocusRowIndex = React.useCallback((valor,row,col)=>{
    refAdd.current.bandNew = true;
    let resul       = refData.current.hotInstance.getSourceData()
    form.setFieldsValue({
      ...form.getFieldsValue(),
      COSTO_ULTIMO    : valor.COSTO_ULTIMO,      
    });              
    document.getElementById("total_registro").textContent = resul.length;
    setTimeout(()=>{
      setClickCell();
    },10)
    // eslint-disable-next-line 
  },[]);
  const validaDetalle = React.useCallback(async(row,name)=>{

    if(row[name] <= 0){
      Main.message.warning({
        content  : `Ingrese mayor a 0 para Continuar!!`,
        className: 'custom-class',
        duration : `${2}`,
        style    : {marginTop: '2vh'},
      });        
      return
    }

    if(row[name]) row[name] = parseFloat(row[name]);    
    let decimales   = refCab.current.data[getIndice()].DECIMALES ? refCab.current.data[getIndice()].DECIMALES : 1;
    let p_cantidad  = row.CANTIDAD ? row.CANTIDAD : 0;
    let total       = (p_cantidad * row[name]);    
    refData.current.hotInstance.setDataAtCell(row.rowIndex, 5, row[name]);
    refData.current.hotInstance.setDataAtCell(row.rowIndex, 6, total);
    
    let p_costo_ub  = new Intl.NumberFormat("de-DE").format( (row[name] ? row[name] : 0  / row.MULT ? row.MULT : 0 ).toFixed(decimales))
    refData.current.hotInstance.view.settings.data[row.rowIndex]['COSTO_UB'] = parseFloat(p_costo_ub);

    setTimeout(()=>{      
      refData.current.hotInstance.selectCell(row.rowIndex,5);
      addRow({index:row.rowIndex})
      setClickCell();
    },20)
    // eslint-disable-next-line
  },[]) 
  const setClickCell  = React.useCallback((id = 'DET')=>{
    let rowIndex  = Main.g_getRowFocus(idComp)[0] ? Main.g_getRowFocus(idComp)[0].rowIndex : 0;
    if(id === "CAB"){
      refAdd.current.bandNew = false;
      document.getElementById("total_registro").textContent = "?";
      document.getElementById("mensaje").textContent 				=  "";   
    }else{
      refAdd.current.bandNew = true;
    }

    let resul       = refData.current.hotInstance.getSourceData()
    const columnSum = resul.reduce((acc, row) => acc + parseFloat(row.MONTO_TOTAL || 0), 0);
    let p_decimales = refCab.current.data[getIndice()].DECIMALES ? refCab.current.data[getIndice()].DECIMALES : 0
    form.setFieldsValue({
      ...form.getFieldsValue(),    
      TOT_COMPROBANTE : Main.currency(columnSum, { separator:'.',decimal:',',precision:p_decimales,symbol:''}).format(),
      COSTO_ULTIMO    : new Intl.NumberFormat("de-DE").format(resul[rowIndex]?.COSTO_ULTIMO ? resul[rowIndex]?.COSTO_ULTIMO : 0),
      COSTO_UB        : new Intl.NumberFormat("de-DE").format(resul[rowIndex]?.COSTO_UB     ? resul[rowIndex]?.COSTO_UB     : 0),
    });    
    refCab.current.data[getIndice()].TOT_COMPROBANTE = columnSum;
    // eslint-disable-next-line
  },[])

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
            NavigateArrow={NavigateArrow}            
          />

          <STENTSAL
            form={form}
            FormName={FormName}
            refGrid={refData}            
            idComp={idComp}
            handleInputChange={handleInputChange}
            handleKeyDown={onKeyDown}
            handleKeyUp={handleKeyUp}
            setfocusRowIndex={setfocusRowIndex}
            dataRef={refCab}
            validaExterno={validaDetalle}
            setClickCell={setClickCell}
            activateButtonCancelar={activateButtonCancelar}
            refBloqueo={refBloqueo}
          />
 
        </Main.Paper>  
      </Main.AntLayout>
    </Main.Spin>     
    </>
  );
});

export default MainST;