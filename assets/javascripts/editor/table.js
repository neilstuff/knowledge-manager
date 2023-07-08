import { BEFORE_END, TOOLBAR_ITEM } from './constants';
import { cumulativeOffset } from './utilities';

export const createTable = (commandId, title, children, editor, execCommand) => {

    const selectDimensions = (e) => {
        var drawGrid = function(context) {
            
            for (var row = 0; row < 10 ; row++) {
                for (var col = 0; col < 10 ; col++) {
                    context.beginPath();
                    context.lineWidth = 1;
                    context.strokeStyle = 'rgba(47, 121, 255, 0.5)';
                    context.rect(row * 8 + 2, col * 8 + 2, 5, 5);
                    context.closePath();
                    context.stroke();
                }

            }

        }

        var position = cumulativeOffset(e.target);
        var canvas = document.createElement('canvas');
        var div = document.createElement("div");

        div.style.position = "absolute";
        div.style.top = `${position.top + 30}px`;
        div.style.left = `${position.left - 80}px`;
        div.style.width = '91px';
        div.style.height = '91px';
        div.style.zIndex = '2';

        document.body.appendChild(div);
        document.body.addEventListener('mouseup', e => {
            div.remove();
        });

        canvas.id = "canvasTable";
        canvas.width = 81;
        canvas.height = 81;
        canvas.style.marginLeft = "5px";
        canvas.style.marginTop = "5px";
        canvas.style.zIndex = 8;
        canvas.style.position = "absolute";
        canvas.style.border = "1px solid rgba(47, 121, 255, 0.5)";

        div.appendChild(canvas);

        var context = canvas.getContext('2d');

        drawGrid(context);

        canvas.addEventListener("mousemove", e => {
            e.stopPropagation();

            var cursor = {
                x: e.offsetX,
                y: e.offsetY
            };
        
            context.fillStyle = "#FF0000";

            for (var row = 0; row < 10 ; row++) {
                for (var col = 0; col < 10 ; col++) {

                    if ((row <= Math.floor(cursor.x/8)) && (col <= Math.floor(cursor.y/8))) {
                        context.fillStyle = "#0000FF";
                    } else {
                        context.fillStyle = "#FFFFFF";                     
                    }

                    context.beginPath();
                    context.lineWidth = 1;
                    context.fillRect(row * 8 + 3, col * 8 + 2, 4, 4);
                    context.closePath();
                    context.stroke();
                
                }

            }

        }, false);

        canvas.addEventListener("mouseup", e => {
            e.stopPropagation();

            var cursor = {
                x: e.offsetX,
                y: e.offsetY
            };

            div.remove();

            editor.focus();

            let html = '<table align="center">';

            for (var row = 0; row <= Math.floor(cursor.y/8) ; row++) {

                html += '<tr>';

                for (var col = 0; col <= Math.floor(cursor.x/8) ; col++) {

                    html += '<td></td>';

                }

                html += "</tr>";

            }

            html += "</table>";

            execCommand('insertHTML', html);

        }, false);

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