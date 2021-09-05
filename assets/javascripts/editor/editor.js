import { createToolbar } from './toolbar';
import { createPopup } from './popup';
import { BEFORE_BEGIN } from './constants';

const rgbToHex = color => {
    const digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
    const red = parseInt(digits[2]);
    const green = parseInt(digits[3]);
    const blue = parseInt(digits[4]);
    const rgb = blue | (green << 8) | (red << 16);

    return digits[1] + '#' + rgb.toString(16).padStart(6, '0');
};

export const transformToEditor = editor => {

    // Indicate that the element is editable
    editor.setAttribute('contentEditable', true);

    // Add a custom class
    editor.className = '__editor';

    // Create an exec command function
    const execCommand = (commandId, value) => {
        document.execCommand(commandId, false, value);
        editor.focus();
    };

    // Set default paragraph to <p>
    execCommand('defaultParagraphSeparator', 'p');

    // Create a toolbar
    const toolbar = createToolbar(editor.dataset, execCommand);

    editor.insertAdjacentElement(BEFORE_BEGIN, toolbar);

    // Listen for events to detect where the caret is
    const updateActiveState = () => {
        const toolbarButtons = toolbar.querySelectorAll('button[data-command-id]');

        for (const button of toolbarButtons) {
            const active = document.queryCommandState(button.dataset.commandId);

            button.classList.toggle('active', active);

        }

        const inputButtons = toolbar.querySelectorAll('input[data-command-id]');
        
        for (const input of inputButtons) {
            const value = document.queryCommandValue(input.dataset.commandId);
            input.value = rgbToHex(value);
        }

    };

    const contextMenu = (e) => {

        console.log('contextMenu', e.target);

        var cursor = {
            x: e.x,
            y: e.y
        };
        var element = document.elementFromPoint(e.x + 1, e.y + 1);

        if (element.tagName == 'TD') {
            console.log(e.target.tagName);

            var items = [
                {
                    text: "Delete Table",
                },
                {
                    text: "Add Row",
                },
                {
                    text: "Add Column",
                },
                {
                    text: "Delete Row",
                },
                {
                    text: "Delete Column",
                }
            ];

            const popup = createPopup(cursor, items);

        }

        e.preventDefault();

    };

    editor.addEventListener('keydown', updateActiveState);
    editor.addEventListener('keyup', updateActiveState);
    editor.addEventListener('click', updateActiveState);
    editor.addEventListener('input', e => {

        if (typeof editor.onChange === 'function') {
            editor.onChange(editor.innerHTML);
        }

    });

    editor.addEventListener('contextmenu', contextMenu);

    editor.setHTML = function(html) {
        editor.innerHTML = html;
        updateActiveState
    }

    editor.getHTML = function() {
        return editor.innerHTML;
    }

};