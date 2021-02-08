const orden = {
    proyectil : 0,
    enemigo : 0,
}

let rateOfFireEvent = null;
let speedShootEvent = null;

const item = {
    zeroFill : (num, max) => num.toString().length < max ? item.zeroFill('0' + num, max) : num
    ,
    checkLimit : (yPos) => (yPos) >= tamano.ventana.alto
    ,
    rePrepareToSpawn : (element, heightElement) => {
        element.classList.add(clase.esconder);
        element.style.top = negativeValue(heightElement) + px;    
    },
    collisionWithShip : (yColisionador, xColisionador, nave, anchoColisionador, altoColisionador) => {
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
                max : xColisionador + anchoColisionador
            },
            y : {
                min : yColisionador + altoColisionador,
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
    },
    create : (type, width, height, img, label) => {
        const element = document.createElement(label);
    
        element.style.opacity = 1;
        element.style.width = width + px;
        element.style.height = height + px;
        element.style.top = negativeValue(width) + px;
        element.style.left = 0 + px;
        //element.style.position = 'absolute';
        element.classList.add(clase.esconder, type);

        switch (type) {
            case clase.enemigo:
                element.style.height += parseInt(element.style.height.split(px)[0]) * 0.05 + px;

                const bodyElement = document.createElement(label);
                bodyElement.style.width = oneHundred + percentage;
                bodyElement.style.height = 95 + percentage;
                bodyElement.style.backgroundImage = img;
                bodyElement.style.backgroundPosition = 'center';
                bodyElement.style.backgroundRepeat = 'no-repeat';
                bodyElement.style.backgroundSize = oneHundred + percentage + ' ' + oneHundred + percentage;
                bodyElement.style.opacity = 1;

                const lifeContainer = document.createElement(label);
                lifeContainer.style.border = '1px solid white';
                lifeContainer.style.width = oneHundred + percentage;
                lifeContainer.style.height = 5 + percentage;
                lifeContainer.style.backgroundColor = 'rgb(116, 0, 0)';

                const life = document.createElement(label);
                life.style.width = oneHundred + percentage;
                life.style.height = oneHundred + percentage;
                life.style.backgroundColor = 'red';
                life.setAttribute(attribute.dataLife, item.enemy.maxLife);
                life.setAttribute(attribute.dataMaxLife, item.enemy.maxLife);

                lifeContainer.appendChild(life);

                element.appendChild(bodyElement);
                element.appendChild(lifeContainer);
                break;
            case clase.aliado:
                element.style.backgroundSize = oneHundred + percentage + ' ' + oneHundred + percentage;
                element.style.backgroundPosition = 'center';
                element.style.backgroundRepeat = 'no-repeat';
                element.style.backgroundImage = img;

                element.setAttribute(attribute.dataCaught, false);
                
                item.ally.assignRole(element, imagenes.aliados);

                break;
            default:
                element.style.backgroundSize = oneHundred + percentage + ' ' + oneHundred + percentage;
                element.style.backgroundPosition = 'center';
                element.style.backgroundRepeat = 'no-repeat';
                element.style.backgroundImage = img;
                break;
        } 
        return element;
    },
    createArray : (amount, type, width, height, img, labelType) => {
        const items = new Array(amount);
        const body = document.querySelector(label.body);
        let posImg = 0;
    
        for (let i = 0; i < amount; i++) {
            items[i] = item.create(type, width, height, img[posImg], labelType);
            body.appendChild(items[i]);
            if (img.length > 1) posImg = posImg < img.length - 1 ? posImg + 1 : 0;
        }
        return items;
    },
    rearrange : (items) => items.sort(() => Math.random() - 0.5)
    ,
    ally : {
        points : 25,
        chooseAllyType : (urlImg) => 
        {
            return Object.values(nombre.aliado).filter(nombreAliado => urlImg.includes(nombreAliado) ? nombreAliado : "")[0];
        },
        chooseImagePower : (chosedPowerUP) => {  
            let chosedImage = "";        
            switch (chosedPowerUP) {
                case nombre.aliado.gt:
                    chosedImage = nombre.powerUp.cadence;
                    break;
                case nombre.aliado.mascarilla:
                    chosedImage = nombre.powerUp.heal;
                    break;
                case nombre.aliado.poqvnw:
                    chosedImage = nombre.powerUp.damage;
                    break;
                case nombre.aliado.koala:
                    chosedImage = nombre.powerUp.velocity;
                    break;
            }
            chosedImage = imagenes.powerUps.filter(powerUp => powerUp.includes(chosedImage) ? powerUp : "");
            return chosedImage[0];
        },
        assignRole : (element, images) => {
            const rnd = Math.floor(Math.random() * images.length);
            let chosedAllyType;
        
            let chosedImage = null;
            images.forEach((image, i) => {
                if (i == rnd) chosedImage = image;
            });
            //Le quito la clase que determinaba el tipo de aliado que era hasta ahora.
            element.classList.remove(item.ally.chooseAllyType(element.style.backgroundImage));
            //Cambio su imagen.
            element.style.backgroundImage = chosedImage;
            //Reasigno su nuevo poder según su nueva imagen.
            chosedAllyType = item.ally.chooseAllyType(chosedImage);
            element.classList.add(chosedAllyType, clase.aliado);
            //Y finalmente le agrego la imagen correspondiente a su actual power up.
            element.setAttribute(attribute.dataPowerUp, item.ally.chooseImagePower(chosedAllyType));
        },
        rebootCadence : (ship, projectiles) => {
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
                item.ally.rebootCadence(ship, projectiles);
            } else if (ally.classList.contains(nombre.aliado.mascarilla)) {
                item.ally.heal(life);
            } else if (ally.classList.contains(nombre.aliado.poqvnw)) {
                damage.projectile += poder.dano;
                damage.projectile = Math.round(damage.projectile * 10) / 10;
            } else if (ally.classList.contains(nombre.aliado.koala)) {
                speed.projectile += poder.velocidadDisparo;
            }
        },
        move : (allys, ship, projectiles, life) => {
            let yPos = 0;
            let xPos = 0;
            let currentPoints;
            let caught = false;
            let curImg;
            allys.forEach(ally => {
                if (!ally.classList.contains(clase.esconder)) {
                    caught = ally.getAttribute(attribute.dataCaught);
                    
                    //Si el aliado aún no ha sido pillado por el jugador...
                    if (caught == 'false') {

                        yPos = parseInt(ally.style.top.split(px)[0]);
                        xPos = parseFloat(ally.style.left.split(px)[0]);
                        ally.style.top = yPos + speed.friends + px;

                        if (item.collisionWithShip(yPos, xPos, ship, tamano.aliado.ancho, tamano.aliado.alto)) {
                            ally.setAttribute(attribute.dataCaught, true);
                            item.ally.increaseStats(ally, ship, projectiles, life);

                            //Creo una copia de la imagen actual del aliado.
                            curImg = Object.assign({}, {bg : ally.style.backgroundImage});
                            
                            ally.style.backgroundImage = ally.getAttribute(attribute.dataPowerUp);

                            setTimeout(() => {
                                item.rePrepareToSpawn(ally, tamano.aliado.alto);
                                ally.style.backgroundImage = curImg.bg;
                                item.ally.assignRole(ally, imagenes.aliados);
        
                                const pointsMenu = document.querySelector('.' + clase.points);
                                currentPoints = parseInt(pointsMenu.textContent.trim());
                                pointsMenu.innerHTML = item.zeroFill(currentPoints + item.ally.points, 10);
                                ally.setAttribute(attribute.dataCaught, false);
                            }, time.showingPowerUp);  

                        } else if (item.checkLimit(yPos)) {
                            item.ally.assignRole(ally, imagenes.aliados);
                            item.rePrepareToSpawn(ally, tamano.aliado.alto);
                        }
                    }
                }
            });
        }
    },
    projectile : {
        checkCollisions : (element, colliders, heightItem, widthItem, heightCollider, widthCollider) => {
            const yElement = parseInt(element.style.top.split(px)[0]);
            const xElement = parseInt(element.style.left.split(px)[0]);
        
            let bounds = null;
            let yCollider = 0;
            let xCollider = 0;
            let lifeBar, curEnemyLife, maxEnemyLife;
        
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

                            element.classList.add(clase.esconder);
                            element.classList.toggle(clase.disparado);

                            //Obtengo el elemento div que contiene la vida del enemigo.
                            lifeBar = collider.lastChild.lastChild;
                            curEnemyLife = parseInt(lifeBar.getAttribute(attribute.dataLife));
                            maxEnemyLife = parseInt(lifeBar.getAttribute(attribute.dataMaxLife));

                            item.enemy.takeDamage(collider, lifeBar, curEnemyLife, maxEnemyLife);
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
        maxLife : 100,
        points : 75,
        die : (enemy) => {
            const pointsMenu = document.querySelector('.' + clase.points);
            const currentPoints = parseInt(pointsMenu.textContent.trim());
            pointsMenu.innerHTML = item.zeroFill(currentPoints + item.enemy.points, 10);

            item.rePrepareToSpawn(enemy, tamano.enemigo.alto);
        },
        takeDamage : (enemy, lifeBar, currentLife, currentMaxLife) => {      
            currentLife -= damage.projectile;
            lifeBar.style.width = currentLife / currentMaxLife * oneHundred + percentage;
            lifeBar.setAttribute(attribute.dataLife, currentLife);

            if (currentLife <= 0) item.enemy.die(enemy);
        },
        move : (enemies, ship, life) => {
            let yPos = 0;
            let xPos = 0;
        
            enemies.forEach(enemy => {
                if (!enemy.classList.contains(clase.esconder)) {
                    yPos = parseInt(enemy.style.top.split(px)[0]);
                    xPos = parseInt(enemy.style.left.split(px)[0]);
        
                    enemy.style.top = yPos + speed.enemies + px;

                    if (item.collisionWithShip(yPos, xPos, ship, tamano.enemigo.ancho, tamano.enemigo.alto) || item.checkLimit(yPos)) {
                        item.rePrepareToSpawn(enemy, tamano.enemigo.alto);
        
                        const currentLife = life.style.width.split(percentage)[0] - (oneHundred * damage.enemy);
                        life.style.width = currentLife + percentage;
        
                        if (currentLife <= 0) item.ship.toDie(life);
                    }

                    if (item.checkLimit(yPos)) {
                        lifeBar = enemy.lastChild.lastChild;
                        lifeBar.setAttribute(attribute.dataLife, item.enemy.maxLife);
                        lifeBar.style.width = oneHundred + percentage;
                    }
                }
            });
        },
        increaseLife : () => {
            item.enemy.maxLife += 50;
        },
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
            if (speed.starts >= speed.max.starts) eventChangeSpeedStarts = clearInterval(eventChangeSpeedStarts);
        }
    },
    ship : {
        isDeath : false,
        toDie : (life) => {
            const loseMenu = document.querySelector('.' + clase.loseMenu);
            const totalPoints = document.querySelector('.' + clase.totalPoints);
            const ship = document.querySelector('.' + clase.nave);
            const currentPoints = document.querySelector('.' + clase.points);
             
            //life.style.width = oneHundred + percentage;
            item.ship.isDeath = true;
            loseMenu.classList.toggle(clase.esconder);
            loseMenu.style.display = 'flex';

            totalPoints.textContent = parseInt(currentPoints.textContent) + ' puntos';

            ship.style.display = 'none';
        },
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
    spawn : (elements, probability) => {
        const num = Math.floor(Math.random() * oneHundred) + 1;

        if (num <= probability) {
            const limit = {
                x : {
                    min : tamano.enemigo.ancho  + halfValue(tamano.enemigo.ancho),
                    max : window.innerWidth - halfValue(tamano.enemigo.ancho)
                }
            }   
            let spawned = false;
            elements.forEach(element => {
                if (!spawned) {
                    const hidden = element.classList.contains(clase.esconder);
                    if (hidden) {
                        if (element.classList.contains(clase.enemigo)) {
                            const lifeBar = element.lastChild.lastChild;
                            lifeBar.setAttribute(attribute.dataMaxLife, item.enemy.maxLife);
                            lifeBar.setAttribute(attribute.dataLife, item.enemy.maxLife);
                            lifeBar.style.width = oneHundred + percentage;
                        }
                        const xAleatoria = Math.floor(Math.random() * (limit.x.max - limit.x.min));
                        element.classList.remove(clase.esconder);
                        element.style.left = xAleatoria + px;
                        spawned = true;
                    }
                }
            }); 
        }
    }
}