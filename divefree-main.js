let lastExpanded = null;
let selectedFolder = null;
let selectedFile = null;

function checkOrientation() {
  const banner = document.getElementById('orientationBanner');
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const onMobile = /android/i.test(userAgent) ||
  /iPhone|iPad|iPod/i.test(userAgent) ||
  /windows phone/i.test(userAgent) ||
  /mobile/i.test(userAgent);

  if (onMobile){
      // on mobile the window dimensions are usually fixed, but we can ask for landscape mode
      if (window.innerWidth < window.innerHeight) {
        // show the banner when in landscape mode
        banner.innerText = "This page looks better in landscape mode";
        banner.style.display = 'block';
    }else{
        // hide the banner otherwise
        banner.style.display = 'none';
    }
} else if (window.innerWidth < 600) {
      // on desktop, show the banner if below some min width
  banner.innerText = "This page looks better on wider screens";
  banner.style.display = 'block';
}else{
      // otherwise hide it
  banner.style.display = 'none';
}
}

function toggleFolder(folder) {
    const folderElement = document.getElementById(folder);
    if (folderElement.style.display === "none") {
        if (lastExpanded && lastExpanded !== folder) {
            document.getElementById(lastExpanded).style.display = "none";
        }
        folderElement.style.display = "block";
        lastExpanded = folder;
    } else {
        folderElement.style.display = "none";
    }

    // Bold the selected folder
    if (selectedFolder) {
        document.getElementById('folder-' + selectedFolder).classList.remove('selected');
    }
    selectedFolder = folder;
    document.getElementById('folder-' + folder).classList.add('selected');

     // Automatically click the first file under the folder, if available
    const firstFile = folderElement.querySelector('li');
    if (firstFile) {
        firstFile.click();  // Trigger a click on the first file to load it
    }
}

function loadFile(file) {
    const iframe = document.getElementById('file-viewer');
    iframe.src = file + '.html';  // Ensure we append '.html' to the file path

    // Bold the selected file
    if (selectedFile) {
        document.getElementById('file-' + selectedFile).classList.remove('selected');
    }
    selectedFile = file;
    document.getElementById('file-' + selectedFile).classList.add('selected');

    // Store the selected file in a cookie
    document.cookie = `selectedFile=${file};path=/;max-age=31536000;samesite=lax`;  // Store for 1 year
}

function getCookie(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

// Automatically load a file on page load
window.onload = function() {            
    restoreFolder = '2024-11-03';
    restoreFile = '10:42:34 - 58s - 20m';

    const selectedFileFromCookie = getCookie('selectedFile');

    if (selectedFileFromCookie) {
        // Extract folder and file from the cookie (expecting "folder/file" format)
        [restoreFolder, restoreFile] = selectedFileFromCookie.split('/');
    }

    // Expand the specific folder and load the specific file
    const folderElement = document.getElementById('folder-' + restoreFolder);
    if (folderElement) {
        folderElement.click();  // Expand the folder
        const fileElement = document.getElementById('file-' + restoreFolder + '/' + restoreFile);
        if (fileElement) {
            fileElement.click();  // Load the file into the iframe
        }
    }
    
    // Check orientation and bother user
    checkOrientation();
};

window.addEventListener('resize', function() {
    checkOrientation();
});
