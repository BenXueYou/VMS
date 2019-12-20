//文字超出部分显示...鼠标经过浮层显示全部文字
export const mouseover = ($event) => {
    let dom = $event.target,
        style = window.getComputedStyle ? window.getComputedStyle(dom, '') : dom.currentStyle,
        width = dom.clientWidth,//容器宽度
        paddingRight = style.paddingRight,//右padding
        paddingLeft = style.paddingLeft,//左padding
        marginLeft = style.marginLeft,//左margin
        marginRight = style.marginRight,//左margin
        boxWidth = width - parseInt(paddingRight) - parseInt(paddingLeft) - parseInt(marginLeft) - parseInt(marginRight),
        fontSize = style.fontSize,
        text = dom.innerHTML,
        span = document.createElement("span"),
        left = $event.clientX - $event.layerX,
        top = $event.clientY + 5; // 向下偏移5
    span.style.cssText = `font-size:12px;height:0;overflow:hidden;`;
    span.setAttribute('id', 'span');
    document.body.appendChild(span);
    document.querySelector('#span').innerHTML = text;
    let spanWidth = span.offsetWidth;
    document.body.removeChild(span);
    if (spanWidth > boxWidth) {
        let bgObj = document.createElement("div");
        bgObj.style.cssText = `position:absolute;top:${top}px;left:${left}px;color:#fff;background:#333;max-width:400px;border-radius:5px;padding:10px;display:inline-block;font-size:12px;z-index:9999`;
        bgObj.setAttribute('id', 'bgObj');
        document.body.appendChild(bgObj);
        document.querySelector('#bgObj').innerHTML = text;
    }
}
//鼠标移出浮层消失
export const mouseout = ($event) => {
    let bgObj = document.querySelector('#bgObj');
    if (bgObj) {
        document.body.removeChild(bgObj);
    }
}
//鼠标移动浮层移动
export const mousemove = ($event) => {
    // console.log($event);
    let left = $event.clientX - $event.layerX,
        top = $event.clientY,
        bgObj = document.querySelector('#bgObj');
    if (bgObj) {
        bgObj.style.top = (top + 10) + 'px',
            bgObj.style.left = left + 'px';
    }
}