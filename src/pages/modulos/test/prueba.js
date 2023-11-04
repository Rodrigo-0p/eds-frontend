import React from 'react';
import 'handsontable/dist/handsontable.full.css';
import HandsontableComponent from './HandsontableComponent';
import {data} from './data'
import Main from '../../../componente/util/main';

const MiComponenteConHandsontable = () => {
  const [visible, setVisible] = React.useState(true);

  return (
    <>
      <Main.FormModalSearch
          setShowsModal={setVisible}
          open={visible}
          title={'Data'}
          className='Modal-contenet'
          component={
            <HandsontableComponent data={data} />
          }
          footer={null}
      />
    </>
  );
};

export default MiComponenteConHandsontable;
