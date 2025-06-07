document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', function (e) {
    if (e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) || 
        (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
    }
});
setInterval(function() {
    if (window.outerHeight - window.innerHeight > 200) {
        document.body.innerHTML = "DevTools Detected!";
    }
}, 1000);
