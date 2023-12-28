import React, { memo }   from 'react';
import Main              from '../../../../../componente/util/main';
import mainUrl           from './url/mainUrl';
import VTVENDE,{columns} from './view';
import {inicialObjeto}   from './ObjetoInicial/mainInicial'

const FormName     = 'VTVENDE';
const TituloList   = "Vendedor";

const idComp       = FormName

const MainVT = memo(() => {

  const [form]              = Main.Form.useForm()
  const defaultOpenKeys     = Main.DireccionMenu(FormName);
  const defaultSelectedKeys = Main.Menu(FormName);
  const cod_empresa         = sessionStorage.getItem('cod_empresa');

  const refData	            = React.useRef();
  const buttonSaveRef       = React.useRef();
  const refCab              = React.useRef({ data: [], dataCan:[], delete : [], activateCambio:false});

  React.useEffect(()=>{  
    inicialForm()
    // eslint-disable-next-line
  },[])

  var idGrid = {
    grid:{
      [idComp] : refData,
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
    
  const inicialForm = async (data, url) => {
    try {
      let params = await { value:'null',cod_empresa,filter:[]};
       await Main.Request(mainUrl.url_list_cab, "POST", params).then(resp => { 
        if(resp.data.rows.length > 0){
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

  const guardar = async ()=>{
    var permisoActualizacion = false;
    var permisoIsertar 	     = false;
    var exitInsertedBand     = false;
    
    Main.quitarClaseRequerido();
    //GET 
    var update_insert = []
    if(refData.current.hotInstance) update_insert = refData.current.hotInstance.getSourceData();   

    if(refData.current){
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
    let url_get_cod         = `${mainUrl.url_buscar_cod_vededor}${cod_empresa}`
    let infoCab            	= await Main.GeneraUpdateInsertCab(update_insert,'COD_VENDEDOR',url_get_cod,dependencia,true,false,true);
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

    let newRowData           = {...inicialObjeto} 
    newRowData.COD_EMPRESA   = cod_empresa;
    newRowData.insertDefault = true;
    newRowData.ACTIVO        = 'N';
    
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
  const setLastFocusNext = React.useCallback((e,row,rowCount,rowindex)=>{
    if(e.keyCode === 13){
      setTimeout(()=>{
        addRow({index:rowindex})
      },2)
    }
    // eslint-disable-next-line
  },[])


  return (
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
        
        <VTVENDE
          refs={refData}
          FormName={FormName}
          idComp={idComp}
          form={form}
          setLastFocusNext={setLastFocusNext}
        />

      </Main.Paper>
     </Main.AntLayout>
    </Main.Spin>
    
  );
});

export default MainVT;