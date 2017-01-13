const  GRID_COL_COLOR_START 	= 'hsla(190, 84%, 59%, 0.5)'
		 , GRID_COL_COLOR_END 		= 'hsla(163, 64%, 49%, 0.2)'
 		 , GRID_LINE_COLOR				= '#7400ff';

var 	unit = 'px';

// 요소찾아 변수에 참조
var 	el_gs_type_stt 		= document.querySelector('#rdo_gs_type_stt')
		, el_gs_type_fld 		= document.querySelector('#rdo_gs_type_fld')
		, el_total_width 		= document.querySelector('#txt_total_width')
		, el_columns 				= document.querySelector('#txt_columns')
		, el_margin_width 	= document.querySelector('#txt_margin_width')
		, el_gutter_width 	= document.querySelector('#txt_gutter_width')
		, el_btn_calculate 	= document.querySelector('.btn-calculate')

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

// 라디오 버튼
el_gs_type_stt.onclick = function() {
	gs_type_val = getRadioCheckedValue('rdo_gs_type');
	(gs_type_val === "stt") ? unit = 'px' : unit = '%';
};
el_gs_type_fld.onclick = function() {
	gs_type_val = getRadioCheckedValue('rdo_gs_type');
	(gs_type_val === "stt") ? unit = 'px' : unit = '%';
};

// 버튼 클릭이벤트 등록
document.addEventListener('DOMContentLoaded', function () {
  var el_btn_calculate 	= document.querySelector('.btn-calculate');
  el_btn_calculate.addEventListener('click', click);

  var el_btn_remove 	= document.querySelector('.btn-remove');
  el_btn_remove.addEventListener('click', click);
});

function click(e) {
	if ( e.target.getAttribute('class') === 'btn-calculate' ) {
		setInputValue();
		calcGrid();
	 	chrome.tabs.executeScript(null,
	  	{code: getScript() });
	} 
	else if ( e.target.getAttribute('class') === 'btn-remove' ) {
		chrome.tabs.executeScript(null,
	  	{code: "var pre_grid_div = document.querySelector('#grid-system-guide-parent');"
						+ "if (pre_grid_div) { pre_grid_div.remove() }" });
	}
}

function setInputValue() {
	total_width 		= window.parseInt(el_total_width.value, 10);
	columns 				= window.parseInt(el_columns.value, 10);
	margin_width 		= window.parseInt(el_margin_width.value, 10);
	gutter_width 		= (columns === 1) ? 0 : window.parseInt(el_gutter_width.value, 10);	// 컬럼이 하나이면 거터값 무시
	margin_width_fix = margin_width;
}
	
// 그리드 요소 값 계산
function calcGrid() {
	total_gutter_width	= gutter_width * ( columns - 1 );					// 거터의 총넓이
	ex_margin 					= total_width - ( margin_width_fix * 2 );	// 총넓이에서 양쪽마진값을 뺀 값
	total_column_width	= ex_margin - total_gutter_width;					// 컬럼의 총넓이
	mod_column_width 		= total_column_width % columns;

	if ( mod_column_width === 0 ) 	// 총컬럼 넓이를 컬럼수로 나누어 0 떨어지면 ok
	{
		console.log("calcGrid() : 0");
		column_width = total_column_width / columns;
	} 
	else if ( isEven( mod_column_width ) === true ) 	// 총컬럼 넓이를 컬럼수로 나눈 값이 짝수이면
	{
		console.log("calcGrid() : even");
		// 나머지의 1/2를 마진값에 더하여 다시 계산
		margin_width_fix = margin_width_fix + (mod_column_width / 2);
		calcGrid();
	}
	else if ( isEven( mod_column_width ) === false ) 	// 총컬럼 넓이를 컬럼수로 나눈 값이 홀수이면
	{
		console.log("calcGrid() : odd");
		if ( isEven( columns ) === true ) {	// 나머지가 홀수일 때, 컬럼수가 짝수이면 정수 계산이 안됨.
			console.log("정수로 계산 안됨.");					// ************* 경고 디스플레이 처리 필요
			showAlert();
			return false;
		}
		mod_column_width = mod_column_width + 1;
		margin_width_fix = margin_width_fix + (mod_column_width / 2);
		calcGrid();
	}
	return true;
}

function getScript() {
	var make_div 	= "var pre_grid_div = document.querySelector('#grid-system-guide-parent');"
								+ "if (pre_grid_div) { pre_grid_div.remove() }"
								+ "var el_body = document.body;"
								+ "var el_div_parent 	= document.createElement('div');"
								+ "el_div_parent.setAttribute('id', 'grid-system-guide-parent');"
								+ "el_body.appendChild(el_div_parent);"
								+ "var el_div_child 	= document.createElement('div');"
								+ "el_div_child.setAttribute('id', 'grid-system-guide-child');"
								+ "el_div_parent.appendChild(el_div_child);"

 	var   column_gradient = ""
			, col_start 			= 0
			, col_end 				= 0
			, gut_end 				= 0;

	// static
 	if ( gs_type_val === "stt" ) {

		column_gradient = "transparent " + margin_width_fix + unit;
		for (var i = 1; columns >= i; ++i) {

			col_start = margin_width_fix + (((i - 1) * column_width)  + ((i - 1) * gutter_width));
			col_end 	= margin_width_fix + ((i * column_width)  + ((i - 1) * gutter_width));
			gut_end		= margin_width_fix + ((i * column_width)  + (i * gutter_width));

			column_gradient = column_gradient 
			 								+ ", " + GRID_COL_COLOR_START + " " + col_start + unit
			 								+ ", " + GRID_COL_COLOR_END 	+ " " + col_end + unit
											+ ", transparent " + col_end + unit
											+ ", transparent " + gut_end + unit;
		}
		column_gradient = column_gradient
										+ ", transparent " + (total_width - margin_width_fix) + unit;
	} 
	// fluid
	else {	
		column_gradient = "transparent " + percent(margin_width_fix, total_width) + unit;
		for (var i = 1; columns >= i; ++i) {

			col_start = margin_width_fix + (((i - 1) * column_width)  + ((i - 1) * gutter_width));
			col_end 	= margin_width_fix + ((i * column_width)  + ((i - 1) * gutter_width));
			gut_end		= margin_width_fix + ((i * column_width)  + (i * gutter_width));

			col_start = percent(col_start, total_width);
			col_end 	= percent(col_end, total_width);
			gut_end		= percent(gut_end, total_width);

			column_gradient = column_gradient 
			 								+ ", " + GRID_COL_COLOR_START + " " + col_start + unit
			 								+ ", " + GRID_COL_COLOR_END 	+ " " + col_end + unit
											+ ", transparent " + col_end + unit
											+ ", transparent " + gut_end + unit;
		}
		column_gradient = column_gradient
										+ ", transparent " + (total_width - margin_width_fix) + unit;
	}

	// show-grid
	var bg_guide 	= "linear-gradient(transparent 9px, " + GRID_LINE_COLOR + " 9px)"
								+ ", linear-gradient(90deg, " + column_gradient + ")" 

	var result 	=	make_div  
							+ "el_div_parent.style.width='100%';"
							+ "el_div_parent.style.height='200%';"
							+ "el_div_parent.style.position='absolute';"
							+ "el_div_parent.style.top='0';"
							+ "el_div_parent.style.left='0';"
							+ "el_div_parent.style.zIndex=10000;"
							+ "el_div_child.style.width='" + (gs_type_val === "stt" ? total_width : "100") + unit + "';"
							+ "el_div_child.style.height='100%';"
							+ "el_div_child.style.marginLeft='auto';"
							+ "el_div_child.style.marginRight='auto';"
							+ "el_div_child.style.background='" + bg_guide + "';"
							+ "el_div_child.style.backgroundSize='1px 10px, " + (gs_type_val === "stt" ? total_width : "100") + unit + " 1px';"
  return result;
}

function isType(data) {
    return Object.prototype.toString.call(data).toLowerCase().slice(8, -1);
}

// 정수형 check 
function isInt(num) {
	if ( isType(num) !== 'number' ) {
		return false;
	}
	var str = String(num)
	if ( str.indexOf('.') === -1 ) {
		return true;
	} else {
		return false;
	}
}

// 짝수 check
function isEven(num) {
	if ( isType(num) !== 'number' ) {
		return false;
	}
	if ( (num % 2) === 0 ) {
		return true;
	} else {
		return false;
	}
}

// 퍼센트 반환 함수
function percent(target, context) {
  return target / context * 100;
}

// 라디오버튼 그룹 중 check 된 요소의 값 반환
function getRadioCheckedValue(rdo_name) {
	var _rdo_group = document.getElementsByName(rdo_name);

	for(var i=0; _rdo_group.length > i; ++i) {
		 if( _rdo_group[i].checked === true ) {
		 		return _rdo_group[i].value;
		 }
	}
}
