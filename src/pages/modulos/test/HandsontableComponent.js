import React               from 'react';
import Handsontable        from 'handsontable';
import Input               from '@mui/material/Input';
import InputAdornment      from '@mui/material/InputAdornment';
import SearchIcon          from '@mui/icons-material/Search';

import 'handsontable/dist/handsontable.full.min.css';
import './prueba.css'
import { columns_1, data } from './data'
// import Main from '../../../componente/util/main';


const HandsontableComponent = ({ valor , idComp='defauld'}) => {
  const hotRef  = React.useRef();
  const refData = React.useRef()
  

  const clickEvent = (e) => {
    console.log('Esto es el valor', e);
  }

  React.useEffect(() => {
    const hotElement = hotRef.current;
    const hot = new Handsontable(hotElement, {
      data:[],
      colHeaders: columns_1.map(col =>{return `<div class="handsontable_${col.className}" >${col.title}<div/> `}),
      contextMenu: true,
      readOnly:true,
      copyPaste:true,
      trimRows:true,
      snapToBottom:true,
      enterBeginsEditing:false,
      autoWrapRow:true,
      autoWrapCol:false,
      dragToScroll:true,

      selectionMode:'none',
      disableVisualSelection:'auto',// Deshabilita la selección visual
      viewportColumnRenderingOffset:'auto',
      stretchH: 'all',
      className:`handsontable_${idComp}`,
      
      height: 175,
      viewportRowRenderingOffset:350,
      enterMoves:{row: 0, col: 0},

      afterOnCellMouseDown:handleCellClick,
      beforeKeyDown:handsonTableKeyDown,

      licenseKey: 'non-commercial-and-evaluation',

    });
    
    if (hotRef){
      hot.loadData(data)
      refData.current = hot;
    } 
    
    return () => {
      hot.destroy();
    };
    // eslint-disable-next-line
  }, []);


  const InputOnkeyDown = (e) => {

    if (e.keyCode === 13) {
      let valor = refData?.current?.getSelected()
      if (valor === undefined) clickEvent(refData?.current?.getSourceDataAtRow(0));
      else clickEvent(refData?.current?.getSourceDataAtRow(valor[0][0]))
    } else if (e.keyCode === 40) {
      setTimeout(() => {
        refData?.current?.selectCell(0, 0);
      })
    }

  }
  const handsonTableKeyDown = async (e) => {

    if (e.keyCode === 13) {
      let valor = await refData?.current?.getSelected()[0][0];
      clickEvent(refData?.current?.getSourceDataAtRow(valor))
    }

  }
  const handleCellClick = (event, coords, td) => {
    var now = new Date().getTime();
    if (!(td.lastClick && now - td.lastClick < 200)) {
      td.lastClick = now;
      return; // no double-click detected
    }
    let valor = refData?.current?.getSourceDataAtRow(coords.row)
    clickEvent(valor)
  }


  return (
    <div>    
      <div className='buscador-input'>
        <Input className='input-change'
          autoComplete="off"
          onKeyDown={InputOnkeyDown}
          startAdornment={
            <InputAdornment position="start" >
              <SearchIcon />
            </InputAdornment>
          } />
      </div>
      
      <div ref={hotRef}/>

    </div> 
  )
};

export default HandsontableComponent;

// import React from 'react';
// import { HotTable, HotColumn } from '@handsontable/react';
// import { columns_1, data } from './data'
// import Input from '@mui/material/Input';
// import InputAdornment from '@mui/material/InputAdornment';
// import SearchIcon from '@mui/icons-material/Search';

// import 'handsontable/dist/handsontable.full.min.css';
// import './prueba.css'
// import Main from '../../../componente/util/main';

// const PRUEBA = ({ columns = [] }) => {

//   let idComp = 'BSPERSON'
//   React.useEffect(() => {
//     // let data = generateData(5,5)
//     refData?.current?.hotInstance?.loadData(data)
//   }, [])
//   const refData = React.useRef([])

//   const clickEvent = (e) => {
//     console.log('Esto es el valor', e);
//   }

//   const handleAfterSelection = (rowIndex, col) => {
//     // let valor = refData.current.hotInstance.getSourceDataAtRow(rowIndex)    
//   };

//   const handleCellClick = (event, coords, td) => {
//     var now = new Date().getTime();
//     if (!(td.lastClick && now - td.lastClick < 200)) {
//       td.lastClick = now;
//       return; // no double-click detected
//     }
//     let valor = refData?.current?.hotInstance?.getSourceDataAtRow(coords.row)
//     clickEvent(valor)
//   }

//   const onkeyDown = (e) => {

//     if (e.keyCode === 13) {
//       let valor = refData?.current?.hotInstance.getSelected()
//       if (valor === undefined) clickEvent(refData?.current?.hotInstance?.getSourceDataAtRow(0));
//       else clickEvent(refData?.current?.hotInstance?.getSourceDataAtRow(valor[0][0]))
//     } else if (e.keyCode === 40) {
//       setTimeout(() => {
//         refData?.current?.hotInstance?.selectCell(0, 0);
//       })
//     }

//   }

//   const handsonTableKeyDown = async (e) => {

//     if (e.keyCode === 13) {
//       let valor = await refData?.current?.hotInstance?.getSelected()[0][0];
//       clickEvent(refData?.current?.hotInstance?.getSourceDataAtRow(valor))
//     }

//   }


//   return (

//     <div>
      // <div className='buscador-input'>
      //   <Input className='input-change'
      //     autoComplete="off"
      //     onKeyDown={onkeyDown}
      //     startAdornment={
      //       <InputAdornment position="start" >
      //         <SearchIcon />
      //       </InputAdornment>
      //     } />
      // </div>

      
//         <HotTable
//           ref={refData}
//           colHeaders={columns_1.map((col) => `<div class="handsontable_${col.className}">${col.title}</div>`)}
//           copyPaste={true}
//           columnSorting={true}
//           trimRows={true}
//           snapToBottom={true}
//           enterBeginsEditing={false}
//           autoWrapRow={true}
//           autoWrapCol={false}
//           dragToScroll={true}


//           selectionMode={'none'}
//           disableVisualSelection={'area'} // Deshabilita la selección visual
//           viewportColumnRenderingOffset={'auto'}

//           // manualColumnMove={false}
//           height={160}
//           className={`handsontable_${idComp}`}


//           enterMoves={() => { return { row: 0, col: 0 } }}
//           stretchH={'all'}
//           viewportRowRenderingOffset={350}

//           afterSelection={handleAfterSelection}
//           afterOnCellMouseDown={handleCellClick}
//           beforeKeyDown={handsonTableKeyDown}


//           licenseKey="non-commercial-and-evaluation" // for non-commercial use only
//         >
//           {
//             columns_1.map((col, indice) => (

//               <HotColumn
//                 key={indice}
//                 data={col.data}
//                 type={col.type}
//                 title={col.title}
//                 width={col.width}
//                 className={col.className}
//                 readOnly={true}
//                 // CHECKBOX
//                 uncheckedTemplate={col?.checkbox?.length > 0 ? col?.checkbox[1] : ''}
//                 columnSorting={{ headerAction: false }}
//               />
//             ))
//           }
//         </HotTable>

//       </div>

//   );
// };

// export default PRUEBA;