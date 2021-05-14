const { ipcRenderer } = require('electron');

const zip = require('jszip');
const $ = require('jquery');

const fs = require('fs');

let documents = {};
let markers = {};
let format = {};

let tree = null;
let editor = null;

let filename = null;

let FRAGMENTS_MENU = null;
let CALLBACKS = null;

const extractFilename = (path) => {
    const pathArray = path.split("/");
    const lastIndex = pathArray.length - 1;
    return pathArray[lastIndex];
};

$.fn.Load = (filepath) => {

    fs.readFile(filepath, function(err, data) {
        var zipFile = new zip();

        zipFile.loadAsync(data).then(async function(zipFile) {
            documents = {};
            editor.setData("");

            tree.removeTree();

            tree = createTree('placeholder', 'white', FRAGMENTS_MENU, CALLBACKS);

            var files = zipFile.file(/.*/);
            var structure = {};
            var node = null;
            var rootFolder = null;
            var setData = false;

            zipFile.forEach(async function(relativePath, zipEntry) {

                if (zipEntry.dir) {

                    if (node == null) {
                        node = tree.createNode(zipEntry.name.replace(/.$/, ''), false, 'assets/images/folder-icon.png', null, null, 'context1');
                    } else {
                        var paths = relativePath.replace(/.$/, '').split("/");
                        var folder = ""

                        for (var iPath = 0; iPath < paths.length - 1; iPath++) {
                            folder += paths[iPath] + "/";
                        }

                        node = structure[folder].createChildNode(paths[paths.length - 1], false, "assets/images/folder-icon.png", null, "context2");

                    }

                    structure[relativePath] = node;

                } else {

                    function getBlob(file) {

                        return new Promise(resolve => {
                            file.async("blob").then(function(blob) {
                                resolve(blob);
                            });

                        });

                    }

                    function readBlob(url) {

                        return new Promise(resolve => {
                            var reader = new FileReader();

                            reader.onload = function() {
                                resolve(reader.result);
                            }

                            reader.readAsText(url);

                        });

                    }

                    let fileUrl = await getBlob(zipEntry);
                    let data = await readBlob(fileUrl);
                    let fileName = extractFilename(zipEntry.name);
                    let path = relativePath.replace(fileName, '');

                    fileName = fileName.split(".html").join("");

                    if (fileName.startsWith('$$')) {

                        if (structure[path] == null) {
                            node = tree.createNode(path, false, 'assets/images/folder-icon.png', null, null, 'context1');
                            structure[path] = node;
                        }

                        documents[structure[path].id] = data;

                        tree.selectedNode = structure[path];

                        if (`${path}` == `${fileName.replace('$$', '')}/` && !setData) {
                            editor.setData(data);
                            setData = true;
                        }

                    } else {
                        var fragmentNode = structure[path].createChildNode(fileName, false, "assets/images/document-icon.png", null, "context2");

                        documents[fragmentNode.id] = data;

                    }

                }

            });

            tree.drawTree();

        })

    })

}

$.fn.Save = (zipFolder, nodes, isRoot) => {

    for (let iNode in nodes) {

        if (nodes[iNode].childNodes.length > 0 || isRoot) {

            let subFolder = zipFolder.folder(nodes[iNode].text, {
                comment: "Generated by Knowledge Manager"
            });

            let html = documents[nodes[iNode].id];

            if (html) {
                subFolder.file(`$$${nodes[iNode].text}.html`, html, {
                    comment: "Generated by Knowledge Manager"
                });
            }

            $(this).Save(subFolder, nodes[iNode].childNodes, false);

        } else {
            let html = documents[nodes[iNode].id];

            if (html) {
                zipFolder.file(`${nodes[iNode].text}.html`, html, {
                    comment: "Generated by Knowledge Manager"
                });
            }

        }

    }

}

$.fn.Join = (childNodes, html, level) => {

    for (let childNode in childNodes) {
        html.push(documents[childNodes[childNode].id] == null ? '' : documents[childNodes[childNode].id]);

        if (level < 2 && documents[childNodes[childNode].id] != null &&
            documents[childNodes[childNode].id].trim().length > 0) {
            html.push(`<div class="break"></div>`);
        }

        if (childNodes[childNode].childNodes.length > 0) {
            $(this).Join(childNodes[childNode].childNodes, html, level + 1);
        }

    }

}

$(async() => {

    $(document).on('click', 'a[href^="http"]', function(event) {
        event.preventDefault();

        if (event.target.id.includes('ck-editor')) {
            ipcRenderer.send('openUrl', this.href);
        }

    });

    DecoupledEditor.builtinPlugins.map(plugin => plugin.pluginName);

    let promise = new Promise((resolve, reject) => {

        DecoupledEditor
            .create(document.querySelector('#editor'), {
                toolbar: ['heading', 'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor',
                    '|', 'indent', 'outdent', 'alignment',
                    '|', 'bold', 'italic', 'underline', 'strikeThrough',
                    '|', 'link', 'bulletedList', 'numberedList', 'blockQuote',
                    '|', 'imageUpload', 'insertTable', '|', 'undo', 'redo'
                ],
                heading: {
                    options: [
                        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
                    ]
                },
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
                    tableToolbar: ['bold', 'italic']
                },
                extraPlugins: [Base64CustomUploadAdapterPlugin],

            })
            .then(editor => {
                const toolbarContainer = document.querySelector('#toolbar-container');

                toolbarContainer.appendChild(editor.ui.view.toolbar.element);

                resolve(editor);

            })
            .catch(error => {
                console.error(error);
                reject();
            });

    });

    editor = await promise;

    editor.model.document.on('change:data', () => {
        if (tree != null & tree.selectedNode != null) {

            documents[tree.selectedNode.id] = editor.getData();
        }

    });

    $("#window-minimize").on('click', async(e) => {

        ipcRenderer.send('minimize');

    });

    $("#window-maximize").on('click', async(e) => {
        var isMaximized = ipcRenderer.sendSync('isMaximized');

        if (!isMaximized) {
            $("#window-maximize").addClass("fa-window-restore");
            $("#window-maximize").removeClass("fa-square");
            ipcRenderer.send('maximize');
        } else {
            $("#window-maximize").removeClass("fa-window-restore");
            $("#window-maximize").addClass("fa-square");
            ipcRenderer.send('unmaximize');
        }

    });

    $("#quit").on('click', async(e) => {

        ipcRenderer.send('quit');

    });

    ipcRenderer.on('wrote-pdf', (event, path) => {
        $('#waitDialog').css('display', 'none');

        alert("PDF Written");
    });

    $('#open').on('click', (e) => {

        let result = ipcRenderer.sendSync('showOpenDialog');

        if (!result.canceled) {
            let filepath = result.filePaths[0];

            $(this).Load(filepath);
            filename = filepath;
            $('#filename').text(`- ${filepath}`);

        }

    });

    $('#save').on('click', (e) => {
        let fileUtil = new FileUtil(document);

        let zipFile = new zip();
        let folder = zipFile.folder('');

        $(this).Save(folder, tree.childNodes, true);

        let result = ipcRenderer.sendSync('showSaveDialog', (filename == null ? 'fragments.zip' : filename));

        if (!result.canceled) {
            filename = result.filePath;

            $('#filename').text(`- ${filename}`);

            zipFile
                .generateNodeStream({ streamFiles: true })
                .pipe(fs.createWriteStream(filename))
                .on('finish', function() {
                    console.log("out.zip written.");
                });

        }


    });

    $('#new').on('click', (e) => {

        documents = {};

        filename = null;

        $('#filename').html('-&nbsp[Untitled]');

        editor.setData("");

        tree.removeTree();

        tree = createTree('placeholder', 'white', FRAGMENTS_MENU, CALLBACKS);

        tree.createNode('Fragments', false, 'assets/images/folder-icon.png', null, null, 'context1');

        tree.drawTree();

    });

    $('#print').on('click', (e) => {
        var result = ipcRenderer.sendSync('showPrintDialog');

        if (result.canceled) {
            return;
        }

        $('#waitDialog').css('display', 'inline-block');

        window.setTimeout(function() {
            let html = [];

            $(this).Join(tree.childNodes, html, 0);

            let text = html.join("");

            let footer = format.hasOwnProperty('footer') ? format['footer'] : "";

            text = `<html><style>td { min-width:100px;} ` +
                `.center { display: block; margin-left: auto; margin-right: auto; width: 50%; }` +
                `</style> <div id="footer" class="footer">${footer}</div><div style="font-family:Arial, Helvetica, sans-serif; font-size:14px;">${text}</div><html>`;

            $('#print-area').html(text);

            ipcRenderer.send('printToPdf', result.filePath);
        }, 100);


    });

    $('#navigate').on('click', (e) => {

        $('#navigate-box').css('display', 'inline-block');

    });

    $('#format').on('click', (e) => {

        if (format['footer']) {
            $('#footer').val(format['footer']);
        } else {
            $('#footer').val("");
        }

        $('#format-box').css('display', 'inline-block');

    });

    $('#help').on('click', (e) => {

        $('#dialog-help').css('display', 'inline-block');

    });

    $('#close').on('click', (e) => {

        $('#dialog-help').css('display', 'none');

    });

    FRAGMENTS_MENU = {
        'context1': {
            elements: [{
                    text: 'Fragment Actions',
                    icon: 'assets/images/folder-icon.png',
                    action: function(node) {},
                    submenu: {
                        elements: [{
                                text: 'Rename Node',
                                icon: 'assets/images/rename-icon.png',
                                action: function(node) {
                                    node.editNode();
                                }

                            },

                        ]
                    }

                },
                {
                    text: 'Child Actions',
                    icon: 'assets/images/document-icon.png',
                    action: function(node) {},
                    submenu: {
                        elements: [{
                                text: 'Create Child Node',
                                icon: 'assets/images/add-icon.png',
                                action: function(node) {
                                    var childNode = node.createChildNode('[fragment]', false, "assets/images/document-icon.png", null, "context2");
                                    documents[node.id] = editor.getData();
                                    tree.selectNode(childNode);
                                    node.expandNode();
                                    editor.setData("");
                                }
                            },
                            {
                                text: 'Delete Child Nodes',
                                icon: 'assets/images/delete-icon.png',
                                action: function(node) {
                                    node.removeChildNodes();

                                }

                            }

                        ]

                    }

                }

            ]

        },
        'context2': {
            elements: [{
                    text: 'Rename Node',
                    icon: 'assets/images/rename-icon.png',
                    action: function(node) {
                        node.editNode();
                    }

                },
                {
                    text: 'Delete Node',
                    icon: 'assets/images/delete-icon.png',
                    action: function(node) {
                        editor.setData("");
                        node.removeNode();
                    }

                },
                {
                    text: 'Create Child Node',
                    icon: 'assets/images/add-icon.png',
                    action: function(node) {
                        var childNode = node.createChildNode('[fragment]', false, 'assets/images/document-icon.png', null, "context2");
                        node.setIcon('assets/images/folder-icon.png');
                        documents[node.id] = editor.getData();
                        tree.selectNode(childNode);
                        node.expandNode();
                        editor.setData("");
                    }
                }
            ]

        }

    };

    CALLBACKS = {

        onclick: function(node) {
            if (documents[node.id] == null) {
                editor.setData("");
            } else {
                editor.setData(documents[node.id]);
            }

        },

        addchild: function(node) {
            node.setIcon('assets/images/folder-icon.png');
        },

        removechild: function(node) {

            if (node.childNodes.length == 0) {
                node.setIcon('assets/images/document-icon.png');
            } else {
                node.setIcon('assets/images/folder-icon.png');
            }

        }

    };

    tree = createTree('placeholder', 'white', FRAGMENTS_MENU, CALLBACKS);

    let root = tree.createNode('Fragments', false, 'assets/images/folder-icon.png', null, null, 'context1');

    tree.drawTree();

    tree.selectNode(root);
    let paneSep = $("#separator")[0];

    paneSep.sdrag(function(el, pageX, startX, fix) {
        let leftPaneWidth = $("#separator").offset().left - 56;
        let rightPaneLeft = $("#separator").offset().left + 9;

        $("#container").width(leftPaneWidth + "px");
        $("#details").css("left", rightPaneLeft + "px");

    });

});