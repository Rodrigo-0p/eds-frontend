import React, { memo } from 'react';
import CCCANCAJ        from './view';
import Main            from '../../../../../componente/util/main';
import mainUrl         from './url/mainUrl';
import mainInicial     from './ObjetoInicial/mainInicial';
import mainColumn      from './columnModal/mainColumn';
import './styles/CCCANCAJ.css'

const FormName   = "CCCANCAJ";
const TituloList = "Balcón - Cobranzas"
const idComp     = `GRID_${FormName}`;

const MainCc = memo(({history, location}) => {

  const vcod_empresa        = sessionStorage.getItem('cod_empresa');
  const vcod_sucursal       = sessionStorage.getItem('cod_sucursal');
  const [form]              = Main.Form.useForm()  
  const defaultOpenKeys     = Main.DireccionMenu(FormName);
  const defaultSelectedKeys = Main.Menu(FormName);
  const banRef              = React.useRef({valida:false,objetoF7:{},variable:{}});
  const refGrid	            = React.useRef();

  Main.useHotkeys('f7', (e) => {
    e.preventDefault();
	});
  Main.useHotkeys('f4', (e) => {
    e.preventDefault();
    openF4();
	},{enableOnFormTags: ['input', 'select', 'textarea']});

  React.useEffect(()=>{
    inicialForm();
    get_PreFrom()
    // eslint-disable-next-line 
  },[])
  const get_PreFrom = async() => {
    try {
      let params  = {}
			return await Main.Request(mainUrl.url_preform,"POST",params).then((resp)=>{
        banRef.current.variable = resp.data;        
      });
		} catch (error) {      
			console.log(error);
      return {}
		} finally {
			Main.desactivarSpinner();
		}
  }
  const clearLocation = ()=>{
    if(location.rows){
      location.rows.TIP_COMP = null;
      location.rowIndex      = null;
    }
  }
  const inicialForm = async (data = null,rowIndex = 0 ,columnIndex = 0, TIP_COMP = 'PED')=>{
    TIP_COMP = Main.nvl(location?.rows?.TIP_COMP,TIP_COMP);
    rowIndex = Main.nvl(location.rowIndex,rowIndex);

    Main.activarSpinner();
    let dataParams =  { COD_EMPRESA  :vcod_empresa
                      , COD_SUCURSAL :vcod_sucursal    
                      , TIP_COMP
                      };
   if(data !== null) dataParams = {...data,...dataParams}
    try {
      let content = [];
      form.setFieldsValue(dataParams);
      Main.Request(mainUrl.url_listar_cab,'POST',dataParams).then((resp)=>{
        Main.desactivarSpinner()
        if(resp?.data?.rows?.length === 0 || resp?.data?.rows === undefined){          
          content.push(JSON.parse(JSON.stringify(mainInicial.objetoInicial)));
          if(data){
            Main.message.info({
              content  : `No se encontro datos!!`,
              className: 'custom-class',
              duration : `${2}`,
              style    : {marginTop: '2vh'},
            });
          }
        } else content = resp.data.rows;   
        refGrid.current.hotInstance.loadData(content);
        setTimeout(()=>{
          clearLocation();
          refGrid.current.hotInstance.selectCell(rowIndex,columnIndex);
        },10);
      })
    } catch (error) {
      clearLocation();
      Main.desactivarSpinner();
      console.log(error);
    }
  }
  const funcionBuscar = ()=>{
  }
  const cancelar = ()=>{
    Main.setModifico(FormName);
    inicialForm();
  }
  const handleRadioChange = (e)=>{
    inicialForm(null,0,0,e.target.value)
  }
  const handleonkeydown = React.useCallback((e)=>{    
    const hotInstance = refGrid.current.hotInstance;
    e.preventDefault();
    if(hotInstance){
      hotInstance.getSelected()
      let columnIndex = [0,1,2,3]
      const selected = hotInstance?.getSelected() ? hotInstance?.getSelected()[0] : [0,0,0,0];
      if(e.keyCode === 118 && columnIndex.includes(selected[1])){
        Main.activarSpinner()
        hotInstance.loadData([]);
        let valor  = JSON.parse(JSON.stringify(mainInicial.objetoInicial));
        banRef.current.objetoF7 = valor
        hotInstance.loadData([valor]);
        setTimeout(()=>{
          const meta = hotInstance.getCellMetaAtRow(0);
          // eslint-disable-next-line 
          columnIndex.map((indice)=>{
            meta[indice].readOnly = false;  
          })
          hotInstance.selectCell(0, selected[1]);
          Main.desactivarSpinner()  
        },5)
      }else if(columnIndex.includes(selected[1])){
        try {
          let data = banRef.current.objetoF7; 
          let nameColumn   = mainColumn.columns[selected[1]].data;       
          data[nameColumn] = e.target.value && e.target.value.length  > 0 ? 
                                                        e.target.value.trim().length             > 0 ? 
                                                        e.target.value.trim()                    : data[nameColumn] : data[nameColumn];
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
  const validaRow = (row,name)=>{
    switch (name) {
      case "SALDO_CUOTA":
        if(["ANT","NCR","SNC"].includes(row.TIP_COMPROBANTE)){
          if(Main.nvl(row.SALDO_CUOTA,0) > Main.nvl(row.SALDO_CUOTAS,0)){
            refGrid.current.hotInstance.setDataAtCell(row.rowIndex, row.rowColumn, row.SALDO_CUOTAS);
            let vsaldo_cuotas = Main.currency(row.SALDO_CUOTAS, { separator:'.',decimal:',',precision:Main.nvl(row.DECIMALES,0),symbol:''}).format();
            refGrid.current.hotInstance.deselectCell();
            Main.alert(`El monto a cancelar no puede ser mayor a ${row.SIGLAS} ${vsaldo_cuotas}`, '¡Atención!', 'alert', 'OK')            
          }else if(Main.nvl(row.SALDO_CUOTA,0) <= 0){
            refGrid.current.hotInstance.setDataAtCell(row.rowIndex, row.rowColumn, row.SALDO_CUOTAS);
            refGrid.current.hotInstance.deselectCell();
            Main.alert( 'El monto a cancelar no puede ser cero 0 menor', '¡Atención!', 'alert', 'OK')
          }
        }
        break;
      case "IND_AUTORIZAR":
          try {
            let data = {  COD_EMPRESA     : sessionStorage.getItem('cod_empresa')
                        , COD_USUARIO     : sessionStorage.getItem('cod_usuario')
                        , TIP_COMPROBANTE : row.TIP_COMPROBANTE
                        , SER_COMPROBANTE : row.SER_COMPROBANTE
                        , NRO_COMPROBANTE : row.NRO_COMPROBANTE
                        , IND_BLOQUEADO   : row.IND_BLOQUEADO
                        , COBRAR_EFE      : row.COBRAR_EFE
                        , IND_AUTORIZAR   : row.IND_AUTORIZAR
                        , COD_CLIENTE     : row.COD_CLIENTE
                       }
            Main.activarSpinner();
            Main.Request(mainUrl.url_valida_indAutoriza,'POST',data).then((resp)=>{
              Main.desactivarSpinner();
              if(resp.data.outBinds.ret === 1){
                refGrid.current.hotInstance.setDataAtCell(row.rowIndex, row.rowColumn, resp.data.outBinds.IND_AUTORIZAR);
                if(Main.nvl(resp.data.outBinds.p_mensaje,'N') !== 'N'){
                  Main.message.warning({
                    content  : resp.data.outBinds.p_mensaje,
                    className: 'custom-class',
                    duration : `${2}`,
                    style    : {marginTop: '2vh'},
                  });
                }
              }else{
                refGrid.current.hotInstance.setDataAtCell(row.rowIndex, row.rowColumn, resp.data.outBinds.IND_AUTORIZAR);
                Main.alert(resp.data.outBinds.p_mensaje, '¡Atención!', 'alert', 'OK')
              }
            })
          } catch (error) {
            console.log(error)
          }  
      break;
      case "IND_RUBRICAR":
        try {
          let data = {  COD_EMPRESA     : sessionStorage.getItem('cod_empresa')
                      , COD_USUARIO     : sessionStorage.getItem('cod_usuario')
                      , TIP_COMPROBANTE : row.TIP_COMPROBANTE
                      , SER_COMPROBANTE : row.SER_COMPROBANTE
                      , NRO_COMPROBANTE : row.NRO_COMPROBANTE
                      , IND_AUTORIZAR   : Main.nvl(row.IND_AUTORIZAR,'N')
                      , IND_RUBRICAR    : row.IND_RUBRICAR
                      , COD_CLIENTE     : row.COD_CLIENTE
                      , CLIENTE_OCA     : Main.nvl(banRef.current.variable.CLIENTE_OCA,'')
                      }
          Main.activarSpinner();
          Main.Request(mainUrl.url_valida_indRubicar,'POST',data).then((resp)=>{
            Main.desactivarSpinner();
            if(resp.data.outBinds.ret === 1){
              refGrid.current.hotInstance.setDataAtCell(row.rowIndex, row.rowColumn, resp.data.outBinds.IND_RUBRICAR);
              if(Main.nvl(resp.data.outBinds.p_mensaje,'N') !== 'N'){
                Main.message.warning({
                  content  : resp.data.outBinds.p_mensaje,
                  className: 'custom-class',
                  duration : `${2}`,
                  style    : {marginTop: '2vh'},
                });
              }
            }else{
              refGrid.current.hotInstance.setDataAtCell(row.rowIndex, row.rowColumn, resp.data.outBinds.IND_RUBRICAR);
              Main.alert(resp.data.outBinds.p_mensaje, '¡Atención!', 'alert', 'OK')
            }
          })
        } catch (error) {
          console.log(error)
        }  
      break;
      default:
        break;
    }
  }
  const openF4 = ()=>{
    console.log('entro aquiii',);
    let data    = Main.nvl(refGrid.current.hotInstance.getSourceData(),[]);
    let vFilter = data.filter(value => value.IND_AUTORIZAR === 'D');
    console.log('esto es lo que trajo ',vFilter);

    // declare verror   exception;
    //     vmensaje varchar2(400);
    // BEGIN
    //   IF (  ( nvl(:b_orden.ind_pagar    ,'N') = 'P' ) or
    //         ( nvl(:b_orden.ind_autorizar,'N') = 'D' ) and
    //         ( nvl(:b_orden.ind_rubricar ,'N') = 'N' )  ) THEN
    //     procesa_cobros;
    //   ELSIF (  ( nvl(:b_orden.ind_pagar    ,'N') = 'N' ) and
    //             ( nvl(:b_orden.ind_autorizar,'N') = 'N' ) and
    //             ( nvl(:b_orden.ind_rubricar ,'N') = 'R' )  ) THEN
    //     procesa_rubricar;
    //   END IF;
    // EXCEPTION
    // WHEN verror THEN
    //   mensaje_ex(vmensaje,2);
    //   raise form_trigger_failure;	
    // WHEN others THEN
    //   mensaje_ex('Error al llamar al movimiento de caja. - '||SQLERRM, 3);
    //   raise form_trigger_failure;
    // END;
  }
  const iconAccion = React.useCallback((info,row,column)=>{
    if(info){
      if(['PED','PRE','FCO','ECO','ECR'].includes(info.TIP_COMPROBANTE)){
        ver_pedido(info,row)
      }else if(['NCE','NCR'].includes(info.TIP_COMPROBANTE)){
        ver_nota_credito(info,row)
      }
    }
  },[])

  const ver_pedido = (rows,rowIndex)=>{
    let url_form  = '/cm/cmfactur';
    if(rows.TIP_COMPROBANTE === 'PED') url_form = '/vt/vtpedido'
    rows.TIP_COMP = form.getFieldValue('TIP_COMP')
    history.push({
      pathname    : url_form,
      rutaAtras   : '/cc/cccancaj',
      state       : rows,
      rowData     : refGrid.current.hotInstance.getSourceData(),          
      tabkey      : '',
      columnIndex : 0,
      rowIndex    : rowIndex,
    })    
  }
  const ver_nota_credito = (rows,rowIndex)=>{
    rows.TIP_COMP = form.getFieldValue('TIP_COMP')
    history.push({
      pathname    : '/cc/ccncrdef',
      rutaAtras   : '/cc/cccancaj',
      state       : rows,
      rowData     : refGrid.current.hotInstance.getSourceData(),          
      tabkey      : '',
      columnIndex : 0,
      rowIndex    : rowIndex,      
    })  
  }

  return (
    <Main.Spin spinning={false} delay={500}>
      <Main.AntLayout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
        <Main.Paper className="paper-style">
          <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${TituloList}`} />
          <div className="paper-header">
            <Main.Title level={4} className="title-color">
              {TituloList}<div level={5} style={{ float: 'right', marginTop: '10px', marginRight: '5px', fontSize: '10px' }} className="title-color">{FormName}</div>
            </Main.Title>
          </div>

          <Main.HeaderMenu 
            // refs={{ref:buttonSaveRef}}
            formName={FormName}
            funcionBuscar={funcionBuscar}
            cancelar={cancelar}
          />

          <CCCANCAJ
            form={form}
            FormName={FormName}
            handleRadioChange={handleRadioChange}
            refGrid={refGrid}
            idComp={idComp}
            handleonkeydown={handleonkeydown}
            validaRow={validaRow}
            buttomAccion={iconAccion}
          />
          
        </Main.Paper>
      </Main.AntLayout>      
    </Main.Spin>
  );
});

export default MainCc;