const orden = {
    proyectil : 0,
    enemigo : 0,
}

const halfValue = (number) => number * 0.5;
const negativeValue = (number) => number * -1;

const comprobarColisiones = (elemento, colisionadores, altoElemento, anchoElemento, altoColisionador, anchoColisionador) => {
    const yElemento = parseInt(elemento.style.top.split(px)[0]);
    const xElemento = parseInt(elemento.style.left.split(px)[0]);

    let boundsColisionador = null;
    let yColisionador = 0;
    let xColisionador = 0;

    colisionadores.forEach(colisionador => {
        //Si el elemento no está escondido, es decir, que está recorriendo la pantalla.
        if (!colisionador.classList.contains(clase.esconder)) {
            yColisionador = parseInt(colisionador.style.top.split(px)[0]);
            xColisionador = parseInt(colisionador.style.left.split(px)[0]);
    
            boundsColisionador = {
                y : {
                    max : yColisionador,
                    min : yColisionador + altoColisionador - altoElemento
                },
                x : {
                    min : xColisionador - anchoElemento,
                    max : xColisionador + anchoColisionador
                }
            }
    
            if(yElemento <= boundsColisionador.y.min && yElemento >= boundsColisionador.y.max) {
                if (xElemento >= boundsColisionador.x.min && xElemento <= boundsColisionador.x.max) {
                        elemento.classList.remove(clase.disparado);
                        elemento.classList.add(clase.esconder);
                        let opacidadActual = parseFloat(colisionador.style.opacity);
                        opacidadActual -= damage.projectile;
                        colisionador.style.opacity = '' + opacidadActual;
                }
            }
        }
    });
}

const comprobarLimiteProyectil = (proyectil) => {
    const yPos = parseInt(proyectil.style.top.split(px)[0]);
    const height = parseInt(proyectil.style.height.split(px)[0]);

    //Si el proyectil se sale de la parte superior de la pantalla + la de su propia altura * 1.4, desaparecerá.
    if (yPos <= negativeValue(height * 1.4)) { 
        proyectil.classList.remove(clase.disparado);
        proyectil.classList.add(clase.esconder);
    }
}

const moverProyectiles = (proyectiles, enemigos) => {
    let actualPosProyectil = 0;

    proyectiles.forEach(proyectil => {
        if (!proyectil.classList.contains(clase.esconder)) {
            if (proyectil.classList.contains(clase.disparado)) {
                actualPosProyectil = parseInt(proyectil.style.top.split(px)[0]) - speed.projectile;
                proyectil.style.top = actualPosProyectil + px;

                comprobarLimiteProyectil(proyectil);
                comprobarColisiones(proyectil, enemigos, tamano.proyectil.alto, tamano.proyectil.ancho, tamano.enemigo.alto, tamano.enemigo.ancho);
            }
        }
    });
}

const disparar = (nave, proyectiles) => {
    let xPosNave = 0;
    let yPosNave = 0;

    if (!proyectiles[orden.proyectil].classList.contains(clase.disparado)) {
        proyectiles[orden.proyectil].classList.remove(clase.esconder);
        yPosNave = parseInt(nave.style.top.split(px)[0]);
        proyectiles[orden.proyectil].style.top = yPosNave + tamano.proyectil.alto + px;
        xPosNave = parseInt(nave.style.left.split(px)[0]);
        proyectiles[orden.proyectil].style.left = xPosNave + halfValue(tamano.nave.ancho) - halfValue(tamano.proyectil.ancho) + px;
        proyectiles[orden.proyectil].classList.add(clase.disparado);
    }
    orden.proyectil = orden.proyectil < proyectiles.length - 1 ? orden.proyectil + 1 : 0;
}

const moverEstrellas = (estrellas) => {

    let top = 0;
    let alto = 0;
    let actualY = 0;

    estrellas.forEach((estrella, i) => {
        top = parseInt(estrella.style.top.split(px)[0]);
        if (top >= tamano.ventana.alto) {
            alto = parseInt(estrella.style.height.split(px)[0]);
            estrella.classList.add(clase.esconder);
            if (i == 0) {
                top = parseInt(estrellas[i + 2].style.top.split(px)[0]);
                estrella.style.top = top - alto + px;
            } else if (i == 1) {
                top = parseInt(estrellas[i + 1].style.top.split(px)[0]);
                estrella.style.top = top - alto * 2 + px;
            } else {
                top = parseInt(estrellas[0].style.top.split(px)[0]);
                estrella.style.top = top - alto * 2 - speed.starts + px;
            }
        } else {
            estrella.classList.remove(clase.esconder);
        }
        actualY = parseInt(estrella.style.top.split(px)[0]);
        estrella.style.top = actualY + speed.starts + px;
    });
}

const iniciarParametros = (nave, estrellas, anchoNave, altoNave, vida) => {
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

const nuevoElemento = (tipo, ancho, alto, img, tipoEtiqueta) => {
    const elemento = document.createElement(tipoEtiqueta);

    switch (tipoEtiqueta) {
        case label.div:
            // elemento.style.backgroundSize = ancho + px + ' ' + alto + px;
            elemento.style.backgroundSize = oneHundred + percentage + ' ' + oneHundred + percentage;
            elemento.style.backgroundPosition = 'center';
            elemento.style.backgroundRepeat = 'no-repeat';
            elemento.style.backgroundImage = img;
            break;
        default:
            elemento.src = img;
            break;
    }

    elemento.style.opacity = 1;
    elemento.style.width = ancho + px;
    elemento.style.height = alto + px;
    elemento.style.top = negativeValue(ancho) + px;
    elemento.style.left = 0 + px;
    elemento.style.position = 'absolute';
    elemento.classList.add(clase.esconder, tipo);

    return elemento;
}

const crearElementos = (cantidad, tipo, ancho, alto, img, tipoEtiqueta) => {
    const elementos = new Array(cantidad);
    const body = document.querySelector(label.body);
    let posImg = 0;

    for (let i = 0; i < cantidad; i++) {
        elementos[i] = nuevoElemento(tipo, ancho, alto, img[posImg], tipoEtiqueta);
        body.appendChild(elementos[i]);
        if (img.length > 1) {
            posImg = posImg < img.length - 1 ? posImg + 1 : 0;
        }
    }
    return elementos;
}

const comprobarLimiteItem = (item, yPos) => {
    if (yPos >= tamano.ventana.alto) {
        item.classList.add(clase.esconder);
        item.style.opacity = '1';
        item.style.top = negativeValue(tamano.enemigo.alto) + px;
    }
}

const colisionConNave = (yColisionador, xColisionador, nave) => {
    const yPosNave = parseFloat(nave.style.top.split(px)[0]);
    const xPosNave = parseFloat(nave.style.left.split(px)[0]);

    const percentage = {
        x : tamano.nave.ancho * tamano.colisionador.nave.ancho,
        y : {
            top : tamano.nave.alto * tamano.colisionador.nave.alto.top,
            bottom : tamano.nave.alto * tamano.colisionador.nave.alto.bottom
        }
    }

    const boundsNave = {
        x : {
            min : xPosNave + percentage.x,
            max : (xPosNave + tamano.nave.ancho) - percentage.x,
        },
        y : {
            min : yPosNave + percentage.y.bottom,
            max : yPosNave + percentage.y.top
        }
    }

    const boundsColisionador = {
        x : {
            min : xColisionador,
            max : xColisionador + tamano.enemigo.ancho
        },
        y : {
            min : yColisionador + tamano.enemigo.alto,
            max : yColisionador
        }
    }

    let colision = false;

    if (boundsNave.x.min >= boundsColisionador.x.min && boundsNave.x.min <= boundsColisionador.x.max) {
        if (boundsNave.y.min <= boundsColisionador.y.min && boundsNave.y.min >= boundsColisionador.y.max) {
            colision = true;
        } else if (boundsNave.y.max >= boundsColisionador.y.max && boundsNave.y.max <= boundsColisionador.y.min) {
            colision = true;
        }
    } else if (boundsNave.x.max <= boundsColisionador.x.max && boundsNave.x.max >= boundsColisionador.x.min) {
        if (boundsNave.y.min <= boundsColisionador.y.min && boundsNave.y.min >= boundsColisionador.y.max) {
            colision = true;
        } else if (boundsNave.y.max >= boundsColisionador.y.max && boundsNave.y.max <= boundsColisionador.y.min) {
            colision = true;
        }
    }
    return colision;
}

const moverEnemigo = (enemigos, proyectiles, nave, vida) => {
    let yPos = 0;
    let xPos = 0;

    enemigos.forEach(enemigo => {
        if (!enemigo.classList.contains(clase.esconder)) {
            yPos = parseInt(enemigo.style.top.split(px)[0]);
            xPos = parseInt(enemigo.style.left.split(px)[0]);

            enemigo.style.top = yPos + speed.enemies + px;

            comprobarLimiteItem(enemigo, yPos);
            comprobarColisiones(enemigo, proyectiles, tamano.enemigo.alto, tamano.enemigo.ancho, tamano.proyectil.alto, tamano.proyectil.ancho);

            const opacidadActual = parseFloat(enemigo.style.opacity);

            if (opacidadActual <= 0.0) {
                enemigo.classList.add(clase.esconder);
                enemigo.style.opacity = '1';
                enemigo.style.top = negativeValue(tamano.enemigo.alto) + px;
            } else if (colisionConNave(yPos, xPos, nave)) {
                enemigo.classList.add(clase.esconder);
                enemigo.style.opacity = '1';
                enemigo.style.top = negativeValue(tamano.enemigo.alto) + px;

                const currentLife = vida.style.width.split(percentage)[0] - (oneHundred * damage.enemie);
                vida.style.width = currentLife + percentage;

                if (currentLife <= 0) {
                    alert('Has morido fuertemente.');
                    vida.style.width = oneHundred + percentage;
                } 
            }
        }
    });
}

const moverAliado = (aliados) => {
    let yPos = 0;
    aliados.forEach(aliado => {
        if (!aliado.classList.contains(clase.esconder)) {
            yPos = parseInt(aliado.style.top.split(px)[0]);
            aliado.style.top = yPos + speed.friends + px;

            comprobarLimiteItem(aliado, yPos);
        }
    });
}

const spawnItems = (items, probabilidad) => {
    const numero = Math.floor(Math.random() * oneHundred) + 1;

    if (numero <= probabilidad) {
        const limite = {
            x : {
                min : tamano.enemigo.ancho  + halfValue(tamano.enemigo.ancho),
                max : window.innerWidth - halfValue(tamano.enemigo.ancho)
            }
        }
    
        let spawned = false;
        items.forEach(enemigo => {
            if (!spawned) {
                const enemigoEscondido = enemigo.classList.contains(clase.esconder);
                if (enemigoEscondido) {
                    const xAleatoria = Math.floor(Math.random() * (limite.x.max - limite.x.min));
                    enemigo.classList.remove(clase.esconder);
                    enemigo.style.left = xAleatoria + px;
                    spawned = true;
                }
            }
        }); 
    }
}

const moverNaveDispMovil = (event, nave) => {
    const touchPos = {
        x : event.changedTouches[0].screenX,
        y : event.changedTouches[0].screenY
    }

    const limit = {
        x : {
            min : halfValue(tamano.nave.ancho),
            max : tamano.ventana.ancho - tamano.nave.ancho + halfValue(tamano.nave.ancho)
        },
        y : {
            min : tamano.ventana.ancho * (10 / oneHundred),
            max : tamano.ventana.alto * (90 / oneHundred)
        }
    }
    
    // if (touchPos.x >= limit.x.min && touchPos.x <= limit.x.max) {
    //     nave.style.left = touchPos.x - tamano.nave.ancho * 0.5 + px;
    // } else {
    //     nave.style.left = touchPos.x < limit.x.min ? limit.x.min + px : limit.x.max + px;
    // }

    nave.style.left = touchPos.x - halfValue(tamano.nave.ancho) + px;
}

const moverNaveOrdenador = (event, nave) => {
    const coordRaton = {
        x : event.clientX,
        y : event.clientY
    };

    const limitesVentana = {
        x : {
            min : tamano.nave.ancho * 0.1,
            max : tamano.ventana.ancho - tamano.nave.ancho * 0.1
        },
        y : {
            min : tamano.nave.alto,
            max : tamano.ventana.alto
        }
    }

    if (coordRaton.x > limitesVentana.x.min && coordRaton.x < limitesVentana.x.max) {
        nave.style.left = coordRaton.x - halfValue(tamano.nave.ancho) + px;
    }

    if (coordRaton.y > limitesVentana.y.min && coordRaton.y < limitesVentana.y.max) {
        nave.style.top = coordRaton.y - tamano.nave.alto + px;
    }
};

const onMovil = _ => {
    //Condición que comprueba si la página ha sido abierta desde un dispositivo móvil.
    if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        return true;
    } else {
        return false;
    }
}

const main = (nave, vida) => {
    //Así me aseguro que recorre siempre la misma distancia independientemente del tamaño de la pantalla.
    speed.projectile = tamano.ventana.alto * 0.01;

    if (onMovil()) {
        tamano.nave.ancho = tamano.ventana.ancho * tamano.movil.nave.ancho;
        tamano.nave.alto = tamano.nave.ancho * 1.1;
        //Movimiento de la nave si se hace desde un dispositivo móvil.
        document.addEventListener(usedEvent.touchstart, (event) => moverNaveDispMovil(event, nave));
    } else {
        //Movimiento de la nave si se hace desde un ordenador.
        document.addEventListener(usedEvent.mousemove, (event) => moverNaveOrdenador(event, nave));
    }

    const proyectiles = crearElementos(amount.projectiles, clase.proyectil, tamano.proyectil.ancho, tamano.proyectil.alto, [imagenes.proyectiles], label.div);
    const enemigos = crearElementos(amount.enemies, clase.enemigo, tamano.enemigo.ancho, tamano.enemigo.alto, imagenes.enemigos, label.div);
    const aliados = crearElementos(amount.friends, clase.aliado, tamano.aliado.ancho, tamano.aliado.alto, imagenes.aliados, label.div);

    //Meto un enemigo nada más empezar.
    spawnItems(enemigos, oneHundred);
    //Y un aliado.
    spawnItems(aliados, oneHundred);

    setInterval(_ => disparar(nave, proyectiles), time.betweenShots);
    setInterval(_ => moverProyectiles(proyectiles, enemigos), time.movement.projectile);
    setInterval(_ => spawnItems(enemigos, probability.enemies), time.spawn.enemies);
    setInterval(_ => spawnItems(aliados, probability.friends), time.spawn.friends);
    setInterval(_ => moverAliado(aliados), time.movement.friends);
    setInterval(_ => moverEnemigo(enemigos, proyectiles, nave, vida), time.movement.enemies);

    window.onresize = _ => {
        tamano.ventana.ancho = window.innerWidth;
        tamano.ventana.alto = window.innerHeight;
        document.querySelector(label.body).style.backgroundSize = tamano.ventana.ancho + px + ' ' + tamano.ventana.alto + px;
    }
}

window.addEventListener(usedEvent.load, _ => {
    tamano.ventana.ancho = window.innerWidth;
    tamano.ventana.alto = window.innerHeight;

    const nave = document.querySelector('.' + clase.nave);
    nave.style.display = none;
    const vida = document.querySelector('.' + clase.vida);
    const estrellas = document.querySelectorAll('.' + clase.estrellas);

    const menu = document.querySelector('.' + clase.menu + ' ' + label.div);
    const marginTopMenu = halfValue(tamano.ventana.alto) - halfValue(tamano.menu.alto);

    if (onMovil()) {
        const ancho = tamano.ventana.ancho * tamano.movil.menu.ancho;
        const alto = ancho * 1.2;
        menu.style.width = ancho + px;
        menu.style.height = alto + px;
        menu.style.position = 'absolute';
        menu.style.top = halfValue(tamano.ventana.alto) - halfValue(alto);
        menu.style.left = halfValue(tamano.ventana.ancho) - halfValue(ancho);

        tamano.nave.ancho = tamano.ventana.ancho * tamano.movil.nave.ancho;
        tamano.nave.alto = tamano.nave.ancho * 1.2;

        alert('Versión de móvil');   
    } else {
        menu.style.width = tamano.menu.ancho + px;
        menu.style.height = tamano.menu.alto + px;
    }

    iniciarParametros(nave, estrellas, tamano.nave.ancho, tamano.nave.alto, vida.childNodes[1]);

    menu.style.marginTop = marginTopMenu + px;
    document.querySelector('.' + clase.menu + ' ' + label.div + ' ' + label.img).src = './gif/countdown.gif';
    // document.querySelector('.menu div img').src = './gif/countdown.gif';
    setTimeout(() =>  {
        document.querySelector('.' + clase.menu).style.display = none;
        menu.style.display = none;
        nave.style.display = 'block';
        vida.style.display = 'block';
    }, time.countdown);

    setTimeout(() => main(nave, vida.childNodes[1]), time.startGame);
    setInterval(_ => moverEstrellas(estrellas), time.movement.starts);
});