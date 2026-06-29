const shimeji = document.getElementById("shimeji");

const imgs = {
    parado: "imgs shimeji/parado.png",
    pulando: "imgs shimeji/pulando.png",
    ferido: "imgs shimeji/machucado.png",
    caido: "imgs shimeji/caido.png",
    correndo: "imgs shimeji/correndo.png",
    correndoMuito: "imgs shimeji/correndo2.png",
    arrastado: "imgs shimeji/arrastado.png"
};

// ==================
// CONFIGURAÇÕES
// ==================

const HP_MAX = 5;
const CHAO = 0;
const GRAVIDADE = 0.8;

let hp = HP_MAX;

let x = 100;
let y = 0;

let velocidadeX = 0;
let velocidadeY = 0;

let arrastando = false;
let caiuDeAlto = false;
let caido = false;

let direcaoAtual = 1;

// ==================
// POSIÇÃO
// ==================

function atualizarPosicao() {
    shimeji.style.left = x + "px";
    shimeji.style.bottom = y + "px";
}

function virar(direcao) {

    direcaoAtual = direcao;

    shimeji.style.transform =
        direcao > 0
            ? "scaleX(1)"
            : "scaleX(-1)";
}

atualizarPosicao();

// ==================
// COMPORTAMENTO RANDOM
// ==================

function escolherAcao() {

    if (arrastando || caido) return;

    const sorteio = Math.random();


    // 25% parado
    if (sorteio < 0.25) {

        velocidadeX = 0;
        shimeji.src = imgs.parado;

        return;
    }


    // 25% andando
    if (sorteio < 0.50) {

        andar(3, imgs.correndo);

        return;
    }


    // 25% correndo
    if (sorteio < 0.75) {

        andar(8, imgs.correndoMuito);

        return;
    }


    // 25% pulando
    pular();

}

setInterval(escolherAcao, 2500);

// ==================
// ANDAR
// ==================

function andar(vel, imagem) {

    const direcao =
        Math.random() < 0.5 ? -1 : 1;


    virar(direcao);


    velocidadeX = vel * direcao;


    shimeji.src = imagem;


    setTimeout(() => {

        if (arrastando || caido) return;

        velocidadeX = 0;
        shimeji.src = imgs.parado;

    }, 3000);
}

// ==================
// PULO
// ==================

function pular() {

    if (y > 0) return;

    velocidadeY = 15;
    shimeji.src = imgs.pulando;
}

// ==================
// HP E DANO
// ==================

shimeji.addEventListener("click", () => {

    if (arrastando || caido) return;

    hp--;

    console.log("HP:", hp);

    shimeji.src = imgs.ferido;

    if (hp <= 0) {

        derrubar();
        return;
    }

    setTimeout(() => {

        if (y <= 0 && !caido)
            shimeji.src = imgs.parado;

    }, 800);
});

// ==================
// CAIR / DESMAIAR
// ==================

function derrubar() {

    caido = true;

    velocidadeX = 0;
    velocidadeY = 0;

    shimeji.src = imgs.caido;

    setTimeout(() => {

        hp = HP_MAX;
        caido = false;

        shimeji.src = imgs.parado;

    }, 5000);
}

// ==================
// ARRASTAR
// ==================

let offsetX;
let offsetY;
let alturaSolta = 0;

shimeji.addEventListener("mousedown", e => {

    if (caido) return;

    arrastando = true;

    velocidadeX = 0;
    velocidadeY = 0;

    shimeji.src = imgs.arrastado;

    offsetX = e.offsetX;
    offsetY = e.offsetY;
});

document.addEventListener("mousemove", e => {

    if (!arrastando) return;

    x = e.clientX - offsetX;

    y =
        window.innerHeight -
        e.clientY -
        shimeji.offsetHeight / 2;

    if (y < 0) y = 0;

    atualizarPosicao();
});

document.addEventListener("mouseup", () => {

    if (!arrastando) return;

    alturaSolta = y;

    arrastando = false;

    velocidadeY = 0;

    caiuDeAlto = alturaSolta > 200;
});

// ==================
// LOOP PRINCIPAL
// ==================

function loop() {

    if (!arrastando) {

        x += velocidadeX;

        velocidadeY -= GRAVIDADE;
        y += velocidadeY;

        if (y <= CHAO) {

            y = CHAO;

            if (caiuDeAlto) {

                caiuDeAlto = false;

                shimeji.src = imgs.caido;

                caido = true;

                setTimeout(() => {

                    hp = HP_MAX;
                    caido = false;

                    shimeji.src = imgs.parado;

                }, 3000);
            }
            else {

                if (!caido)
                    shimeji.src = imgs.parado;
            }

            velocidadeY = 0;
        }

        // Limite esquerdo

        if (x < 0) {

            x = 0;
            velocidadeX *= -1;

            virar(1);
        }

        // Limite direito

        if (x > window.innerWidth - shimeji.offsetWidth) {

            x =
                window.innerWidth -
                shimeji.offsetWidth;

            velocidadeX *= -1;

            virar(-1);
        }
    }

    atualizarPosicao();

    requestAnimationFrame(loop);
}

loop();