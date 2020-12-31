const zeroFill = (num, max) => num.toString().length < max ? zeroFill('0' + num, max) : num;

window.addEventListener('load', () => {
    console.log(zeroFill(23, 5));
});