const px = 'px';
const percentage = '%';
const none = 'none';
const oneHundred = 100;

const amount = {
    projectiles : 40,
    enemies : 15,
    friends : 5
}

const usedEvent = {
    load : 'load',
    touchstart : 'touchstart',
    mousemove : 'mousemove'
}

const speed = {
    projectile : 1,
    starts : 1,
    enemies : 2,
    friends : 3
}
//Máximo 1.0
const damage = {
    projectile : 0.2, 
    enemie : 0.1
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
        enemies : 15000,
        friends : 8000
    },
    countdown : 2350,
    startGame : 2500
}
//Es la probabilidad que tienen de aparecer cuando ha pasado su tiempo de spawn.
const probability = {
    friends : 10,
    enemies : 100
}

const urlImages = 'url(./img/';
const urlEnemies = urlImages + 'items/enemies/';
const urlFriends = urlImages + 'items/friends/';
const png = '.png)';

const imagenes = {
    proyectiles : urlImages + 'disparoComunista' + png,
    enemigos : [
        urlEnemies + 'tierra.tif' + png,
        urlEnemies + 'CV.tif' + png,
        urlEnemies + 'DT.tif' + png
    ],
    aliados : [
        urlFriends + 'GT.tif' + png,
        urlFriends + 'Mascarilla.tif' + png,
        urlFriends + 'PoQvnw.tif' + png,
        urlFriends + 'koala' + png
    ]
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
    menu : 'menu'
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
    menu : { 
        ancho : 300,
        alto : 400
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