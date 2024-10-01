const columns_persona = [
	{ data: 'COD_PERSONA'  		    , title: 'Codigo'       , className:'htLeft'  },
	{ data: 'NOMBRE' 					    , title: 'Descripción'  , className:'htLeft'  },
];

const columns_tipoSociedad = [
	{ data: 'TIPO_SOCIEDAD'       , title: 'Código'       ,className:'htLeft'   },
	{ data: 'DESC_TIPO_SOCIEDAD'  , title: 'Descripción'  ,className:'htLeft' 	},
]
const columns_sector = [
	{ data: 'COD_SECTOR'  				, title: 'Código'      , className:'htLeft'   },
	{ data: 'DESC_SECTOR' 				, title: 'Descripción' , className:'htLeft' 	},
]
const columns_pais 	= [
	{ data: 'COD_PAIS'    				, title: 'Código'       ,className:'htLeft'   },
	{ data: 'DESC_PAIS'   				, title: 'Descripción'  ,className:'htLeft' 	},
]
const columns_provincia = [
  { data: 'COD_PROVINCIA'       , title: 'Código'       ,className:'htLeft'   },
  { data: 'DESC_PROVINCIA'      , title: 'Descripción'  ,className:'htLeft' 	},
]
const columns_ciudad = [
	{ data: 'COD_CIUDAD'   				, title: 'Código'       ,className:'htLeft'   },
	{ data: 'DESC_CIUDAD'  				, title: 'Descripción'  ,className:'htLeft' 	},
]
const columns_barrio = [
	{ data: 'COD_BARRIO'   				, title: 'Código'       ,className:'htLeft'   },
	{ data: 'DESC_BARRIO'  				, title: 'Descripción'  ,className:'htLeft' 	},
]
const columns_tipoIdentificacion = [
	{ data: 'COD_IDENT'  	 				, title: 'Código'       ,className:'htLeft'   },
	{ data: 'DESC_IDENT' 	 				, title: 'Descripción'  ,className:'htLeft' 	},
]

const main = {
  	columns_persona
	, columns_tipoSociedad
	, columns_sector
	, columns_pais
	, columns_provincia
	, columns_ciudad
	, columns_tipoIdentificacion
	, columns_barrio
	}

export default main;