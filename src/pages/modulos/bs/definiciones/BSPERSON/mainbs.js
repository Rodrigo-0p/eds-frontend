import React, { memo } from 'react';
import Main  from '../../../../../componente/util/main';

const FormName = 'BSPERSON';

const MainBs = memo(() => {

  const defaultOpenKeys 		= Main.DireccionMenu(FormName);
	const defaultSelectedKeys = Main.Menu(FormName);

  console.log(defaultOpenKeys)
  console.log(defaultSelectedKeys)
  
  return (
    <>
     <Main.AntLayout defaultOpenKeys={['BS','BS1','BS-BS1']} defaultSelectedKeys={['BS-BS1-BSPERSON']}>
      <div>FORMULARIO DE PERSONA</div>
     </Main.AntLayout>      
    </>    
  );
});

export default MainBs;