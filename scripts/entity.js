
const entity = {
    create : (type, width, height, img, label) => {
        const element = document.createElement(label);
    
        element.style.opacity = 1;
        element.style.width = width + px;
        element.style.height = height + px;
        element.style.top = negativeValue(width) + px;
        element.style.left = 0 + px;
        element.style.position = 'absolute';
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
            default:
                element.style.backgroundSize = oneHundred + percentage + ' ' + oneHundred + percentage;
                element.style.backgroundPosition = 'center';
                element.style.backgroundRepeat = 'no-repeat';
                element.style.backgroundImage = img;
                break;
        } 
        return element;
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
    despawn : () => { console.log("Despawn.") },
}

const object = Object.create(entity);
object.isColliding = () => { console.log("Is colliding.") }
object.move = () => { console.log("Move.") }
object.isOutScreen = (yPos) => (yPos) >= tamano.ventana.alto


const npc = Object.create(object)
npc.points = 50
npc.life = 100
npc.maxLife = 100
npc.takeDamage = () => { }


console.log(entity)
console.log(object)
console.log(npc)

npc.despawn();
