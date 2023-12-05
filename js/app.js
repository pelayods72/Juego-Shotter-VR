window.addEventListener('load', initScene); // Cuando se cargue, inicia la escena

let enemy, score = 0, finJuego = false;

function initScene() {
    // Inicia el juego
    game();
}

// Función principal del juego
function game() {
    // Genera enemigos cada 3 segundos
    setInterval(() => {
        if (!finJuego) {
            generateEnemy();
        } else {
            document.querySelector('[text]').setAttribute('value', `FINAL\nHAS REVENTADO `+ score +` OJETES\nFELICIDADES`)
        }
    }, 3000);
}

// La funcion para generar enemigos
function generateEnemy() {
    // Características del enemigo
    const enemy = document.createElement('a-entity');
    enemy.setAttribute('gltf-model', '#enemy');
    enemy.setAttribute('class', 'enemy');
    enemy.setAttribute('scale', '1 1 1');
    
    // Establece la posición inicial aleatoriamente
    const initialX = Math.random() < 0.5 ? -20 - Math.random() * 10 : 10 + Math.random() * 10; // Entre -20 y -10 o 10 y 20 en x
    const initialY = Math.random() * 10; // Entre 0 y 10 en y
    const initialZ = Math.random() < 0.5 ? -20 - Math.random() * 10 : 10 + Math.random() * 10; // Entre -20 y -10 o 10 y 20 en z
    enemy.object3D.position.set(initialX, initialY, initialZ);

    // Añadimos como atributo el componente "shootable" para interactuar
    enemy.setAttribute('shootable', '') 

    // Añadimos como atributo el componente "update-look-at" para que miren hacia la camara
    enemy.setAttribute('update-look-at', '')

    // Añade la animación de posición
    enemy.setAttribute('animation__position', {
        property: 'position',
        to: '0.5 0 1.5',
        dur: 5000,
        easing: 'linear'
    });

    // Si se completa la animacion termina el juego
    enemy.addEventListener("animationcomplete", function (){
        finJuego=true;
        destruir();
    })

    // Añade el enemigo a la órbita actual
    document.querySelector('.orbit').appendChild(enemy);
}

//Destruye todos los enemigos que hay en la partida
function destruir() {
    var escena = document.querySelector('a-scene');
    escena.removeChild(document.getElementById('orbita'))
}

// Cuando se hace click sobre el se destruye
AFRAME.registerComponent('shootable', {
    init: function () {
        this.el.addEventListener('mousedown', () => {
            //console.log('Destruido')
            // Eliminamos del DOM el elemento enemy
            this.el.parentNode.removeChild(this.el)
            // Añadimos puntuacion
            document.querySelector('[text]').setAttribute('value', `${++score} OJETES REVENTADOS`)
        })
    }
})

// Gira a los enemigos para que miren a la camara
AFRAME.registerComponent('update-look-at', {
    tick: function () {
      // Obtiene las posiciones de la cámara y del enemigo
      var camera = document.querySelector('[camera]');
      var enemy = this.el;
  
      if (camera && enemy) {
        var cameraPos = camera.getAttribute('position');
        var enemyPos = enemy.getAttribute('position');
  
        // Calcula la dirección hacia la cámara
        var direction = new THREE.Vector3().subVectors(
          new THREE.Vector3(cameraPos.x, cameraPos.y, cameraPos.z),
          new THREE.Vector3(enemyPos.x, enemyPos.y, enemyPos.z)
        );
  
        // Calcula la rotación para que el enemigo mire hacia la cámara
        enemy.object3D.lookAt(new THREE.Vector3().addVectors(enemy.object3D.position, direction));
      }
    }
});

// Cuando se hace click se para o enciende la musica
AFRAME.registerComponent('clickable', {
    init: function () {
        var music = document.querySelector('#music');
        this.el.addEventListener('mousedown', () => {
            // Al hacer clic en el walkman, alternar la reproducción de música
            if (music.components.sound.isPlaying) {
                music.components.sound.pause();
            } else {
                music.components.sound.playSound();
            }  
        })
    }
}); 