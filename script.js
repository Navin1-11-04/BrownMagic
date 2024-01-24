const spinnner = document.querySelector('.spinner-wrapper');

window.addEventListener('load',()=>{
    spinnner.style.opacity = '0';

    setTimeout(()=>{
        spinnner.style.display = 'none';
    },2000);
});
