import { BEFORE_END, TOOLBAR_ITEM } from './constants';

export const createTable = (commandId, title, children, execCommand) => {

    const selectDimensions = (e) => {        
        var cumulativeOffset = function(element) {
            var top = 0, left = 0;
            do {
                top += element.offsetTop  || 0;
                left += element.offsetLeft || 0;
                element = element.offsetParent;
            } while(element);

            return {
                top: top,
                left: left
            };
        };

        var position = cumulativeOffset(e.target);
        var canvas = document.createElement('canvas');
        var div = document.createElement("div");
        var editor = document.getElementById("editor");

        div.style.position = "absolute";
        div.style.top = `${position.top + 30}px`;
        div.style.left = `${position.left - 80}px`;
        div.style.width = '100px';
        div.style.height = '110px';
        div.style.zIndex = '2';
        div.style.backgroundColor = 'rgb(255,255,255)';
        div.style.border = "solid 1px rgba(0,0,0,0.2)";

        document.body.appendChild(div);
        document.body.addEventListener('mouseup', e => {
            console.log('mouseup');
            div.remove();
        });
        
 
        canvas.id     = "canvGameStage";
        canvas.width  = 100;
        canvas.height = 100;
        canvas.style.zIndex   = 8;
        canvas.style.position = "absolute";
        canvas.style.border   = "1px solid";
        div.appendChild(canvas);

    }

    const button = document.createElement('button');

    button.dataset.commandId = commandId;
    button.className = TOOLBAR_ITEM;
    button.title = title;
    button.type = 'button';
    button.insertAdjacentElement(BEFORE_END, children);
    button.addEventListener('mousedown', selectDimensions);

    return button;

}