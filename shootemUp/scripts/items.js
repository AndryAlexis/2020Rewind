const orden = {
    proyectil : 0,
    enemigo : 0,
}

let rateOfFireEvent = null;
let speedShootEvent = null;

item = {
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
                    } else if (comprobarLimiteItem(yPos)) {
                        item.ally.reassignRole(ally, imagenes.aliados);
                        item.ally.rePrepareToSpawn(ally, tamano.aliado.alto);
                    }
                }
            });
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
        }
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
    }
}