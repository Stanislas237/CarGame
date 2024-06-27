document.addEventListener('DOMContentLoaded', () => {

    const game = document.querySelector(".game")
    const road = document.createElement("div")
    const b_start = document.createElement("button")

    let player
    let left = 40
    let bottom = -10
    let ennemies = []
    let road_bg = -1
    let keypressed = ""
    let playing = false
    let timer = 0
    let score = 0

    function initialize (){
        playing = true
        b_start.style.display = "none"
    }

    function start (){
        player = new Car("car1", left, bottom)
        ennemies.push(new Car("car3", 10, 30))
        ennemies.push(new Car("car2", 70, 70))

        b_start.addEventListener("click", initialize)
        b_start.style.background = "green"
        b_start.innerHTML = "START"
        road.appendChild(b_start)
        b_start.style.margin = '40%'
    }

    function update (){
        if (playing){
            score += 0.01
            timer++
            timer = (timer == 150) ? spawn_car() : timer
            ennemies.forEach(car => {
                car.bottom -= 0.3
                car.car.style.bottom = car.bottom + "%"
                if (car.bottom < -19) {
                    ennemies.shift()
                    car.car.remove()
                }
                if (collision(car, player) || collision(player, car)) lost()
            });
    
            player.car.style.left = player.left + "%"
            
            road_bg +=0.4
            road.style.backgroundPosition = "0% " + road_bg + "%"
            road_bg = (road_bg == 100) ? -1 : road_bg
    
            if (keypressed == "l") go_left()
            if (keypressed == "r") go_right()
        }
    }

    function create_game (){
        const b_left = document.createElement("button")
        const background = document.createElement("div")
        const b_right = document.createElement("button")
    
        b_left.innerHTML = "👈"
        b_left.style.marginLeft = "10%"
        b_left.classList.add("button")
        b_right.innerHTML = "👉"
        b_right.style.marginLeft = "60%"
        b_right.classList.add("button")
        background.id = "background"
        road.id = "road"

        game.appendChild(b_left)
        game.appendChild(background)
        game.appendChild(b_right)
        background.appendChild(road)

        b_left.addEventListener("click", () => {keypressed = 'l'})
        b_right.addEventListener("click", () => {keypressed = 'r'})
        document.addEventListener("keydown", keydown)
    }

    function go_left (){
        if (player.left > -10) player.left -= 0.3
    }

    function go_right (){
        if (player.left < 90) player.left += 0.3
    }

    function keydown (e){
        if (e.key == " ") keypressed = ''
        if (e.key == "ArrowLeft") keypressed = 'l'
        if (e.key == "ArrowRight") keypressed = 'r'
        if (!playing && e.key == " ") initialize()
    }

    function lost (){
        playing = false
        document.removeEventListener("keydown", keydown)
        game.innerHTML = "<p>SCORE : " + Math.round(score) + "</p>"
    }

    function spawn_car (){
        let name = "car" + Math.ceil(random(2, false) + 1)
        let left = random(100) - 10
        let bottom = random(10) + 100

        ennemies.push(new Car(name, left, bottom))
        return -1
    }

    class Car {
        constructor(name, left, bottom){
            this.bottom = bottom
            this.left = left
            this.car = document.createElement("div")
            
            this.car.classList.add(name)
            this.car.style.left = left + "%"
            this.car.style.bottom = bottom + "%"
            road.appendChild(this.car)
        }
    }

    create_game()
    start ()
    setInterval(() => {
        update()
    }, 20);
})

function random (a, round = true){
    if (round) return Math.round(Math.random() * a)
    else return Math.random() * a
}
function collision  (car1, car2){
    if (((car1.left + 1) < car2.left) && ((car1.left + 19) > car2.left)){
        if (((car1.bottom + 1) > car2.bottom) && ((car2.bottom + 19) > car1.bottom)){
            return true
        }
        if (((car1.bottom + 1) < car2.bottom) && ((car1.bottom + 19) > car2.bottom)){
            return true
        }
    }
    return false
}