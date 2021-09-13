export const cumulativeOffset = (element) => {
    var top = 0,
        left = 0;
    do {
        top += element.offsetTop || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while (element);

    return {
        top: top,
        left: left
    };

};

export const createLinkSelection = (linkWindow, document, text) => {
    var div = document.createElement("div");

     div.style.position = "absolute";
     div.style.top = `2px`;
     div.style.left = `2px`;
     div.style.right = `2px`;
     div.style.bottom = `2px`;
     div.style.backgroundColor = 'rgb(255,255,255)';
     div.style.border = "solid 1px rgba(0,0,0,0.2)";

     document.body.appendChild(div);

     var input = document.createElement("input");

     input.style.margin = "6px 0px 5px 8px";
     input.setAttribute("type", "text");
     input.placeholder = "Enter URL ...";
     input.style.width = "100px;";
     input.value = text;
     input.id = "link-value";

     div.appendChild(input);

     input.focus();

} 