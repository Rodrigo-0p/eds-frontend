const columns_proveedor = [
	{ data: 'COD_PROVEEDOR_DFLT', title: 'Codigo'       , className:'htLeft'  },
	{ data: 'DESC_PROVEEDOR' 		, title: 'Descripción'  , className:'htLeft'  },
];

const columns_rubro = [
	{ data: 'COD_RUBRO'      , title: 'Código'       ,className:'htLeft'   },
	{ data: 'DESC_RUBRO'     , title: 'Descripción'  ,className:'htLeft' 	 },
]
const columns_marca = [
	{ data: 'COD_MARCA'  		 , title: 'Código'      , className:'htLeft'   },
	{ data: 'DESC_MARCA' 		 , title: 'Descripción' , className:'htLeft' 	 },
]
const columns_grupo 	= [
	{ data: 'COD_GRUPO'    	 , title: 'Código'       ,className:'htLeft'   },
	{ data: 'DESC_GRUPO'   	 , title: 'Descripción'  ,className:'htLeft' 	 },
]
const columns_iva = [
  { data: 'COD_IVA'        , title: 'Código'       ,className:'htLeft'   },
  { data: 'DESC_IVA'       , title: 'Descripción'  ,className:'htLeft' 	 },
]

const columns_linea = [
	{ data: 'COD_LINEA'			, title: 'Código'			   , className: "htLeft" },
	{ data: 'DESC_LINEA'		, title: 'Descripción'   , className: "htLeft" },
];
const column_segmento = [
	{ data: 'COD_CATEGORIA'	, title: 'Código'			   , className: "htLeft" },
	{ data: 'DESC_CATEGORIA', title: 'Descripción'   , className: "htLeft" },
];

const main = {
  	columns_proveedor
	, columns_rubro
	, columns_marca
	, columns_grupo
	, columns_iva
	, columns_linea
	, column_segmento
	}

export default main;