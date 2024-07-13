import React, { memo } from 'react';
import Main            from '../../../../../../componente/util/main';
import CCNCRDEF        from './view';
import mainInicial     from './ObjetoInicial/mainInicial'
import mainUrl         from './url/mianUrl';
import mainInput       from './inputValida/mainInput'
import './styles/CCNCRDEF.css';

const FormName   = "CCNCRDEF";
const TituloList = "Nota de Crédito Definitiva"
const idComp     = `GRID_${FormName}`;
let data_len     = 100
const MainCc = memo(() => {

  const [form]              = Main.Form.useForm()
  const cod_empresa         = sessionStorage.getItem('cod_empresa');
  const cod_sucursal        = sessionStorage.getItem('cod_sucursal');
  
  const defaultOpenKeys     = Main.DireccionMenu(FormName);
  const defaultSelectedKeys = Main.Menu(FormName);
  // USESTATE
  const [ shows, setShows ] = React.useState(false);
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

  React.useEffect(()=>{
    inicialForm();
    // eslint-disable-next-line
  },[])

  //******************************************************************* */
  const guardar = () =>{
  }
  const deleteRow = () =>{
  }
  const addRow = ()=>{
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
        valor.COD_EMPRESA   = sessionStorage.getItem('cod_emrpesa')
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
        
        if(!f7_delete)getDetalle(newKey,false,0);
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
    valor.COD_EMPRESA	    = refCab.current.data[indexRow].COD_EMPRESA    ;
    valor.COD_SUCURSAL    = refCab.current.data[indexRow].COD_SUCURSAL   ;
    valor.COD_PROVEEDOR   = refCab.current.data[indexRow].COD_PROVEEDOR  ;
    valor.NRO_COMPROBANTE = refCab.current.data[indexRow].NRO_COMPROBANTE;
    valor.TIP_COMPROBANTE = refCab.current.data[indexRow].TIP_COMPROBANTE;
    valor.SER_COMPROBANTE = refCab.current.data[indexRow].SER_COMPROBANTE;
    valor.idCabecera      = idCabecera ? idCabecera : refCab.current.data[indexRow]?.ID;
    return valor;
  }
  const getDetalle = async (idCabecera, data = false,indexRow = 0,guardar = false)=>{
    let dataParams = data ? data : await getParamsDetalle(idCabecera,indexRow);
    var content = [];
    try {
      var info = await Main.Request(mainUrl.url_listar_det,'POST',dataParams);
      if(info?.data?.rows?.length === 0 || info?.data?.rows === undefined) content = [dataParams];
      else content = info.data.rows
    
      refCab.current.dataCanDet = JSON.parse(JSON.stringify(content));
      refGrid.current?.hotInstance.loadData(content);
      setTimeout(()=>{                
        // ver_bloqueo();
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
        // leftData();  
        break;
      case 'right':
        // rightData();
        break;
      case 'next-left':
        // if(refCab.current.data.length > 1){banRef.current.indice=0;leftData();} 
        // else Main.desactivarSpinner();
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
  const manejaF7 = (idFocus)=>{
    Main.activarSpinner()
    form.resetFields(); 
    refCab.current.activateCambio = false    
    refGrid.current?.hotInstance.loadData([]) 
    setTimeout(()=>{    
      if(!Main.getViewBuscar(FormName))Main.setBuscar(FormName,true);
      Main.desactivarSpinner()      
      inicialForm(true,idFocus);      
      // ver_bloqueo(true)
    })
  }
  const getParmas = (retornaNull = false) =>{
    let indice = banRef.current.indice;
    var data = {
      COD_EMPRESA      : sessionStorage.cod_empresa,
      COD_SUCURSAL     : retornaNull ? '' : Main.nvl(form.getFieldValue('COD_SUCURSAL'),''),
      TIP_COMPROBANTE  : retornaNull ? '' : Main.nvl(refCab.current.data[indice]['TIP_COMPROBANTE'],''),
      SER_COMPROBANTE  : retornaNull ? '' : Main.nvl(refCab.current.data[indice]['SER_COMPROBANTE'],''),
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
      console.log(info);
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
                }
      try {
        await Main.Request(mainUrl.url_listar_pq, "POST", data).then((resp) => {          
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
    let index  = await indice ? indice : banRef.current.indice
    let value  = await data[index] === undefined ? data : data[index];

		form.setFieldsValue({
			...value,
			// FEC_ALTA 					: value.FEC_ALTA 					  !== ""   && value.FEC_ALTA 		 		  !== null && value.FEC_ALTA 				  !== undefined ? Main.format_h(value.FEC_ALTA) 				 : null,
      FEC_COMPROBANTE       : value?.FEC_COMPROBANTE ? Main.dayjs(value?.FEC_COMPROBANTE , 'DD/MM/YYYY') : null,
			// ACTUALIZADO_POR		: value.ACTUALIZADO_POR   	!== null || value.ACTUALIZADO_POR 	!== undefined ? value.ACTUALIZADO_POR : "",
			// ALTA_POR          : value.ALTA_POR   					!== null || value.ALTA_POR 				  !== undefined ? value.ALTA_POR        : "",
		});
    // bloqueoInput()
    Main.desactivarSpinner()
    getDetalle(false, { COD_EMPRESA     : value.COD_EMPRESA
                      , NRO_COMPROBANTE : value.NRO_COMPROBANTE
                      , TIP_COMPROBANTE : value.TIP_COMPROBANTE
                      , SER_COMPROBANTE : value.SER_COMPROBANTE},indice); 
  }
  const onkeyDown = async(e)=>{
    const valorValida = [ "COD_SUCURSAL"    , "COD_CLIENTE"     , "NRO_COMPROBANTE_REF"
                        , "COD_SUBCLIENTE"  , "COD_ZONA"        , "COD_CONDICION_VENTA"
                        , "COD_MOTIVO_NCR"  , "COD_LISTA_PRECIO", "COD_VENDEDOR"
                        , "COD_MONEDA"
                        ];
    if([40,38].includes(e.keyCode)) e.preventDefault();
    if (['Enter', 'Tab'].includes(e.key)) {
      let indice = refCab.current.indice;
      switch (e.target.id) {
        case "NRO_COMPROBANTE":
          document.getElementById('COD_CLIENTE').focus()
          break;
        case "NRO_NCR_CLIENTE":
          setTimeout(()=>refGrid?.current?.hotInstance?.selectCell(0,0))          
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
  const typeEvent = ()=>{
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
    Main.modifico(FormName);
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
      // setClickCell();
    },10)
    // eslint-disable-next-line 
  },[]);
  const validaDetalle = React.useCallback(async(row,name,enter)=>{
    let p_decimales  = refCab.current.data[banRef.current.indice].DECIMALES ? refCab.current.data[banRef.current.indice].DECIMALES : 0;
    let p_cantidad   = '';
    // VALIDACIO CANTIDAD
    if(typeof row.CANTIDAD === 'string'){
      if(row.CANTIDAD.startsWith("-")){
        p_cantidad = Number(row.CANTIDAD_ANT);
        row.CANTIDAD = p_cantidad
      }else p_cantidad = row.CANTIDAD ? Main.numerico_grilla(row.CANTIDAD,p_decimales) : 0;
    }else{
      p_cantidad = row.CANTIDAD ? Main.numerico_grilla(row.CANTIDAD,p_decimales) : 0;
    }
    if(['CANTIDAD'].includes(name)){
      try {
        let data = { PRECIO_UNITARIO_C_IVA  : row.PRECIO_UNITARIO_C_IVA,
                     DECIMALES              : Main.nvl(form.getFieldValue('DECIMALES'),0),
                     MULT                   : row.MULT,
                     DIV                    : row.DIV,
                     PORC_IVA               : row.PORC_IVA,
                     PORC_GRAVADA           : row.PORC_GRAVADA,
                     CANTIDAD               : p_cantidad
                    }
        Main.Request(mainUrl.url_valida_calcCant,'POST',data).then((resp)=>{
          console.log(resp);
          // for(var index in resp.data.outBinds) {
          //   if(!['p_mensaje','ret'].includes(index)){
          //     refGrid.current.hotInstance.view.settings.data[row.rowIndex][index] = resp.data.outBinds[index]
          //   }            
          // }
        })
      } catch (error) {
        console.log(error);
      }
    }
    console.log('p_cantidad',p_cantidad)

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
          />

        </Main.Paper>
      </Main.AntLayout>
    </Main.Spin>      
  );
});

export default MainCc;