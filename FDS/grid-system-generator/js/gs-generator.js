const  GRID_COL_COLOR_START 	= 'hsla(190, 84%, 59%, 0.5)'
		 , GRID_COL_COLOR_END 		= 'hsla(163, 64%, 49%, 0.2)'
 		 , GRID_LINE_COLOR				= '#7400ff';

var		doc_CSS = null	// 출력될 css 문서
		, unit = 'px';

// DOM 요소찾아 변수에 참조
var 	el_gs_type_stt 		= document.querySelector('#rdo_gs_type_stt')
		, el_gs_type_fld 		= document.querySelector('#rdo_gs_type_fld')
		, el_total_width 		= document.querySelector('#txt_total_width')
		, el_columns 				= document.querySelector('#txt_columns')
		, el_margin_width 	= document.querySelector('#txt_margin_width')
		, el_gutter_width 	= document.querySelector('#txt_gutter_width')
		, el_txta_css				= document.querySelector('#txta_css')
		, el_btn_calculate 	= document.querySelector('.btn-calculate')
		, el_btn_download 	= document.querySelector('.btn-download')
		, el_content_area 	= document.querySelector('#txt_content_area')
		, el_column_width 	= document.querySelector('#txt_column_width')
		, el_fixed_margin 	= document.querySelector('#txt_fixed_margin')
		, el_opt_pu 				= document.querySelector('#chk_opt_pu')
		, el_opt_fix 				= document.querySelector('#chk_opt_fix')
		, el_opt_isolate 		= document.querySelector('#chk_opt_isolate')
		, el_recommend_alert= document.querySelector('.recommend_alert');

//  계산 시 필요한 변수선언
var  	gs_type_val 				= getRadioCheckedValue('rdo_gs_type')
		, total_width 				= 0
		,	columns 						= 0
		,	margin_width 				= 0
		,	gutter_width 				= 0
		,	margin_width_fix 		= 0
    , column_width 				= 0
    , total_gutter_width	= 0
    , ex_margin 					= 0
    , total_column_width	= 0
    , mod_column_width 		= 0;


/************************
 * 이벤트 연결
 */
// Calculate 버튼
el_btn_calculate.onclick = function() {
	hiddenAlert();
	setInputValue();
	if ( calcGrid() ) {
		setCSS();
		displayResult();
	}
};
// Download 버튼
el_btn_download.onclick = function() {
	alert('Not yet...');
};
// 라디오 버튼
el_gs_type_stt.onclick = function() {
	gs_type_val = getRadioCheckedValue('rdo_gs_type');
	(gs_type_val === "stt") ? unit = 'px' : unit = '%';
};
el_gs_type_fld.onclick = function() {
	gs_type_val = getRadioCheckedValue('rdo_gs_type');
	(gs_type_val === "stt") ? unit = 'px' : unit = '%';
};

/**
 * 사용자가 입력한 값 저장
 */
function setInputValue() {
	total_width 		= window.parseInt(el_total_width.value, 10);
	columns 				= window.parseInt(el_columns.value, 10);
	margin_width 		= window.parseInt(el_margin_width.value, 10);
	gutter_width 		= (columns === 1) ? 0 : window.parseInt(el_gutter_width.value, 10);	// 컬럼이 하나이면 거터값 무시
	margin_width_fix = margin_width;
}

/**
 * 그리드 요소 값 계산
 */
function calcGrid() {
	total_gutter_width	= gutter_width * ( columns - 1 );					// 거터의 총넓이
	ex_margin 					= total_width - ( margin_width_fix * 2 );	// 총넓이에서 양쪽마진값을 뺀 값
	total_column_width	= ex_margin - total_gutter_width;					// 컬럼의 총넓이
	mod_column_width 		= total_column_width % columns;

	if ( mod_column_width === 0 ) 	// 총컬럼 넓이를 컬럼수로 나누어 0 떨어지면 ok
	{
		column_width = total_column_width / columns;
	} 
	else if ( isEven( mod_column_width ) === true ) 	// 총컬럼 넓이를 컬럼수로 나눈 값이 짝수이면
	{
		// 나머지의 1/2를 마진값에 더하여 다시 계산
		margin_width_fix = margin_width_fix + (mod_column_width / 2);
		calcGrid();
	}
	else if ( isEven( mod_column_width ) === false ) 	// 총컬럼 넓이를 컬럼수로 나눈 값이 홀수이면
	{
		if ( isEven( columns ) === true ) {	// 나머지가 홀수일 때, 컬럼수가 짝수이면 정수로 계산이 안됨.
			showAlert();
			return false;
		}
		mod_column_width = mod_column_width + 1;
		margin_width_fix = margin_width_fix + (mod_column_width / 2);
		calcGrid();
	}
	return true;
}

/**
 * 결과값 보여주기
 */
function displayResult() {
	el_content_area.value = total_width;
	el_column_width.value = column_width;
	el_fixed_margin.value	= margin_width_fix;
	el_txta_css.innerText = doc_CSS;
}
// 경고 노출 
function showAlert() {
	var str_class = el_recommend_alert.getAttribute('class');
	str_class = str_class.replace(' on', '');
	el_recommend_alert.setAttribute('class', str_class + ' on');
}
// 경고 숨김
function hiddenAlert() {
	var str_class = el_recommend_alert.getAttribute('class');
	str_class = str_class.replace(' on', '');
	el_recommend_alert.setAttribute('class', str_class);
}