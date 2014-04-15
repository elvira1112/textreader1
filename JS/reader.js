"use strict"
var reader; //GLOBAL File Reader object for demo purpose only
var el = $('#main');
var pageSize=120;

/**
 * Check for the various File API support.
 */
function checkFileAPI() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        reader = new FileReader();
        return true;
    } else {
        alert('The File APIs are not fully supported by your browser. Fallback required.');
        return false;
    }
}

/**
 * read text input
 */
function readText(filePath) {
    var output = ""; //placeholder for text output
    if(filePath.files && filePath.files[0]) {
        reader.addEventListener("load", function (event) {
            var textFile = event.target.result;
            displayContents(event.name,textFile);
        });
        reader.readAsText(filePath.files[0]);
    }//end if html5 filelist support
    else if(ActiveXObject && filePath) { //fallback to IE 6-8 support via ActiveX
        try {
            reader = new ActiveXObject("Scripting.FileSystemObject");
            var file = reader.OpenTextFile(filePath, 1); //ActiveX File Object
            output = file.ReadAll(); //text contents of file
            file.Close(); //close file "input stream"
            displayContents(output);
        } catch (e) {
            if (e.number == -2146827859) {
                alert('Unable to access local files due to browser security settings. ' +
                    'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' +
                    'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"');
            }
        }
    }
    else { //this is where you could fallback to Java Applet, Flash or similar
        return false;
    }
    return true;
}

/**
 * display content using a basic HTML replacement
 */
function displayContents(title, txt) {
    var len = txt.length;
    var count = 0;

    var div = '<div class="hard"></div>';
    el.append(div);
    el.append(div);

    while(count < len){
        var div = document.createElement('div');
        div.className = 'bgColor';
        div.innerHTML = createPage(txt.substr(count,pageSize));
        count += pageSize;
        el.prepend(div);
    }
    div = '<div class="hard"></div>';
    el.prepend(div);
    el.prepend(div);
    zh_init();
    el.turn({
        page:Math.ceil(len/pageSize)+4
    });
}

function createPage(content){
    return '<div class="hie">' + content + '</div>';
}
