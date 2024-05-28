import React, { memo } from 'react';
import Main            from '../../../../../componente/util/main';
import VTPRESAR        from './view';
import './VTPRESAR.css'
import {ObjetoInicial,
     ObjetoInicialDet} from './ObjetoInicial/mainInicial'
import mainInput       from './validaInput/mainInputValida';
import mainUrl         from './url/mainUrl';
import mainColumn      from './columnModal/mainColumn';
import mainReport      from './Reporte/mainReport';

const FormName   = 'VTPRESAR';
const TituloList = "Presupuesto";
const idComp     = `GRID_${FormName}`
let data_len     = 100
var mitad_data   = data_len / 2;

const MainVT = memo(() => {

  const [form]              = Main.Form.useForm();
  const cod_empresa         = sessionStorage.cod_empresa;
  const defaultOpenKeys     = Main.DireccionMenu(FormName);
  const defaultSelectedKeys = Main.Menu(FormName);
  //  UseRef
  const buttonSaveRef       = React.useRef();
  const refGrid             = React.useRef()
  const banRef              = React.useRef({indice:0,bandNew:false, id_cabecera:'',refFec_comp:''
                                           ,b_bloqueo:false,b_bloqueo_aux:false})
  const refCab              = React.useRef({ data: [{}], dataCan:[]   , delete:[]   , activateCambio:false
                                          , dataCanDet:[], deleteDet:[] });
  // USESTATE
  const [ shows        , setShows         ] = React.useState(false);         
  // MODAL F9
  const refModalData        = React.useRef();
  const refModal            = React.useRef({  modalColumn : []
                                            , data        : []
                                            , ModalTitle  : ''
                                            , idInput     : ''
                                            , dataParams  : ''
                                            , url_buscador: ''
                                            });
  Main.useHotkeys(Main.Guardar, (e) =>{
    e.preventDefault();
    buttonSaveRef.current.click();
  },{enableOnFormTags: ['input', 'select', 'textarea']});
  Main.useHotkeys('f7', (e) => {
    e.preventDefault();
  });
  
  React.useEffect(()=>{
    inicalRow(false,'COD_VENDEDOR')
    // eslint-disable-next-line 
  },[])
  let idGrid = {
    grid:{
      [idComp] : refGrid
    },
    columna:{
      [idComp] : mainColumn.columnDet
    }
  }
  const inicalRow = (f7_delete = false, idFocus = 'NRO_COMPROBANTE')=>{
    let valor   = {...ObjetoInicial}
    form.resetFields();
    let newKey = Main.uuidID()
    valor.ID                = newKey;
    valor.COD_EMPRESA       = sessionStorage.cod_empresa;
    valor.COD_SUCURSAL      = sessionStorage.cod_sucursal;
    let date                = Main.moment().format('DD/MM/YYYY').toString();
    valor.FEC_COMPROBANTE   = Main.dayjs(date,'DD/MM/YYYY');
    if(!f7_delete) form.setFieldsValue(valor);
    else Main.desactivarSpinner();
    valor.FEC_COMPROBANTE   = Main.moment(valor.FEC_COMPROBANTE).format('DD/MM/YYYY');
    refCab.current.data     = [valor]
    refCab.current.dataCan  = JSON.parse(JSON.stringify([valor]));
    if(!f7_delete)getDetalle(valor.ID,false,0,false,f7_delete = false);
    else refGrid.current?.hotInstance.loadData([])
    setTimeout( ()=> {				
      document.getElementById(idFocus).select();
		},20);
    document.getElementById("indice").textContent         = "1"
		document.getElementById("total_registro").textContent = "?";
		document.getElementById("mensaje").textContent 				= "";
  }
  const getParamsDetalle = async (idCabecera = false, indexRow = 0)=>{
    var valor             = await {...ObjetoInicialDet};
    valor.idCabecera      = idCabecera ? idCabecera : form.getFieldValue('ID');
    valor.ID	            = Main.uuidID();
    valor.COD_EMPRESA	    = refCab.current.data[indexRow].COD_EMPRESA    ;
    valor.COD_SUCURSAL    = refCab.current.data[indexRow].COD_SUCURSAL   ;
    valor.COD_PROVEEDOR   = refCab.current.data[indexRow].COD_PROVEEDOR  ;
    valor.NRO_COMPROBANTE = refCab.current.data[indexRow].NRO_COMPROBANTE;
    valor.TIP_COMPROBANTE = refCab.current.data[indexRow].TIP_COMPROBANTE;
    valor.SER_COMPROBANTE = refCab.current.data[indexRow].SER_COMPROBANTE;
    return valor;
  }
  const getDetalle = async (idCabecera, data = false,indexRow = 0,guardar = false,f7 = false)=>{
    let dataParams = data ? data : await getParamsDetalle(idCabecera,indexRow);
    var content = [];
    try {
      var info = await Main.Request(mainUrl.url_list_det,'POST',dataParams);
      if(info?.data?.rows?.length === 0 || info?.data?.rows === undefined) content = [{...dataParams}];
      else content = JSON.parse(JSON.stringify(info.data.rows))
    
      refCab.current.dataCanDet = JSON.parse(JSON.stringify(content));
      refGrid.current?.hotInstance.loadData(content);

      setTimeout(()=>{                
        ver_bloqueo(f7);
        setTimeout(()=>Main.setFocusedRowIndex(0,undefined,refGrid,idComp),10);
        if(guardar)refGrid.current.hotInstance.selectCell(0,0);
      },15);
    } catch (error) {
      console.error(error);
    }
  }
  const addRow = async(index = false)=>{
    if(!banRef.current.bandNew && index === false){
      inicalRow(false,'COD_VENDEDOR');
    }else if(!banRef.current.b_bloqueo_aux){
      let row = refCab.current.data[banRef.current.indice]
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
          refGrid.current.hotInstance.selectCell(valor.columnaRequerido.indexRow,valor.columnaRequerido.indexComun);
        },5)
        return
      }
      Main.modifico(FormName)
      let rowValue    = Main.g_getRowFocus(idComp);
      let rowIndex    = index !== false ? index.index + 1 : rowValue[0].rowIndex === 0 ? rowValue[0].rowIndex + 1  : rowValue[0].rowIndex === -1 ? 0 : rowValue[0].rowIndex;
      let newRow      = await getParamsDetalle(false,banRef.current.indice);

      refGrid.current.hotInstance.alter('insert_row', rowIndex);
      refGrid.current.hotInstance.view.settings.data[rowIndex] =  JSON.parse(JSON.stringify({...newRow}));

      refGrid.current.hotInstance.updateSettings({      
        cellRow:rowIndex,
      });  
      refGrid.current.hotInstance.selectCell(rowIndex, 0);
      setTimeout(()=>{        
        typeEventDet(rowIndex)
      },100)
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
       // eslint-disable-next-line
      refCab.current.data.filter( item =>{
        if(item.inserted || item.updated){
          if(item.inserted) exitInsertedBand = true
          if(item.FEC_COMPROBANTE === ""){
            p_mensaje = `El campo FEC_COMPROBANTE es requerido`;            
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
          [idComp] : mainColumn.columnDet
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
    var dependencia_cab     = [];
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
    var dependencia_det        = [];
    var add_cab_and_det        = ['COD_DEPOSITO','COD_MONEDA','DECIMALES','NRO_COMPROBANTE','COD_LISTA_PRECIO','COD_SUCURSAL'];
    let url_get_det_cod        = `${mainUrl.url_buscar_nro_orden}${cod_empresa}/${rowCab.SER_COMPROBANTE}/${rowCab.TIP_COMPROBANTE}/${keyCabecera}`
    var infoDet     	    	   = await Main.GeneraUpdateInsertDet(update_insert_detalle,['ORDEN'],aux_cab,dependencia_det,'NRO_COMPROBANTE',url_get_det_cod,'ORDEN','ASC',add_cab_and_det);
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
            
              
            refCab.current.activateCambio = false;
            refCab.current.delete         = []
            refCab.current.deleteDet      = []
            
            refCab.current.data        = infoCab.rowsAux
            refCab.current.dataCan     = JSON.parse(JSON.stringify(refCab.current.data));

            if(refCab.current.delete.length > 0){
              setTimeout(()=>inicalRow()); 
            }else{
              loadForm(infoCab.rowsAux,banRef.current.indice,refCab.current.delete.length === 0 ? false : true );
            } 
            setTimeout(()=>document.getElementById('NRO_COMPROBANTE').focus())
            
          }else{
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
  const deleteRow = ()=>{
    if(!banRef.current.bandNew){
      if(!banRef.current.b_bloqueo_aux){
        setTimeout(()=>{
          Main.activarSpinner()
          form.resetFields();
          refCab.current.delete[0] = refCab.current.data[banRef.current.indice]
          inicalRow(true);
          Main.modifico(FormName)
        },10)
      }      
    }else if(!banRef.current.b_bloqueo_aux){
      Main.activarSpinner();
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
     Main.setBuscar(FormName,false);
    if(refCab.current.data[indice].insertDefault || refCab.current.data[indice].inserted){
      inicalRow()
    }else{
      refCab.current.data    = JSON.parse(JSON.stringify(refCab.current.dataCan));
      refCab.current.dataCan = JSON.parse(JSON.stringify(refCab.current.data))   ;
      loadForm(refCab.current.data,indice) 
      setTimeout(()=>{
        document.getElementById('NRO_COMPROBANTE').focus();  
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
      TOT_COMPROBANTE : Main.currency(value.TOT_COMPROBANTE, { separator:'.',decimal:',',precision:value.DECIMALES ? value.DECIMALES : 0 ,symbol:''}).format()
    });
    Main.desactivarSpinner();
    nextValida({input:'COD_MONEDA'},guardar);
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
              await Main.Request(mainUrl.url_list_cab,'POST',params)
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
  const getParmas = (retornaNull = false,indice = 0) =>{
    var data = {
      COD_EMPRESA           : sessionStorage.getItem('cod_empresa'),
      COD_SUCURSAL          : retornaNull ? '' : form.getFieldValue('COD_SUCURSAL')             !== undefined ? form.getFieldValue('COD_SUCURSAL')              : '',
      TIP_COMPROBANTE       : retornaNull ? '' : refCab.current.data[indice]['TIP_COMPROBANTE'] !== undefined ? refCab.current.data[indice]['TIP_COMPROBANTE']  : '',
      SER_COMPROBANTE       : retornaNull ? '' : refCab.current.data[indice]['SER_COMPROBANTE'] !== undefined ? refCab.current.data[indice]['SER_COMPROBANTE']  : '',
      NRO_COMPROBANTE       : retornaNull ? '' : form.getFieldValue('NRO_COMPROBANTE')          !== undefined ? form.getFieldValue('NRO_COMPROBANTE')           : '',
      FEC_COMPROBANTE       : retornaNull ? '' : banRef.current.refFec_comp                     !== ''        ? banRef.current.refFec_comp                      : '',
      COD_CONDICION_VENTA   : retornaNull ? '' : form.getFieldValue('COD_CONDICION_VENTA')      !== undefined ? form.getFieldValue('COD_CONDICION_VENTA')       : '',
      COD_VENDEDOR          : retornaNull ? '' : form.getFieldValue('COD_VENDEDOR')             !== undefined ? form.getFieldValue('COD_VENDEDOR')              : '',
      COD_CLIENTE           : retornaNull ? '' : form.getFieldValue('COD_CLIENTE')              !== undefined ? form.getFieldValue('COD_CLIENTE')               : '',
      COD_MONEDA            : retornaNull ? '' : form.getFieldValue('COD_MONEDA')               !== undefined ? form.getFieldValue('COD_MONEDA')                : '',
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
      Main.Request(mainUrl.url_list_cab, "POST", params).then((resp) => {
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
  const manejaF7 = (idFocus)=>{
    Main.activarSpinner()
    form.resetFields(); 
    banRef.current.b_bloqueo = false;
    banRef.current.indice = 0;
    refCab.current.activateCambio = false    
    refGrid.current?.hotInstance.loadData([]) 
    banRef.current.refFec_comp    = '';
    setTimeout(()=>{    
      if(!Main.getViewBuscar(FormName))Main.setBuscar(FormName,true);
      Main.desactivarSpinner()      
      inicalRow(true,idFocus);      
      ver_bloqueo(true)
    })
  }
  const onkeyDown = async (e)=>{
    if(banRef.current.b_bloqueo) e.preventDefault();
    if(e.target.id === 'FEC_COMPROBANTE') banRef.current.refFec_comp   = e.target.value;
    if (['Enter', 'Tab'].includes(e.key)) {
      // let indice = banRef.current.indice;
      e.preventDefault()
      switch (e.target.id) {
        case "NRO_COMPROBANTE":
          document.getElementById('FEC_COMPROBANTE').focus();
          break;
        case "FEC_COMPROBANTE":
          setTimeout(()=>{
            document.getElementsByClassName('ant-picker-dropdown')[0].style.visibility = 'collapse'
          })
          document.getElementById('COD_VENDEDOR').focus();
        break;
        default:
          break;
      }
      if (['COD_VENDEDOR','COD_CONDICION_VENTA','COD_CLIENTE','COD_MONEDA','COD_LISTA_PRECIO'].includes(e.target.id) && !banRef.current.b_bloqueo) {
       ValidarUnico(e.target.id, e.target.value);
      }
    }else if (['F7', 'F8'].includes(e.key)) {
      e.preventDefault();
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
    }else if (e.key === 'F9' && ['COD_VENDEDOR','COD_CONDICION_VENTA','COD_CLIENTE','COD_MONEDA','COD_LISTA_PRECIO'].includes(e.target.id) && !banRef.current.b_bloqueo) {
      e.preventDefault()
      let aux = [];
      refModal.current.idInput = e.target.id
      let items = mainInput.ModalF9[e.target.id]

      refModal.current.ModalTitle   = items.title;
      refModal.current.modalColumn  = items.column;
      refModal.current.url_buscador = items.url;
      Main.activarSpinner()
      switch (e.target.id) {
        case "COD_VENDEDOR":
          aux = await Main.getData({ valor: 'null',cod_empresa },refModal.current.url_buscador);
          refModal.current.data = aux ? aux : []
          refModal.current.dataParams = { cod_empresa }
        break;
        case "COD_CONDICION_VENTA":
          aux = await Main.getData({valor:'null',cod_empresa },  refModal.current.url_buscador);
          refModal.current.data = aux ? aux : []
          refModal.current.dataParams = { cod_empresa }
        break;    
        case "COD_CLIENTE":
          aux = await Main.getData({valor:'null',cod_empresa },  refModal.current.url_buscador);
          refModal.current.data = aux ? aux : []
          refModal.current.dataParams = { cod_empresa }
        break;        
        case "COD_MONEDA":
          aux = await Main.getData({valor:'null',cod_empresa },  refModal.current.url_buscador);
          refModal.current.data = aux ? aux : []
          refModal.current.dataParams = { cod_empresa }
        break;
        case "COD_LISTA_PRECIO":
          aux = await Main.getData({valor:'null',cod_empresa },  refModal.current.url_buscador);
          refModal.current.data = aux ? aux : []
          refModal.current.dataParams = { cod_empresa }
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
  const handleInputChange = (e) => {
    Main.modifico(FormName)
    try {
      if(e.target.id === 'OBSERVACION') e.target.value = e.target.value.trim()
      refCab.current.data[banRef.current.indice][e?.target?.id ? e?.target?.id : e.target.name ] = e?.target?.value;  
    } catch (error) {
      console.log(error)
    }
    typeEvent()
  }
  const typeEvent = (activateCancelar)=>{
    let indice = banRef.current.indice;
    if(refCab.current.data[indice]['insertDefault']){
      refCab.current.data[indice].insertDefault    = false;
      refCab.current.data[indice].inserted 		     = true;
      refCab.current.data[indice].COD_USUARIO	     = sessionStorage.getItem('cod_usuario');
    }
    if(!refCab.current.data[indice]['updated'] && refCab.current.data[indice]['inserted'] !== true){
      refCab.current.data[indice]['updated']           = true;
      refCab.current.data[indice].COD_USUARIO_MODIFIC	 = sessionStorage.cod_usuario;
      refCab.current.data[indice].FEC_ESTADO           =  Main.moment().format('DD/MM/YYYY').toString();
      refCab.current.activateCambio = true;
    }
    if(activateCancelar)Main.modifico(FormName);
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
  const nextValida = (value,focus = true)=>{
    if(value.input === 'COD_LISTA_PRECIO'){
      let valor = refCab.current.data[banRef.current.indice];  
      setTimeout(()=>{
        const currentColumnSettings = refGrid.current.hotInstance.getSettings().columns;
        currentColumnSettings[4] = {
          ...currentColumnSettings[4],
          type: 'numeric',
          numericForma1t: {pattern: `0,0.${'0'.repeat(valor.DECIMALES)}`},
        };
        currentColumnSettings[5] = {
          ...currentColumnSettings[5],
          type: 'numeric',
          numericFormat: {pattern: `0,0.${'0'.repeat(valor.DECIMALES)}`},
        };
        currentColumnSettings[6] = {
          ...currentColumnSettings[6],
          type: 'numeric',
          numericFormat: {pattern: `0,0.${'0'.repeat(valor.DECIMALES)}`},
        };
        refGrid.current.hotInstance.updateSettings({columns: currentColumnSettings})
        Main.setFocusedRowIndex(0,undefined,refGrid,idComp);
        if(focus)refGrid?.current?.hotInstance?.selectCell(0,0);
      },10)
    }
  }
  const ValidarUnico = async (input, value) => {
    let intOutDate = []
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
                  [x]: x === 'ES_FISICA' ? resp.data.outBinds[x] === 'S' ? true : false : resp.data.outBinds[x]
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
  //************************* MODAL F9 ******************************/ 
  const ver_bloqueo= async(f7 = false) =>{
    let p_bloqueo_aux = form.getFieldValue('ESTADO') !== 'P' ? true : false;
    let p_bloqueo     = form.getFieldValue('NRO_COMPROBANTE') === '' || form.getFieldValue('NRO_COMPROBANTE') === undefined ? false : true;
    let input         = document.getElementsByClassName(`${FormName}_BLOQUEO`);

    for (let i = 0; i < input.length; i++) {
      const element = input[i];
      element.readOnly = p_bloqueo;
    }

    banRef.current.b_bloqueo     = p_bloqueo;
    banRef.current.b_bloqueo_aux = p_bloqueo_aux;
    document.getElementsByClassName(`${FormName}_BLOQUEO_NRO_COMP`)[0].readOnly = !f7
    Main.setBloqueoFecha(`${FormName}_FEC_COMPROBANTE`,p_bloqueo);

    setTimeout(()=>{
      habilitar_columna()
    },1);
  }
  const habilitar_columna = (vbloqueo = false)=>{
    vbloqueo = form.getFieldValue('ESTADO') !== 'P' ? true : false;
    
    let row = refGrid?.current ? refGrid?.current?.hotInstance?.getSourceData() : []; 
    if(row.length > 0){
      for (let i = 0; i < row.length; i++) {
        const meta = refGrid?.current?.hotInstance?.getCellMetaAtRow(i);
        meta[0].readOnly   = vbloqueo;
        meta[1].readOnly   = true;
        meta[2].readOnly   = vbloqueo;
        meta[3].readOnly   = true;
        meta[4].readOnly   = vbloqueo;
        meta[5].readOnly   = vbloqueo;
        meta[6].readOnly   = vbloqueo;
        meta[7].readOnly   = true;
        
        refGrid.current.hotInstance.setCellMetaObject(i, meta);
      }
      refGrid?.current?.hotInstance?.updateSettings({});
    }
  }
  const eventoClick = async (data) => {
    let indice = banRef.current.indice;
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
  const validaDetalle = React.useCallback(async(row,name,enter)=>{
    let p_decimales  = refCab.current.data[banRef.current.indice].DECIMALES ? refCab.current.data[banRef.current.indice].DECIMALES : 0;
    let p_cantidad   = '';
    let p_valorDescuento = row.DESCUENTO 

    // VALIDACIO CANTIDAD
    if(typeof row.CANTIDAD === 'string'){
      if(row.CANTIDAD.startsWith("-")){
        p_cantidad = Number(row.CANTIDAD_ANT);
        row.CANTIDAD = p_cantidad
      }else p_cantidad = row.CANTIDAD ? Main.numerico_grilla(row.CANTIDAD,p_decimales) : 0;
    }else{
      p_cantidad = row.CANTIDAD ? Main.numerico_grilla(row.CANTIDAD,p_decimales) : 0;
    }
    if(typeof row.DESCUENTO === 'string'){
      if(row.DESCUENTO.startsWith("-")){
        p_valorDescuento = Number(row.DESCUENTO_ANT);
        row.DESCUENTO = p_valorDescuento
      }else p_valorDescuento = row.DESCUENTO !== "0" && row.DESCUENTO ? Main.numerico_grilla(row.DESCUENTO) : 0;
    }else{
      p_valorDescuento = row.DESCUENTO !== "0" && row.DESCUENTO ? Main.numerico_grilla(row.DESCUENTO) : 0;
    }
    if( name === 'PRECIO_UNITARIO_C_IVA' ){
      if(typeof row.PRECIO_UNITARIO_C_IVA === 'string'){
        if(row.PRECIO_UNITARIO_C_IVA.startsWith("-")){
          refGrid.current.hotInstance.view.settings.data[row.rowIndex].PRECIO_UNITARIO_C_IVA = Number(row.PRECIO_UNITARIO_C_IVA_ANT);        
        }else refGrid.current.hotInstance.view.settings.data[row.rowIndex].PRECIO_UNITARIO_C_IVA = row.PRECIO_UNITARIO_C_IVA !== "0" && row.PRECIO_UNITARIO_C_IVA ? Main.numerico_grilla(row.PRECIO_UNITARIO_C_IVA) : 0;
      }else{
        refGrid.current.hotInstance.view.settings.data[row.rowIndex].PRECIO_UNITARIO_C_IVA = row.PRECIO_UNITARIO_C_IVA !== "0" && row.PRECIO_UNITARIO_C_IVA ? Main.numerico_grilla(row.PRECIO_UNITARIO_C_IVA) : 0;
      }
    }
    

    let p_precio_unitario_c_iva   = refGrid.current.hotInstance.view.settings.data[row.rowIndex].PRECIO_UNITARIO_C_IVA; 
    row.PRECIO_UNITARIO_C_IVA = p_precio_unitario_c_iva;
    refGrid.current.hotInstance.view.settings.data[row.rowIndex].PRECIO_UNITARIO_C_IVA = p_precio_unitario_c_iva;
    refGrid.current.hotInstance.view.settings.data[row.rowIndex].CANTIDAD_UB  = (p_cantidad * Main.nvl(row.MULT,1)) / Main.nvl(row.DIV,1);

    // let total      = ( p_cantidad * Main.nvl( p_precio_unitario_c_iva , 0 )) 
    let total      =  Main.round( ( Main.nvl( p_cantidad,0)  * 
                                    Main.nvl( p_precio_unitario_c_iva,0 )) , p_decimales  )
    let porcentaje = (p_valorDescuento / total) * 100 ;
    refGrid.current.hotInstance.view.settings.data[row.rowIndex].PORC_DESC  = porcentaje;
    total          = (total - p_valorDescuento)

    refGrid.current.hotInstance.setDataAtCell(row.rowIndex, 7, total);
    if(enter === 13 ){
      let rowColumn = name === 'DESCUENTO' ? 6 : name === 'PRECIO_UNITARIO_C_IVA' ? 5 : 4
      setTimeout(()=>{    
        refGrid.current.hotInstance.selectCell(row.rowIndex,rowColumn);
      },10)  
      refGrid.current.hotInstance.setDataAtCell(row.rowIndex,rowColumn,row[name]);
    }
    typeEventDet(row.rowIndex)
    setTimeout(()=>calculaTotal(refGrid.current.hotInstance.view.settings.data),10)
    // eslint-disable-next-line
  },[])
  const nextValidaInput = React.useCallback((name,value)=>{
    setTimeout(()=>{
      if(name === 'COD_ARTICULO') validaDetalle(value,name);
      calculaTotal()
    },100)    
    // eslint-disable-next-line
  },[])
  const calculaTotal = (data = false,activateCancelar = true)=>{
    if(refGrid.current){
      let resul        = data === false ? refGrid.current.hotInstance.getSourceData() : data;
      const columnSum  = resul.reduce((acc, row) => acc + parseFloat(row.MONTO_TOTAL || 0), 0);
      let p_decimales  = refCab.current.data[banRef.current.indice].DECIMALES ? refCab.current.data[banRef.current.indice].DECIMALES : 0;

      form.setFieldsValue({
        ...form.getFieldsValue(), 
        TOT_COMPROBANTE : p_decimales === 0 || p_decimales === "0" ? columnSum : Main.currency(columnSum, { separator:'.',decimal:',',precision:p_decimales,symbol:''}).format(),
      });    
      refCab.current.data[banRef.current.indice].TOT_COMPROBANTE = columnSum;
      typeEvent(activateCancelar)
    }
  }
  const setfocusRowIndex = React.useCallback((valor,row,col)=>{
    banRef.current.bandNew = true;
    let resul       = refGrid.current.hotInstance.getSourceData();
    document.getElementById("total_registro").textContent = resul.length;
    setTimeout(()=>{
      setClickCell();
    },10)
    // eslint-disable-next-line 
  },[]);
  const setClickCell  = React.useCallback((id = 'DET')=>{
    if(id === "CAB"){
      banRef.current.bandNew = false;
      document.getElementById("total_registro").textContent = "?";
      document.getElementById("mensaje").textContent 				=  "";   
    }else{
      banRef.current.bandNew = true;
    }
    calculaTotal(false,false)
    // eslint-disable-next-line
  },[])
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
  const reporte = async ()=>{
    let params = {  P_COD_EMPRESA     : form.getFieldValue('COD_EMPRESA'),
                    P_NRO_COMPROBANTE : form.getFieldValue('NRO_COMPROBANTE'),
                    P_SER_COMPROBANTE : form.getFieldValue('SER_COMPROBANTE'),
                    P_TIP_COMPROBANTE : form.getFieldValue('TIP_COMPROBANTE'),
                }
    try {
      Main.activarSpinner()
      Main.Request(mainUrl.url_reporte,'POST',params).then((resp)=>{
        Main.desactivarSpinner()
        if(resp.data.rows.length > 0){
          buildReporte(resp.data.rows);
        }else{
          Main.message.warning({
            content  : 'No se encontro resultado!!',
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
  const buildReporte = (data = [])=>{
    Main.activarSpinner()
    let row_cab     = {}
    let rows_body   = [];
    let empresa     = Main._.uniq( data, (item) => {return item.COD_EMPRESA});
    let cantidadMinima = 20; 

    for (let a = 0; a < empresa.length; a++) {
      const items_empresa = data[a];
      let storeEmpresa    = data.filter( item => item.COD_EMPRESA === items_empresa.COD_EMPRESA );        
      row_cab = {
        DIRECCION_EMPRESA    : items_empresa.DIRECCION_EMPRESA    ? items_empresa.DIRECCION_EMPRESA   : '',
        RUC_EMPRESA          : items_empresa.RUC_EMPRESA          ? items_empresa.RUC_EMPRESA         : '',
        TELEFONO_EMPRESA     : items_empresa.TELEFONO_EMPRESA     ? items_empresa.TELEFONO_EMPRESA    : '',
        NRO_COMPROBANTE      : items_empresa.NRO_COMPROBANTE      ? `${items_empresa.NRO_COMPROBANTE}`: '',
        ASESOR               : items_empresa.ASESOR               ? items_empresa.ASESOR              : '',
        // 
        FEC_COMPROBANTE      : items_empresa.FEC_COMPROBANTE      ? items_empresa.FEC_COMPROBANTE     : '',
        DESC_CLIENTE         : items_empresa.DESC_CLIENTE         ? items_empresa.DESC_CLIENTE        : '',
        CLIENTE              : items_empresa.CLIENTE              ? items_empresa.CLIENTE             : '',
        DIRECCION            : items_empresa.DIRECCION            ? items_empresa.DIRECCION           : '',
        RUC                  : items_empresa.RUC                  ? `${items_empresa.RUC}`            : '',
        TELEFONO             : items_empresa.TELEFONO             ? items_empresa.TELEFONO            : '',
        DESC_CONDICION_VENTA : items_empresa.DESC_CONDICION_VENTA ? items_empresa.DESC_CONDICION_VENTA: '',
        DESC_PDF             : form.getFieldValue('OBSERVACION_PDF') ? form.getFieldValue('OBSERVACION_PDF') : ''
      }
    
      storeEmpresa  = data.filter( item => item.ORDEN !== null );
      storeEmpresa.sort((a,b) => { return a.ORDEN - b.ORDEN});

      // eslint-disable-next-line
      storeEmpresa.map((items)=>{
        rows_body = [...rows_body, {
          COD_ARTICULO          : items.COD_ARTICULO,
          DESC_ARTICULO         : items.DESC_ARTICULO,
          CANTIDAD              : Main.currency(items.CANTIDAD             , { separator:'.',decimal:',',precision:0 ,symbol:''}).format(),
          PRECIO_UNITARIO_C_IVA : Main.currency(items.PRECIO_UNITARIO_C_IVA, { separator:'.',decimal:',',precision:items.DECIMALES ,symbol:''}).format(),
          DESCUENTO             : `${Main.currency(items.PORC_DESC         , { separator:'.',decimal:',',precision:0 ,symbol:''}).format()}%`,
          MONTO_TOTAL           : Main.currency(items.MONTO_TOTAL          , { separator:'.',decimal:',',precision:items.DECIMALES ,symbol:''}).format(),
        }]
      })

      if(rows_body.length < cantidadMinima ){
        cantidadMinima = cantidadMinima - rows_body.length
        for (let i = 0; i < cantidadMinima; i++) {
          rows_body = [...rows_body, {
            COD_ARTICULO : '',
            deleteLinea  : true
          }]
        }
      }

      rows_body = [...rows_body, {
        COD_ARTICULO:`Son:`,
        DESC_ARTICULO:`${Main.NumerosALetras(items_empresa.TOT_COMPROBANTE)} ${items_empresa.DESC_MONEDA}`,
        PRECIO_UNITARIO_C_IVA:'PRECIO TOTAL IVA INCLUIDO',
        MONTO_TOTAL :  Main.currency(items_empresa.TOT_COMPROBANTE, { separator:'.',decimal:',',precision:items_empresa.DECIMALES ,symbol:''}).format(),
        ultimo:true,
      }]
      
    }

    try {
      mainReport.main_presupuesto(rows_body,row_cab).then(()=>{
        Main.desactivarSpinner();
      });  
    } catch (error) {
      Main.desactivarSpinner()
      console.log(error)
    }
    
  }
  const handleInputEstado = (e)=>{
    let url = e.target.id === 'ESTADO' ? mainUrl.url_valida_estado : mainUrl.url_valida_estCorr;
    let data =  { COD_EMPRESA       : form.getFieldValue('COD_EMPRESA'),
                  TIP_COMPROBANTE   : form.getFieldValue('TIP_COMPROBANTE'),
                  SER_COMPROBANTE   : form.getFieldValue('SER_COMPROBANTE'),
                  NRO_COMPROBANTE   : form.getFieldValue('NRO_COMPROBANTE'),
                  [e.target.id]     :  e.target.value
                }
    try {
      Main.Request(url,'POST',data).then((resp)=>{
        if(!Main._.isNull(resp.data.outBinds.p_mensaje)){
          Main.message.warning({
            content  : resp.data.outBinds.p_mensaje,
            className: 'custom-class',
            duration : `${2}`,
            style    : {marginTop: '2vh'},
          });        
          form.setFieldsValue({
            ...form.getFieldsValue(),
            [e.target.id] : resp.data.outBinds[e.target.id]
          });
        }else{
          handleInputChange(e);
        }
      });
    } catch (error) {
      console.log(error)
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
            cancelar={funcionCancelar}
            formName={FormName}
            vprinf={false}
            refs={{ref:buttonSaveRef}}
            funcionBuscar={funcionBuscar}
            NavigateArrow={navigateArrow}
            reporte={reporte}
          />

          <VTPRESAR
            form={form}
            FormName={FormName}
            refGrid={refGrid}
            handleKeyDown={onkeyDown}
            dataRef={refCab}
            refIndex={banRef}
            idComp={idComp}
            handleInputChange={handleInputChange}
            validaAllExterno={validaDetalle} 
            nextValidaInput={nextValidaInput}
            setClickCell={setClickCell}
            setfocusRowIndex={setfocusRowIndex}
            setLastFocusNext={setLastFocusNext}
            activateButtonCancelar={activateButtonCancelar}
            handleKeyUp={handleKeyUp}
            handleInputEstado={handleInputEstado}
          />

        </Main.Paper>
      </Main.AntLayout>
    </Main.Spin>
  );
});

export default MainVT;