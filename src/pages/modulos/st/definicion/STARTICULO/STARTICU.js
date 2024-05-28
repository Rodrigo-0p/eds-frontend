import React, { memo }    from 'react';
import Main               from '../../../../../componente/util/main';
import STARTICU,{columns} from './view.jsx';
import mainUrl            from './url/mainUrl';
import mainInput          from './inputValida/mainInputValida'
import {objetoInicialCab,
        objetoInicialDet} from './ObjetoInicial/mainInicial'
import './styles/STARTICU.css'
const FormName     = 'STARTICU';
const TituloList   = "Articulos";
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

const MainST = memo(({history, location, match}) => {

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
  const refModalData        = React.useRef()
  const refModal            = React.useRef({  modalColumn : []
                                            , data        : []
                                            , ModalTitle  : ''
                                            , idInput     : ''
                                            , dataParams  : ''
                                            , url_buscador: ''
                                          })
  // bloqueo
  const bloqueoArticulo      = React.useRef();

  React.useEffect(()=>{
    document.getElementById(`form-cab-${FormName}`)?.addEventListener('click', function (e){
      refAdd.current.bandNew = false //Focus Cabecera
      document.getElementById("total_registro").textContent = refCab.current.data.length;
    });
    document.getElementById(`form-det-${FormName}`)?.addEventListener('click', function (e){
      refAdd.current.bandNew = true //Focus detalle
      let resul = refData.current.hotInstance.getSourceData()
      document.getElementById("total_registro").textContent = resul.length;
    });
    setTimeout(()=>{
      if (!sessionStorage.getItem("hash")) {
        history.push({pathname:'/login'}) 
      }else{
        inicialForm()
      }
    })
    // eslint-disable-next-line
  },[])

  Main.useHotkeys(Main.Guardar, (e) =>{
		e.preventDefault();
		buttonSaveRef.current.click();
	},{enableOnFormTags: ['input', 'select', 'textarea']});
	Main.useHotkeys('f7', (e) => {
    e.preventDefault();
	});
  const inicialForm = async (f7_delete = false, idFocus = 'DESCRIPCION')=>{
    setIndice(0);
    form.resetFields()
    var newKey 					    = Main.uuidID();
    let valor  						  = JSON.parse(JSON.stringify(objetoInicialCab));
    valor.ID							  = newKey;
    valor.COD_EMPRESA	      = cod_empresa;		
    valor.COD_USUARIO_ALTA 	= sessionStorage.cod_usuario;
    valor.FEC_ALTA				  = Main.moment().format('DD/MM/YYYY HH:mm:ss');        
    if(!f7_delete) form.setFieldsValue({...valor,MANEJA_COSTO : valor.MANEJA_COSTO === 'S' ? true : false});    
    else Main.desactivarSpinner();

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
  const guardar = async()=>{
    var permisoActualizacion = false;
    var permisoIsertar 	     = false;
    
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
    let url_get_cab_cod     = `${mainUrl.url_buscar_cod_articulo}${cod_empresa}`
    let infoCab      	      = await Main.GeneraUpdateInsertCab(refCab.current.data,'COD_ARTICULO',url_get_cab_cod,false,true);
    var aux_cab	            = infoCab.rowsAux;
    var updateInserData     = infoCab.updateInsert;
    if(!permisoActualizacion) permisoActualizacion = infoCab.actualizar;
    if(!permisoIsertar)       permisoIsertar 	     = infoCab.insertar  ;
    var delete_cab          = refCab.current.delete[0] !== undefined && refCab.current.delete?.length > 0  ? refCab.current.delete : []
   
    var dependencia_det        = [];
    var add_cab_and_det        = ['COD_EMPRESA','COD_ARTICULO'];
    let url_get_det_cod        = undefined
    var infoDet     	    	   = await Main.GeneraUpdateInsertDet(update_insert_detalle,['COD_UNIDAD_REL'],aux_cab,dependencia_det,'COD_ARTICULO',url_get_det_cod,'COD_UNIDAD_REL',undefined,add_cab_and_det);
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
      aux_updateInserData  : refCab.current.dataCan[getIndice()],
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
            refData.current.hotInstance.deselectCell();
            // eslint-disable-next-line
            mainInput.validaInput.map( item => {
              item.valor_ant = null;
            });
            refCab.current.activateCambio = false;
            refCab.current.delete    = []
            refCab.current.deleteDet = []

            let keyPamas = await getParmas(true)
            keyPamas.COD_ARTICULO = infoCab.rowsAux[getIndice()].COD_ARTICULO
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
        console.log('Error en la funcion de Guardar starticu',error)
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
    if(!refAdd.current.bandNew && index === false){
      inicialForm();
    }else{
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
          refCab.current.hotInstance.selectCell(valor.columnaRequerido.indexRow,valor.columnaRequerido.indexComun);
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

      habilitar_columna(rowIndex)

      refData.current.hotInstance.selectCell(rowIndex, 0);

      setTimeout(()=>{        
        typeEventDet(rowIndex)
      },100)
    }
  }
  const deleteRow = ()=>{
    if(!refAdd.current.bandNew){
      setTimeout(()=>{
        Main.activarSpinner()
        form.resetFields();
        refCab.current.delete[0] = refCab.current.data[getIndice()]
        inicialForm(true,'DESCRIPCION',true)
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
  // -----------------------------------------------------------------------------------------------
  const getParamsDetalle = async (idCabecera = false, indexRow = 0)=>{
    var newKey               = Main.uuidID();
    var valor                = await {...objetoInicialDet};
    valor.ID	               = newKey;
    valor.COD_EMPRESA	       = refCab.current.data[indexRow === false ? 0 : indexRow].COD_EMPRESA
    valor.COD_ARTICULO       = refCab.current.data[indexRow === false ? 0 : indexRow].COD_ARTICULO    
    valor.idCabecera         = form.getFieldsValue('ID');
    return valor;
  }
  const getDetalle = async (idCabecera, data = false,indexRow = 0,f7 = false)=>{

    let dataParams = data ? data : {COD_EMPRESA  : cod_empresa,COD_ARTICULO:form.getFieldValue('COD_ARTICULO')}
    var content = [];
    try {
      var info = await Main.Request(mainUrl.url_list_relaciones,'POST',dataParams);
    } catch (error) {
      console.log(error)
      Main.desactivarSpinner()
    }
    if(info?.data?.rows?.length === 0 || info?.data?.rows === undefined){
      let valor = await getParamsDetalle(idCabecera,indexRow)
      content   = [valor]
      setTimeout(()=>{
        habilitar_columna(0)  
      },100)      
    }else{
      content = info.data.rows;
    }
    refCab.current.dataCanDet = JSON.parse(JSON.stringify(content));
    refData.current?.hotInstance.loadData(content)
    Main.setFocusedRowIndex(0,undefined,refData,idComp);
    ver_bloqueo(f7)
  }
  const habilitar_columna = (rowIndex)=>{
    const meta = refData.current.hotInstance.getCellMetaAtRow(rowIndex);
    if(meta.length > 0){
      meta[0].readOnly = false
      meta[1].readOnly = false
      meta[2].readOnly = false
      meta[3].readOnly = false
      meta[4].readOnly = false
      meta[5].readOnly = false
      meta[6].readOnly = false  
      meta[7].readOnly = false 
      meta[8].readOnly = false  
    }  
    refData.current.hotInstance.setCellMetaObject(rowIndex, meta);
    refData.current.hotInstance.updateSettings({});
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
  const getParmas = (retornaNull = false) =>{
    var data = {
      COD_EMPRESA        : sessionStorage.getItem('cod_empresa'),
      COD_ARTICULO       : retornaNull ? '' : form.getFieldValue('COD_ARTICULO')       !== undefined ? form.getFieldValue('COD_ARTICULO')       : '',
      COD_PROVEEDOR_DFLT : retornaNull ? '' : form.getFieldValue('COD_PROVEEDOR_DFLT') !== undefined ? form.getFieldValue('COD_PROVEEDOR_DFLT') : '',
      COD_MARCA          : retornaNull ? '' : form.getFieldValue('COD_MARCA')          !== undefined ? form.getFieldValue('COD_MARCA')          : '',
      COD_LINEA          : retornaNull ? '' : form.getFieldValue('COD_LINEA')          !== undefined ? form.getFieldValue('COD_LINEA')          : '',
      COD_CATEGORIA      : retornaNull ? '' : form.getFieldValue('COD_CATEGORIA')      !== undefined ? form.getFieldValue('COD_CATEGORIA')      : '',
      COD_RUBRO          : retornaNull ? '' : form.getFieldValue('COD_RUBRO')          !== undefined ? form.getFieldValue('COD_RUBRO')          : '',
      COD_GRUPO          : retornaNull ? '' : form.getFieldValue('COD_GRUPO')          !== undefined ? form.getFieldValue('COD_GRUPO')          : '',
      COD_IVA            : retornaNull ? '' : form.getFieldValue('COD_IVA')            !== undefined ? form.getFieldValue('COD_IVA')            : '',
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
    } catch (error) {
      console.error(error)
    }
  }
  const postQueryCab = async(info,buttonF8 = false,indice) => {
    if(info){      
      let data = {   COD_EMPRESA    : info?.COD_EMPRESA    ? info?.COD_EMPRESA    : ''
                   , COD_PROVEEDOR_DFLT  : info?.COD_PROVEEDOR_DFLT  ? info?.COD_PROVEEDOR_DFLT  : ''
                   , COD_RUBRO      : info?.COD_RUBRO      ? info?.COD_RUBRO      : ''
                   , COD_MARCA      : info?.COD_MARCA      ? info?.COD_MARCA      : ''
                   , COD_LINEA      : info?.COD_LINEA      ? info?.COD_LINEA      : ''
                   , COD_CATEGORIA  : info?.COD_CATEGORIA  ? info?.COD_CATEGORIA  : ''
                   , COD_GRUPO      : info?.COD_GRUPO      ? info?.COD_GRUPO      : ''
                   , COD_IVA        : info?.COD_IVA        ? info?.COD_IVA        : ''
                }
      try {
        await Main.Request(mainUrl.url_postQueryCab, "POST", data).then(async(resp) => {
          if(resp.data){
            ver_bloqueo()
            refCab.current.data[indice] = {...refCab.current.data[indice], ...resp.data}
            refCab.current.dataCan[indice] = JSON.parse(JSON.stringify(refCab.current.data[indice]));
            loadForm(refCab.current.data,indice);            
            if(buttonF8) document.getElementById('DESCRIPCION').focus() 
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
      MANEJA_COSTO : value.MANEJA_COSTO === 'S' ? true : false    
    });
    Main.desactivarSpinner()
    getDetalle(false, { COD_EMPRESA  : value.COD_EMPRESA
                      , COD_ARTICULO : value.COD_ARTICULO},indice); 
  } 
  const funcionCancelar = () => {
    form.resetFields();    
    Main.setCambiosPendiente(idComp,false)
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
        document.getElementById('DESCRIPCION').focus();  
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
      manejaF7('DESCRIPCION')
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
  const onKeyDown = async (e)=>{
    if (['Enter', 'Tab'].includes(e.key)) {
      e.preventDefault()
      switch (e.target.id) {
        case "COD_ARTICULO":
            document.getElementById('DESCRIPCION').focus();
          break;
        case "DESCRIPCION":
          document.getElementById('COD_PROVEEDOR_DFLT').focus();
        break;
        case "MANEJA_COSTO":
          setTimeout(()=>{
            refData?.current?.hotInstance?.selectCell(0,0);
          },1)
        break;
        default:
          break;
      }
      if (['COD_PROVEEDOR_DFLT','COD_MARCA','COD_RUBRO','COD_GRUPO','COD_IVA','COD_LINEA','COD_CATEGORIA'].includes(e.target.id)) {
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
      ['COD_PROVEEDOR_DFLT','COD_MARCA','COD_RUBRO','COD_GRUPO','COD_IVA','COD_LINEA','COD_CATEGORIA'].includes(e.target.id)) {
        e.preventDefault()
      let aux = '';

      refModal.current.idInput = e.target.id
      let items = mainInput.ModalF9[e.target.id]
    
      refModal.current.ModalTitle   = items.title;
      refModal.current.modalColumn  = items.column;
      refModal.current.url_buscador = items.url;
      
      Main.activarSpinner()
      switch (e.target.id) {
        case "COD_PROVEEDOR_DFLT":
          aux = await getData({ valor: 'null',cod_empresa }, mainUrl.url_buscar_proveedor);
          refModal.current.data = aux
          refModal.current.dataParams = { cod_empresa }
          break;      
        case "COD_MARCA":
          aux = await getData({ valor: 'null',cod_empresa }, mainUrl.url_buscar_marca);
          refModal.current.data = aux
          refModal.current.dataParams = { cod_empresa }
          break;
        case "COD_LINEA":
          aux = await getData({ valor: 'null',cod_empresa,cod_marca:form.getFieldValue('COD_MARCA')}, mainUrl.url_buscar_linea);
          refModal.current.data = aux
          refModal.current.dataParams = { cod_empresa,cod_marca:form.getFieldValue('COD_MARCA') }
          break;
        case "COD_CATEGORIA":
        aux = await getData({ valor: 'null',cod_empresa,cod_linea:form.getFieldValue('COD_LINEA')}, mainUrl.url_buscar_segmento);
        refModal.current.data = aux
        refModal.current.dataParams = { cod_empresa,cod_linea:form.getFieldValue('COD_LINEA') }
        break;
        case "COD_RUBRO":
          aux = await getData({ valor: 'null',cod_empresa }, mainUrl.url_buscar_rubro);
          refModal.current.data = aux
          refModal.current.dataParams = { cod_empresa }
          break;
        case "COD_GRUPO":
          aux = await getData({ valor: 'null',cod_empresa }, mainUrl.url_buscar_grupo);
          refModal.current.data = aux
          refModal.current.dataParams = { cod_empresa }
          break;
        case "COD_IVA":
          aux = await getData({ valor: 'null',cod_empresa }, mainUrl.url_buscar_iva);
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
  const handleCheckbox = (e,options)=>{
    let rowValue = {target:{'id':e.target.id,'value': form.getFieldValue(e.target.id) === true ? options[0] : options[1]}}
    handleInputChange(rowValue)
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

          // if (['LIMITE_CREDITO'].includes(x)) {
          //   value = Main.numerico(fieldValue);
          // } else {
            value = fieldValue;
          // }          
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
  const setLastFocusNext = React.useCallback((e,row,rowCount,rowindex)=>{
    if(e.keyCode === 13){
      setTimeout(()=>{
        addRow({index:rowindex})
      },2)
    }
    // eslint-disable-next-line
  },[]);
  const setfocusRowIndex = React.useCallback((valor,row,col)=>{
    refAdd.current.bandNew = true;
    let resul = refData.current.hotInstance.getSourceData()
    document.getElementById("total_registro").textContent = resul.length;
    // eslint-disable-next-line 
  },[]);
  const setUpdateEdit = React.useCallback(async(valor)=>{
    let row = refData.current.hotInstance.getSourceData()
    if(row.length > 1){
      row[0].KG_PESO_NETO = row[0].KG_PESO_NETO !== null && 
                            row[0].KG_PESO_NETO !== ""   && 
                            row[0].KG_PESO_NETO !== undefined 
                         ?  row[0].KG_PESO_NETO : 0
      let rowValue    = Main.g_getRowFocus(idComp)[0];
      if(Main._.isNumber(row[0].KG_PESO_NETO) && rowValue.rowIndex > 0){
        let resulMul = await (valor[0][3] * row[0].KG_PESO_NETO).toFixed(3)
        let resul    = await parseFloat(resulMul)
        refData.current.hotInstance.view.settings.data[rowValue.rowIndex].KG_PESO_NETO = resul;
        refData.current.__hotInstance.updateSettings({      
          cellRow:rowValue.rowIndex,
        },);
      }else if(valor[0][1] === 'KG_PESO_NETO' && rowValue.rowIndex === 0){
        for (let index = 1; index < row.length; index++) {
          let resulMul = await (row[index].MULT * row[0].KG_PESO_NETO).toFixed(3)
          let resul    = await parseFloat(resulMul)
          refData.current.hotInstance.view.settings.data[index].KG_PESO_NETO = resul;
          typeEventDet(index)
          refData.current.__hotInstance.updateSettings({      
            cellRow:index,
          },);
        }
      }

      
    }
    // eslint-disable-next-line 
  },[]);
  
  // ----------------------------- BLOQUEO INPUT --------------------------------------------------- 
  const ver_bloqueo = (f7 = false)=>{
    f7 = form.getFieldValue('COD_ARTICULO') ? f7 : true
    setTimeout(()=>{
      bloqueoArticulo.current.input.readOnly = !f7;
    },50)
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
              NavigateArrow={NavigateArrow}            
            />
          
             <STARTICU
               form={form}
               idComp={idComp}
               FormName={FormName}
               refGrid={refData}
               dataRef={refCab}
               handleInputChange={handleInputChange}
               handleKeyDown={onKeyDown}
               handleKeyUp={handleKeyUp}
               bloqueoArticulo={bloqueoArticulo}
               handleCheckbox={handleCheckbox}
               setLastFocusNext={setLastFocusNext}
               setfocusRowIndex={setfocusRowIndex}
               setUpdateEdit={setUpdateEdit}

             />

          </Main.Paper>
        </Main.AntLayout>        
      </Main.Spin>
    </>
  );
});

export default MainST;