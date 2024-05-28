import React, { memo }    from 'react';
import CMCOFFAC           from './view';
import Main               from '../../../../../componente/util/main';
import './styles/CMCOFFAC.css';
import mainUrl            from './url/mainUrl';
import {Report}           from './reporte';
import mainColumn         from './columnModal/mainColumn';
import {objetoInicialCab} from './ObjetoInicial/mainInicial'

const FormName   = "CMCOFFAC";
const TituloList = "Confirmar Compras"
const idComp     = `GRID_${FormName}`;

const MainCM = memo(({history, location}) => {

  const cod_empresa         = sessionStorage.cod_empresa;
  const cod_sucursal        = sessionStorage.cod_sucursal;

  const defaultOpenKeys     = Main.DireccionMenu(FormName);
  const defaultSelectedKeys = Main.Menu(FormName);
  // REF
  const banRef              = React.useRef({valida:false,rowCan:[],objetoF7:{}});
  const buttonSaveRef       = React.useRef();
  const refData             = React.useRef();
  
  Main.useHotkeys(Main.Guardar, (e) =>{
		e.preventDefault();
		buttonSaveRef.current.click();
	},{enableOnFormTags: ['input', 'select', 'textarea']});
	Main.useHotkeys('f7', (e) => {
    e.preventDefault();
	});

  React.useEffect(()=>{
    inicialForm(null, location.rowIndex ? location.rowIndex :0, location.columnIndex ? location.columnIndex : 0);
    // eslint-disable-next-line
  },[])

  const inicialForm = async (data = null,rowIndex = 0 ,columnIndex = 0)=>{
    banRef.current.valida = false;
    Main.activarSpinner();
    let dataParams = data !== null ? data : { COD_EMPRESA:cod_empresa
                                            , COD_SUCURSAL:cod_sucursal};
    var content = [];
    try {
      let info = await Main.Request(mainUrl.url_listar_cab,'POST',dataParams);

      if(info?.data?.rows?.length === 0 || info?.data?.rows === undefined){
        content.push(JSON.parse(JSON.stringify(objetoInicialCab)));
        Main.message.info({
          content  : `No se encontro datos!!`,
          className: 'custom-class',
          duration : `${2}`,
          style    : {marginTop: '2vh'},
        });
      } else content = info.data.rows;        
            
      refData.current.hotInstance.loadData(content);
      banRef.current.rowCan = JSON.parse(JSON.stringify(content));
      setTimeout(()=>{
        refData.current.hotInstance.selectCell(rowIndex,columnIndex);
        addClassAddGrid()
      },10);
      Main.desactivarSpinner()
    } catch (error) {
      console.log(error)
      Main.desactivarSpinner()
    }
  }
  const addClassAddGrid = ()=>{  
    let row = refData.current.hotInstance.getSourceData();
    for (let a = 0; a < row.length; a++) {
      const items = row[a];
      if(items.IND_NUEVO === 'S'){
        for (let b = 0; b < 8; b++) {
          refData.current.hotInstance.setCellMeta(a, b, 'className', 'lightblue-bg-verd');         
        }
      }
      refData.current.__hotInstance.updateSettings({      
        cellRow:a
      },);
    }    
  }
  const guardar = async ()=>{
    let Permiso  = Main.VerificaPermiso(FormName)
    if(Permiso.update !== 'S'){
      Main.message.warning({
        content  : `No cuenta con los permisos para Actualizar!`,
        className: 'custom-class',
        duration : `${2}`,
        style    : {marginTop: '2vh'},
      });
      return
    }

    let rowCab        = refData.current.hotInstance.getSourceData();
    var update_cab    = rowCab.filter(item => item.ESTADO === 'C');
    var aditionalData = [{"cod_usuario":sessionStorage.getItem('cod_usuario'),"cod_empresa":cod_empresa}];

    var data = { update_cab     ,
                 aux_update_cab : banRef.current.rowCan,
                 aditionalData
              }
    if( update_cab.length > 0){
      Main.activarSpinner()
      await Main.Request(mainUrl.url_update,"POST",data).then(async(resp) => {
        Main.desactivarSpinner();
        if(resp.data.ret === 1){
          Main.setModifico(FormName);
          Main.message.success({
            content  : `Procesado correctamente!!`,
            className: 'custom-class',
            duration : `${2}`,
            style    : {
              marginTop: '4vh',
            },
          });
          inicialForm(null,0,0);
        }else{
          Main.alert(resp.data.p_mensaje, '¡Atención!', 'alert', 'OK')
        }
      })
    }else{
      Main.desactivarSpinner();
      Main.message.info({
        content  : `No encontramos cambios para guardar`,
        className: 'custom-class',
        duration : `${2}`,
        style    : {
            marginTop: '2vh',
        },
      });
      Main.setModifico(FormName);
    }
  }  
  const func_Report = async(e)=>{
    Main.activarSpinner();
    if(
      (e.COD_EMPRESA     === undefined || e.COD_EMPRESA      === null || e.COD_EMPRESA     === '') ||
      (e.NRO_COMPROBANTE === undefined || e.NRO_COMPROBANTE  === null || e.NRO_COMPROBANTE === '') ||
      (e.TIP_COMPROBANTE === undefined || e.TIP_COMPROBANTE  === null || e.TIP_COMPROBANTE === '') || 
      (e.SER_COMPROBANTE === undefined || e.SER_COMPROBANTE  === null || e.SER_COMPROBANTE === '') 
    ){
      return Main.desactivarSpinner();
    }
    let data = {
      P_COD_EMPRESA     : e.COD_EMPRESA    ,
      P_NRO_COMPROBANTE : e.NRO_COMPROBANTE ,
      P_TIP_COMPROBANTE : e.TIP_COMPROBANTE ,
      P_SER_COMPROBANTE : e.SER_COMPROBANTE ,
    }
    try {
      await Main.Request( mainUrl.url_reporte, 'POST', data)
      .then((res) => {
        buildReport(res.data.rows);
      })  
    } catch (error) {
      console.log('func_Report',error)
      Main.desactivarSpinner();
    }
  }
  const buildReport = async(data) => {
    var rows = [];
    let comprobantes = Main._.uniq( data, (item)=>{ return item.NRO_COMPROBANTE; });  
     // eslint-disable-next-line
    comprobantes.map(() => {
      // eslint-disable-next-line
      data.map( item => { 
          rows = [ ...rows, {
            COD_SUCURSAL     : `${item.COD_SUCURSAL} ${item.DESC_SUCURSAL}`,
            REFERENCIA       : item.REFERENCIA,
            COD_DEPOSITO     : item.COD_DEPOSITO,
            NRO_COMPROBANTE  : item.NRO_COMPROBANTE,
            COD_BARRA_ART    : item.COD_BARRA_ART ? item.COD_BARRA_ART : '',
            DESC_ARTICULO    : item.DESC_ARTICULO,
            DESC_UM          : item.DESC_UM,
            CANTIDAD         : item.CANTIDAD,
            COD_DIRECCION    : item.COD_DIRECCION,
          }]
      });
    });
    
    Report(rows).then(()=>{
      Main.desactivarSpinner();;
    });
  }
  const funcionCancelar = ()=>{
    Main.setModifico(FormName);
    inicialForm(null,0,0);
  }
  const iconAccion = React.useCallback((info,row,column)=>{
    if(info){
      if(column === 9){
        history.push({
          pathname    : '/cm/cmfactur',
          rutaAtras   : '/cm/cmcoffac',
          state       : info,
          rowData     : refData.current.hotInstance.getSourceData(),          
          tabkey      : '',
          columnIndex : column,
          rowIndex    : row,
        })
      }else if(column === 10){
        func_Report(info);
      }      
    }
    // eslint-disable-next-line 
  },[])
  const validaRow = React.useCallback((row,name,enter)=>{
    if(banRef.current.valida){
      banRef.current.valida = false;
      return
    } 
    try {
      let data = {
          COD_EMPRESA      : row.COD_EMPRESA
        , TIP_COMPROBANTE  : row.TIP_COMPROBANTE
        , SER_COMPROBANTE  : row.SER_COMPROBANTE
        , NRO_COMPROBANTE  : row.NRO_COMPROBANTE
        , IND_COMPRA_LOCAL : row.IND_COMPRA_LOCAL
      }
      Main.activarSpinner()
      Main.Request(mainUrl.url_valida_fac,'POST',data).then((resp)=>{
        Main.desactivarSpinner()
        if(resp.data.ret === 0){
          Main.message.warning({
            content  : resp.data.p_mensaje,
            className: 'custom-class',
            duration : `${2}`,
            style    : {marginTop: '2vh'},
          });
          banRef.current.valida = true
          refData.current.hotInstance.setDataAtCell(row.rowIndex, row.rowColumn, row.ESTADO_ANT);
        }else{
          refData.current.hotInstance.view.settings.data[row.rowIndex].updated = true
          refData.current.hotInstance.updateSettings({      
            cellRow:row.rowIndex,
          });  
        }
      });
    } catch (error) {
      Main.desactivarSpinner()
      console.log(error)
    }
    // eslint-disable-next-line 
  },[])
  const handleonkeydown = React.useCallback((e)=>{
    const hotInstance = refData.current.hotInstance;
    e.preventDefault();
    if(hotInstance){
      hotInstance.getSelected()
      const selected = hotInstance?.getSelected() ? hotInstance?.getSelected()[0] : [0,0,0,0];
      if(e.keyCode === 118 && [0,1,4,5,6].includes(selected[1])){
        Main.activarSpinner()
        hotInstance.loadData([]);
        let valor  = JSON.parse(JSON.stringify(objetoInicialCab));
        banRef.current.objetoF7 = valor
        hotInstance.loadData([valor]);
        setTimeout(()=>{
          const meta = hotInstance.getCellMetaAtRow(0);
          meta[selected[1]].readOnly = false;
          hotInstance.selectCell(0, selected[1]);
          Main.desactivarSpinner()  
        },5)
      }else if([0,1,4,5,6].includes(selected[1])){
        try {
          let data = banRef.current.objetoF7;        
          data[mainColumn.columns[selected[1]].data] = e.target.value.length > 0 ? e.target.value.trim() : data[mainColumn.columns[selected[1]].data]
          data.updated = false
          inicialForm(data,0,selected[1]);        
          hotInstance.deselectCell();
          let activeEditor = hotInstance?.getActiveEditor();
          if (activeEditor) activeEditor.finishEditing();
          Main.desactivarSpinner() 
        } catch (error) {
          console.log(error)
          Main.desactivarSpinner()
        }        
      }
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
          SaveForm={()=>guardar()} 
          refs={{ref:buttonSaveRef}}
          formName={FormName}
          cancelar={funcionCancelar}
        />
        <CMCOFFAC        
          FormName={FormName}
          idComp={idComp}
          refData={refData}
          buttomAccion={iconAccion}
          validaRow={validaRow}
          handleonkeydown={handleonkeydown}
        />
      </Main.Paper>
      </Main.AntLayout>
    </Main.Spin>      
  );
});

export default MainCM;