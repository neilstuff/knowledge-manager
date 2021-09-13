import { BEFORE_END, TOOLBAR_ITEM } from './constants';
import { cumulativeOffset } from './utilities';

export const createLink = (commandId, title, children, execCommand) => {

    const createLinkSelection = (linkWindow, document) => {
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

        input.style.margin = "5px";
        input.setAttribute("type", "text");
        input.placeholder = "Enter URL ...";
        input.style.width = "100px;";
        input.value  = "http://";
        input.id = "link-value";

        div.appendChild(input);

        input.focus();

    }
    
    const button = document.createElement('button');

    button.dataset.commandId = commandId;
    button.className = TOOLBAR_ITEM;
    button.title = title;
    button.type = 'button';
    button.insertAdjacentElement(BEFORE_END, children);
    
    button.addEventListener('click', (e) => {
        var position = cumulativeOffset(button);

        console.log(window.screenLeft,  window.screenTop, position);

        var linkWindow = window.open("", "Link Window", `top=${position.top + window.screenTop + 30},left=${window.screenLeft + position.left},width=200,height=4`);

        createLinkSelection(linkWindow, linkWindow.document);

        linkWindow.addEventListener("blur", (e) => {
            linkWindow.close();
        });

        linkWindow.document.getElementById("link-value").addEventListener("keydown", (e) => {
            if (e.key === 'Enter') {
                console.log(linkWindow.document.getElementById("link-value").value);
                linkWindow.close();

                execCommand(commandId, linkWindow.document.getElementById("link-value").value);
            }

        });

    });

    return button;

}
