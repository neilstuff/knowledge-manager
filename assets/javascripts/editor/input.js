import { TOOLBAR_ITEM } from './constants';

export const createInput = (commandId, title, type, className, value, execCommand) => {
    const div = document.createElement('div');
    div.title = title;
    div.classList.add(className);

    const input = document.createElement('input');

    input.dataset.commandId = commandId;
    input.classList.add(TOOLBAR_ITEM);
    input.title = title;
    input.type = type;
    input.value = value;

    input.addEventListener('change', e => execCommand(commandId, e.target.value));

    div.appendChild(input);

    return div;

};