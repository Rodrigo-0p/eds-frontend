import React, { memo }  from 'react';
import { Layout }       from "antd";
import SessionTime      from "./sessionTime";
import Sider            from './siderBartLef/siderBartLef';
import { Redirect,useHistory }     from 'react-router-dom';
import Navbar            from './navbar/navbar';
import '../../assets/css/styles.css';
const { Content } = Layout;


const AntLayout = memo((props) => {
  const history                 = useHistory();
  const [ defaultOpenKeys     ] = React.useState(props.defaultOpenKeys);
  const [ defaultSelectedKeys ] = React.useState(props.defaultSelectedKeys);

  const CloseSession = (e) => {
    sessionStorage.clear();
    history.push("/")
  };

  if(!sessionStorage.getItem("hash") ) {
    return <Redirect to="/"/>;
  }

  return (
    <>
      <SessionTime CloseSession={CloseSession}/>
        <Navbar/>
        <Sider defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys} />
        <Content
          id="site-content"
          className="site-layout-background"
          style={{
              padding: 10,
              // height: 'calc(100vh - 64px)',
              // marginTop: 64,
              marginBottom:'0px',
              overflow:'auto',
              scrollbarWidth: 'none',
          }}
        >
        {props.children}
      </Content>    
    </>
    
  );
});

export default AntLayout;