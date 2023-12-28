import React, { memo }    from 'react';
import Main               from '../../../../../componente/util/main';
import CMPROVEC,{columns} from './view'

import mainUrl            from './url/mainUrl';
import mainInput          from './inputValida/mainInputValida';

import { objetoinicial }  from './ObjetoInicial/mainInicial';
const FormName   = 'CMPROVEC';
const TituloList = "Proveedores";

const idComp     = FormName
// eslint-disable-next-line

const MainCM = memo(() => {

  const [form]              = Main.Form.useForm()
  const defaultOpenKeys     = Main.DireccionMenu(FormName);
  const defaultSelectedKeys = Main.Menu(FormName);
  //--- 
  const refData	            = React.useRef();
  const buttonSaveRef       = React.useRef();
  //--- 
  const cod_empresa         = sessionStorage.getItem('cod_empresa');
  // ---
  const refCab              = React.useRef({ data: [], dataCan:[], delete : [], activateCambio:false});
  const refModal            = React.useRef({  modalColumn : []
                                            , data        : []
                                            , ModalTitle  : ''
                                            , idInput     : ''
                                            , dataParams  : ''
                                            , url_buscador: ''
                                          })

const refModalData               = React.useRef()
const [shows     , setShows    ] = React.useState(false);
const [mdiasant  , setMdiasant ] = React.useState('N') 


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

  const getDataInicial = async ()=>{
    let url_modifica_dias_ant = '/cm/cmprovec/buscar/modificaDiaAnt';
    try {
      let result = await Main.Request(url_modifica_dias_ant, 'POST', {
          'COD_EMPRESA': sessionStorage.getItem('cod_empresa'),
          'COD_USUARIO': sessionStorage.getItem('cod_usuario')
      }); 
      setMdiasant(result.data.outBinds ? result.data.outBinds.IND_MODIFICA_DIAS_ANT : 'N')
    } catch (error) {
      console.log(error) 
    }
  }
  const inicialForm = async (data, url) => {
    try {
      let params = await { value:'null',cod_empresa,filter:[]};
       await Main.Request(mainUrl.url_list_cab, "POST", params).then(resp => { 
        if(resp.data.rows.length > 0){
          getDataInicial();          
          refData.current.hotInstance.loadData(resp.data.rows)
          refCab.current.dataCan  = JSON.parse(JSON.stringify(resp.data.rows));
          refData?.current?.hotInstance?.selectCell(0,1);
        }else{
          Main.message.info({
            content  : `No encontraron datos!!`,
            className: 'custom-class',
            duration : `${2}`,
            style    : {
                marginTop: '2vh',
            },
          });
        }
      });
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  const searchChange = (e)=>{
    setTimeout(async()=>{
      var value = e.target.value;
      if(value.trim().length === 0){
        value = 'null';
      }
      if(e.keyCode === 13 || value === 'null'){
        try {
            var method         = "POST";
            const cod_empresa  = sessionStorage.getItem('cod_empresa');        
            await Main.Request(mainUrl.url_list_cab,method,{'value':value, cod_empresa, filter:Main.newArrayPushHedSeled[FormName] })
            .then( response =>{
                if( response.status === 200 ){
                  refData?.current?.hotInstance?.loadData(response.data.rows);
                }
            setTimeout(()=>{
              Main.setFocusedRowIndex(0,undefined,refData,FormName)
            },45)
            });
        } catch (error) {
            console.log(error);
        }
      }     
    })
  }
  const funcionCancelar = ()=>{
    Main.setModifico(FormName);    
    refCab.current.delete   = []        
    Main.activarSpinner();
    setTimeout(()=>{
      let rowAux             = JSON.parse(JSON.stringify(refCab.current.dataCan));
      refCab.current.dataCan = JSON.parse(JSON.stringify(rowAux));
      refData.current.hotInstance.loadData(rowAux)
      refData?.current?.hotInstance?.selectCell(0,1);

      Main.desactivarSpinner()
    },20)
  }

  const guardar = async ()=>{
    var permisoActualizacion = false;
    var permisoIsertar 	     = false;
    var exitInsertedBand     = false;
    
    if(refCab.current.delete.length === 0){
      let verificar_input_requerido = Main.validarCamposRequeridos();
      if(!verificar_input_requerido) return      
    }    
    
    Main.quitarClaseRequerido();

    //GET TAB1 DET
    var update_insert = []
    if(refData.current.hotInstance) update_insert = refData.current.hotInstance.getSourceData();   

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
    var dependencia         = [];
    let url_get_cod         = `${mainUrl.url_buscar_cod_proveedor}${cod_empresa}`
    let infoCab            	= await Main.GeneraUpdateInsertCab(update_insert,'COD_PROVEEDOR',url_get_cod,dependencia,true,false,true);
    var updateInserData     = infoCab.updateInsert;
    if(!permisoActualizacion) permisoActualizacion = infoCab.actualizar;
    if(!permisoIsertar)       permisoIsertar 	     = infoCab.insertar ;
    exitInsertedBand        = infoCab.insertar;
    var deleteCab           = refCab.current.delete[0] !== undefined && refCab.current.delete?.length > 0  ? refCab.current.delete : []
  
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
    
    var AditionalData = {"cod_usuario": sessionStorage.cod_usuario,"cod_empresa": sessionStorage.cod_empresa};
 
    var data = {
      updateInserData   ,
      aux_updateInserData :  refCab.current.dataCan,
      deleteCab	        , 
      AditionalData     ,
      exitInsertedBand
    }
    Main.activarSpinner();
    if(updateInserData.length > 0 ||  deleteCab.length > 0){
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
            refCab.current.delete         = []

            setTimeout(()=>{
              inicialForm()
            },4)
          }else{
            Main.desactivarSpinner();
            setTimeout(()=>{
              Main.alert(resp.data.p_mensaje, '¡Atención!', 'alert', 'OK')  
            },120)
          }            
        });
        
      } catch (error) {
        Main.desactivarSpinner();
        console.log('Error en la funcion de Guardar cmfactur',error)
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
  
    let valor = await  Main.hotTableRequerido(idGrid,idComp);
    if(valor.Addband){      
      var countRow       = refData.current.hotInstance.getSourceData().length -1
      setTimeout(()=>{
        Main.message.warning({
          content  : `Ingrese ${valor.columnaRequerido.label} para Continuar!!`,
          className: 'custom-class',
          duration : `${2}`,
          style    : {marginTop: '2vh'},
        });        
        refData.current.__hotInstance.selectCell(valor.columnaRequerido.indexRow,valor.columnaRequerido.indexComun);        
        if(countRow === valor.columnaRequerido.indexRow){
          refData.current.__hotInstance.scrollViewportTo(valor.columnaRequerido.indexRow,valor.columnaRequerido.indexComun);
        }
      },1)
      return
    }

    Main.modifico(FormName);
    let rowValue            = Main.g_getRowFocus(idComp);
    let rowIndex            = index !== false ? index.index + 1 : rowValue[0].rowIndex === -1 ? 0 : rowValue[0].rowIndex;

    let newRowData          = {...objetoinicial} 
    newRowData.COD_EMPRESA  = cod_empresa;
    newRowData.ESTADO       = 'I';
    newRowData.TIP_FLETE    = 'N';
    newRowData.CANT_DIA_ANT = '';
    newRowData.MODIFICA_DIAS_ANT = mdiasant;
    
    refData.current.hotInstance.alter('insert_row', rowIndex);    
    refData.current.hotInstance.view.settings.data[rowIndex] = newRowData;
    
    refData.current.__hotInstance.updateSettings({      
      cellRow:rowIndex,
    },);

    // Copia el arreglo de metadatos para la fila que deseas habilitar
    const meta = refData.current.hotInstance.getCellMetaAtRow(rowIndex);
    if(meta.length > 0){
      meta[0].readOnly = true
      meta[1].readOnly = false
      meta[2].readOnly = true
      meta[3].readOnly = false
      meta[4].readOnly = false  
    }

    // Actualiza los metadatos para la fila
    refData.current.hotInstance.setCellMetaObject(rowIndex, meta);
    // focus    
    refData.current.hotInstance.selectCell(rowIndex, 1);    
  }
  const deleteRow = ()=>{
    let Permiso  = Main.VerificaPermiso(FormName);
    if(Permiso.delete === 'S'){
      Main.activarSpinner()

      setTimeout(()=>{

        let rowCount       = refData.current.hotInstance.getSourceData().length;
        let rowInfo        = Main.g_getRowFocus(idComp)[0]
        let rowIndexFocus  = rowInfo.rowIndex - 1 === -1 ? 0 : rowInfo.rowIndex - 1;
        if(Main._.isUndefined(rowInfo?.inserted) && Main._.isUndefined(rowInfo?.insertDefault) ){
          Main.desactivarSpinner();

          if(refCab.current.delete.length > 0){
            refCab.current.delete = Main._.union(refCab.current.delete, [rowInfo])
          }else{
            refCab.current.delete = [...refCab.current.delete,rowInfo]
          }

          refData.current.hotInstance.alter('remove_row',rowInfo.rowIndex);
          refData.current.hotInstance.selectCell(rowIndexFocus,rowInfo.columnIndex)
  
          Main.modifico(FormName)
          Main.setCambiosPendiente(idComp,true)
  
          if(rowCount === 1){
            addRow({index:-1});
          }
          Main.desactivarSpinner()
          
        }else if(rowCount === 1){        
          refData.current.hotInstance.alter('remove_row',rowInfo.rowIndex);
          addRow({index:-1});
          Main.desactivarSpinner();
        }else{
          Main.desactivarSpinner();
          refData.current.hotInstance.alter('remove_row',rowInfo.rowIndex);
          refData.current.hotInstance.selectCell(rowIndexFocus,rowInfo.columnIndex)
        }

      },10)
      
    }else{
      Main.message.warning({
        content  : `No cuenta con los permisos para Eliminar`,
        className: 'custom-class',
        duration : `${2}`,
        style    : {marginTop: '2vh'},
      });
    }
  }

  const setfocusRowIndex = React.useCallback((valor,row,col)=>{
    if(valor){
      let valor2 = form.getFieldsValue()
      if(valor.COD_PROVEEDOR !== valor2.COD_PROVEEDOR){        
        if(!refData.current.hotInstance.view.settings.data[valor.rowIndex].MODIFICA_DIAS_ANT){
          refData.current.hotInstance.view.settings.data[valor.rowIndex].MODIFICA_DIAS_ANT = mdiasant;
        };
        form.setFieldsValue({
          ...valor,
          IND_DIF_PRECIO    : valor.IND_DIF_PRECIO    === "S" ? true : false ,
          EXENTO            : valor.EXENTO            === "S" ? true : false ,
          IND_TRANSPORTISTA : valor.IND_TRANSPORTISTA === "S" ? true : false ,
          DIRECTO           : valor.DIRECTO           === "S" ? true : false ,
          IND_DESPACHANTE   : valor.IND_DESPACHANTE   === "S" ? true : false ,
          IND_LOCAL         : valor.IND_LOCAL         === "S" ? true : false ,
          IND_CAJA_CHICA    : valor.IND_CAJA_CHICA    === "S" ? true : false ,
          IND_RETENCION_IVA : valor.IND_RETENCION_IVA === "S" ? true : false ,
          IND_REPARTO       : valor.IND_REPARTO       === "S" ? true : false ,
          IND_EXPORTADOR    : valor.IND_EXPORTADOR    === "S" ? true : false ,
          IND_ODC           : valor.IND_ODC           === "S" ? true : false ,
        });
      }
    }
    // eslint-disable-next-line
  },[])

  const nextFocus = React.useCallback((row)=>{
    setTimeout(async()=>{
      document.getElementById('COD_PROVEEDOR_REF').focus();
    },5);
  },[])

  const getData = async (data, url) => {
    try {
      let params = await data;
      return await Main.Request(url, "POST", params).then(resp => { return resp.data.rows });
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  const handleKeydown = async (e)=>{
    if (['Enter', 'Tab'].includes(e.key)) {
      e.preventDefault()
      if(['CUENTA_BANCARIA','IND_DIF_PRECIO','EXENTO','IND_LOCAL','IND_RETENCION_IVA','IND_EXPORTADOR','IND_TRANSPORTISTA','IND_DESPACHANTE','IND_CAJA_CHICA','IND_ODC'].includes(e.target.id)){
        e.target.blur();
        switch (e.target.id) {
          case "CUENTA_BANCARIA":
            document.getElementById('CANT_DIA_ANT').focus()    
            break;
          case "IND_DIF_PRECIO":
            document.getElementById('EXENTO').focus()    
            break;
          case "EXENTO":
            document.getElementById('IND_LOCAL').focus()    
          break;   
          case "IND_LOCAL":
            document.getElementById('IND_RETENCION_IVA').focus()    
          break;          
          case "IND_RETENCION_IVA":
            document.getElementById('IND_EXPORTADOR').focus()    
          break;
          case "IND_EXPORTADOR":
            document.getElementById('IND_TRANSPORTISTA').focus()    
          break;
          case "IND_TRANSPORTISTA":
            document.getElementById('IND_DESPACHANTE').focus()    
          break;
          case "IND_DESPACHANTE":
            document.getElementById('IND_CAJA_CHICA').focus()    
          break;
          case "IND_CAJA_CHICA":
            document.getElementById('IND_ODC').focus()    
          break;
          case "IND_ODC":
            document.getElementById('COD_PROVEEDOR_REF').focus()    
          break;        
          default:
            break;
        }      
      }else if (["COD_PROVEEDOR_REF","COD_CUENTA_CONTABLE","COD_CUENTA_CONT","COD_BANCO","COD_CONDICION_COMPRA","COD_MONEDA","CANT_DIA_ANT"].includes(e.target.id)) {
        ValidarUnico(e.target.id, e.target.value);      
      }
    } else if (e.key === 'F9' && ["COD_PROVEEDOR_REF","COD_CUENTA_CONTABLE","COD_CUENTA_CONT","COD_BANCO","COD_CONDICION_COMPRA","COD_MONEDA"].includes(e.target.id)) {
      e.preventDefault()
      let aux = '';
      refModal.current.idInput = e.target.id
      let items = mainInput.ModalF9[e.target.id]

      refModal.current.ModalTitle   = items.title;
      refModal.current.modalColumn  = items.column;
      refModal.current.url_buscador = items.url;

      Main.activarSpinner()
      switch (e.target.id) {
        case 'COD_PROVEEDOR_REF':
          aux = await getData({ valor: 'null' }, mainUrl.url_buscar_proveedor_fef);
          
          refModal.current.dataParams = { cod_empresa }
          break;
        case 'COD_CUENTA_CONTABLE':
          aux = await getData({ valor: 'null', cod_empresa }, mainUrl.url_buscar_cuenta_contable);          
          refModal.current.dataParams = { cod_empresa }
          break;
        case 'COD_CUENTA_CONT':
          aux = await getData({ valor: 'null', cod_empresa }, mainUrl.url_buscar_cuenta_cont);          
          refModal.current.dataParams = { cod_empresa }
          break;
        case 'COD_BANCO':
          aux = await getData({ valor: 'null' }, mainUrl.url_buscar_banco);          
          refModal.current.dataParams = { cod_empresa }
          break;
        case 'COD_CONDICION_COMPRA':
          aux = await getData({ valor: 'null', cod_empresa }, mainUrl.url_buscar_codCompra);          
          refModal.current.dataParams = { cod_empresa }
         break;
        case 'COD_MONEDA':
          aux = await getData({ valor: 'null' }, mainUrl.url_buscar_codMoneda);          
          refModal.current.dataParams = { cod_empresa }
         break;
        default:
          break;
      }
      refModal.current.data = aux
      Main.desactivarSpinner()
      setShows(true)      
    }
  }

  //********** MODAL F9  ***************************/ 
  const eventoClick = async (data) => {
    let row = Main.g_getRowFocus(FormName)[0]
    setShows(!shows)
    setTimeout(()=>{
      if (Object.keys(data).length > 0) {
        for (let key in data) {
          form.setFieldsValue({
            ...form.getFieldsValue(),
            [key]: data[key]
          });
          refData.current.hotInstance.view.settings.data[row.rowIndex][key] = data[key]
        }
      }
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
    
    let rowValue = Main.g_getRowFocus(FormName)[0]

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
         refData.current.hotInstance.view.settings.data[rowValue.rowIndex][x] = '';
      });
      // eslint-disable-next-line
      valorValida.rel.map((x) => {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          [x]: ''
        });
         refData.current.hotInstance.view.settings.data[rowValue.rowIndex][x] = '';
      });
      if (valorValida.next !== ""){
        setTimeout(()=>{
          if (valorValida?.idFocus) document.getElementById(valorValida.next).focus();
          else if (valorValida?.idSelect) document.getElementById(valorValida.next).select();
        },10)
      }
      return;
    }else
    if (form.getFieldValue(valorValida.input) !== valorValida.valor_ant || valorValida.validaNull === true) {
      try {
        let data = {}
        // eslint-disable-next-line
        valorValida.data.map((x) => { data = { ...data, [x]: rowValue[x] ? rowValue[x] : '' } });
        data = { ...data, valor };
        data.MODIFICA_DIAS_ANT = mdiasant;
        await Main.Request(valorValida.url, 'POST', data).then((resp) => {
          if (resp.data.outBinds.ret === 1) {
            valorValida.valor_ant = valor
            // eslint-disable-next-line
            valorValida.out.map((x) => {
              form.setFieldsValue({
                ...form.getFieldsValue(),
                [x]: resp.data.outBinds[x]
              });
               refData.current.hotInstance.view.settings.data[rowValue.rowIndex][x] = resp.data.outBinds[x];
            })
            // eslint-disable-next-line
            valorValida.rel.map(x => {
              form.setFieldsValue({
                ...form.getFieldsValue(),
                [x]: ''
              });
               refData.current.hotInstance.view.settings.data[rowValue.rowIndex][x] = null;
            });
            setTimeout(()=>{
              if (valorValida?.idFocus) document.getElementById(valorValida.next).focus();
              else if (valorValida?.idSelect) document.getElementById(valorValida.next).select();
            },10)            
          } else {
            valorValida.valor_ant = null;
            // eslint-disable-next-line
            valorValida.out.map(x => {
              form.setFieldsValue({
                ...form.getFieldsValue(),
                [x]: ''
              });
               refData.current.hotInstance.view.settings.data[rowValue.rowIndex][x] = null;
            });
            // eslint-disable-next-line
            valorValida.rel.map(x => {
              form.setFieldsValue({
                ...form.getFieldsValue(),
                [x]: ''
              });
               refData.current.hotInstance.view.settings.data[rowValue.rowIndex][x] = null;
            });
            Main.alert(resp.data.outBinds.p_mensaje, '¡Atención!', 'alert', 'OK')
          }
        })
      } catch (error) {
        console.log('valida frontend', error)
      }
    }else{
      setTimeout(()=>{
        if (valorValida?.idFocus) document.getElementById(valorValida.next).focus();
        else if (valorValida?.idSelect) document.getElementById(valorValida.next).select();
      },10)
    }
  }
  // ------------------------------------------------
  const typeEvent = (indexRow = false)=>{
    let rowValue = indexRow === false ? Main.g_getRowFocus(FormName)[0] : {rowIndex:indexRow};
    
    if(refData.current.hotInstance.view.settings.data[rowValue.rowIndex]['insertDefault']){
       refData.current.hotInstance.view.settings.data[rowValue.rowIndex].insertDefault      = false;
       refData.current.hotInstance.view.settings.data[rowValue.rowIndex].inserted 		      = true;
       refData.current.hotInstance.view.settings.data[rowValue.rowIndex].ALTA_POR	          = sessionStorage.getItem('cod_usuario');
       refData.current.hotInstance.view.settings.data[rowValue.rowIndex].FEC_ALTA           = Main.moment().format('DD/MM/YYYY');
    }else if(!refData.current.hotInstance.view.settings.data[rowValue.rowIndex]['updated'] && 
              refData.current.hotInstance.view.settings.data[rowValue.rowIndex]['inserted'] !== true){
       refData.current.hotInstance.view.settings.data[rowValue.rowIndex]['updated']         = true;
       refData.current.hotInstance.view.settings.data[rowValue.rowIndex].MODIFICADO_POR	    = sessionStorage.getItem('cod_usuario');
       refData.current.hotInstance.view.settings.data[rowValue.rowIndex].FEC_MODIFICACION   = Main.moment().format('DD/MM/YYYY');
       refData.current.activateCambio = true;
       Main.modifico(FormName);
    } 
  }
  const handleInputChange = async (e)=>{
    let rowValue = await Main.g_getRowFocus(FormName)[0]
    refData.current.hotInstance.view.settings.data[rowValue.rowIndex][e.target.id] = e.target.value;
    typeEvent(rowValue.rowIndex)
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
            <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${TituloList}`} />
              <div className="paper-header">
                <Main.Title level={4} className="title-color">
                  {TituloList}				<div level={5} style={{ float: 'right', marginTop: '10px', marginRight: '5px', fontSize: '10px' }} className="title-color">{FormName}</div>
                </Main.Title>
              </div>

              <Main.HeaderMenu
                AddForm={()=>addRow(false)}
                SaveForm={guardar}
                deleteRows={deleteRow}
                cancelar={funcionCancelar}
                formName={FormName}
                searchChange={searchChange}
                refs={{ref:buttonSaveRef}}
                search={true}
              />
            
            <CMPROVEC 
              refs={refData}
              FormName={FormName}
              idComp={idComp}
              form={form}
              setfocusRowIndex={setfocusRowIndex}
              nextFocus={nextFocus}
              handleKeydown={handleKeydown}
              handleInputChange={handleInputChange}              
            />

          </Main.Paper>
          </Main.AntLayout>
        </Main.Spin>
    </>

  );
});

export default MainCM;