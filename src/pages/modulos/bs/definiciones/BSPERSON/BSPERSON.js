import React, { memo }   from 'react';
import Main              from '../../../../../componente/util/main';
import BSPERSON          from './View.jsx';

import mainUrl           from './url/mainUrl';
import mainInput         from './inputValida/mainInputValida';
import { objetoinicial } from './ObjetoInicial/mainInicial'
import './stlyles/bsperson.css';

const FormName   = 'BSPERSON';
const TituloList = "Persona";


var id_cabecera    	  = '';
const set_id_cabecera = (e)=>{
  id_cabecera = e;
}
const get_id_cabecera = ()=>{
  return id_cabecera;
}
var indice = 0
const setIndice = (e) => {
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
var bandPost_Cab_Det  = true;


const MainBs = memo(() => {
  const defaultOpenKeys     = Main.DireccionMenu(FormName);
  const defaultSelectedKeys = Main.Menu(FormName);
  const cod_empresa         = sessionStorage.getItem('cod_empresa');
  const [form]              = Main.Form.useForm();
  const permisoEspecial     = Main.getPermisosEspecial(FormName);

  //  UseRef
  const buttonSaveRef       = React.useRef();
  const refCodPersona       = React.useRef()
  const refNroDocumen       = React.useRef()
  const refDigVerif         = React.useRef()
  const refCab              = React.useRef({ data: [], dataCan:[], delete : [], activateCambio:false});
  const refModal            = React.useRef({  modalColumn : []
                                            , data        : []
                                            , ModalTitle  : ''
                                            , idInput     : ''
                                            , dataParams  : ''
                                            , url_buscador: ''
                                          })
  const refModalData = React.useRef()
  const [shows, setShows] = React.useState(false);

  Main.useHotkeys(Main.Guardar, (e) =>{
		e.preventDefault();
		buttonSaveRef.current.click();
	},{enableOnFormTags: ['input', 'select', 'textarea']});
	Main.useHotkeys('f7', (e) => {
    e.preventDefault();
	});
  React.useEffect(() => {
    initialForm();
    // eslint-disable-next-line
  },[])

  const initialForm = (f7_delete = false, idFocus = 'NOMBRE') => {
    setIndice(0);
    var newKey 					    = Main.uuidID();
    let valor  						  = JSON.parse(JSON.stringify(objetoinicial));
    valor.ID							  = newKey;
    valor.COD_USUARIO 		  = sessionStorage.getItem('cod_usuario');
		valor.ALTA_POR				  = sessionStorage.getItem('cod_usuario');    
    valor.ES_FISICA				  = 'S';
    valor.FEC_ALTA				  = Main.moment().format('DD/MM/YYYY HH:mm:ss');

    if(!f7_delete) form.setFieldsValue(valor);
    
    refCab.current.data     = [valor]
    refCab.current.dataCan  = JSON.parse(JSON.stringify([valor]));
    
    setTimeout( ()=> {	
			document.getElementById(idFocus).focus();
		});
    document.getElementById("indice").textContent         = "1"
		document.getElementById("total_registro").textContent = "?";
		document.getElementById("mensaje").textContent 				= "";
    bloqueoInput(!f7_delete)
  }
  const guardar = async () => {
    var permisoActualizacion = false;
    var permisoIsertar 	     = false;

    if(refCab.current.delete.length === 0){
      let verificar_input_requerido = Main.validarCamposRequeridos();
      if(!verificar_input_requerido) return      
    }

    Main.quitarClaseRequerido();

    // FILTER
    var dependencia      = [];
    // let url_get_cab_cod  = `${mainUrl.url_buscar_cod_persona}${cod_empresa}`
    let url_get_cab_cod  = undefined;
    let info          	 = await Main.GeneraUpdateInsertCab([refCab.current.data[getIndice()]],'COD_PERSONA',url_get_cab_cod,dependencia,false,false,true);
    var updateInserData  = info.updateInsert;
    if(!permisoActualizacion) permisoActualizacion = info.actualizar;
    if(!permisoIsertar)       permisoIsertar 	     = info.insertar;
    var deleteCab        = refCab.current.delete;

    if(info.insertar){
      // eslint-disable-next-line 
      updateInserData.map((itmes)=>{
        if(itmes.COD_IDENT === 'RUC') itmes.COD_PERSONA = `${itmes.NRO_DOCUMENTO}-${itmes.NRO_DIG_VER}`;
        else itmes.COD_PERSONA = itmes.NRO_DOCUMENTO
      })
    }

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
      updateInserData   ,
      aux_updateInserData :  refCab.current.dataCan[getIndice()],
      deleteCab	        , 
      AditionalData
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
            refCab.current.activateCambio = false;
            refCab.current.delete         = []

            let keyPamas = await getParmas(true)
            keyPamas.COD_PERSONA = info.rowsAux[0].COD_PERSONA
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
  const AddRow = () => {
    initialForm(false,'NOMBRE')
  }
  const deleteRow = () => {
    refCab.current.delete = [refCab.current.data[getIndice()]]
    refCab.current.activateCambio = true;
    form.resetFields();
    Main.modifico(FormName)
    initialForm(true)
  }
  const funcionCancelar = () => {
    // eslint-disable-next-line
    mainInput.validaInput.map( item => {
      item.valor_ant = null;
    });
    Main.activarSpinner()
    Main.setModifico(FormName);
    refCab.current.activateCambio = false;
    refCab.current.delete         = []
    Main.setBuscar(FormName,false);
    if(refCab.current.data[getIndice()].insertDefault || refCab.current.data[getIndice()].inserted){
      Main.desactivarSpinner()
      initialForm()
    }else{
      refCab.current.data       = JSON.parse(JSON.stringify(refCab.current.dataCan))
      refCab.current.dataCan    = JSON.parse(JSON.stringify(refCab.current.data));
      mainInput.restablecerValida();
      Main.desactivarSpinner()
      loadForm(refCab.current.data,getIndice())      
    }
    
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
  //********** EVENTOS   ****************************/ 
  const getParmas = (retornaNull = false) =>{
    var data = {
      COD_PERSONA    : retornaNull ? '' : form.getFieldValue('COD_PERSONA')   !== undefined ? form.getFieldValue('COD_PERSONA')   : '',
      NOMBRE         : retornaNull ? '' : form.getFieldValue('NOMBRE')        !== undefined ? form.getFieldValue('NOMBRE')        : '',
      NOMB_FANTASIA  : retornaNull ? '' : form.getFieldValue('NOMB_FANTASIA') !== undefined ? form.getFieldValue('NOMB_FANTASIA') : '',
      TIPO_SOCIEDAD  : retornaNull ? '' : form.getFieldValue('TIPO_SOCIEDAD') !== undefined ? form.getFieldValue('TIPO_SOCIEDAD') : '',
      COD_SECTOR     : retornaNull ? '' : form.getFieldValue('COD_SECTOR')    !== undefined ? form.getFieldValue('COD_SECTOR')    : '',
      COD_PAIS       : retornaNull ? '' : form.getFieldValue('COD_PAIS')      !== undefined ? form.getFieldValue('COD_PAIS')      : '',
      COD_PROVINCIA  : retornaNull ? '' : form.getFieldValue('COD_PROVINCIA') !== undefined ? form.getFieldValue('COD_PROVINCIA') : '',
      COD_CIUDAD     : retornaNull ? '' : form.getFieldValue('COD_CIUDAD')    !== undefined ? form.getFieldValue('COD_CIUDAD')    : '',
      COD_BARRIO     : retornaNull ? '' : form.getFieldValue('COD_BARRIO')    !== undefined ? form.getFieldValue('COD_BARRIO')    : '',
      COD_IDENT      : retornaNull ? '' : form.getFieldValue('COD_IDENT')     !== undefined ? form.getFieldValue('COD_IDENT')     : '',
      NRO_DOCUMENTO  : retornaNull ? '' : form.getFieldValue('NRO_DOCUMENTO') !== undefined ? form.getFieldValue('NRO_DOCUMENTO') : '',
      NRO_DIG_VER    : retornaNull ? '' : form.getFieldValue('NRO_DIG_VER')   !== undefined ? form.getFieldValue('NRO_DIG_VER')   : '',
      ES_FISICA      : retornaNull ? '' : form.getFieldValue('ES_FISICA')     !== undefined ? form.getFieldValue('ES_FISICA')     : '',
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
      let data = {   TIPO_SOCIEDAD  : info?.TIPO_SOCIEDAD  ? info?.TIPO_SOCIEDAD  : ''
                   , COD_SECTOR     : info?.COD_SECTOR     ? info?.COD_SECTOR     : ''
                   , COD_PAIS       : info?.COD_PAIS       ? info?.COD_PAIS       : ''
                   , COD_PROVINCIA  : info?.COD_PROVINCIA  ? info?.COD_PROVINCIA  : ''
                   , COD_CIUDAD     : info?.COD_CIUDAD     ? info?.COD_CIUDAD     : ''
                   , COD_BARRIO     : info?.COD_BARRIO     ? info?.COD_BARRIO     : ''
                   , COD_IDENT      : info?.COD_IDENT      ? info?.COD_IDENT      : ''
                }
      try {
        await Main.Request(mainUrl.url_postQueryCab, "POST", data).then((resp) => {          
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

		form.setFieldsValue({
			...value,
			FEC_ALTA 					: value.FEC_ALTA 					  !== ""   && value.FEC_ALTA 		 		  !== null && value.FEC_ALTA 				  !== undefined ? Main.format_h(value.FEC_ALTA) 				 : null,
			FEC_ACTUALIZACION	: value.FEC_ACTUALIZACION   !== ""   && value.FEC_ACTUALIZACION !== null && value.FEC_ACTUALIZACION !== undefined ? Main.format_h(value.FEC_ACTUALIZACION) : null,
			ACTUALIZADO_POR		: value.ACTUALIZADO_POR   	!== null || value.ACTUALIZADO_POR 	!== undefined ? value.ACTUALIZADO_POR : "",
			ALTA_POR          : value.ALTA_POR   					!== null || value.ALTA_POR 				  !== undefined ? value.ALTA_POR        : "",
		});
    bloqueoInput()
    Main.desactivarSpinner()
  }
  const manejaF7 = (idFocus)=>{
    Main.activarSpinner()
    form.resetFields(); 
    refCab.current.activateCambio = false    
    setTimeout(()=>{    
      if(!Main.getViewBuscar(FormName))Main.setBuscar(FormName,true);
      Main.desactivarSpinner()
      initialForm(true,idFocus)
    },10)
  }
  const handleKeyDow = async (e) => {
    if (['Enter', 'Tab'].includes(e.key)) {
      e.preventDefault()
      if (["TIPO_SOCIEDAD","COD_SECTOR","COD_PAIS","COD_PROVINCIA","COD_CIUDAD","COD_BARRIO","COD_IDENT","NRO_DOCUMENTO","NRO_DIG_VER"].includes(e.target.id)) {
        ValidarUnico(e.target.id, e.target.value);      
      } else {
        switch (e.target.id) {
          case "COD_PERSONA":
              document.getElementById('NOMBRE').select();   
            break;
          case "NOMBRE":
            document.getElementById('NOMB_FANTASIA').select();   
          break;
          case "NOMB_FANTASIA":
            document.getElementById('TIPO_SOCIEDAD').select();   
          break;
          case "DIRECCION":
            document.getElementById('TELEFONO').select();   
          break;
          case "TELEFONO":
            document.getElementById('COD_IDENT').select();   
          break;
          case "DIREC_ELECTRONICA":
            document.getElementById('PAGINA_WEB').select();   
          break;
          case "PAGINA_WEB":
            document.getElementById('COD_PERSONA').select();   
          break;
          
          default:
            break;
        }        
      }  
    } else if (['F7', 'F8'].includes(e.key)) {
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
      
    } else if (e.key === 'F9' && ["COD_PERSONA","TIPO_SOCIEDAD","COD_SECTOR","COD_PAIS","COD_PROVINCIA","COD_CIUDAD","COD_BARRIO","COD_IDENT"].includes(e.target.id)) {
      e.preventDefault()
      let aux = '';
      if(e.target.id === 'COD_PERSONA' && refCodPersona.current.input.readOnly) return
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
        case 'TIPO_SOCIEDAD':
          aux = await getData({ valor: 'null' }, mainUrl.url_buscar_tipo_sociedad);
          refModal.current.data = aux
          refModal.current.dataParams = { cod_empresa }
          break;
        case 'COD_SECTOR':
          aux = await getData({ valor: 'null' }, mainUrl.url_buscar_sector);
          refModal.current.data = aux
          refModal.current.dataParams = { cod_empresa }
          break;
        case 'COD_PAIS':
          aux = await getData({ valor: 'null' }, mainUrl.url_buscar_pais);
          refModal.current.data = aux
          refModal.current.dataParams = { cod_empresa }
          break;
        case 'COD_PROVINCIA':
          refModal.current.dataParams = { cod_empresa, cod_pais: form.getFieldValue('COD_PAIS') }
          aux = await getData({ ...refModal.current.dataParams, valor: 'null' }, mainUrl.url_buscar_provincia);
          refModal.current.data = aux
          break;
        case 'COD_CIUDAD':
          refModal.current.dataParams = { cod_empresa, cod_pais: form.getFieldValue('COD_PAIS'), cod_provincia: form.getFieldValue('COD_PROVINCIA') }
          aux = await getData({ ...refModal.current.dataParams, valor: 'null' }, mainUrl.url_buscar_ciudad);
          refModal.current.data = aux
          break;
        case 'COD_BARRIO':
          refModal.current.dataParams = { cod_empresa, cod_pais: form.getFieldValue('COD_PAIS'), cod_provincia: form.getFieldValue('COD_PROVINCIA'), cod_ciudad: form.getFieldValue('COD_CIUDAD') }
          aux = await getData({ ...refModal.current.dataParams, valor: 'null' }, mainUrl.url_buscar_barrio);
          refModal.current.data = aux
          break;
        case 'COD_IDENT':
          refModal.current.dataParams = { cod_empresa }
          aux = await getData({ ...refModal.current.dataParams, valor: 'null' }, mainUrl.url_buscar_tipo_identificacion);
          refModal.current.data = aux
          break;
        default:
          break;
      }
      Main.desactivarSpinner()
      setShows(true)
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
      manejaF7('NOMBRE')
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
  const handleInputChange = (e) => {
    Main.modifico(FormName)
    try {
      refCab.current.data[getIndice()][e?.target?.id ? e?.target?.id : e.target.name ] = e?.target?.value;  
    } catch (error) {
      console.log(error)
    }
    typeEvent()
  }
  const typeEvent = ()=>{
    if(refCab.current.data[getIndice()]['insertDefault']){
      refCab.current.data[getIndice()].insertDefault      = false;
      refCab.current.data[getIndice()].inserted 		      = true;
      refCab.current.data[getIndice()].ALTA_POR	          = sessionStorage.getItem('cod_usuario');
      refCab.current.data[getIndice()].FEC_ALTA           = Main.moment().format('DD/MM/YYYY');
    }
    if(!refCab.current.data[getIndice()]['updated'] && refCab.current.data[getIndice()]['inserted'] !== true){
      refCab.current.data[getIndice()]['updated']         = true;
      refCab.current.data[getIndice()].ACTUALIZADO_POR	  = sessionStorage.getItem('cod_usuario');
      refCab.current.data[getIndice()].FEC_ACTUALIZACION  = Main.moment().format('DD/MM/YYYY');
      refCab.current.activateCambio = true;      
      Main.modifico(FormName);
    } 
    bloqueoInput()
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
        let data = {}
        // eslint-disable-next-line
        valorValida.data.map((x) => { data = { ...data, [x]: form.getFieldValue(x) ? form.getFieldValue(x) : '' } });
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
            valorValida.valor_ant = null;
            // eslint-disable-next-line
            valorValida.out.map(x => {
              form.setFieldsValue({
                ...form.getFieldsValue(),
                [x]: ''
              });
              refCab.current.data[getIndice()][x] = null;
            });
            // eslint-disable-next-line
            valorValida.rel.map(x => {
              form.setFieldsValue({
                ...form.getFieldsValue(),
                [x]: ''
              });
              refCab.current.data[getIndice()][x] = null;
            });
            Main.alert(resp.data.outBinds.p_mensaje, '¡Atención!', 'alert', 'OK')
          }
        })
      } catch (error) {
        console.log('valida frontend', error)
      }
    }    
  }
  //***************** CONTROL DE BLOQUEO ***********/
  const bloqueoInput = (f7 = true)=>{

    if(!refCab.current.data[getIndice()].inserted && !refCab.current.data[getIndice()].insertDefault){
      refCodPersona.current.input.readOnly = true;
      refNroDocumen.current.input.readOnly = permisoEspecial.includes("MODIFICA_DOCUMENTO") ? false : true;
    }else{
      refNroDocumen.current.input.readOnly = false;
      refCodPersona.current.input.readOnly = f7;
    }

    if(form.getFieldValue('COD_IDENT') === 'CI' || form.getFieldValue('COD_IDENT') === ''){
      refDigVerif.current.input.readOnly = true;
    }else{
      refDigVerif.current.input.readOnly = false;
    }
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
              AddForm={AddRow}
              SaveForm={guardar}
              deleteRows={deleteRow}
              cancelar={funcionCancelar}
              formName={FormName}
              vprinf={false}
              refs={{ref:buttonSaveRef}}
              funcionBuscar={funcionBuscar}
              NavigateArrow={NavigateArrow}            
            />
            
            <BSPERSON
              form={form}
              handleKeyDow={handleKeyDow}
              handleKeyUp={handleKeyUp}
              handleInputChange={handleInputChange}
              refs={{refCodPersona,refNroDocumen,refDigVerif}}
            />
          </Main.Paper>
        </Main.AntLayout>
      </Main.Spin>
    
    </>
  );
});

export default MainBs;