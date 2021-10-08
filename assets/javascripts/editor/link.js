import { BEFORE_END, TOOLBAR_ITEM } from './constants';
import { cumulativeOffset } from './utilities';
import { createLinkSelection } from './utilities';

export const createLink = (commandId, title, children, execCommand) => {
    const button = document.createElement('button');

    button.dataset.commandId = commandId;
    button.className = TOOLBAR_ITEM;
    button.title = title;
    button.type = 'button';
    button.insertAdjacentElement(BEFORE_END, children);
    
    button.addEventListener('click', (e) => {
        var position = cumulativeOffset(button);
        var linkWindow = window.open("", "Link Window", 
                            `frame=false,top=${position.top + window.screenTop + 30},left=${window.screenLeft + position.left},width=200,height=40`);

        createLinkSelection(linkWindow, linkWindow.document, "http://");

        linkWindow.addEventListener("blur", (e) => {
            linkWindow.close();
        });

        linkWindow.document.getElementById("link-value").addEventListener("keydown", (e) => {
            if (e.key === 'Enter') {

                linkWindow.close();

                execCommand(commandId, linkWindow.document.getElementById("link-value").value);
                
            }

        });

    });

    return button;

}
