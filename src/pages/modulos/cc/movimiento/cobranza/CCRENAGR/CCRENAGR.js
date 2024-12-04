import React, { memo }  from 'react';
import CCRENAGR         from './view';
import Main             from '../../../../../../componente/util/main';
import mainUrl          from './url/mainUrl';
import mainInput        from './inputValida/mainInputValida';
import mainObjetInicial from './ObjetoInicial/mainInicial';
import mainColumn       from './columnModal/mainColumna';
import './styles/CCRENAGR.css'


const FormName   = "CCRENAGR";
const TituloList = "Rendición - Sin Planilla"
const idComp     = `GRID_${FormName}`;

const MainCc = memo(() => {

  const cod_empresa         = sessionStorage.getItem('cod_empresa');
  const cod_sucursal        = sessionStorage.getItem('cod_sucursal');
  const [form]              = Main.Form.useForm()  
  const defaultOpenKeys     = Main.DireccionMenu(FormName);
  const defaultSelectedKeys = Main.Menu(FormName);
  // USESTATE
  const [ shows, setShows ] = React.useState(false);
  // REF
  const refGrid	            = React.useRef();
  const banRef              = React.useRef({indice:0,objetoF7:{},f7:false})
  const refCab              = React.useRef({ data: [{}], dataCan:[]   , delete:[]   , activateCambio:false
                                           , dataCanDet:[], deleteDet:[] });
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
	},{enableOnFormTags: ['input', 'select', 'textarea']});
	Main.useHotkeys('f7', (e) => {
    e.preventDefault();
	});

  React.useEffect(()=>{
    inicialForm();
    // eslint-disable-next-line
  },[])

  const get_PreFrom = async() => {
    try {
      let params  = {
                      COD_EMPRESA : cod_empresa ,
                      COD_SUCURSAL: cod_sucursal,
                      FORMNAME    : FormName    ,
                      COD_USUARIO : sessionStorage.cod_usuario
                    }
			return await Main.Request(mainUrl.url_buscar_preForm,"POST",params).then((resp)=>{
        return resp.data ? resp.data : {}
      });
		} catch (error) {      
			console.log(error);
      return {}
		} finally {
			Main.desactivarSpinner();
		}
  }
  const inicialForm = async(idFocus = 'COD_CLIENTE')=>{
    let valor  = JSON.parse(JSON.stringify({...mainObjetInicial.objetoInicialCab}));
    
    valor.COD_EMPRESA  = sessionStorage.getItem('cod_empresa');
    valor.COD_SUCURSAL = sessionStorage.getItem('cod_sucursal');
    valor.COD_USUARIO  = sessionStorage.getItem('cod_usuario');

    let newKey = Main.uuidID()
    valor.ID	 = newKey;
    valor.COD_SUCURSAL = cod_sucursal;
    let result_preForm = await get_PreFrom();
    if(Object.keys(result_preForm).length > 0) valor   = {...valor, ...result_preForm}
    form.resetFields();
    form.setFieldsValue(valor);
    setTimeout( ()=> {				
      document.getElementById(idFocus).select();
      getDetalle(newKey,false,0);
		},20);
  }
  const getParamsDetalle = async (idCabecera = false, indexRow = 0)=>{
    var newKey            = Main.uuidID();
    var valor             = await {...mainObjetInicial.objetoInicialDet};
    valor.ID	            = newKey;
    valor.COD_EMPRESA	    = sessionStorage.cod_empresa;
    valor.idCabecera      = idCabecera ? idCabecera : refCab.current.data[indexRow]?.ID;
    return valor;
  }
  const getDetalle = async (idCabecera, data = false,indexRow = 0,indexcolumn = -1)=>{
    let dataParams = data ? data : await getParamsDetalle(idCabecera,indexRow);
    var content = [0,1,2];
    try {
      var info = await Main.Request(mainUrl.url_buscar_cabecera,'POST',dataParams);
      if(info?.data?.rows?.length === 0 || info?.data?.rows === undefined){
        if(indexcolumn !== -1){
          Main.message.info({
            content  : `No se han encontrado registros!!`,
            className: 'custom-class',
            duration : `${2}`,
            style    : { marginTop: '2vh'},
          });
        }
        content = [dataParams];
      }else content = info.data.rows
    
      refCab.current.dataCanDet = JSON.parse(JSON.stringify(content));
      refGrid.current?.hotInstance.loadData(content);

      setTimeout(()=>{         
        Main.desactivarSpinner()       
        setTimeout(()=>Main.setFocusedRowIndex(0,undefined,refGrid,idComp),10);
        if(indexcolumn !== -1)refGrid.current.hotInstance.selectCell(indexRow,indexcolumn);
      },15);
    } catch (error) {
      console.error(error);
    }
  }
  const cancelar = ()=>{
    mainInput.restablecerValida()
    Main.setModifico(FormName);
    if(Main.nvl(form.getFieldValue('COD_CLIENTE'),null) !== null){
      buscarButton()
    }else{
      refGrid.current?.hotInstance.loadData([]);
      setTimeout(() =>inicialForm());  
    }
  }
  const setClickCell = ()=>{
    getTotal()
  }
  const handleKeyDown = async (e)=>{
    if (['Enter', 'Tab'].includes(e.key)) {
      e.preventDefault();
      switch (e.target.id) {        
        case "FECHA_DESDE":
          setTimeout(()=>{
            document.getElementsByClassName('ant-picker-dropdown')[0].style.visibility = 'collapse'
          })
          document.getElementById('FECHA_HASTA').focus();            
        break;
        case "FECHA_HASTA":
          setTimeout(()=>{
            document.getElementsByClassName('ant-picker-dropdown')[1].style.visibility = 'collapse'
          })
          document.getElementById('NRO_CUENTA').focus();            
        break;
        case "FCO":
          document.getElementById('FCR').focus();            
        break;
        case "FCR":
          document.getElementById('VEN').focus();            
        break;
        case "VEN":
          document.getElementById('CHE').focus();            
        break;
        case "CHE":
          document.getElementById('TAR').focus();            
        break;
        case "TAR":
          document.getElementById('ND').focus();            
        break;
        case "ND":
          document.getElementById('BUTTOMBUSCAR').focus();            
        break;
        default:
          break;
      }
      if(['COD_CLIENTE','NRO_CUENTA'].includes(e.target.id)){
        Main.modifico(FormName)
        ValidarUnico(e.target.id, e.target.value);
      } 
    }else if (e.key === 'F9' && ['COD_CLIENTE','NRO_CUENTA'].includes(e.target.id)){
      e.preventDefault()
      let aux = '';

      refModal.current.idInput = e.target.id
      let items = mainInput.ModalF9[e.target.id]
      refModal.current.ModalTitle   = items.title;
      refModal.current.modalColumn  = items.column;
      refModal.current.url_buscador = items.url;

      switch (e.target.id) {
        case "COD_CLIENTE":
          aux = await Main.getData({ valor: 'null',cod_empresa },refModal.current.url_buscador);
          refModal.current.data = aux ? aux : []
          refModal.current.dataParams = { cod_empresa }
          break;
        case "NRO_CUENTA":
          aux = await Main.getData({ valor: 'null',cod_empresa,cod_usuario:sessionStorage.cod_usuario },refModal.current.url_buscador);
          refModal.current.data = aux ? aux : []
          refModal.current.dataParams = { cod_empresa ,cod_usuario:sessionStorage.cod_usuario}
        break;
        default:
          break;
      }
      Main.desactivarSpinner()
      setTimeout(() => {
        setShows(true)  
      },10)
    }else if (['F7', 'F8'].includes(e.key)) {
      e.preventDefault()
    }
  }
  const ValidarUnico = async (input, value) => {
    let intOutDate = ['FEC_COMPROBANTE']
    let indice = banRef.current.indice;
    let valorValida = await mainInput.validaInput.find(item => item.input === input);
    if (!Main._.isObject(valorValida)) return;
    let valor = await !isNaN(value) ? value : value.trim();

    if (valor?.length === 0 && !valorValida.requerido && valorValida.validaNull) {
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
    if (form.getFieldValue(valorValida.input) !== valorValida.valor_ant || !valorValida.validaNull) {
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
    }else if(valorValida.validaNull){
      if (valorValida.next !== ""){
        if (valorValida?.idFocus) document.getElementById(valorValida.next).focus();
        else if (valorValida?.idSelect) document.getElementById(valorValida.next).select();
      }
    }    
  }
  const activateButtonCancelar = async(e,nameInput)=>{
    refCab.current.data[banRef.current.indice][nameInput] = await e !== null ? Main.format_N(e.$d) : Main.moment(new Date(),'DD MM YYYY');
    Main.setModifico(FormName);
  }
  const buscarButton = (row = false)=>{
    let data  = row ? row : JSON.parse(JSON.stringify(form.getFieldValue()));
    data.CHE  =  refCab.current.data[banRef.current.indice]?.CHE === 'S' ? 'S' : 'N';
    data.FCO  =  refCab.current.data[banRef.current.indice]?.FCO === 'S' ? 'S' : 'N';
    data.FCR  =  refCab.current.data[banRef.current.indice]?.FCR === 'S' ? 'S' : 'N';
    data.ND   =  refCab.current.data[banRef.current.indice]?.ND  === 'S' ? 'S' : 'N';
    data.TAR  =  refCab.current.data[banRef.current.indice]?.TAR === 'S' ? 'S' : 'N';
    data.VEN  =  refCab.current.data[banRef.current.indice]?.VEN === 'S' ? 'S' : 'N';
    try {
      Main.activarSpinner()
      Main.Request(mainUrl.url_buscar_cabecera,'POST',data).then((resp)=>{
        Main.desactivarSpinner()
        if(resp.data.rows.length > 0 ){ 
          refGrid.current?.hotInstance.loadData(resp.data.rows);  
          setTimeout(()=>{
            refGrid.current.hotInstance.selectCell(0,10);
            getTotal();
          })
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
      console.log(error)
    }
  }
  const handleCheckbox = (e,options)=>{
    let rowValue = {target:{'id':e.target.id,'value': form.getFieldValue(e.target.id) === true ? options[0] : options[1]}}
    refCab.current.data[banRef.current.indice][e.target.id] = rowValue.target.value
  }
  const getTotal = ()=>{
    if(refGrid.current){
      let resul       = refGrid.current.hotInstance.getSourceData()
      const columnSum = resul.reduce((acc, row) => acc + parseFloat(row.MONTO_A_COBRAR || 0), 0);      
      let p_decimales = 3;
      form.setFieldsValue({
        ...form.getFieldsValue(), 
        TOT_COMPROBANTE : Main.currency(columnSum, { separator:'.',decimal:',',precision:p_decimales,symbol:''}).format(),
      });    
    } 
  }  
  const setfocusRowIndex = React.useCallback((valor,row,col)=>{
    if(!Main._.isNull(valor)){
      form.setFieldsValue({
        ...form.getFieldsValue(),
        DESC_CLIENTE_DET : valor.DESC_CLIENTE,
      });
    }
    // eslint-disable-next-line 
  },[]);
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
  const validaAllExterno = React.useCallback(async(row,name)=>{
    if(name !== "IND_COBRAR"){
      refGrid.current.hotInstance.deselectCell();
      var p_monto_a_cobrar  = 0;
      if(typeof row.MONTO_A_COBRAR === 'string'){
        if(row.MONTO_A_COBRAR.startsWith("-")) p_monto_a_cobrar = 0;
        else p_monto_a_cobrar = row.MONTO_A_COBRAR !== '' && row.MONTO_A_COBRAR !== null ? Main.numerico_grilla(row.MONTO_A_COBRAR,3) : 0;
      }else{
        p_monto_a_cobrar = row.MONTO_A_COBRAR !== '' && row.MONTO_A_COBRAR !== null ? Main.numerico_grilla(row.MONTO_A_COBRAR,3) : 0;
      }
      refGrid.current.hotInstance.view.settings.data[row.rowIndex].MONTO_A_COBRAR = p_monto_a_cobrar;
      refGrid.current.hotInstance.setDataAtCell(row.rowIndex, 10, p_monto_a_cobrar);    
      setTimeout(()=>{    
        refGrid.current.hotInstance.selectCell(row.rowIndex,11);
      },10)  
      setTimeout(()=>getTotal());
    }else if(row[name] === 'S'){
      let cabecera = form.getFieldsValue()
      cabecera.COD_EMPRESA  = sessionStorage.cod_empresa;
      cabecera.COD_USUARIO  = sessionStorage.cod_usuario;
      cabecera.TIP_PLANILLA = 'IND'
      let params   = {...row,...cabecera}
      try {
        Main.activarSpinner()
        Main.Request(mainUrl.url_valida_pagar,'POST',params).then((resp)=>{
          Main.desactivarSpinner()
          if(resp.data.outBinds.ret === 1){
            Main.message.success({
              content  : 'Procesado correctamente!!',
              className: 'custom-class',
              duration : 2,
              style    : {
              marginTop: '4vh',
              },
            });
            mainInput.restablecerValida()
            row.MONTO_A_COBRAR = resp.data.outBinds.MONTO_A_COBRAR;
            refGrid.current.hotInstance.setDataAtCell(row.rowIndex, 10, resp.data.outBinds.MONTO_A_COBRAR);
          }else{
            refGrid.current.hotInstance.deselectCell();
            Main.alert(resp.data.outBinds.p_mensaje, '¡Atención!', 'alert', 'OK',undefined,false,false,FormName);
            setTimeout(()=>{
              row.IND_COBRAR = resp.data.outBinds.IND_COBRAR;
              refGrid.current.hotInstance.setDataAtCell(row.rowIndex, 11, 'N');
            },100)
          }
        })
      } catch (error) {
        Main.desactivarSpinner()
        console.log(error);
      }
    }
  // eslint-disable-next-line
  },[])
  const funcionBuscar = (e)=>{
    let keyFuncion = (e)=>{return e};
    let evento = {keyCode:e ? 119 : 118 , preventDefault:keyFuncion,target:{value:''}}
    Main.activarSpinner();
    f7_and_F8(evento);
  }
  const f7_and_F8 = React.useCallback((e)=>{
    const hotInstance = refGrid.current.hotInstance;
    e.preventDefault();
    if(hotInstance){
      hotInstance.getSelected()
      const selected = hotInstance?.getSelected() ? hotInstance?.getSelected()[0] : [0,0,0,0];
      const indexColumn = [0,1,3]
      if(e.keyCode === 118 && indexColumn.includes(selected[1])){
          Main.setBuscar(FormName,true);
          Main.setModifico(FormName);
          Main.activarSpinner()        
          hotInstance.loadData([]);
          let inicialData = mainObjetInicial.objetoInicialDet;
          let newRowValue = form.getFieldValue();
          inicialData     = {...inicialData,...JSON.parse(JSON.stringify(newRowValue))}
          banRef.current.f7       = true;
          banRef.current.objetoF7 = inicialData
          hotInstance.loadData([inicialData]);
          setTimeout(()=>{
          const meta = hotInstance.getCellMetaAtRow(0);
           // eslint-disable-next-line
          indexColumn.map((row)=>{
            meta[row].readOnly = false;
          })
          hotInstance.selectCell(0, selected[1]);
          Main.desactivarSpinner()  
          },5)
      }else if(indexColumn.includes(selected[1])){
          Main.setBuscar(FormName,false);
          let data = JSON.parse(JSON.stringify(banRef.current.objetoF7));
          data.COD_EMPRESA = cod_empresa;
          let nameColumn   = mainColumn.columnDet[selected[1]].data;
          data[nameColumn] = e.target.value && e.target.value.length  > 0 ? 
                            e.target.value.trim().length             > 0 ? 
                            e.target.value.trim()                    : data[nameColumn] : data[nameColumn];
          getDetalle(data.ID,data,selected[0],selected[1]);        
          hotInstance.deselectCell();
          let activeEditor = hotInstance?.getActiveEditor();
          if (activeEditor) activeEditor.finishEditing();
      }
    }
    // eslint-disable-next-line
  },[])
  
  
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
      
          <CCRENAGR
            form={form}
            FormName={FormName}
            refGrid={refGrid}
            idComp={idComp}
            dataRef={refCab}
            setClickCell={setClickCell}
            handleKeyDown={handleKeyDown}
            activateButtonCancelar={activateButtonCancelar}
            buscarButton={buscarButton}
            setfocusRowIndex={setfocusRowIndex}
            handleCheckbox={handleCheckbox}
            validaAllExterno={validaAllExterno}
            f7_and_F8={f7_and_F8}
          />
          
        </Main.Paper>
      </Main.AntLayout>
    </Main.Spin>     
  );
});
export default MainCc;