export const createPopup = (position, menu) => {

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
    
    var div = createSimpleElement('div', null, null);
    var ul = createSimpleElement('ul', null, ' menu');

    div.appendChild(ul)
    
    for (var iItem = 0; iItem < menu.length; iItem++)(function(iItem) {
 
        var a = createSimpleElement('a', null, null);
  
        a.appendChild(document.createTextNode(menu[iItem].text));

        var li = createSimpleElement('li', null, null);
        var span = createSimpleElement('span', null, null);
        span.appendChild(a);
        
        li.appendChild(span);
        li.appendChild(a);       
        ul.appendChild(li);

        console.log(li);


    })(iItem);

    div.style.display = 'block';
    div.style.position = 'absolute';
    div.style.left = (position.x) + 'px';
    div.style.top = (position.y) + 'px';

    console.log(div);

    document.body.appendChild(div);

    window.onclick = function() {

        if (div != null && div.parentNode == document.body) {
            document.body.removeChild(div);
            div = null;
        }

    }

} 