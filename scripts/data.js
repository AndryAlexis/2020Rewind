const px = 'px';
const percentage = '%';
const none = 'none';
const oneHundred = 100;

const halfValue = (number) => number * 0.5;
const negativeValue = (number) => number * -1;

const onMovil = _ => {
    //Condición que comprueba si la página ha sido abierta desde un dispositivo móvil.
    if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        return true;
    } else {
        return false;
    }
}

const amount = {
    projectiles : 50,
    enemies : 15,
    friends : 5
}

const usedEvent = {
    load : 'load',
    touchstart : 'touchstart',
    mousemove : 'mousemove'
}

let speed = {
    projectile : 1,
    starts : 1,
    enemies : 2,
    friends : 3,
    max : {
        starts : 40
    },
    next : {
        starts : 1
    }
}

const initSpeed = Object.create(speed);
speed = initSpeed;

console.log(speed);

//Máximo 1.0
const damage = {
    projectile : 50, 
    enemy : 1 // TO DO CHANGE TO 0.1
}

const label = {
    div : 'div',
    img : 'img',
    body : 'body'
}

const time = {
    movement : {
        projectile : 60,
        starts : 60,
        enemies : 100,
        friends : 120
    },
    betweenShots : 2000,
    spawn : {
        enemies : 5000,
        friends : 15000
    },
    countdown : 2350,
    startGame : 2500,
    changeSpeedStarts : 15000,
    showingPowerUp : 1500,
    changeEnemyLife : 60000
}
//Es la probabilidad que tienen de aparecer cuando ha pasado su tiempo de spawn.
const probability = {
    friends : 90,
    enemies : 95
}

const urlImages = 'url(./img/';
const urlEnemies = urlImages + 'items/enemies/';
const urlFriends = urlImages + 'items/friends/';
const urlPowerUps = urlImages + 'powerUps/';
const png = '.png)';

const nombre = {
    enemigo : {
        tierra : 'tierra',
        dt : 'dt',
        cv : 'cv'
    },
    aliado : {
        gt : 'gt',
        mascarilla : 'mascarilla',
        koala : 'koala',
        poqvnw : 'poqvnw'
    }, 
    powerUp : {
        cadence : 'cadence',
        heal : 'heal',
        velocity : 'velocity',
        damage : 'damage'
    }
}

const imagenes = {
    proyectiles : urlImages + 'disparoComunista' + png,
    enemigos : [
        urlEnemies + nombre.enemigo.tierra + png,
        urlEnemies + nombre.enemigo.cv + png,
        urlEnemies + nombre.enemigo.dt + png
    ],
    aliados : [
        urlFriends + nombre.aliado.gt + png,
        urlFriends + nombre.aliado.mascarilla + png,
        urlFriends + nombre.aliado.poqvnw + png,
        urlFriends + nombre.aliado.koala + png
    ],
    powerUps : [
        urlPowerUps + nombre.powerUp.cadence + png,
        urlPowerUps + nombre.powerUp.heal + png,
        urlPowerUps + nombre.powerUp.velocity + png,
        urlPowerUps + nombre.powerUp.damage + png
    ]
}

const attribute = {
    dataLife : 'data-currentLife',
    dataMaxLife : 'data-currentMaxLife',
    dataPowerUp : 'data-power-up',
    dataCaught : 'data-caught'
}

const clase = {
    esconder : 'esconder',
    disparado : 'disparado',
    proyectil : 'proyectil',
    enemigo : 'enemigo',
    estrellas : 'estrellas',
    nave : 'nave',
    aliado : 'aliado',
    vida : 'vida',
    countDownMenu : 'countDownMenu',
    loseMenu : 'loseMenu',
    points : 'points',
    powerUp : 'powerUp',
    totalPoints : 'totalPoints'
}

const poder = {
    cadencia : 100,
    velocidadDisparo : 1,
    vida : 0.1,
    dano : 10,
    max : {
        cadencia : 200,
        velocidadDisparo : 100
    }
}

//Las medidas de tamano se miden en píxeles, excepto tamano.movil, esas se miden en porcentajes.
const tamano = {
    nave : {
        ancho : 60,
        alto : 80
    },
    proyectil : {
        ancho : 5,
        alto : 10
    },
    enemigo : {
        ancho : 70,
        alto : 70
    },
    aliado : {
        ancho : 50,
        alto : 50
    },
    ventana : {
        ancho : 0,
        alto : 0
    },
    countDownMenu : { 
        ancho : 300,
        alto : 400
    },
    loseMenu : {
      width : 500,
      height : 600  
    },
    movil : {
        nave : {
            ancho : 0.14
        },
        proyectil : {
            ancho : 3
        },
        enemigo : {
            ancho : 13
        },
        aliado : {
            ancho : 13
        },
        menu : {
            ancho : 0.7
        }
    }, //Los valores de los colisionadores están pensados en usarlo como un porcentaje.
    colisionador : {
        nave : {
            ancho : 0.3,
            alto : {
                top : 0.25,
                bottom : 0.6
            }
        }
    }
}