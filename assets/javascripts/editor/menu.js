export const createMenu = (editor) => {

    return {
        TD:  [
                {
                text: "Delete Table",
                action: function(element, position) {
                    var node = element.parentNode;

                    while (node.tagName != 'TABLE') {
                        node = node.parentNode
                    }

                    node.remove();
                    editor.focus();

                    editor.onChange(editor.innerHTML);

                }

            },
            {
                text: "Add Row",
                action: function(element, position) {
                    var rowIndex = element.closest('tr').rowIndex;
                    var cellsLength = element.closest('tr').cells.length;
                    var table = element.parentNode;

                    while (table.tagName != 'TABLE') {
                        table = table.parentNode
                    }

                    var row = table.insertRow(rowIndex);

                    for (var iCell = 0; iCell < cellsLength; iCell++) {
                        row.insertCell(iCell);
                    }

                    editor.onChange(editor.innerHTML);

                }

            },
            {
                text: "Add Column",
                action: function(element, position) {
                    var table = element.parentNode;
                    while (table.tagName != 'TABLE') {
                        table = table.parentNode
                    }
                    var cellIndex = element.cellIndex;

                    for (var row = 0; row < table.rows.length; row++) {
                        table.rows[row].insertCell(cellIndex);
                    }

                    editor.onChange(editor.innerHTML);

                }

            },
            {
                text: "Delete Row",
                action: function(element, position) {
                    var rowIndex = element.closest('tr').rowIndex;
                    var cellsLength = element.closest('tr').cells.length;
                    var table = element.parentNode;

                    while (table.tagName != 'TABLE') {
                        table = table.parentNode
                    }

                    table.deleteRow(rowIndex);

                    editor.onChange(editor.innerHTML);

                }

            },
            {
                text: "Delete Column",
                action: function(element, position) {
                    var cellsLength = element.closest('tr').cells.length;

                    var table = element.parentNode;
                    while (table.tagName != 'TABLE') {
                        table = table.parentNode
                    }


                    var cellIndex = element.cellIndex;
                    var cellCount = 0;

                    for (var row = 0; row < table.rows.length; row++) {

                        if (table.rows[row].cells.length > cellIndex) {
                            table.rows[row].deleteCell(cellIndex);
                        }

                        cellCount = table.rows[row].cells.length > 0 ? table.rows[row].cells.length : cellCount

                    }

                    if (cellCount == 0) {
                        table.remove();
                        editor.focus();
                    }

                    editor.onChange(editor.innerHTML);

                }

            }
        ],

        A:  [
            {
            text: "Edit Anchor",
            action: function(element, position) {

                alert("im herer a");
       
                editor.focus();

                editor.onChange(editor.innerHTML);

            }

        }]
    }

}
