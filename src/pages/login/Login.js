import React, { memo }                 from 'react';
import { Form, Input, Button, message} from 'antd';
import { UserOutlined, LockOutlined
  , EyeTwoTone, EyeInvisibleOutlined}  from '@ant-design/icons';
import './Login.css';
import loginImg                        from '../../assets/img-svg/login.svg'; 
import Main                            from '../../componente/util/main';
import { Redirect }                    from 'react-router-dom';
const setMenu = async(result) => {
  // MENU
  sessionStorage.setItem("menu", JSON.stringify(result.data.menu) );
  // MENU PADRE
  var menu_padre = [];
  menu_padre = Main._.uniq( result.data.menu, function(item){
      return item.NODO_PADRE;
  });
  menu_padre.sort(function (a, b) {
      if (parseInt(a.ORDEN_PADRE) > parseInt(b.ORDEN_PADRE)) { return  1;}
      if (parseInt(a.ORDEN_PADRE) < parseInt(b.ORDEN_PADRE)) { return -1;}
      return 0;
  });
  sessionStorage.setItem("menu_padre", JSON.stringify(menu_padre) );
  // NODO HIJO 1
  var menu_hijo_1 = [];
  menu_hijo_1 = Main._.uniq( result.data.menu, function(item){
      return item.NODO_HIJO_1;
  });
  menu_hijo_1.sort(function (a, b) {
      if (parseInt(a.ORDEN_MENU) > parseInt(b.ORDEN_MENU)) { return  1;}
      if (parseInt(a.ORDEN_MENU) < parseInt(b.ORDEN_MENU)) { return -1;}
      return 0;
  });
  sessionStorage.setItem("menu_hijo_1", JSON.stringify(menu_hijo_1) );
  // NODO HIJO 2
  var menu_hijo_2 = [];
  menu_hijo_2 = Main._.uniq( result.data.menu, function(item){
      if(item.NODO_HIJO_2 != null){
          return item.NODO_HIJO_2;
      }
  });
  menu_hijo_2 = Main._.flatten(Main._.filter( menu_hijo_2, function(item){
      return item.NODO_HIJO_2 != null;
  }));
  menu_hijo_2.sort(function (a, b) {
      if (parseInt(a.ORDEN_NODO) > parseInt(b.ORDEN_NODO)) { return  1;}
      if (parseInt(a.ORDEN_NODO) < parseInt(b.ORDEN_NODO)) { return -1;}
      return 0;
  });
  sessionStorage.setItem("menu_hijo_2", JSON.stringify(menu_hijo_2) );
  // NODO HIJO 3
  var menu_hijo_3 = [];
  menu_hijo_3 = Main._.uniq( result.data.menu, function(item){
      return item.COD_FORMA;
  });
  menu_hijo_3.sort(function (a, b) {
      if (parseInt(a.ORDEN_FORMA) > parseInt(b.ORDEN_FORMA)) { return  1;}
      if (parseInt(a.ORDEN_FORMA) < parseInt(b.ORDEN_FORMA)) { return -1;}
      return 0;
  });
  sessionStorage.setItem("menu_hijo_3", JSON.stringify(menu_hijo_3) );
}
const setPermisoGrupo = async(result) => {
  sessionStorage.setItem("acceso", JSON.stringify(result.data.per_grupo) );
}
const setPermisoEspecial = async(result) => {
  sessionStorage.setItem("permiso_especial", JSON.stringify(result.data.per_Espec) );
}

const Login = memo(({history}) => {

  const refPass = React.useRef()
  const refUser = React.useRef()
  const [form]  = Form.useForm();
  
  React.useEffect(()=>{
    refUser.current.focus()
  },[])

  if (sessionStorage.getItem("token")) {
    return <Redirect to="/home" />;
  }

  const onFinish = (values) => {
    if(values?.PASSWORD?.trim().length === 0         || 
        values?.USUARIO?.trim()?.length === 0         ||
        values?.PASSWORD?.trim().length === undefined || 
        values?.USUARIO?.trim()?.length === undefined 
        ){        
      message.error({
        content: 'Complete todos los campos',
      });
    }else{
      submitForm(values);
    }
  };
  const submitForm = async(data) => {
      Main.activarSpinner()
      var resp = [];
      var url = `/api/auth/login?in_username=${data.USUARIO}&in_password=${data.PASSWORD}`;
      try {
          resp = await Main.axios({
            method: "GET",
            url: process.env.REACT_APP_BASEURL + url
          })
          .then( response =>{
              return response;
          })          

        const { token } = resp.data;
        sessionStorage.setItem("token"            , token                   );
        sessionStorage.setItem("hash"             , resp.data.CRYPTPASS     );
        sessionStorage.setItem("ruta_logo"        , resp.data.RUTA_LOGO     );
        sessionStorage.setItem("cod_empresa"      , resp.data.COD_EMPRESA   );
        sessionStorage.setItem("desc_empresa"     , resp.data.DESC_EMPRESA  );
        sessionStorage.setItem("cod_sucursal"     , resp.data.COD_SUCURSAL  );
        sessionStorage.setItem("desc_sucursal"    , resp.data.DESC_SUCURSAL );
        sessionStorage.setItem("cod_usuario"      , resp.data.COD_USUARIO   );
        sessionStorage.setItem("nombre_usuario"   , resp.data.NOMBRE        );
        
        await setMenu(resp);
        await setPermisoGrupo(resp);
        await setPermisoEspecial(resp);
        Main.desactivarSpinner()
        history.push('/home');
      } catch (error) {
        Main.desactivarSpinner()
        if(error.response !== undefined){
            if(error.response.status === 401){
                Main.message.error({
                    content  : error.response.data.message,
                    className: 'custom-class',
                    duration : `${2}`,
                    style    : {
                      marginTop: '2vh',
                    },
                  });
            };
        }else{
          Main.message.error('No se ha obtenido respuesta del backend');
        }
      }
  }
  const onKeyDown = (e)=>{
    if(e.keyCode === 13){
      e.preventDefault()        
      switch (e.target.name) {
        case "USUARIO":
            refPass.current.focus()  
          break;
        case "PASSWORD":
          onFinish(form.getFieldsValue());
          break;
        default:
          break;
      } 
    }
  }

  return (              
    <Main.Spin spinning={false} delay={500}>
      <div className="login-container">        
        <div className='bg_color'></div>
        <div className='wave w1'></div>
        <div className='wave w2'></div>
            
        <div className='img-login'>
          <img src={loginImg} alt="scanpy" className="img-logo" /> 
        </div>        
          <div className="login-form-container">          
            <div className="login-header">
              {/* <img src={logo_scanpay} alt="scanpy" className="logo" /> */}
              <h1 className="login-title" >Iniciar Sesión</h1>
            </div>
            <Form autoComplete="off" form={form} name="loginForm" onFinish={onFinish}>
              <Form.Item name="USUARIO">
                <Input
                  name="USUARIO"
                  id="USUARIO"
                  prefix={<UserOutlined />}
                  placeholder="Nombre de Usuario"
                  className="login-input"
                  onKeyDown={onKeyDown}
                  ref={refUser}
                  onInput={Main.mayuscula}
                />
              </Form.Item>
    
              <Form.Item name="PASSWORD">
                <Input.Password
                  name="PASSWORD"
                  prefix={<LockOutlined />}
                  placeholder="Contraseña"
                  className="login-input"
                  ref={refPass}
                  onKeyDown={onKeyDown}
                  onInput={Main.mayuscula}                
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
              />
              </Form.Item>
    
              <Form.Item>
                <Button type="primary" htmlType="submit" block className="login-button">
                  Iniciar Sesión
                </Button>
              </Form.Item>
            </Form>
          </div>
      </div>
    </Main.Spin>
  );
});

export default Login;