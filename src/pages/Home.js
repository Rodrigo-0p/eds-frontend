import React, { memo } from 'react';
import Main            from "../componente/util/main";

const Titulo = "Inicio";

const Home = memo(() => {
  return (    
    <>
      <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${Titulo}` }/>     
      <Main.AntLayout defaultOpenKeys={[]} defaultSelectedKeys={['home']}>
        <>
          Home
        </>
      </Main.AntLayout>
    </>
    
  );
});

export default Home;