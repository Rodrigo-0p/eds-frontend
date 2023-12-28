import React, { memo }   from 'react';
import VTCLIENT,{columns}from './View.jsx';
import mainUrl           from './url/mainUrl';
import Main              from '../../../../../../componente/util/main.js';
import mainInput         from './inputValida/mainInputValida';
import { objetoinicialCab
        ,objetoInicialDet } from './ObjetoInicial/mainInicial'
import './VTCLIENT.css';


const FormName   = 'VTCLIENT';
const TituloList = "Catastro Cliente";
const idComp     = `GRID_${FormName}`

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

var bandNew = false;

// BANDERA
var bandPost_Cab_Det  = true;

const MainVt = memo(() => {


  const defaultOpenKeys     = Main.DireccionMenu(FormName);
  const defaultSelectedKeys = Main.Menu(FormName);    

  const [form]              = Main.Form.useForm();
  const [form_det]          = Main.Form.useForm();
  const cod_empresa         = sessionStorage.getItem('cod_empresa');
  const cod_usuario         = sessionStorage.getItem('cod_usuario');

  React.useEffect(()=>{    
    inicialForm()
    // eslint-disable-next-line

    document.getElementById(`form-${FormName}`)?.addEventListener('click', function (e){
      bandNew = false //Focus Cabecera
    });
  // eslint-disable-next-line
  },[])

  Main.useHotkeys(Main.Guardar, (e) =>{
		e.preventDefault();
		buttonSaveRef.current.click();
	},{enableOnFormTags: ['input', 'select', 'textarea']});
	Main.useHotkeys('f7', (e) => {
    e.preventDefault();
	});

  // bloqueo
  const bloqueoCliente      = React.useRef(false);

  //  UseRef
  const buttonSaveRef       = React.useRef();
  const refGrid             = React.useRef();
  const refCab              = React.useRef({ data: [], dataCan:[]   , delete:[]   , activateCambio:false
                                                     , dataCanDet:[], deleteDet:[]});
  const refModalData        = React.useRef()
  const refModal            = React.useRef({  modalColumn : []
                                            , data        : []
                                            , ModalTitle  : ''
                                            , idInput     : ''
                                            , dataParams  : ''
                                            , url_buscador: ''
                                          })
    
  const [shows, setShows] = React.useState(false);

  const getPreForm = async (data)=>{
    try {
      let data  = {   'COD_EMPRESA':cod_empresa, 'COD_USUARIO' :cod_usuario , 'FORMNAME':FormName}      ;
      return await Main.Request(mainUrl.url_preform, "POST", data).then(resp => {
        return resp.data 
      });
    } catch (error) {
      console.log(error);
      return {};
    }
  }
  // -----------------------------------------------------------------------------------------------
  const inicialForm = async (f7_delete = false, idFocus = 'COD_PERSONA')=>{
    setIndice(0);
    var newKey 					    = Main.uuidID();
    let params              = await getPreForm()
    let valor  						  = JSON.parse(JSON.stringify(objetoinicialCab));
    valor.LIMITE_CREDITO    = params.LIMITE_CREDITO_ANT
    valor.ID							  = newKey;
    valor.COD_EMPRESA	      = sessionStorage.cod_empresa;		
    valor.COD_USUARIO 		  = sessionStorage.cod_usuario;
    valor.FEC_ALTA				  = Main.moment().format('DD/MM/YYYY HH:mm:ss');
    valor                   = {...valor,...params};        
    if(!f7_delete) form.setFieldsValue({...valor,IND_SUB_CLIENTE : valor.IND_SUB_CLIENTE === 'S' ? true : false});    
    else Main.desactivarSpinner();

    refCab.current.data     = [valor]
    refCab.current.dataCan  = JSON.parse(JSON.stringify([valor]));
    
    setTimeout( ()=> {	
			document.getElementById(idFocus).focus();
      getDetalle(newKey,false,0,f7_delete);
		});
    document.getElementById("indice").textContent         = "1"
		document.getElementById("total_registro").textContent = "?";
		document.getElementById("mensaje").textContent 				= "";
    // ver_bloqueo(f7_delete) 
  }
  // -----------------------------------------------------------------------------------------------
  const guardar = async ()=>{
    var permisoActualizacion = false;
    var permisoIsertar 	     = false;

    if(refCab.current.delete.length === 0){
      let verificar_input_requerido = Main.validarCamposRequeridos();
      if(!verificar_input_requerido) return      
    }
     
    //GET TAB1 DET
    var update_insert_detalle = []
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
      const valor = await  Main.hotTableRequerido(idGrid,idComp,false);
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
    var dependencia_cab     = [];
    // var rowCab              = refCab.current.data[getIndice()];
    let url_get_cab_cod     = `${mainUrl.url_cod_cliente}${cod_empresa}`
    let infoCab      	      = await Main.GeneraUpdateInsertCab(refCab.current.data,'COD_CLIENTE',url_get_cab_cod,dependencia_cab,true,false,true);
    var aux_cab	            = infoCab.rowsAux;
    var updateInserData     = infoCab.updateInsert;
    let keyCabecera 			  = infoCab.rowsAux.length > 0 ?  infoCab.rowsAux[getIndice()]?.COD_CLIENTE : null;
    if(!permisoActualizacion) permisoActualizacion = infoCab.actualizar;
    if(!permisoIsertar)       permisoIsertar 	    = infoCab.insertar  ;
    var delete_cab          = refCab.current.delete[0] !== undefined && refCab.current.delete?.length > 0  ? refCab.current.delete : []
 
    let bandLimiteCred      = false;
    if(updateInserData.length > 0){
      for (let a = 0; a < updateInserData.length; a++) {
        const items = updateInserData[a];
        let p_limite_credito = Main.numerico(refCab.current.dataCan[a].LIMITE_CREDITO_ANT)
        let v_limite_credito = Main.numerico(items.LIMITE_CREDITO)
        if(v_limite_credito > p_limite_credito){
          if(items.CAD_LIMITE_SUPERIOR === 'N'){
            bandLimiteCred = true
            refCab.current.data[getIndice()].LIMITE_CREDITO = p_limite_credito
            form.setFieldsValue({...form.getFieldsValue(),LIMITE_CREDITO : p_limite_credito});
            Main.alert('Usted no posee permiso para ingresar este limite de credito', '¡Atención!', 'alert', 'OK');
          }
        }
      }
    }
    if(bandLimiteCred) return
    // FILTER DET
    var dependencia_det        = [];
    var add_cab_and_det        = ['COD_EMPRESA','COD_CLIENTE'];
    let url_get_det_cod        = `${mainUrl.url_sub_cliente}${cod_empresa}/${keyCabecera}`
    var infoDet     	    	   = await Main.GeneraUpdateInsertDet(update_insert_detalle,['COD_SUBCLIENTE'],aux_cab,dependencia_det,'COD_CLIENTE',url_get_det_cod,'COD_SUBCLIENTE','ASC',add_cab_and_det);
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
      aux_updateInserData : refCab.current.dataCan[getIndice()],
      delete_cab	         , 

      updateInserDataDet   ,
      aux_updateInserDataDet : refCab.current.dataCanDet,
      delete_Det	         , 

      AditionalData
    }

    Main.activarSpinner();
    if(updateInserData.length    > 0 ||  
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
  const AddRow = async (index = false)=>{
    if(!bandNew && index === false){
      inicialForm();
    }else{
      var idGrid = {
        grid:{
          [idComp] : refGrid,
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
      let newRow      = await getParamsDetalle(false,getIndice());

      refGrid.current.hotInstance.alter('insert_row', rowIndex);
      refGrid.current.hotInstance.view.settings.data[rowIndex] = newRow;

      refGrid.current.hotInstance.updateSettings({      
        cellRow:rowIndex,
      });  
      refGrid.current.hotInstance.selectCell(rowIndex, 0);

      setTimeout(()=>{        
        typeEventDet(rowIndex)
      },100)
    }
  }
  const deleteRow = async ()=>{
    if(!bandNew){
      setTimeout(()=>{
        Main.activarSpinner()
        form.resetFields();
        refCab.current.delete[0] = refCab.current.data[getIndice()]
        inicialForm(true,'COD_PERSONA',true)
        Main.modifico(FormName)
      },10)
    }else{
      Main.activarSpinner()
      setTimeout(async()=>{
        let rowCount       = refGrid.current.hotInstance.getSourceData().length;
        let rowInfo        = Main.g_getRowFocus(idComp)[0]
        let rowIndexFocus  = rowInfo.rowIndex - 1 === -1 ? 0 : rowInfo.rowIndex - 1;
        
        if(Main._.isUndefined(rowInfo?.inserted) && Main._.isUndefined(rowInfo?.insertDefault) ){
  
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
            bandNew = true;
            AddRow({index:-1});
          }
          Main.desactivarSpinner()
        }else if(rowCount === 1){
          bandNew = true;
          refGrid.current.hotInstance.alter('remove_row',rowInfo.rowIndex);
          AddRow({index:-1});
          Main.desactivarSpinner()
        }else{
          Main.desactivarSpinner()
          refGrid.current.hotInstance.alter('remove_row',rowInfo.rowIndex);
          refGrid.current.hotInstance.selectCell(rowIndexFocus,rowInfo.columnIndex)
        }
      },5)
    }
  }
  // -----------------------------------------------------------------------------------------------
  const funcionCancelar = () => {
    form.resetFields();    
    Main.setCambiosPendiente(idComp,false)
    // eslint-disable-next-line
    mainInput.validaInput.map( item => {
      item.valor_ant = null;
    });
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
      mainInput.restablecerValida();
      Main.desactivarSpinner()
      loadForm(refCab.current.data,getIndice())      
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
      manejaF7('COD_PERSONA')
    };
    Main.setBuscar(FormName,!e)
  }
  const NavigateArrow = (id) => {
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
  // -----------------------------------------------------------------------------------------------
  const getParmas = (retornaNull = false) =>{
    var data = {
      COD_EMPRESA         : sessionStorage.getItem('cod_empresa'),
      COD_CLIENTE         : retornaNull ? '' : form.getFieldValue('COD_CLIENTE')         !== undefined ? form.getFieldValue('COD_CLIENTE')         : '',
      COD_PERSONA         : retornaNull ? '' : form.getFieldValue('COD_PERSONA')         !== undefined ? form.getFieldValue('COD_PERSONA')         : '',
      IND_SUB_CLIENTE     : retornaNull ? '' : form.getFieldValue('IND_SUB_CLIENTE')     ? 'S' : 'N',
      COD_MONEDA_LIMITE   : retornaNull ? '' : form.getFieldValue('COD_MONEDA_LIMITE')   !== undefined ? form.getFieldValue('COD_MONEDA_LIMITE')   : '',
      LIMITE_CREDITO      : retornaNull ? '' : form.getFieldValue('LIMITE_CREDITO')      !== undefined ? form.getFieldValue('LIMITE_CREDITO')      : '',   
      COD_CONDICION_VENTA : retornaNull ? '' : form.getFieldValue('COD_CONDICION_VENTA') !== undefined ? form.getFieldValue('COD_CONDICION_VENTA') : '',
      COD_CAUSAL          : retornaNull ? '' : form.getFieldValue('COD_CAUSAL')          !== undefined ? form.getFieldValue('COD_CAUSAL')          : '',
      COD_GRUPO_CLIENTE   : retornaNull ? '' : form.getFieldValue('COD_GRUPO_CLIENTE')   !== undefined ? form.getFieldValue('COD_GRUPO_CLIENTE')   : '',
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
      let data = {   COD_EMPRESA         : info?.COD_EMPRESA         ? info?.COD_EMPRESA          : ''
                   , COD_USUARIO         : cod_usuario
                   , COD_CLIENTE         : info?.COD_CLIENTE         ? info?.COD_CLIENTE          : ''
                   , COD_PERSONA         : info?.COD_PERSONA         ? info?.COD_PERSONA          : ''
                   , COD_CONDICION_VENTA : info?.COD_CONDICION_VENTA ? info?.COD_CONDICION_VENTA  : ''
                   , COD_CAUSAL          : info?.COD_CAUSAL          ? info?.COD_CAUSAL           : ''
                   , COD_MONEDA_LIMITE   : info?.COD_MONEDA_LIMITE   ? info?.COD_MONEDA_LIMITE    : ''
                   , COD_GRUPO_CLIENTE   : info?.COD_GRUPO_CLIENTE   ? info?.COD_GRUPO_CLIENTE    : ''
                }
      try {
        await Main.Request(mainUrl.url_postQueryCab, "POST", data).then(async(resp) => {
          if(resp.data){
            refCab.current.data[indice] = {...refCab.current.data[indice], ...resp.data}
            refCab.current.dataCan[indice] = JSON.parse(JSON.stringify(refCab.current.data[indice]));
            loadForm(refCab.current.data,indice);            
            if(buttonF8) document.getElementById('COD_PERSONA').focus() 
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
    value.DESC_CIUDAD = ''
    value.BARRIO      = ''
    value.EMAIL       = ''
    value.DIRECCION   = ''
		form.setFieldsValue({
      ...value,
      IND_SUB_CLIENTE : value.IND_SUB_CLIENTE === 'S' ? true : false    
    });
    Main.desactivarSpinner()
    getDetalle(false, { COD_EMPRESA : value.COD_EMPRESA
                      , COD_CLIENTE : value.COD_CLIENTE},indice); 
  }
  const getParamsDetalle = async (idCabecera = false, indexRow = 0)=>{
    var newKey              = Main.uuidID();
    var valor               = await {...objetoInicialDet};
    valor.ID	              = newKey;
    valor.COD_EMPRESA	      = refCab.current.data[indexRow === false ? 0 : indexRow].COD_EMPRESA
    valor.idCabecera        = idCabecera ? idCabecera : refCab.current.data[indexRow]?.ID;
    return valor;
  }
  const getDetalle = async (idCabecera, data = false,indexRow = 0,f7 = false)=>{

    let dataParams = data ? data : {COD_EMPRESA : cod_empresa}
    var content = [];
    try {
      var info = await Main.Request(mainUrl.url_list_det,'POST',dataParams);
    } catch (error) {
      console.log(error)
      Main.desactivarSpinner()
    }
    if(info?.data?.rows?.length === 0 || info?.data?.rows === undefined){
      let valor = await getParamsDetalle(idCabecera,indexRow)
      content   = [valor]
    }else{
      content = info.data.rows;
    }
    refCab.current.dataCanDet = JSON.parse(JSON.stringify(content));
    refGrid.current?.hotInstance.loadData(content)
    Main.setFocusedRowIndex(0,undefined,refGrid,idComp);    
    setTimeout(()=>{
      form.setFieldsValue({
        ...form.getFieldsValue(),
        IND_SUB_CLIENTE   : refCab.current.data[getIndice()].IND_SUB_CLIENTE === 'S' ? true : false,
        DIRECCION         : content[0].DIRECCION         ? content[0].DIRECCION         : '',
        EMAIL             : content[0].EMAIL             ? content[0].EMAIL             : '',
        DESC_CIUDAD       : content[0].DESC_CIUDAD       ? content[0].DESC_CIUDAD       : '',
        DESC_LISTA_PRECIO : content[0].DESC_LISTA_PRECIO ? content[0].DESC_LISTA_PRECIO : '',
        BARRIO            : content[0].BARRIO            ? content[0].BARRIO            : '',
      }); 
      ver_bloqueo(f7)
    },10)
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
  const getData = async (data, url) => {
    try {
      let params = await data;
      return await Main.Request(url, "POST", params).then(resp => { return resp.data.rows });
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  const handleKeyDow = async (e) => {
    if (['Enter', 'Tab'].includes(e.key)) {
      e.preventDefault()
    
      switch (e.target.id) {
        case 'LIMITE_CREDITO':
          let p_limite_credito = Main.numerico(refCab.current.dataCan[getIndice()].LIMITE_CREDITO_ANT)
          let v_limite_credito = Main.numerico(e.target.value)
          if(v_limite_credito > p_limite_credito){
            if(refCab.current.data[getIndice()].CAD_LIMITE_SUPERIOR === 'N'){
              refCab.current.data[getIndice()].LIMITE_CREDITO = p_limite_credito
              form.setFieldsValue({...form.getFieldsValue(),LIMITE_CREDITO : p_limite_credito});
              Main.alert('Usted no posee permiso para ingresar este limite de credito', '¡Atención!', 'alert', 'OK');
            }else{
              document.getElementById('COD_MONEDA_LIMITE').focus();
            }
          }else{
            document.getElementById('COD_MONEDA_LIMITE').focus();
          }
          break;
        case 'SALDO':
          document.getElementById('VALORES').focus();
          break;
        case 'VALORES':
          document.getElementById('POSIBLE').focus();
        break;
        case 'POSIBLE':
          setTimeout(()=>{
            refGrid?.current?.hotInstance?.selectCell(0,0);
          },1)
        break;
        default:
          break;
      }
      
     if (['COD_PERSONA','COD_CONDICION_VENTA','COD_CAUSAL','COD_GRUPO_CLIENTE','COD_MONEDA_LIMITE'].includes(e.target.id)) {
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
    } else if (e.key === 'F9' && ["COD_PERSONA","COD_CONDICION_VENTA",'COD_CAUSAL','COD_GRUPO_CLIENTE','COD_MONEDA_LIMITE'].includes(e.target.id)) {
      e.preventDefault()
      let aux = '';

      if(e.target.id === 'COD_CAUSAL' && refCab.current.data[getIndice()].BLOQUEAR_CLIENTE !== 'S'){
        Main.alert('Usted no tiene permiso para bloquear el cliente', '¡Atención!', 'alert', 'OK');
        return
      }

      refModal.current.idInput = e.target.id
      let items = mainInput.ModalF9[e.target.id]

      refModal.current.ModalTitle   = items.title;
      refModal.current.modalColumn  = items.column;
      refModal.current.url_buscador = items.url;

      Main.activarSpinner()
      switch (e.target.id) {
        case 'COD_PERSONA':
          aux = await getData({ valor: 'null' }, mainUrl.url_buscar_persona);
          refModal.current.data = aux
          refModal.current.dataParams = { cod_empresa }
          break; 
        case 'COD_CONDICION_VENTA':
          aux = await getData({ valor: 'null',cod_empresa}, mainUrl.url_buscar_condVent);
          refModal.current.data = aux
          refModal.current.dataParams = { cod_empresa }
          break;
        case 'COD_CAUSAL':
          aux = await getData({ valor: 'null'}, mainUrl.url_buscar_causal);
          refModal.current.data = aux
        break;
        case 'COD_GRUPO_CLIENTE':
          aux = await getData({ valor: 'null', cod_empresa }, mainUrl.url_buscar_grupCli);
          refModal.current.data = aux
          refModal.current.dataParams = { cod_empresa }
        break;
        case 'COD_MONEDA_LIMITE':
          aux = await getData({ valor: 'null'}, mainUrl.url_buscar_monedas);
          refModal.current.data = aux
        break;      
        default:
          break;
      }
      Main.desactivarSpinner()
      setShows(true)
    }
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
        let data = {}
        // eslint-disable-next-line
        valorValida.data.map((x) => {          
          let value;
          const fieldValue = form.getFieldValue(x);

          if (['LIMITE_CREDITO'].includes(x)) {
            value = Main.numerico(fieldValue);
          } else {
            value = fieldValue;
          }
          
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
          } else {            
            Main.alert(resp.data.outBinds.p_mensaje, '¡Atención!', 'alert', 'OK')
          }
        })
      } catch (error) {
        console.log('valida frontend', error)
      }
    }    
  }
  // ----------------------------- BLOQUEO INPUT --------------------------------------------------- 
  const ver_bloqueo = (f7 = false)=>{
    bloqueoCliente.current.input.readOnly = !f7;
  }
  //********** MODAL F9  ***************************/ 
  const eventoClick = async (data) => {
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
      Main.modifico(FormName);
    } 
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
  const handleInputChangeNumber = (e)=>{
    const { id, value} = e.target
    Main.modifico(FormName)
    try {
      refCab.current.data[getIndice()][id] = Main.numerico(value);
    } catch (error) {
      console.log(error)
    }
    typeEvent()
  }
  const handleCheckbox = (e,options)=>{
    let rowValue = {target:{'id':e.target.id,'value': form.getFieldValue(e.target.id) === true ? options[0] : options[1]}}
    handleInputChange(rowValue)
  }
  //********************************************/ 
  const setfocusRowIndex = React.useCallback((valor,row,col)=>{
    if(valor){
      bandNew = true;
      form.setFieldsValue({
        ...form.getFieldsValue(),
        IND_SUB_CLIENTE   : refCab.current.data[getIndice()].IND_SUB_CLIENTE === 'S' ? true : false,
        DIRECCION         : valor.DIRECCION,
        EMAIL             : valor.EMAIL,
        DESC_CIUDAD       : valor.DESC_CIUDAD,
        DESC_LISTA_PRECIO : valor.DESC_LISTA_PRECIO,
        BARRIO            : valor.BARRIO,
      }); 
    }
    // eslint-disable-next-line 
  },[]);
  const onKeyDownDet = (e)=>{
    if (['Enter', 'Tab'].includes(e.key)) {
      e.preventDefault()
      switch (e.target.id) {
        case "BARRIO":
            document.getElementById('DIRECCION').focus();
          break;
        case "DIRECCION":
          document.getElementById('EMAIL').focus();
        break;
        case "EMAIL":
          document.getElementById('BARRIO').focus();
        break;
        default:
          break;
      }
    }
  }

  const handleInputChangeDet = React.useCallback(async(e)=>{    
    let rowValue = await Main?.g_getRowFocus(idComp)[0]
    refGrid.current.hotInstance.view.settings.data[rowValue.rowIndex][e.target.id] = e.target.value;
    typeEventDet(rowValue.rowIndex)
  },[]);
  const setLastFocusNext = React.useCallback((e,row,rowCount,rowindex)=>{
    if(e.keyCode === 13){
      setTimeout(()=>{
        AddRow({index:rowindex})
      },2)
    }
    // eslint-disable-next-line
  },[]);

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
            AddForm={()=>AddRow()}
            SaveForm={guardar}
            deleteRows={deleteRow}
            cancelar={funcionCancelar}
            formName={FormName}
            vprinf={false}
            refs={{ref:buttonSaveRef}}
            funcionBuscar={funcionBuscar}
            NavigateArrow={NavigateArrow}            
          />

          <VTCLIENT 
            form={form} 
            form_det={form_det}
            refGrid={refGrid} 
            FormName={FormName} 
            idComp={idComp}
            stateRef={{bloqueoCliente}}
            // ---
            handleKeyDown={handleKeyDow}
            handleKeyUp={handleKeyUp}
            handleInputChange={handleInputChange}
            handleInputChangeNumber={handleInputChangeNumber}
            handleCheckbox={handleCheckbox}
            dataRef={refCab}
            setfocusRowIndex={setfocusRowIndex}   
            handleInputChangeDet={handleInputChangeDet}
            onKeyDownDet={onKeyDownDet}
            setLastFocusNext={setLastFocusNext}
          />

          </Main.Paper>
        </Main.AntLayout>
      </Main.Spin>
    </>
  );
});

export default MainVt;