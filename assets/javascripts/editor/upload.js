import { BEFORE_END, TOOLBAR_ITEM } from './constants';

export const createUpload = (commandId, title, children, execCommand) => {

    const upload = (e) => {
        var loadButton = document.createElementNS("http://www.w3.org/1999/xhtml", "input");

        loadButton.setAttribute("type", "file");
        loadButton.accept = "*.png";

        loadButton.addEventListener('change', async(event) => {

            const toBase64 = file => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });

            if (event.target.files.length == 1) {
                let data = await toBase64(event.target.files[0]);

                execCommand(commandId, data)

            }

            return false;

        }, false);


        loadButton.click();

    }
    const button = document.createElement('button');

    button.dataset.commandId = commandId;
    button.className = TOOLBAR_ITEM;
    button.title = title;
    button.type = 'button';
    button.insertAdjacentElement(BEFORE_END, children);
    button.addEventListener('click', upload);

    return button;

}