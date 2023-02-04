let user = {
    _height: 200,
    _health: false,
    _center: document.querySelector('.place').offsetWidth / 2,
    score: 0,

    start() {
        this._health = true;
    },

    stop() {
        this._health = false;
    },

    restart() {
        this._health = true;
        this._height = 200;
        this.score = 0;
    },

    space() {
        this._height += 50;
    },

    isHealth() {
        return this._health;
    },

    addScore(pipes, center) {
        pipes.forEach( pipe => {
            if (pipe.type == 'bottom') {
                if ((this._height > pipe.positionY) && (pipe.positionX < (center + 25)) && (pipe.positionX + 52) > (center - 25)) {
                    if (!pipe.checked) {
                        this.score++;
                        pipe.checked = true;
                    }
                }
            }
        });
    },

    isLosing(pipes, center) {
        pipes.forEach( pipe => {
            if (pipe.type == 'bottom') {
                if ((this._height < pipe.positionY) && (pipe.positionX < (center + 25)) && (pipe.positionX + 52) > (center - 25)) {
                    this._health = false;
                    document.querySelector('a.restart').style.display = 'block';
                }
            } else {
                if (((this._height + 34) > (pipes[pipe.id - 1].positionY + 150)) && (pipe.positionX < (center + 25)) && (pipe.positionX + 52) > (center - 25)) {
                    this._health = false;
                    document.querySelector('a.restart').style.display = 'block';
                }
            }
        });
    },

    render() {
        if (this._health) {
            this._height -= 1;
            document.querySelector('.player').style.bottom = this._height + 'px';

            if (this._height < 0) {
                this._health = false;
                document.querySelector('a.restart').style.display = 'block';
            }

            if (this._height > 464) {
                this._health = false;
                document.querySelector('a.restart').style.display = 'block';
            }
        }
    }
};

let place = {
    _count: 0,
    _tempPosition: 0,
    _width: window.innerWidth,

    object: {
        defaultPosition: [
            {id: 1, positionX: 0},
            {id: 2, positionX: 0}
        ],
        position: []
    },

    generatePositionPipe() {
        let result = 10 + Math.floor(Math.random() * 300);
        return [result, 350 - result];
    },

    addPipe(num) {
        for (let i = 0; i < num; i++) {
            this._count += 2;
            let newPosition = this.generatePositionPipe();
            let types = ['bottom', 'top'];
            let newObjects = [];
            for (let j = 0; j < 2; j++) {
                newObjects.push({id: this._count - j, positionX: this.object.defaultPosition[this._count - 2 + j], positionY: newPosition[j], type: types[j], checked: false})
                this.object.defaultPosition.push({id: this._count + j + 1, positionX: this.object.defaultPosition[this._count - 2].positionX - 300});
                this.object.position.push({id: this._count - j, positionX: this.object.defaultPosition[this._count - 2 + j].positionX, positionY: newPosition[j], type: types[j], checked: false});
            }
            let element =  newObjects.map(object => `<div class="pipe pipe-${object.id}" id="${object.type}">`
                + `<div class="header"></div>`
                + `</div>`);
            document.querySelector('.place .pipes').innerHTML = document.querySelector('.place .pipes').innerHTML + element[0] + element[1];
        }
    },

    getPipesPosition() {
        return this.object.position;
    },

    getWidth() {
        return this._width;
    },

    start() {
        if (this._width >= 1920) {
            this.addPipe(6);
        } else {
            this.addPipe(5);
        }
        this.object.position.forEach( element => {
            this.editHTML(element.id, element.positionY);
        });
    },

    restart() {
        this.object.position.forEach( element => {
            element.positionX = this.object.defaultPosition[element.id - 1].positionX;
            element.checked = false;
            if (element.type == 'bottom') {
                this._tempPosition = this.generatePositionPipe()[0];
                element.positionY = this._tempPosition;
            } else {
                element.positionY = (350 - this._tempPosition);
            }
            this.editHTML(element.id, element.positionY);
        });
    },

    editHTML(id, height) {
        document.querySelector('.pipe-' + id).style.height = height + 'px';
    },

    render(health) {
        if (health) {
            this.object.position.forEach( element => {
                element.positionX += 2;

                const currentPipe = document.querySelector('.pipe-' + element.id);

                if (element.positionX >= 0) {
                    currentPipe.style.right = element.positionX + 'px';
                    currentPipe.style.display = 'block';
                } else if (element.positionX < 0) {
                    currentPipe.style.display = 'none';
                }

                if (element.positionX > this._width) {
                    element.positionX = -150;
                    element.checked = false;
                    currentPipe.style.display = 'none';

                    if (element.type == 'bottom') {
                        this._tempPosition = this.generatePositionPipe()[0];
                        element.positionY = this._tempPosition;
                    } else {
                        element.positionY = (350 - this._tempPosition);
                    }

                    this.editHTML(element.id, element.positionY);
                }
            })
        }
    }
}


document.addEventListener('keydown', (event) => {
    if (event.keyCode == 32) {
        user.space();
    };
});

document.querySelector('a.play').addEventListener('click', () => {
    document.querySelector('a.play').style.display = 'none';
    document.querySelector('.player').style.display = 'block';
    document.querySelector('.pipes').style.display = 'block';

    user.start();
    place.start();

    return false;
})

document.querySelector('a.restart').addEventListener('click', () => {
    user.restart();
    place.restart();

    document.querySelector('a.restart').style.display = 'none';

    return false;
});

setInterval(function(){
    if (user.isHealth()) {
        user.render();
        place.render(user.isHealth());
        user.isLosing(place.getPipesPosition(), place.getWidth() / 2);
        user.addScore(place.getPipesPosition(), place.getWidth() / 2);
        document.querySelector('.scores').textContent = user.score;
    }
}, 10);

window.user = user;
window.place = place;
