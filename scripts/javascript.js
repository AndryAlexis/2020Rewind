let speedStartsEvent = null;
let shoteEvent = null;

const iniciarParametros = (nave, estrellas, anchoNave, altoNave, vida) => {
    nave.style.display = none;
    nave.style.width = anchoNave + px;
    nave.style.height = altoNave + px;
    nave.style.top = size.frame.height * 0.7 + px;
    nave.style.left = halfValue(size.frame.width) - halfValue(anchoNave) + px;

    vida.style.width = oneHundred + percentage;

    let altoEstrella = 0;

    estrellas = document.querySelectorAll('.' + classes.starts);
    estrellas.forEach(estrella => {
        estrella.style.top = altoEstrella + px;
        estrella.style.left = 0 + px;
        estrella.style.width = size.frame.width + px;
        estrella.style.height = size.frame.height + px;
        altoEstrella -= parseInt(estrella.style.height.split(px)[0]);
    });
}

const main = (nave, vida) => {
    //Así me aseguro que recorre siempre la misma distancia independientemente del tamaño de la pantalla.
    speed.projectile = size.frame.height * 0.01;

    if (onMovil()) {
        size.ship.width = size.frame.width * size.movil.nave.ancho;
        size.ship.height = size.ship.width * 1.1;
        //Movimiento de la nave si se hace desde un dispositivo móvil.
        document.addEventListener(usedEvent.touchstart, (event) => item.ship.movil.move(event, nave));
    } else {
        //Movimiento de la nave si se hace desde un ordenador.
        document.addEventListener(usedEvent.mousemove, (event) => {
            if (!item.ship.isDeath) item.ship.computer.move(event, nave)
        });
    }

    const proyectiles = item.createArray(amount.projectiles, classes.projectile, size.projectile.width, size.projectile.height, [imagenes.proyectiles], label.div);
    const enemigos = item.createArray(amount.enemies, classes.enemy, size.enemy.width, size.enemy.height, imagenes.enemigos, label.div);
    const aliados = item.rearrange(item.createArray(amount.friends, classes.ally, size.ally.width, size.ally.height, imagenes.aliados, label.div));

    //Meto un enemigo nada más empezar.
    item.spawn(enemigos, oneHundred);
    //Y un aliado.
    item.spawn(aliados, oneHundred);

    rateOfFireEvent = setInterval(_ => item.ship.shoot(nave, proyectiles), time.betweenShots);
    speedShootEvent = setInterval(_ => item.projectile.move(proyectiles, enemigos), time.movement.projectile);
    
    speedAllyEvent = setInterval(_ => item.ally.move(aliados, nave, proyectiles, vida), time.movement.friends);
    spawnEnemyEvent = setInterval(_ => item.spawn(enemigos, probability.enemies), time.spawn.enemies);
    spawnAllyEvent = setInterval(_ => item.spawn(aliados, probability.friends), time.spawn.friends);
    speedEnemyEvent = setInterval(_ => item.enemy.move(enemigos, nave, vida), time.movement.enemies);
    increaseLifeEnemies = setInterval(_ => item.enemy.increaseLife(), time.changeEnemyLife);
}

window.addEventListener(usedEvent.load, _ => {
    //Doy tamaño a la ventana.
    size.frame.width = window.innerWidth;
    size.frame.height = window.innerHeight;

    const nave = document.querySelector('.' + classes.ship);
    const vida = document.querySelector('.' + classes.life);
    const estrellas = document.querySelectorAll('.' + classes.starts);

    const countDownMenu = document.querySelector('.' + classes.countDownMenu + ' ' + label.div);

    if (onMovil()) {
        size.ship.width = size.frame.width * size.movil.nave.ancho;
        size.ship.height = size.ship.width * 1.2;
    }

    iniciarParametros(nave, estrellas, size.ship.width, size.ship.height, vida.childNodes[1]);

    document.querySelector('.' + classes.countDownMenu + ' ' + label.div + ' ' + label.img).src = './gif/countdown.gif';

    setTimeout(() =>  {
        
        document.querySelector('.' + classes.countDownMenu).style.display = none;
        countDownMenu.style.display = none;
        nave.style.display = 'block';
        vida.style.display = 'block';

    }, time.countdown);

    setTimeout(() => main(nave, vida.childNodes[1]), time.countdown);
    speedStartsEvent = setInterval(_ => item.starts.move(estrellas), time.movement.starts);
    eventChangeSpeedStarts = setInterval(() => item.starts.changeSpeed(estrellas, eventChangeSpeedStarts), time.changeSpeedStarts);

    document.querySelector('button').addEventListener('click', () => {
        //Quito el menú de perder.
        const loseMenu = document.querySelector('.' + classes.loseMenu);
        loseMenu.style.display = 'none';

        //Recojo todos los enemigos visibles y los hago desaparecer.
        const allEnemiesOnScreen = document.querySelectorAll('.' + classes.enemy);
        hideElements(allEnemiesOnScreen, size.enemy.height);

        //Recojo todos los aliados visibles y también los hago desaparecer.
        const allAlliesOnScreeen = document.querySelectorAll('.' + classes.ally);
        hideElements(allAlliesOnScreeen, size.ally.height);

        //Reinicio todas las estadísticas de la nave.
        power.candence = initPower.candence;
        power.shootSpeed = initPower.shootSpeed;
        power.life = initPower.life;
        power.damage = initPower.damage;

        //Reinicio todas las velocidades.
        speed.projectile = size.frame.height * 0.01;
        speed.starts = initSpeed.starts;
        speed.enemies = initSpeed.enemies;
        speed.friends = initSpeed.friends;

        //Reinicio todos los tiempos.
        time.movement.projectile = initTime.movement.projectile;
        time.movement.starts = initTime.movement.starts;
        time.movement.enemies = initTime.movement.enemies;
        time.movement.friends = initTime.movement.friends;
        time.betweenShots = initTime.betweenShots;
        time.spawn.enemies = initTime.spawn.enemies;
        time.spawn.friends = initTime.spawn.friends;

        //Reinicio la puntuación.
        const currentPoints = document.querySelector('.' + classes.points);
        currentPoints.textContent = '0000000000';         

        //Relleno la vida al máximo.
        const vida = document.querySelector('.' + classes.life).childNodes[1];
        vida.style.width = oneHundred + '%';

        //Restauro todo los setTimeout().
        const proyectiles = document.querySelectorAll('.' + classes.projectile);
        const enemigos = document.querySelectorAll('.' + classes.enemy);
        const aliados = document.querySelectorAll('.' + classes.ally);

        rateOfFireEvent = setInterval(_ => item.ship.shoot(nave, proyectiles), time.betweenShots);
        speedShootEvent = setInterval(_ => item.projectile.move(proyectiles, enemigos), time.movement.projectile);
        
        speedAllyEvent = setInterval(_ => item.ally.move(aliados, nave, proyectiles, vida), time.movement.friends);
        spawnEnemyEvent = setInterval(_ => item.spawn(enemigos, probability.enemies), time.spawn.enemies);
        spawnAllyEvent = setInterval(_ => item.spawn(aliados, probability.friends), time.spawn.friends);
        speedEnemyEvent = setInterval(_ => item.enemy.move(enemigos, nave, vida), time.movement.enemies);
        increaseLifeEnemies = setInterval(_ => item.enemy.increaseLife(), time.changeEnemyLife);
        speedStartsEvent = setInterval(_ => item.starts.move(estrellas), time.movement.starts);
        eventChangeSpeedStarts = setInterval(() => item.starts.changeSpeed(estrellas, eventChangeSpeedStarts), time.changeSpeedStarts);

        //Digo que la nave sigue viva.
        item.ship.isDeath = false;
    });

    const hideElements = (elements, heightElement) => {
        elements.forEach(element => {
            if (!element.classList.contains(classes.hide))
                item.rePrepareToSpawn(element, heightElement);
        });
    };
});

window.onresize = () => {
    size.frame.width = window.innerWidth;
    size.frame.height = window.innerHeight;
    document.querySelector(label.body).style.backgroundSize = size.frame.width + px + ' ' + size.frame.height + px;
}