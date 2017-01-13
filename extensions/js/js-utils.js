/*---------------------------------
*	언어 차원에서 지원되지 않는 사용자 정의 함수
*	isType() 유틸리티 헬퍼 함수
* 객체가 아닌 유형도 검증이 가능 
-----------------------------------*/
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