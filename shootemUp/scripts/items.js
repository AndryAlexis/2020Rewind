const orden = {
    proyectil : 0,
    enemigo : 0,
}

let rateOfFireEvent = null;
let speedShootEvent = null;

item = {
    checkLimit : (yPos) => {
        return (yPos) >= tamano.ventana.alto;
    },
    create : (amount, type, width, height, img, labelType) => {
        const items = new Array(amount);
        const body = document.querySelector(label.body);
        let posImg = 0;
    
        for (let i = 0; i < amount; i++) {
            items[i] = nuevoElemento(type, width, height, img[posImg], labelType);
            body.appendChild(items[i]);
    
            switch (type) {
                case clase.aliado:
                    items[i].classList.add(item.ally.chooseAllyPowers(img[posImg]));
                    break;
            }
    
            if (img.length > 1) {
                posImg = posImg < img.length - 1 ? posImg + 1 : 0;
            }
        }
        return items;
    },
    rearrange : (items) => {
        return items.sort(() => Math.random() - 0.5)
    },
    ally : {
        chooseAllyPowers : (urlImg) => 
        {
            return Object.values(nombre.aliado).filter(nombreAliado => urlImg.includes(nombreAliado) ? nombreAliado : "")
        },
        reassignRole : (element, images) => {
            const rnd = Math.floor(Math.random() * images.length);
        
            let chosedImage = null;
            images.forEach((image, i) => {
                if (i == rnd) chosedImage = image;
            });
            //Le quito la clase que determinaba el tipo de aliado que era hasta ahora.
            element.classList.remove(item.ally.chooseAllyPowers(element.style.backgroundImage));
            //Cambio su imagen.
            element.style.backgroundImage = chosedImage;
            //Y finalmente reasigno su nuevo poder según su nueva imagen.
            element.classList.add(item.ally.chooseAllyPowers(chosedImage), clase.aliado);
        },
        rePrepareToSpawn : (element, heightElement) => {
            element.classList.add(clase.esconder);
            element.style.top = negativeValue(heightElement) + px;
            element.style.opacity = '1';
        },
        rebootRateOfFireShoot : (ship, projectiles) => {
            if (time.betweenShots - poder.cadencia > poder.max.cadencia) {
                time.betweenShots -= poder.cadencia;
            } else {
                time.betweenShots = poder.max.cadencia;
            }
            rateOfFireEvent = clearInterval(rateOfFireEvent);
            rateOfFireEvent = setInterval(_ => item.ship.shoot(ship, projectiles), time.betweenShots)
        },
        heal : (life) => {
            let currentLife = parseInt(life.style.width.split(percentage)[0]);
            //Si la vida actual es menor al 100%, se le curará.
            currentLife += currentLife < oneHundred ? oneHundred * poder.vida : 0;
            //Si con la suma anterior se pasa del 100%, me aseguro que sea siempre 100%.
            currentLife = currentLife > oneHundred ? oneHundred : currentLife;
            life.style.width = currentLife + percentage;
        },
        increaseStats : (ally, ship, projectiles, life) => {
            if (ally.classList.contains(nombre.aliado.gt)) {
                item.ally.rebootRateOfFireShoot(ship, projectiles);
            } else if (ally.classList.contains(nombre.aliado.mascarilla)) {
                item.ally.heal(life);
            } else if (ally.classList.contains(nombre.aliado.poqvnw)) {
                damage.projectile += damage.projectile < 1 ? poder.dano : 0;
                damage.projectile = Math.round(damage.projectile * 10) / 10;
            } else if (ally.classList.contains(nombre.aliado.koala)) {
                speed.projectile += poder.velocidadDisparo;
            }
        },
        move : (allys, ship, projectiles, life) => {
            let yPos = 0;
            let xPos = 0;
            allys.forEach(ally => {
                if (!ally.classList.contains(clase.esconder)) {
                    yPos = parseInt(ally.style.top.split(px)[0]);
                    xPos = parseFloat(ally.style.left.split(px)[0]);
                    ally.style.top = yPos + speed.friends + px;
        
                    if (colisionConNave(yPos, xPos, ship, tamano.aliado.ancho, tamano.aliado.alto)) {
                        item.ally.rePrepareToSpawn(ally, tamano.aliado.alto);
                        item.ally.increaseStats(ally, ship, projectiles, life);
                        item.ally.reassignRole(ally, imagenes.aliados);
                    } else if (item.checkLimit(yPos)) {
                        item.ally.reassignRole(ally, imagenes.aliados);
                        item.ally.rePrepareToSpawn(ally, tamano.aliado.alto);
                    }
                }
            });
        }
    },
    projectile : {
        checkCollisions : (item, colliders, heightItem, widthItem, heightCollider, widthCollider) => {
            const yElement = parseInt(item.style.top.split(px)[0]);
            const xElement = parseInt(item.style.left.split(px)[0]);
        
            let bounds = null;
            let yCollider = 0;
            let xCollider = 0;
        
            colliders.forEach(collider => {
                //Si el elemento no está escondido, es decir, que está recorriendo la pantalla.
                if (!collider.classList.contains(clase.esconder)) {
                    yCollider = parseInt(collider.style.top.split(px)[0]);
                    xCollider = parseInt(collider.style.left.split(px)[0]);
            
                    bounds = {
                        y : {
                            max : yCollider,
                            min : yCollider + heightCollider - heightItem
                        },
                        x : {
                            min : xCollider - widthItem,
                            max : xCollider + widthCollider
                        }
                    }
            
                    if(yElement <= bounds.y.min && yElement >= bounds.y.max) {
                        if (xElement >= bounds.x.min && xElement <= bounds.x.max) {
                            item.classList.remove(clase.disparado);
                            item.classList.add(clase.esconder);
                            let opacidadActual = parseFloat(collider.style.opacity);
                            opacidadActual -= damage.projectile;
                            collider.style.opacity = '' + opacidadActual;
                        }
                    }
                }
            });
        },
        checkLimit : (projectile) => {
            const yPos = parseInt(projectile.style.top.split(px)[0]);
            const height = parseInt(projectile.style.height.split(px)[0]);
        
            //Si el proyectil se sale de la parte superior de la pantalla + la de su propia altura * 1.4, desaparecerá.
            if (yPos <= negativeValue(height * 1.4)) { 
                projectile.classList.remove(clase.disparado);
                projectile.classList.add(clase.esconder);
            }
        },
        move : (projectiles, enemies) => {
            let actualProjectilePos = 0;
        
            projectiles.forEach(projectile => {
                if (!projectile.classList.contains(clase.esconder)) {
                    if (projectile.classList.contains(clase.disparado)) {
                        actualProjectilePos = parseInt(projectile.style.top.split(px)[0]) - speed.projectile;
                        projectile.style.top = actualProjectilePos + px;
        
                        item.projectile.checkLimit(projectile);
                        item.projectile.checkCollisions(projectile, enemies, tamano.proyectil.alto, tamano.proyectil.ancho, tamano.enemigo.alto, tamano.enemigo.ancho);
                    }
                }
            });
        },
    },
    enemy : {
        move : (enemies, projectiles, ship, life) => {
            let yPos = 0;
            let xPos = 0;
        
            enemies.forEach(enemigo => {
                if (!enemigo.classList.contains(clase.esconder)) {
                    yPos = parseInt(enemigo.style.top.split(px)[0]);
                    xPos = parseInt(enemigo.style.left.split(px)[0]);
        
                    enemigo.style.top = yPos + speed.enemies + px;
        
                    item.projectile.checkCollisions(enemigo, projectiles, tamano.enemigo.alto, tamano.enemigo.ancho, tamano.proyectil.alto, tamano.proyectil.ancho);
        
                    const opacidadActual = parseFloat(enemigo.style.opacity);
        
                    if (opacidadActual <= 0.0) {
                        item.ally.rePrepareToSpawn(enemigo, tamano.enemigo.alto);
        
                    } else if (colisionConNave(yPos, xPos, ship, tamano.enemigo.ancho, tamano.enemigo.alto) || item.checkLimit(yPos)) {
                        item.ally.rePrepareToSpawn(enemigo, tamano.enemigo.alto);
        
                        const currentLife = life.style.width.split(percentage)[0] - (oneHundred * damage.enemy);
                        life.style.width = currentLife + percentage;
        
                        if (currentLife <= 0) {
                            alert('Has morido fuertemente.');
                            life.style.width = oneHundred + percentage;
                        } 
                    }
                }
            });
        }
    },
    starts : {
        move : (starts) => {

            let top = 0;
            let alto = 0;
            let actualY = 0;
        
            starts.forEach((estrella, i) => {
                top = parseInt(estrella.style.top.split(px)[0]);
                if (top >= tamano.ventana.alto) {
                    alto = parseInt(estrella.style.height.split(px)[0]);
                    estrella.classList.add(clase.esconder);
                    if (i == 0) {
                        top = parseInt(starts[i + 2].style.top.split(px)[0]);
                        estrella.style.top = top - alto + px;
                    } else if (i == 1) {
                        top = parseInt(starts[i + 1].style.top.split(px)[0]);
                        estrella.style.top = top - alto * 2 + px;
                    } else {
                        top = parseInt(starts[0].style.top.split(px)[0]);
                        estrella.style.top = top - alto * 2 - speed.starts + px;
                    }
                } else {
                    estrella.classList.remove(clase.esconder);
                }
                actualY = parseInt(estrella.style.top.split(px)[0]);
                estrella.style.top = actualY + speed.starts + px;
            });
        },
        changeSpeed : (starts, eventChangeSpeedStarts) => {
            speed.starts += speed.next.starts;
        
            speedStartsEvent = clearInterval(speedStartsEvent);
            speedStartsEvent = setInterval(_ => item.starts.move(starts), time.movement.starts);
        
            //Cuando la velocidad de las estrellas llegue a su máximo, se dejará de ejecutar la función changeSpeedStarts.
            if (speed.starts >= speed.max.starts) {
                eventChangeSpeedStarts = clearInterval(eventChangeSpeedStarts);
            }
        }
    },
    ship : {
        shoot : (ship, projectiles) => {
            let xPosShip = 0;
            let yPosShip = 0;
        
            if (!projectiles[orden.proyectil].classList.contains(clase.disparado)) {
                projectiles[orden.proyectil].classList.remove(clase.esconder);
                yPosShip = parseInt(ship.style.top.split(px)[0]);

                projectiles[orden.proyectil].style.top = yPosShip + tamano.proyectil.alto + px;
                xPosShip = parseInt(ship.style.left.split(px)[0]);

                projectiles[orden.proyectil].style.left = xPosShip + halfValue(tamano.nave.ancho) - halfValue(tamano.proyectil.ancho) + px;
                projectiles[orden.proyectil].classList.add(clase.disparado);
            }
            orden.proyectil = orden.proyectil < projectiles.length - 1 ? orden.proyectil + 1 : 0;
        },
        movil : {
            move : (event, ship) => {
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
                ship.style.left = touchPos.x - halfValue(tamano.nave.ancho) + px;
            }
        },
        computer : {
            move : (event, nave) => {
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
            }
        }
    },
    spawn : (items, probability) => {
        const num = Math.floor(Math.random() * oneHundred) + 1;

        if (num <= probability) {
            const limit = {
                x : {
                    min : tamano.enemigo.ancho  + halfValue(tamano.enemigo.ancho),
                    max : window.innerWidth - halfValue(tamano.enemigo.ancho)
                }
            }   
            let spawned = false;
            items.forEach(item => {
                if (!spawned) {
                    const enemigoEscondido = item.classList.contains(clase.esconder);
                    if (enemigoEscondido) {
                        const xAleatoria = Math.floor(Math.random() * (limit.x.max - limit.x.min));
                        item.classList.remove(clase.esconder);
                        item.style.left = xAleatoria + px;
                        spawned = true;
                    }
                }
            }); 
        }
    }
}