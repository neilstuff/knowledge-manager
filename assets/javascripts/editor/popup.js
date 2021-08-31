export const createMenu = (position, menu) => {

    function createSimpleElement(type, id, className) {
        element = document.createElement(type);
        if (id != undefined) {
            element.id = id;
        }

        if (className != undefined) {
            element.className = className;
        }

        return element;
        
    }
    
    
    function createImgElement(id, className, src, width, height) {
        element = document.createElement('img');
        if (id != undefined) {
            element.id = id;
        }

        if (className != undefined) {
            element.className = className;
        }

        if (src != undefined) {
            element.src = src;
        }

        if (width != undefined) {
            element.style.width = `${width}px`;
        }

        if (height != undefined) {
            element.style.height = `${height}px`;
        }

        return element;

    }

    for (var iItem = 0; iItem < items.length; iItem++)(function(iItem) {
        var li = createSimpleElement('li', null, null);
        var span = createSimpleElement('span', null, null);

        span.onclick = function() {
        };

        var a = createSimpleElement('a', null, null);
        var ul = createSimpleElement('ul', null, ' sub-menu');

        a.appendChild(document.createTextNode(v_menu.elements[iItem].text));

        li.appendChild(span);

        if (menu.elements[iItem].icon != undefined) {
            var img = createImgElement('null', 'null', menu.elements[iItem].icon);
            li.appendChild(img);
        }

        li.appendChild(a);
        li.appendChild(ul);
        
        div.appendChild(li);

        if (menu.elements[iItem].submenu != undefined) {
            var v_span_more = createSimpleElement('div', null, null);
            v_span_more.appendChild(createImgElement(null, 'menu_img', menu_image, 8, 8));
            v_li.appendChild(v_span_more);
            nodeTree.contextMenuListItem(v_menu.elements[iItem].submenu, v_ul, node);
        }

    })(iItem);

} 