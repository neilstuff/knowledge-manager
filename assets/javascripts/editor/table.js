import { BEFORE_END, TOOLBAR_ITEM } from './constants';

export const createTable = (commandId, title, children, execCommand) => {

    const selectDimensions = (e) => {
        var cumulativeOffset = function(element) {
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

        var position = cumulativeOffset(e.target);
        var canvas = document.createElement('canvas');
        var div = document.createElement("div");
        var editor = document.getElementById("editor");

        div.style.position = "absolute";
        div.style.top = `${position.top + 20}px`;
        div.style.left = `${position.left - 80}px`;
        div.style.width = '100px';
        div.style.height = '110px';
        div.style.zIndex = '2';
        div
        div.style.backgroundColor = 'rgb(255,255,255)';
        div.style.border = "solid 1px rgba(0,0,0,0.2)";

        document.body.appendChild(div);
        document.body.addEventListener('mouseup', e => {
            console.log('mouseup');
            div.remove();
        });


        canvas.id = "canvGameStage";
        canvas.width = 80;
        canvas.height = 80;
        canvas.style.marginLeft = "10px";
        canvas.style.marginTop = "10px";
        canvas.style.zIndex = 8;
        canvas.style.position = "absolute";
        canvas.style.border = "1px solid rgba(47, 121, 255, 0.5)";
        div.appendChild(canvas);

        var context = canvas.getContext('2d');

        for (var line = 1; line <= 9; line++) {
            context.beginPath();
            context.moveTo(1 * line * 8, 0);
            context.lineTo(1 * line * 8, 80);
            context.closePath();
            context.lineWidth = 1;
            context.strokeStyle = 'rgba(47, 121, 255, 0.5)';
            context.stroke();

            context.beginPath();
            context.moveTo(0, 1 * line * 8);
            context.lineTo(80, 1 * line * 8);
            context.closePath();
            context.lineWidth = 1;
            context.strokeStyle = 'rgba(47, 121, 255, 0.5)';
            context.stroke();

        }

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