//打开全屏方法
export function openFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullScreen();
    }
}

//退出全屏方法
export function exitFullScreen(element) {
    if (element.exitFullscreen) {
        element.exitFullscreen();
    } else if (element.mozCancelFullScreen) {
        element.mozCancelFullScreen();
    } else if (element.msExitFullscreen) {
        element.msExiFullscreen();
    } else if (document.webkitCancelFullScreen) {
        element.webkitCancelFullScreen();

    } else if (document.webkitExitFullscreen) {
        element.webkitExitFullscreen();
    }
}