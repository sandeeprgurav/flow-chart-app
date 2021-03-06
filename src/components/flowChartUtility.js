
export const getOffsetSum =(elem)=> {
    var top=0, left=0
    while(elem) {
      if(elem!==undefined && elem!==null ) {
        top = top + parseInt(elem.offsetTop);
        left = left + parseInt(elem.offsetLeft);
        elem = elem.offsetParent;
      }
    }
    return {top: top, left: left};
}


export const getOffsetRect =(elem) => {
  var box = elem.getBoundingClientRect();
  var body = document.body;
  var docElem = document.documentElement;
  var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
  var clientTop = docElem.clientTop || body.clientTop || 0;
  var clientLeft = docElem.clientLeft || body.clientLeft || 0;
  var top  = box.top +  scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;
  return { top: Math.round(top), left: Math.round(left) };
}


export const getOffset = (elem) => {  
  if (elem!==undefined && elem!==null && elem.getBoundingClientRect) {
      return getOffsetRect(elem);
  } else {
      return getOffsetSum(elem);
  }
}
