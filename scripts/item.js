const orden = {
    proyectil : 0,
    enemigo : 0,
}

let rateOfFireEvent = null;
let spawnEnemyEvent = null;
let spawnAllyEvent = null;
let speedShootEvent = null;
let speedEnemyEvent = null;
let speedAllyEvent = null;
let eventChangeSpeedStarts = null;
let increaseLifeEnemies = null;

const item = {
    zeroFill : (num, max) => num.toString().length < max ? item.zeroFill('0' + num, max) : num
    ,
    checkLimit : (yPos) => (yPos) >= size.frame.height
    ,
    rePrepareToSpawn : (element, heightElement) => {
        element.classList.add(classes.hide);
        element.style.top = negativeValue(heightElement) + px;    
    },
    collisionWithShip : (yColisionador, xColisionador, nave, anchoColisionador, altoColisionador) => {
        const yPosNave = parseFloat(nave.style.top.split(px)[0]);
        const xPosNave = parseFloat(nave.style.left.split(px)[0]);
    
        const percentage = {
            x : size.ship.width * size.colisionador.nave.ancho,
            y : {
                top : size.ship.height * size.colisionador.nave.alto.top,
                bottom : size.ship.height * size.colisionador.nave.alto.bottom
            }
        }
    
        const boundsNave = {
            x : {
                min : xPosNave + percentage.x,
                max : (xPosNave + size.ship.width) - percentage.x,
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
        element.style.position = 'absolute';
        element.classList.add(classes.hide, type);

        switch (type) {
            case classes.enemy:
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
            case classes.ally:
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
            element.classList.add(chosedAllyType, classes.ally);
            //Y finalmente le agrego la imagen correspondiente a su actual power up.
            element.setAttribute(attribute.dataPowerUp, item.ally.chooseImagePower(chosedAllyType));
        },
        rebootCadence : (ship, projectiles) => {
            if (time.betweenShots - power.candence > power.max.cadence) {
                time.betweenShots -= power.candence;
            } else {
                time.betweenShots = power.max.cadence;
            }
            rateOfFireEvent = clearInterval(rateOfFireEvent);
            rateOfFireEvent = setInterval(_ => item.ship.shoot(ship, projectiles), time.betweenShots)
        },
        heal : (life) => {
            let currentLife = parseInt(life.style.width.split(percentage)[0]);
            //Si la vida actual es menor al 100%, se le curará.
            currentLife += currentLife < oneHundred ? oneHundred * power.life : 0;
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
                damage.projectile += power.damage;
                damage.projectile = Math.round(damage.projectile * 10) / 10;
            } else if (ally.classList.contains(nombre.aliado.koala)) {
                speed.projectile += power.shootSpeed;
            }
        },
        move : (allys, ship, projectiles, life) => {
            let yPos = 0;
            let xPos = 0;
            let currentPoints;
            let caught = false;
            let curImg;
            allys.forEach(ally => {
                if (!ally.classList.contains(classes.hide)) {
                    caught = ally.getAttribute(attribute.dataCaught);
                    
                    //Si el aliado aún no ha sido pillado por el jugador...
                    if (caught == 'false') {

                        yPos = parseInt(ally.style.top.split(px)[0]);
                        xPos = parseFloat(ally.style.left.split(px)[0]);
                        ally.style.top = yPos + speed.friends + px;

                        if (item.collisionWithShip(yPos, xPos, ship, size.ally.width, size.ally.height)) {
                            ally.setAttribute(attribute.dataCaught, true);
                            item.ally.increaseStats(ally, ship, projectiles, life);

                            const pointsMenu = document.querySelector('.' + classes.points);
                            currentPoints = parseInt(pointsMenu.textContent.trim());
                            pointsMenu.innerHTML = item.zeroFill(currentPoints + item.ally.points, 10);

                            //Creo una copia de la imagen actual del aliado.
                            curImg = Object.assign({}, {bg : ally.style.backgroundImage});
                            
                            ally.style.backgroundImage = ally.getAttribute(attribute.dataPowerUp);

                            setTimeout(() => {
                                item.rePrepareToSpawn(ally, size.ally.height);
                                ally.style.backgroundImage = curImg.bg;
                                item.ally.assignRole(ally, imagenes.aliados);
        
                                ally.setAttribute(attribute.dataCaught, false);
                            }, time.showingPowerUp);  

                        } else if (item.checkLimit(yPos)) {
                            item.ally.assignRole(ally, imagenes.aliados);
                            item.rePrepareToSpawn(ally, size.ally.height);
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
                if (!collider.classList.contains(classes.hide)) {
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

                            element.classList.add(classes.hide);
                            element.classList.toggle(classes.fired);

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
                projectile.classList.remove(classes.fired);
                projectile.classList.add(classes.hide);
            }
        },
        move : (projectiles, enemies) => {
            let actualProjectilePos = 0;
        
            projectiles.forEach(projectile => {
                if (!projectile.classList.contains(classes.hide)) {
                    if (projectile.classList.contains(classes.fired)) {
                        actualProjectilePos = parseInt(projectile.style.top.split(px)[0]) - speed.projectile;
                        projectile.style.top = actualProjectilePos + px;
        
                        item.projectile.checkLimit(projectile);
                        item.projectile.checkCollisions(projectile, enemies, size.projectile.height, size.projectile.width, size.enemy.height, size.enemy.width);
                    }
                }
            });
        },
    },
    enemy : {
        maxLife : 100,
        points : 75,
        die : (enemy) => {
            const pointsMenu = document.querySelector('.' + classes.points);
            const currentPoints = parseInt(pointsMenu.textContent.trim());
            pointsMenu.innerHTML = item.zeroFill(currentPoints + item.enemy.points, 10);

            item.rePrepareToSpawn(enemy, size.enemy.height);
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
                if (!enemy.classList.contains(classes.hide)) {
                    yPos = parseInt(enemy.style.top.split(px)[0]);
                    xPos = parseInt(enemy.style.left.split(px)[0]);
        
                    enemy.style.top = yPos + speed.enemies + px;

                    if (item.collisionWithShip(yPos, xPos, ship, size.enemy.width, size.enemy.height) || item.checkLimit(yPos)) {
                        item.rePrepareToSpawn(enemy, size.enemy.height);
        
                        const currentLife = life.style.width.split(percentage)[0] - (oneHundred * damage.enemy);
                        console.log(currentLife);
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
                if (top >= size.frame.height) {

                    alto = parseInt(estrella.style.height.split(px)[0]);
                    estrella.classList.add(classes.hide);
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
                    estrella.classList.remove(classes.hide);
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
            const loseMenu = document.querySelector('.' + classes.loseMenu);
            const totalPoints = document.querySelector('.' + classes.totalPoints);
            const currentPoints = document.querySelector('.' + classes.points);
             
            //life.style.width = oneHundred + percentage;
            item.ship.isDeath = true;
            loseMenu.classList.toggle(classes.hide);
            loseMenu.style.display = 'flex';

            totalPoints.textContent = parseInt(currentPoints.textContent) + ' puntos';

            speedShootEvent = clearInterval(speedShootEvent);
            speedEnemyEvent = clearInterval(speedEnemyEvent);
            speedAllyEvent = clearInterval(speedAllyEvent);
            rateOfFireEvent = clearInterval(rateOfFireEvent);
            spawnAllyEvent = clearInterval(spawnAllyEvent);
            spawnEnemyEvent = clearInterval(spawnEnemyEvent);
            eventChangeSpeedStarts = clearInterval(eventChangeSpeedStarts);
            speedStartsEvent  = clearInterval(speedStartsEvent);
            increaseLifeEnemies = clearInterval(increaseLifeEnemies);
        },
        shoot : (ship, projectiles) => {
            let xPosShip = 0;
            let yPosShip = 0;
        
            if (!projectiles[orden.proyectil].classList.contains(classes.fired)) {
                projectiles[orden.proyectil].classList.remove(classes.hide);
                yPosShip = parseInt(ship.style.top.split(px)[0]);

                projectiles[orden.proyectil].style.top = yPosShip + size.projectile.height + px;
                xPosShip = parseInt(ship.style.left.split(px)[0]);

                projectiles[orden.proyectil].style.left = xPosShip + halfValue(size.ship.width) - halfValue(size.projectile.width) + px;
                projectiles[orden.proyectil].classList.add(classes.fired);
            }
            orden.proyectil = orden.proyectil < projectiles.length - 1 ? orden.proyectil + 1 : 0;
        },
        movil : {
            move : (event, ship) => {
                const touchPos = {
                    x : event.changedTouches[0].screenX,
                    y : event.changedTouches[0].screenY
                }
                /*
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
                */
                ship.style.left = touchPos.x - halfValue(size.ship.width) + px;
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
                        min : size.ship.width * 0.1,
                        max : size.frame.width - size.ship.width * 0.1
                    },
                    y : {
                        min : size.ship.height,
                        max : size.frame.height
                    }
                }
            
                if (coordRaton.x > limitesVentana.x.min && coordRaton.x < limitesVentana.x.max) {
                    nave.style.left = coordRaton.x - halfValue(size.ship.width) + px;
                }
            
                if (coordRaton.y > limitesVentana.y.min && coordRaton.y < limitesVentana.y.max) {
                    nave.style.top = coordRaton.y - size.ship.height + px;
                }
            }
        }
    },
    spawn : (elements, probability) => {
        const num = Math.floor(Math.random() * oneHundred) + 1;

        if (num <= probability) {
            const limit = {
                x : {
                    min : size.enemy.width  + halfValue(size.enemy.width),
                    max : window.innerWidth - halfValue(size.enemy.width)
                }
            }   
            let spawned = false;
            elements.forEach(element => {
                if (!spawned) {
                    const hidden = element.classList.contains(classes.hide);
                    if (hidden) {
                        if (element.classList.contains(classes.enemy)) {
                            const lifeBar = element.lastChild.lastChild;
                            lifeBar.setAttribute(attribute.dataMaxLife, item.enemy.maxLife);
                            lifeBar.setAttribute(attribute.dataLife, item.enemy.maxLife);
                            lifeBar.style.width = oneHundred + percentage;
                        }
                        const xAleatoria = Math.floor(Math.random() * (limit.x.max - limit.x.min));
                        element.classList.remove(classes.hide);
                        element.style.left = xAleatoria + px;
                        spawned = true;
                    }
                }
            }); 
        }
    }
}