import { BEFORE_END, TOOLBAR_ITEM } from './constants';

export const createButton = (toolbar, commandId, title, children, execCommand) => {
  const button = document.createElement('button');

  button.dataset.commandId = commandId;
  button.className = TOOLBAR_ITEM;
  button.title = title;
  button.type = 'button';
  button.insertAdjacentElement(BEFORE_END, children);
  button.addEventListener('click', () => {

    const toolbarButtons = toolbar.querySelectorAll('button[data-command-id]');

    for (const toolbarButton of toolbarButtons) {
 
        toolbarButton.classList.toggle('active', false);

    }

    button.classList.toggle('active', true);

    execCommand(commandId);

   });

  return button;
  
};
