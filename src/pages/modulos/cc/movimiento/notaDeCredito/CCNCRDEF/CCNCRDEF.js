import React, { memo } from 'react';
import Main            from '../../../../../../componente/util/main';
import CCNCRDEF        from './view';
import mainInicial     from './ObjetoInicial/mainInicial'
import mainUrl         from './url/mianUrl';
import mainInput       from './inputValida/mainInput'
import mainColumn      from './columnModal/mianColumn';
import './styles/CCNCRDEF.css';

const FormName   = "CCNCRDEF";
const TituloList = "Nota de Crédito Definitiva"
const idComp     = `GRID_${FormName}`;
let data_len     = 100
const MainCc = memo(({history, location}) => {

  const [form]              = Main.Form.useForm()
  const cod_empresa         = sessionStorage.getItem('cod_empresa');
  const cod_sucursal        = sessionStorage.getItem('cod_sucursal');
  
  const defaultOpenKeys     = Main.DireccionMenu(FormName);
  const defaultSelectedKeys = Main.Menu(FormName);
  // USESTATE
  const [ shows        , setShows         ] = React.useState(false);
  const [ activateAtras, setActivateAtras ] = React.useState(false);

  // REF
  const buttonSaveRef       = React.useRef();
  const refGrid	            = React.useRef();
  // USE REF
  const banRef              = React.useRef({  bandNew         :false
                                            , bandPost_Cab_Det:false
                                            , banCambioPrecio :true
                                            , b_bloqueo       :false
                                            , b_bloqueo_aux   :false
                                            , id_cabecera     :''
                                            , refFec_comp     :''
                                            , refFec_rec      :''
                                            , refFec_emb      :''
                                            , indice          : 0
                                            , mitad_data      : data_len / 2})
   const refCab              = React.useRef({ data: [{}], dataCan:[]   , delete:[]   , activateCambio:false
                                            , dataCanDet:[], deleteDet:[] 
                                         });
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
    if(location.state !== undefined){
      setActivateAtras(true)
      let rowData = getParmas(true);
      rowData.COD_EMPRESA     = location.state.COD_EMPRESA;
      rowData.TIP_COMPROBANTE = location.state.TIP_COMPROBANTE;
      rowData.NRO_COMPROBANTE = location.state.NRO_COMPROBANTE;
      setTimeout(()=>{
        getDataCab(false,rowData);
      })
    }else{
      inicialForm();
    }
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
  //******************************************************************* */
  const guardar = async () =>{
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
    //GET DET
    let update_insert_detalle = []
    if(refGrid.current.hotInstance) update_insert_detalle = refGrid.current.hotInstance.getSourceData();   
    if(refGrid.current){
      const valor = await  Main.hotTableRequerido(idGrid,idComp,true);
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
     let url_get_cab_cod     = refCab.current.delete?.length > 0 ? null : `${mainUrl.url_buscar_nro_compr}${cod_empresa}/${rowCab.SER_COMPROBANTE}/${rowCab.TIP_COMPROBANTE}`
     let infoCab      	     = await Main.GeneraUpdateInsertCab(refCab.current.data,'NRO_COMPROBANTE',url_get_cab_cod,dependencia_cab,true,false,true);
     var aux_cab	           = infoCab.rowsAux;
     var updateInserData     = infoCab.updateInsert;
     let keyCabecera 			   = infoCab.rowsAux.length > 0 ?  infoCab.rowsAux[banRef.current.indice]?.NRO_COMPROBANTE : null;
     if(!permisoActualizacion) permisoActualizacion = infoCab.actualizar;
     if(!permisoIsertar)       permisoIsertar 	     = infoCab.insertar  ;
     var delete_cab          = refCab.current.delete !== undefined && refCab.current.delete?.length > 0  ? refCab.current.delete : []
     exitInsertedBand        = infoCab.insertar;

    // FILTER DET
    var dependencia_det        = [];
    var add_cab_and_det        = ['COD_MONEDA','DECIMALES','NRO_COMPROBANTE','COD_LISTA_PRECIO','COD_SUCURSAL'];
    let url_get_det_cod        = `${mainUrl.url_buscar_nro_orden}${cod_empresa}/${rowCab.SER_COMPROBANTE}/${rowCab.TIP_COMPROBANTE}/${keyCabecera}`
    var infoDet     	    	   = await Main.GeneraUpdateInsertDet(update_insert_detalle,['NRO_ORDEN'],aux_cab,dependencia_det,'NRO_COMPROBANTE',url_get_det_cod,'NRO_ORDEN','ASC',add_cab_and_det);
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
      updateInserData      ,
      aux_updateInserData : [refCab.current.dataCan[banRef.current.indice]],
      delete_cab	         , 

      updateInserDataDet   ,
      aux_updateInserDataDet : refCab.current.dataCanDet,
      delete_Det	         , 
      
      auditoria            ,
      exitInsertedBand
    }
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
          
          refCab.current.delete         = []
          refCab.current.deleteDet      = []
          
          refCab.current.data        = infoCab.rowsAux
          refCab.current.dataCan     = JSON.parse(JSON.stringify(refCab.current.data));

          if(refCab.current.delete.length > 0){
            setTimeout(()=>inicialForm()); 
          }else{
            postQueryCab(infoCab.rowsAux[banRef.current.indice],false,banRef.current.indice);
          } 
          setTimeout(()=>{
            document.getElementById('NRO_COMPROBANTE').focus()
            refCab.current.activateCambio = false;
          })
          
        }else{
          Main.alert(resp.data.p_mensaje, '¡Atención!', 'alert', 'OK')
        }            
      });
    } catch (error) {
      Main.desactivarSpinner();
      console.log('Error en la funcion de Guardar ccncrdef',error)
    }
  }
  const deleteRow = () =>{
    if(!banRef.current.bandNew){
      if(!banRef.current.b_bloqueo_aux){
        setTimeout(()=>{
          Main.activarSpinner()
          form.resetFields();
          refCab.current.delete[0] = refCab.current.data[banRef.current.indice]
          inicialForm(true);
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
  const addRow = async (index = false)=>{
    if(!banRef.current.bandNew && index === false){
      inicialForm(false,'COD_SUCURSAL');
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
      newRow.insertDefault  = true
      refGrid.current.hotInstance.alter('insert_row', rowIndex);
      refGrid.current.hotInstance.view.settings.data[rowIndex] =  JSON.parse(JSON.stringify({...newRow}));

      refGrid.current.hotInstance.updateSettings({      
        cellRow:rowIndex,
      });  
      setTimeout(()=>{        
        typeEventDet(rowIndex)
        refGrid.current.hotInstance.selectCell(rowIndex, 0)
      },40)
    }
  }
  const funcionCancelar =()=>{
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
  //******************************************************************* */
  const get_PreFrom = async() => {
    try {
      let params  = {
                      COD_EMPRESA : cod_empresa ,
                      COD_SUCURSAL: cod_sucursal,
                      FORMNAME    : FormName    ,
                    }
			return await Main.Request(mainUrl.url_preForm,"POST",params).then((resp)=>{
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
    Main.activarSpinner()
    try {
      get_PreFrom().then((objeto)=>{
        banRef.current.indice = 0;
        form.resetFields();
        let valor   = JSON.parse(JSON.stringify(mainInicial.mainInicialCab));        
        if(Object.keys(objeto).length > 0) valor = {...valor, ...objeto}
        let newKey  = Main.uuidID()
        valor.ID					  = newKey;
        valor.COD_EMPRESA   =  sessionStorage.getItem('cod_empresa');
        valor.COD_USUARIO   = sessionStorage.getItem('cod_usuario');
        valor.COD_SUCURSAL  = sessionStorage.getItem('cod_sucursal');
        valor.DESC_SUCURSAL = sessionStorage.getItem('desc_sucursal');
        let date            = Main.moment().format('DD/MM/YYYY').toString();
        valor.FEC_COMPROBANTE   = Main.dayjs(date,'DD/MM/YYYY');
        if(!f7_delete) form.setFieldsValue(valor);
        else Main.desactivarSpinner();
        valor.FEC_COMPROBANTE   = Main.moment(valor.FEC_COMPROBANTE).format('DD/MM/YYYY');
        refCab.current.data     = [valor]
        refCab.current.dataCan  = JSON.parse(JSON.stringify([valor]));
        
        if(!f7_delete)getDetalle(newKey,false,0,false,f7_delete);
        else refGrid.current?.hotInstance.loadData([])

        setTimeout( ()=> {				
          document.getElementById(idFocus).select();
        },20);
        document.getElementById("indice").textContent         = "1"
        document.getElementById("total_registro").textContent = "?";
        document.getElementById("mensaje").textContent 				= "";
      });  
    } catch (error) {
      Main.desactivarSpinner();
      console.log(error);
    }
  }
  const getParamsDetalle = async (idCabecera = false, indexRow = 0)=>{
    var newKey            = Main.uuidID();
    var valor             = JSON.parse(JSON.stringify(mainInicial.mainInicialDet))
    valor.ID	            = newKey;
    valor.COD_EMPRESA	    = sessionStorage.getItem('cod_empresa')        ;
    valor.COD_SUCURSAL    = refCab.current.data[indexRow].COD_SUCURSAL   ;
    valor.COD_PROVEEDOR   = refCab.current.data[indexRow].COD_PROVEEDOR  ;
    valor.NRO_COMPROBANTE = refCab.current.data[indexRow].NRO_COMPROBANTE;
    valor.TIP_COMPROBANTE = refCab.current.data[indexRow].TIP_COMPROBANTE;
    valor.SER_COMPROBANTE = refCab.current.data[indexRow].SER_COMPROBANTE;
    valor.idCabecera      = idCabecera ? idCabecera : refCab.current.data[indexRow]?.ID;
    return valor;
  }
  const getDetalle = async (idCabecera, data = false,indexRow = 0,guardar = false,f7 = false)=>{
    let dataParams = data ? data : await getParamsDetalle(idCabecera,indexRow);
    var content = [];
    try {
      var info = await Main.Request(mainUrl.url_listar_det,'POST',dataParams);
      if(info?.data?.rows?.length === 0 || info?.data?.rows === undefined) content = [dataParams];
      else content = info.data.rows
    
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
  //******************************************************************* */
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
          postQueryCab(refCab.current.data,false,index);
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
          postQueryCab(refCab.current.data[index],false,index);
          document.getElementById("total_registro").textContent = refCab.current.data.length
          document.getElementById("mensaje").textContent = "";
          document.getElementById("indice").textContent  = index + 1;
          if(banRef.current.indice > banRef.current.mitad_data && banRef.current.bandPost_Cab_Det){
            banRef.current.bandPost_Cab_Det = false;
            let params = { INDICE  : refCab.current.data.length, 
                           LIMITE  : data_len
                         };  
            try {
              await Main.Request(mainUrl.url_listar_cab,'POST',params)
                .then(async (resp) => {              
                  let response = await resp?.data?.rows;
                  banRef.current.bandPost_Cab_Det = true;
                  refCab.current.data       = [ ...refCab.current.data, ...response ];
                  refCab.current.dataCan    = JSON.parse(JSON.stringify([refCab.current.data]))
                  banRef.current.mitad_data = refCab.current.data.length / 2
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
  const manejaF7 = (idFocus)=>{
    Main.activarSpinner()
    form.resetFields(); 
    refCab.current.activateCambio = false    
    refGrid.current?.hotInstance.loadData([]) 
    setTimeout(()=>{    
      if(!Main.getViewBuscar(FormName))Main.setBuscar(FormName,true);
      Main.desactivarSpinner()      
      inicialForm(true,idFocus);      
      ver_bloqueo(true)
    })
  }
  const getParmas = (retornaNull = false) =>{
    var data = {
      COD_EMPRESA      : sessionStorage.cod_empresa,
      COD_SUCURSAL     : retornaNull ? '' : Main.nvl(form.getFieldValue('COD_SUCURSAL'),''),
      TIP_COMPROBANTE  : retornaNull ? '' : Main.nvl(form.getFieldValue('TIP_COMPROBANTE'),''),
      SER_COMPROBANTE  : retornaNull ? '' : Main.nvl(form.getFieldValue('SER_COMPROBANTE'),''),
      NRO_COMPROBANTE  : retornaNull ? '' : Main.nvl(form.getFieldValue('NRO_COMPROBANTE'),'')
    }
    return data
  }
  const getDataCab = (buttonF8=false,data = false)=>{
    let params = data === false ? getParmas() : data
    params.INDICE = 0;
    params.LIMITE = data_len;      
    Main.activarSpinner()
    Main.Request(mainUrl.url_listar_cab, "POST", params).then((resp) => {
      let response = resp?.data?.rows;
      if (response.length > 0) {
        if(response.length === 1) document.getElementById("total_registro").textContent = "1";
        else document.getElementById("total_registro").textContent = response.length
        refCab.current.data    = response;		
        refCab.current.dataCan = JSON.parse(JSON.stringify(response));
        banRef.current.indice  = 0
        setTimeout(()=>{
          postQueryCab(response[0],buttonF8,0)                    
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
      Main.desactivarSpinner()
      let data = {  COD_EMPRESA         : info.COD_EMPRESA        ,
                    COD_SUCURSAL        : info.COD_SUCURSAL       ,
                    TIP_COMPROBANTE     : info.TIP_COMPROBANTE    ,
                    SER_COMPROBANTE     : info.SER_COMPROBANTE    ,
                    NRO_COMPROBANTE     : info.NRO_COMPROBANTE    ,
                    COD_VENDEDOR        : info.COD_VENDEDOR       ,
                    VENDEDOR_PERSONA    : info.VENDEDOR_PERSONA   ,
                    COD_LISTA_PRECIO    : info.COD_LISTA_PRECIO   ,
                    COD_CONDICION_VENTA : info.COD_CONDICION_VENTA,
                    COD_MONEDA          : info.COD_MONEDA         ,
                    COD_DEPOSITO        : info.COD_DEPOSITO       , 
                    COD_ZONA            : info.COD_ZONA           , 
                    COD_MOTIVO_NCR      : info.COD_MOTIVO_NCR     ,
                }
      try {
        await Main.Request(mainUrl.url_listar_pq, "POST", data).then((resp) => {          
          if(resp.data){
            refCab.current.data[indice] = {...refCab.current.data[indice], ...resp.data}
            refCab.current.dataCan[indice] = JSON.parse(JSON.stringify(refCab.current.data[indice]));
            loadForm(refCab.current.data,indice);            
            if(buttonF8) document.getElementById('COD_CLIENTE').focus() 
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
    let index  = await indice ? indice : banRef.current.indice
    let value  = await data[index] === undefined ? data : data[index];

		form.setFieldsValue({
			...value,
		  FEC_COMPROBANTE       : value?.FEC_COMPROBANTE ? Main.dayjs(value?.FEC_COMPROBANTE , 'DD/MM/YYYY') : null,
			SUMA_MONTO_TOTAL      : Main.nvl(value.TOT_COMPROBANTE,0)
		});
    // bloqueoInput()
    Main.desactivarSpinner()
    getDetalle(false, { COD_EMPRESA     : value.COD_EMPRESA
                      , NRO_COMPROBANTE : value.NRO_COMPROBANTE
                      , TIP_COMPROBANTE : value.TIP_COMPROBANTE
                      , SER_COMPROBANTE : value.SER_COMPROBANTE},indice); 
  }
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
        meta[3].readOnly   = vbloqueo;
        meta[4].readOnly   = vbloqueo;
        meta[5].readOnly   = vbloqueo;
        meta[6].readOnly   = vbloqueo;
        meta[7].readOnly   = true;
        meta[8].readOnly   = true;
        refGrid.current.hotInstance.setCellMetaObject(i, meta);
      }
      refGrid?.current?.hotInstance?.updateSettings({});      
    }
    document.getElementsByClassName(`${FormName}_OBSERVACION`)[0].readOnly  = vbloqueo;
  }
  const onkeyDown = async(e)=>{
    const valorValida = [ "COD_SUCURSAL"    , "COD_CLIENTE"     , "NRO_COMPROBANTE_REF"
                        , "COD_SUBCLIENTE"  , "COD_ZONA"        , "COD_CONDICION_VENTA"
                        , "COD_MOTIVO_NCR"  , "COD_LISTA_PRECIO", "COD_VENDEDOR"
                        , "COD_MONEDA"
                        ];
    if([40,38].includes(e.keyCode)) e.preventDefault();
    if (['Enter', 'Tab'].includes(e.key)) {
      switch (e.target.id) {
        case "NRO_COMPROBANTE":
          document.getElementById('COD_CLIENTE').focus()
          break;
        case "NRO_NCR_CLIENTE":
          setTimeout(()=>refGrid?.current?.hotInstance?.selectCell(0,0))          
          break;
        case "FEC_COMPROBANTE":
          setTimeout(()=>{
            document.getElementsByClassName('ant-picker-dropdown')[0].style.visibility = 'collapse'
          })
          document.getElementById('COD_ZONA').focus();
        break;
        case "RUC":
          document.getElementById('COD_ZONA').focus()
          break;
        default:
          break;
      }
      if(valorValida.includes(e.target.id)) ValidarUnico(e.target.id, e.target.value);
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
    }else if (e.key === 'F9' && valorValida.includes(e.target.id)){
      e.preventDefault();
      let aux = [];
      refModal.current.idInput = e.target.id
      let items = mainInput.ModalF9[e.target.id]
      refModal.current.dataParams   = { cod_empresa, valor: 'null' }
      refModal.current.ModalTitle   = items.title;
      refModal.current.modalColumn  = items.column;
      refModal.current.url_buscador = items.url;

      let data_int = mainInput.validaInput.filter((resul)=> resul.input === e.target.id)
      // eslint-disable-next-line
      data_int && data_int[0]?.data.map((keyName)=>{
        if(keyName){
          refModal.current.dataParams[keyName] = form.getFieldValue(keyName)
        }
      })

      Main.activarSpinner()
      aux = await Main.getData(refModal.current.dataParams,refModal.current.url_buscador);      
      refModal.current.data = aux ? aux : []
      Main.desactivarSpinner()
      setTimeout(() => {
        setShows(true)  
      }, 5);

    }
  }
  const handleInputChange = (e) => {
    Main.modifico(FormName)
    try {
      refCab.current.data[banRef.current.indice][e?.target?.id ? e?.target?.id : e.target.name ] = e?.target?.value;  
    } catch (error) {
      console.log(error)
    }
    typeEvent()
  }
  //********** VALIDADORES GENERICO  ***************/ 
  const nextValida = async (value,focus = true)=>{
    // if(value.input === 'COD_MONEDA'){
    //   let valor = refCab.current.data[banRef.current.indice];  
    //   setTimeout(()=>{
    //     const currentColumnSettings = refGrid.current.hotInstance.getSettings().columns;
    //     currentColumnSettings[7] = {
    //       ...currentColumnSettings[7],
    //       type: 'numeric',
    //       numericForma1t: {pattern: `0,0.${'0'.repeat(valor.DECIMALES)}`},
    //     };
    //     currentColumnSettings[8] = {
    //       ...currentColumnSettings[8],
    //       type: 'numeric',
    //       numericFormat: {pattern: `0,0.${'0'.repeat(valor.DECIMALES)}`},
    //     };
    //     currentColumnSettings[9] = {
    //       ...currentColumnSettings[9],
    //       type: 'numeric',
    //       numericFormat: {pattern: `0,0.${'0'.repeat(valor.DECIMALES)}`},
    //     };
    //     currentColumnSettings[10] = {
    //       ...currentColumnSettings[10],
    //       type: 'numeric',
    //       numericFormat: {pattern: `0,0.${'0'.repeat(valor.DECIMALES)}`},
    //     };
  
    //     refGrid.current.hotInstance.updateSettings({columns: currentColumnSettings})
    //     Main.setFocusedRowIndex(0,undefined,refGrid,idComp);
    //    if(focus)document.getElementById('COD_DEPOSITO').focus();        
    //   },10)
    // }else{
    //   refGrid?.current?.hotInstance?.selectCell(0,0);
    // }
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
  const typeEvent = (activateCancelar = true)=>{
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
  const activateButtonCancelar = async(e,nameInput)=>{
    refCab.current.data[banRef.current.indice][nameInput] = await e !== null ? Main.format_N(e.$d) : Main.moment(new Date(),'DD MM YYYY');    
		typeEvent();  
  }
  //************************* MODAL F9 ******************************/ 
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
    let url    = refModal.current.url_buscador;
    let data   = refModal.current.dataParams
    data.valor = valor
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
  const setfocusRowIndex = React.useCallback((valor,row,col)=>{
    banRef.current.bandNew = true;
    let resul       = refGrid.current.hotInstance.getSourceData();
    if(!Main._.isNull(valor)){
      form.setFieldsValue({
        ...form.getFieldsValue(),
        DESC_UNIDAD_MEDIDA    : valor.DESC_UNIDAD_MEDIDA,
      });
    }
    document.getElementById("total_registro").textContent = resul.length;
    setTimeout(()=>{
      setClickCell();
    },10)
    // eslint-disable-next-line 
  },[]);
  const validaDetalle = React.useCallback(async(row,name,enter)=>{
    let p_valorPrecio = row.PRECIO_UNITARIO_C_IVA 
    // VALIDACIO CANTIDAD
    if(typeof row.PRECIO_UNITARIO_C_IVA === 'string'){
      if(row.PRECIO_UNITARIO_C_IVA.startsWith("-")){
        p_valorPrecio = Number(row.PRECIO_UNITARIO_C_IVA);
        row.PRECIO_UNITARIO_C_IVA = p_valorPrecio
      }else p_valorPrecio = row.PRECIO_UNITARIO_C_IVA !== "0" && row.PRECIO_UNITARIO_C_IVA ? Main.numerico_grilla(row.PRECIO_UNITARIO_C_IVA) : 0;
    }else{
      p_valorPrecio = row.PRECIO_UNITARIO_C_IVA !== "0" && row.PRECIO_UNITARIO_C_IVA ? Main.numerico_grilla(row.PRECIO_UNITARIO_C_IVA) : 0;
    }
    if('PRECIO_UNITARIO_C_IVA' === name){
      row.PRECIO_UNITARIO_C_IVA = p_valorPrecio
      setTimeout(()=>{
        refGrid.current.hotInstance.setDataAtCell(row.rowIndex,6,row[name]);
        up_calcula_actual(row)
      },5)
    }
    // eslint-disable-next-line
  },[])
  const nextValidaInput = React.useCallback((name,value)=>{
    setTimeout(()=>{
      up_calcula_actual(value)
      calculaTotal()
    },100)    
    // eslint-disable-next-line
  },[])
  const up_calcula_actual = (row = {})=>{
    try {  
      let data = { DECIMALES             : form.getFieldValue('DECIMALES'),
                   MULT                  : row.MULT,
                   DIV                   : row.DIV,
                   PORC_GRAVADA          : row.PORC_GRAVADA,
                   CANTIDAD              : row.CANTIDAD,
                   PRECIO_UNITARIO_C_IVA : row.PRECIO_UNITARIO_C_IVA,
                   PORC_DESC_VAR         : row.PORC_DESC_VAR,
                   PORC_DESC_FIN         : row.PORC_DESC_FIN,
                   PORC_IVA              : row.PORC_IVA,
                   PRECIO_UNITARIO       : row.PRECIO_UNITARIO,
                   MONTO_ANT_GRAV        : refCab.current.data[banRef.current.indice].MONTO_ANT_GRAV,
                   MONTO_ANT_EXEN        : refCab.current.data[banRef.current.indice].MONTO_ANT_EXEN,
                   IVA_ANT               : row.IVA_ANT,
                   TOT_IVA               : form.getFieldValue('TOT_IVA'),
                   TOT_GRAVADAS          : form.getFieldValue('TOT_GRAVADAS'),
                   TOT_EXENTAS           : form.getFieldValue('TOT_EXENTAS'),
                 }
    Main.Request(mainUrl.url_valida_calculoAct,'POST',data).then((resp)=>{
      const dDet = ['IVA_ANT','CANTIDAD_UB','MONTO_TOTAL_C_IVA','DESCUENTO_VAR','DESCUENTO_FIN','TOTAL_IVA',
        'PRECIO_UB','TOT_GRAVADA','TOT_EXENTA','DESC_FIN_ANT','DESC_VAR_ANT']
      const dCab = ['MONTO_ANT_GRAV','MONTO_ANT_EXEN','TOT_IVA','TOT_GRAVADAS','TOT_EXENTAS','DESCUENTO_VAR','DESCUENTO_FIN']
      for(var index in resp.data.outBinds) {
        if(!['p_mensaje','ret'].includes(index)){
          if(dCab.includes(index)){
            form.setFieldsValue({
              ...form.getFieldsValue(), 
              [index] : resp.data.outBinds[index].toString()
            });   
            refCab.current.data[banRef.current.indice][index] = resp.data.outBinds[index]
          }else if(dDet.includes(index)){
            let columIndex = refGrid.current.hotInstance.propToCol(index)
            if(!Main._.isNull(refGrid.current.__hotInstance.toVisualColumn(columIndex))){            
              refGrid.current.hotInstance.setDataAtCell(row.rowIndex,columIndex,resp.data.outBinds[index]);
            }else{
              refGrid.current.hotInstance.view.settings.data[row.rowIndex][index] = resp.data.outBinds[index];
            }
          }
        }
      }
      setTimeout(()=>calculaTotal(refGrid.current.hotInstance.view.settings.data),10)
    })
    } catch (error) {
      console.log(error)
    }
  }
  const calculaTotal = (data = false,activateCancelar = true)=>{
    if(refGrid.current){
      let resul                   = data === false ? refGrid.current.hotInstance.getSourceData() : data;
      const columnSum             = resul.reduce((acc, row) => acc + parseFloat(row.MONTO_TOTAL_C_IVA || 0), 0);
      const tot_iva               = resul.reduce((acc, row) => acc + parseFloat(row.TOTAL_IVA || 0), 0);
      const sum_monto_tot_dif     = resul.reduce((acc, row) => acc + parseFloat(row.MONTO_TOT_DIF || 0), 0);
      const sum_desc_var_prec_dif = resul.reduce((acc, row) => acc + parseFloat(row.DESC_VAR_PREC_DIF || 0), 0);
      const sum_desc_fin_prec_dif = resul.reduce((acc, row) => acc + parseFloat(row.DESC_FIN_PREC_DIF || 0), 0);

      let p_decimales  = refCab.current.data[banRef.current.indice].DECIMALES ? refCab.current.data[banRef.current.indice].DECIMALES : 0;
      
      form.setFieldsValue({
        ...form.getFieldsValue(), 
        TOT_IVA : tot_iva,
        SUMA_MONTO_TOTAL : p_decimales === 0 || p_decimales === "0" ? columnSum : Main.currency(columnSum, { separator:'.',decimal:',',precision:p_decimales,symbol:''}).format(),
      });    
      refCab.current.data[banRef.current.indice].TOT_COMPROBANTE   = columnSum            ;
      refCab.current.data[banRef.current.indice].TOT_IVA           = tot_iva              ;
      refCab.current.data[banRef.current.indice].MONTO_TOT_DIF     = sum_monto_tot_dif    ;
      refCab.current.data[banRef.current.indice].DESC_VAR_PREC_DIF = sum_desc_var_prec_dif;
      refCab.current.data[banRef.current.indice].DESC_FIN_PREC_DIF = sum_desc_fin_prec_dif;

      typeEvent(activateCancelar)
    }
  }
  const setLastFocusNext = React.useCallback((e,row,rowCount,rowindex)=>{
    if(e.keyCode === 13){
      setTimeout(()=>{
        addRow({index:rowindex})
      },50)
    }
    // eslint-disable-next-line
  },[]);
  const handleInputChangeSelect = (e)=>{
    try {
      let data = { COD_EMPRESA     : sessionStorage.getItem('cod_empresa'),
                   NRO_COMPROBANTE : form.getFieldValue('NRO_COMPROBANTE'),
                   SER_COMPROBANTE : form.getFieldValue('SER_COMPROBANTE'),
                   TIP_COMPROBANTE : form.getFieldValue('TIP_COMPROBANTE'),
                   ESTADO          : e.target.value,
                 }
     Main.activarSpinner()
      Main.Request(mainUrl.url_valida_estado,'POST',data).then((resp)=>{
        Main.desactivarSpinner()
        if(resp.status === 200){
          if(resp.data.outBinds.ret === 0){
            form.setFieldsValue({
              ...form.getFieldsValue(),
              ESTADO: Main.nvl(resp.data.outBinds.ESTADO,'P')
            })
            Main.message.warning({
              content  : resp.data.outBinds.p_mensaje,
              className: 'custom-class',
              duration : `${2}`,
              style    : {marginTop: '2vh'},
            });
          }else{
            e.target.value = resp.data.outBinds.ESTADO
            handleInputChange(e);
          }
        } 
      })      
    } catch (error) {
      Main.desactivarSpinner()
      console.log(error)
    }
  }
  const setClickCell = React.useCallback((idcom = 'DET',event, dbclick = false)=>{
    if(dbclick) up_carga_detalle()
    if(idcom === "CAB"){
      banRef.current.bandNew = false;
      document.getElementById("total_registro").textContent = "?";
      document.getElementById("mensaje").textContent 				=  "";   
    }else{
      banRef.current.bandNew = true;
    }
    calculaTotal(false,false)
    // eslint-disable-next-line
  },[])
  const finalFocusDet = async(hotInstance)=>{
    hotInstance.deselectCell();
    let activeEditor = hotInstance?.getActiveEditor();
    if (activeEditor) activeEditor.finishEditing();
  }
  const up_carga_detalle = ()=>{
    let url = ''
    let p_nro_comprobante     = Main.nvl(form.getFieldValue('NRO_COMPROBANTE'),null);
    let p_tip_comprobante_ref = Main.nvl(form.getFieldValue('TIP_COMPROBANTE_REF'),null);
    if( p_nro_comprobante === null && p_tip_comprobante_ref === 'NCP'){
      url = mainUrl.url_listar_prov
      refCab.current.data[banRef.current.indice].CARGA_DETALLE = 'S'
    }else if( p_nro_comprobante === null && p_tip_comprobante_ref === 'NCR'){
      url = mainUrl.url_listar_def
      refCab.current.data[banRef.current.indice].CARGA_DETALLE = 'S'
    }else if( p_nro_comprobante === null && p_tip_comprobante_ref === 'APV'){
      url = mainUrl.url_listar_apv
      refCab.current.data[banRef.current.indice].CARGA_DETALLE = 'S'
    }
    if(url.length > 0){
      try {
        let data = { COD_EMPRESA         : sessionStorage.getItem('cod_empresa'),
                     COD_SUCURSAL        : form.getFieldValue('COD_SUCURSAL'),
                     NRO_COMPROBANTE     : form.getFieldValue('NRO_COMPROBANTE'),
                     NRO_COMPROBANTE_REF : form.getFieldValue('NRO_COMPROBANTE_REF'),
                     SER_COMPROBANTE_REF : form.getFieldValue('SER_COMPROBANTE_REF'),
                     TIP_COMPROBANTE_REF : form.getFieldValue('TIP_COMPROBANTE_REF'),
                   }
          Main.activarSpinner();
          Main.Request(url,'POST',data).then((resp)=>{
            Main.desactivarSpinner()
            if(resp.data.rows.length > 0){
              setTimeout(()=>{
                finalFocusDet(refGrid.current?.hotInstance);
                refCab.current.dataCanDet = JSON.parse(JSON.stringify(resp.data.rows));
                refGrid.current?.hotInstance.loadData(resp.data.rows);
                setTimeout(()=>refGrid.current.hotInstance.selectCell(0,0))
              })              
            }else{
              Main.message.info({
                content  : `No se han encontrado registros`,
                className: 'custom-class',
                duration : `${2}`,
                style    : {marginTop: '2vh'},
              });    
            }
          });
      } catch (error) {
        Main.desactivarSpinner();              
        console.log(error)
      }
    }
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
            activateAtras={activateAtras}
            funcionAtras={funcionAtras}
          />

          <CCNCRDEF 
            form={form}
            FormName={FormName}
            refGrid={refGrid}
            idComp={idComp}
            handleKeyDown={onkeyDown}
            dataRef={refCab}
            refIndex={banRef}
            handleInputChange={handleInputChange}
            setfocusRowIndex={setfocusRowIndex}
            validaAllExterno={validaDetalle} 
            nextValidaInput={nextValidaInput}
            setLastFocusNext={setLastFocusNext}
            handleInputChangeSelect={handleInputChangeSelect}
            setClickCell={setClickCell}
            handleKeyUp={handleKeyUp}
            activateButtonCancelar={activateButtonCancelar}
          />

        </Main.Paper>
      </Main.AntLayout>
    </Main.Spin>      
  );
});

export default MainCc;