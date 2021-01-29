let speedStartsEvent = null;

const iniciarParametros = (nave, estrellas, anchoNave, altoNave, vida) => {
    nave.style.display = none;
    nave.style.width = anchoNave + px;
    nave.style.height = altoNave + px;
    nave.style.top = tamano.ventana.alto * 0.7 + px;
    nave.style.left = halfValue(tamano.ventana.ancho) - halfValue(anchoNave) + px;

    vida.style.width = oneHundred + percentage;

    let altoEstrella = 0;

    estrellas = document.querySelectorAll('.' + clase.estrellas);
    estrellas.forEach(estrella => {
        estrella.style.top = altoEstrella + px;
        estrella.style.left = 0 + px;
        estrella.style.width = tamano.ventana.ancho + px;
        estrella.style.height = tamano.ventana.alto + px;
        altoEstrella -= parseInt(estrella.style.height.split(px)[0]);
    });
}

const main = (nave, vida) => {
    //Así me aseguro que recorre siempre la misma distancia independientemente del tamaño de la pantalla.
    speed.projectile = tamano.ventana.alto * 0.01;

    if (onMovil()) {
        tamano.nave.ancho = tamano.ventana.ancho * tamano.movil.nave.ancho;
        tamano.nave.alto = tamano.nave.ancho * 1.1;
        //Movimiento de la nave si se hace desde un dispositivo móvil.
        document.addEventListener(usedEvent.touchstart, (event) => item.ship.movil.move(event, nave));
    } else {
        //Movimiento de la nave si se hace desde un ordenador.
        document.addEventListener(usedEvent.mousemove, (event) => {
            if (!item.ship.isDeath) item.ship.computer.move(event, nave)
        });
    }

    const proyectiles = item.createArray(amount.projectiles, clase.proyectil, tamano.proyectil.ancho, tamano.proyectil.alto, [imagenes.proyectiles], label.div);
    const enemigos = item.createArray(amount.enemies, clase.enemigo, tamano.enemigo.ancho, tamano.enemigo.alto, imagenes.enemigos, label.div);
    const aliados = item.rearrange(item.createArray(amount.friends, clase.aliado, tamano.aliado.ancho, tamano.aliado.alto, imagenes.aliados, label.div));

    //Meto un enemigo nada más empezar.
    item.spawn(enemigos, oneHundred);
    //Y un aliado.
    item.spawn(aliados, oneHundred);

    rateOfFireEvent = setInterval(_ => item.ship.shoot(nave, proyectiles), time.betweenShots);
    speedShootEvent = setInterval(_ => item.projectile.move(proyectiles, enemigos), time.movement.projectile);
    
    setInterval(_ => item.ally.move(aliados, nave, proyectiles, vida), time.movement.friends);
    setInterval(_ => item.spawn(enemigos, probability.enemies), time.spawn.enemies);
    setInterval(_ => item.spawn(aliados, probability.friends), time.spawn.friends);
    setInterval(_ => item.enemy.move(enemigos, nave, vida), time.movement.enemies);
    setInterval(_ => item.enemy.increaseLife(), time.changeEnemyLife);
}

window.addEventListener(usedEvent.load, _ => {
    //Doy tamaño a la ventana.
    tamano.ventana.ancho = window.innerWidth;
    tamano.ventana.alto = window.innerHeight;

    const nave = document.querySelector('.' + clase.nave);
    const vida = document.querySelector('.' + clase.vida);
    const estrellas = document.querySelectorAll('.' + clase.estrellas);

    const countDownMenu = document.querySelector('.' + clase.countDownMenu + ' ' + label.div);
    const loseMenu = document.querySelector('.' + clase.loseMenu);
    //loseMenu.style.display = 'none';

    if (onMovil()) {
        tamano.nave.ancho = tamano.ventana.ancho * tamano.movil.nave.ancho;
        tamano.nave.alto = tamano.nave.ancho * 1.2;
    }

    iniciarParametros(nave, estrellas, tamano.nave.ancho, tamano.nave.alto, vida.childNodes[1]);

    document.querySelector('.' + clase.countDownMenu + ' ' + label.div + ' ' + label.img).src = './gif/countdown.gif';
    setTimeout(() =>  {
        
        document.querySelector('.' + clase.countDownMenu).style.display = none;
        countDownMenu.style.display = none;
        nave.style.display = 'block';
        vida.style.display = 'block';

    }, time.countdown);

    setTimeout(() => main(nave, vida.childNodes[1]), time.countdown);
    speedStartsEvent = setInterval(_ => item.starts.move(estrellas), time.movement.starts);
    let eventChangeSpeedStarts = setInterval(() => item.starts.changeSpeed(estrellas, eventChangeSpeedStarts), time.changeSpeedStarts);

    document.querySelector('button').addEventListener('click', () => {
        alert("Hola, soy el botón de volver a jugar. Siento decirte que todavía no funciono xd");
    });
});

window.onresize = () => {
    tamano.ventana.ancho = window.innerWidth;
    tamano.ventana.alto = window.innerHeight;
    document.querySelector(label.body).style.backgroundSize = tamano.ventana.ancho + px + ' ' + tamano.ventana.alto + px;
}