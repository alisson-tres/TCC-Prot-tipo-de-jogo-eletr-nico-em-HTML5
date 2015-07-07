/* 
 * Código-fonte do protótipo em HTML5 do jogo 'Desafio do Lorde das Trevas'
 * Autor     : Alisson Alberti Tres
 */

// Variáveis Globais
var tela = 0; /* Controla qual a tela na qual a aplicação se encontra */
var jogoCanvas; /* Contém a referência ao elemento Canvas presente na página */
var ctx; /* objeto de desenho 2D para imprimir elementos dentro do Canvas */
var carregado = 0;
var rotinaCarregarRecursos;

var canvas_x = ""; /* Armazena a posição X de um clique/toque na Canvas */
var canvas_y = ""; /* Armazena a posição Y de um clique/toque na Canvas */

var fps = 30; /* Determina a quantidade de quadros por segundo na qual o jogo estará rodando */

// Vetores e Objetos
var jogador; /* Guarda os dados básicos do jogador durante uma partida */
var inimigos = []; /* Vetor responsável por guardar os objetos dos inimigos presentes na tela */
var sprites = {}; /* Objeto responsável por guardar objetos Image correspondentes aos sprites utilizados durante a partida */
var interface = {}; /* Objeto responsável por guardar objetos Image correspondentes aos botões da interface */
var background = {};  /* Objeto responsável por guardar objetos Image correspondentes às imagens de fundo no decorrer do jogo */
var music = {};  /* Objeto responsável por guardar referência às músicas de fundo */
var sounds = {};  /* Objeto responsável por guardar referência aos efeitos sonoros */

/*------------------------------------------------------------------------------
 * Assim que a página web carregar, realiza a chamada do método que inicia o fluxo do jogo
 */
window.addEventListener("load",function() {
    /* Estabelece referência ao elemento Canvas no index */
    jogoCanvas = document.getElementById("jogo");
     /* Inicializa um objeto de desenho 2D para imprimir elementos dentro do Canvas */
    ctx = jogoCanvas.getContext("2d");
    
    /* Atribuí ao elemento Canvas no index um evento de espera para execução de uma função que captura a posição X e Y de um clique do mouse no Canvas */
    jogoCanvas.addEventListener("mousedown", function(event) {
        canvas_x = event.pageX - jogoCanvas.offsetLeft;
        canvas_y = event.pageY - jogoCanvas.offsetTop;
/*pageX e pageY englobam toda a área visível do site no navegador. É preciso subtrair os excessos da área externa (offset) para se obter a real posição de um clique dentro do escopo do Canvas.*/

        document.getElementById("click_X").innerHTML = canvas_x;
        document.getElementById("click_y").innerHTML = canvas_y;
    });
    
    /* Atribuí ao elemento Canvas no index um evento de espera para execução de uma função que captura a posição X e Y de um toque de tela tátil no Canvas */
    jogoCanvas.addEventListener("touchend", function(event) {
        event.preventDefault(); 
        /*primeiramente, cancelamos a execução padrão do método 'touchstart', que é o monitoramento contínuo de toques ou movimentos na tela tátil
         Por conta deste comportamento, as informações da interação com uma tela tátil são armazenadas em um vetor. Assim, podemos recuperar a posição X e Y de um breve toque através da primeira posição deste vetor. */
        canvas_x = event.targetTouches[0].pageX - jogoCanvas.offsetLeft;
        canvas_y = event.targetTouches[0].pageY - jogoCanvas.offsetTop;
        /*Novamente fazemos o tratamento para recuperar a posição de X e Y apenas do escopo da Canvas*/
        
        document.getElementById("click_X").innerHTML = canvas_x;
        document.getElementById("click_y").innerHTML = canvas_y;
    });
    
    /* 
     * Para saber quando que todos os recursos utilizados no jogo foram carregados
     * está sendo utilizado uma variável chamada 'carregado' que controla quantos arquivos já carregaram
     * e uma função executada automaticamente por meio de um Interval que verifica se o valor de 'carregado' já alcançou a quantidade de total de arquivos do jogo
     */
    //Imagens de Fundo
    background["inicial"] = new Image();
    background.inicial.onload = function() { carregado++; };
    background.inicial.src = "recursos/interface/bg_inicial.png";
    background["instrucoes"] = new Image();
    background.instrucoes.onload = function() { carregado++; };
    background.instrucoes.src = "recursos/interface/bg_instrucoes.png";
    background["historia"] = new Image();
    background.historia.onload = function() { carregado++; };
    background.historia.src = "recursos/interface/bg_historia.png";
    background["resultados"] = new Image();
    background.resultados.onload = function() { carregado++; };
    background.resultados.src = "recursos/interface/bg_resultados.png";
    background["cenario"] = new Image();
    background.cenario.onload = function() { carregado++; };
    background.cenario.src = "recursos/imagens/background-game.png";
    //Botões da Interface
    interface["btn_jogar"] = new Image();
    interface.btn_jogar.onload = function() { carregado++; };
    interface.btn_jogar.src = "recursos/interface/btn_jogar.png";
    interface["btn_voltar"] = new Image();
    interface.btn_voltar.onload = function() { carregado++; };
    interface.btn_voltar.src = "recursos/interface/btn_voltar.png";
    interface["btn_instrucoes"] = new Image();
    interface.btn_instrucoes.onload = function() { carregado++; };
    interface.btn_instrucoes.src = "recursos/interface/btn_instrucoes_creditos.png";
    interface["btn_novamente"] = new Image();
    interface.btn_novamente.onload = function() { carregado++; };
    interface.btn_novamente.src = "recursos/interface/btn_novamente.png";
    //Sprites dos personagens
    sprites["sprite_feiticeira"] = new Image();
    sprites.sprite_feiticeira.onload = function() { carregado++; };
    sprites.sprite_feiticeira.src = "recursos/imagens/feiticeira-spritesheet.png";
    sprites["sprite_cogumelo"] = new Image();
    sprites.sprite_cogumelo.onload = function() { carregado++; };
    sprites.sprite_cogumelo.src = "recursos/imagens/cogumelo-spritesheet.png";
    sprites["sprite_esqueleto"] = new Image();
    sprites.sprite_esqueleto.onload = function() { carregado++; };
    sprites.sprite_esqueleto.src = "recursos/imagens/esqueleto-spritesheet.png";
    sprites["sprite_armadura"] = new Image();
    sprites.sprite_armadura.onload = function() { carregado++; };
    sprites.sprite_armadura.src = "recursos/imagens/armadura-spritesheet.png";
    //Músicas e Efeitos Sonoros
    music.music_tela_inicial = document.querySelector("#music_tela_inicial");
    music.music_tela_inicial.load();
    music.music_tela_inicial.addEventListener("canplaythrough", function() { carregado++; }, false);
    music.music_tela_jogo = document.querySelector("#music_tela_jogo");
    music.music_tela_jogo.load();
    music.music_tela_jogo.addEventListener("canplaythrough", function() { carregado++; }, false);
    music.music_tela_jogo.volume = 0.5;
    music.music_tela_resultados = document.querySelector("#music_tela_resultados");
    music.music_tela_resultados.load();
    music.music_tela_resultados.addEventListener("canplaythrough", function() { carregado++; }, false);
    sounds.hit_jogador = document.querySelector("#sfx_hit_jogador");
    sounds.hit_jogador.load();
    sounds.hit_jogador.addEventListener("canplaythrough", function() { carregado++; }, false);
    sounds.hit_inimigo = document.querySelector("#sfx_hit_inimigo");
    sounds.hit_inimigo.load();
    sounds.hit_inimigo.addEventListener("canplaythrough", function() { carregado++; }, false);
    sounds.kill_jogador = document.querySelector("#sfx_kill_jogador");
    sounds.kill_jogador.load();
    sounds.kill_jogador.addEventListener("canplaythrough", function() { carregado++; }, false);
    sounds.kill_inimigo = document.querySelector("#sfx_kill_inimigo");
    sounds.kill_inimigo.load();
    sounds.kill_inimigo.addEventListener("canplaythrough", function() { carregado++; }, false);
    
    rotinaCarregarRecursos = setInterval(iniciarJogo, 500);
});

/* Função para iniciar o jogo quando todos os recursos tiverem sido carregados */
function iniciarJogo() {
    if(carregado === 20) {
        clearInterval(rotinaCarregarRecursos); //encerra a execução deste Interval
        main();
    }
}

/*------------------------------------------------------------------------------
 * Função responsável pelo loop principal do jogo
 */
function main() {
    // Executa um método para limpar a tela do Canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //Carrega uma função correspondente ao estado atual da aplicação
    switch (tela) {
        case 0:
            telaInicial();
            break;
        case 1:
            telaInstrucoes();
            break;
        case 2:
            telaHistoria();
            break;
        case 3:
            comecarJogo();
            break;
        case 4:
            telaResultado();
            break;
        default:
            break;
    }
}

/* -----------------------------------------------------------------------------
 * Função responsável por carregar a tela inicial do jogo
 */
function telaInicial() {

    //Interrompe a execução da música de GAME OVER
    music.music_tela_resultados.pause();
    music.music_tela_resultados.currentTime = 0;
    
    //Renderiza o fundo da tela
    var padrãoFundo = ctx.createPattern( background.inicial, "repeat" );
    ctx.fillStyle = padrãoFundo;
    ctx.fillRect(0, 0, 640, 480);
    
    //Renderiza os títulos da tela inicial
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px Arial Black, Gadget, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("ESTUDO DE TÉCNICAS E PROCESSOS REFERENTES AO",jogoCanvas.width/2,10);
    ctx.fillText("DESENVOLVIMENTO DE JOGOS ELETRÔNICOS MULTIPLATAFORMA",jogoCanvas.width/2,26);
	/* Por padrão, o método fillText() não é capaz de realizar quebras de linha, ou seja, a string é sempre exibida no Canvas em uma única linha. Ele também não reconhece comandos especiais de strings, como o '/n' para quebra de linha */
    
    ctx.font = "24px Arial Black, Gadget, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("DESAFIO DO LORDE DAS TREVAS",jogoCanvas.width/2,jogoCanvas.height/2);
    
    ctx.font = "14px Arial Black, Gadget, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("2015 Alisson Alberti Tres",jogoCanvas.width/2,460);
    
    //Renderiza os botões da interface
    ctx.drawImage(interface.btn_jogar, 40, 370);
    ctx.drawImage(interface.btn_instrucoes, 345, 370);
    
    //Estabelece a evento para quando um dos botões na tela inicial forem clicados
    jogoCanvas.addEventListener("mousedown", menu_telaInicial);
    
    //Toca música da tela inicial
    music.music_tela_inicial.play();
}

function menu_telaInicial() {
    if ((canvas_x >= 40 && canvas_x < 295) && (canvas_y >= 370 && canvas_y < 445)) {
        // Ocorreu um clique/toque no botão de Iniciar Jogo
        tela = 2;
        jogoCanvas.removeEventListener("mousedown", menu_telaInicial);
        main();
    }
    if ((canvas_x >= 345 && canvas_x < 600) && (canvas_y >= 370 && canvas_y < 445)) {
        // Ocorreu um clique/toque no botão de Instruções/Créditos
        tela = 1;
        jogoCanvas.removeEventListener("mousedown", menu_telaInicial);
        main();
    }
}

/* -----------------------------------------------------------------------------
 * Função responsável por carregar a tela de instruções/créditos do jogo
 */
function telaInstrucoes() {

    //Renderiza o fundo da tela
    var padraoFundo = ctx.createPattern( background.instrucoes, "repeat" );
    ctx.fillStyle = padraoFundo;
    ctx.fillRect(0, 0, 640, 480);
    
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "18px Arial Black, Gadget, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Como jogar:",jogoCanvas.width/2,25);
    ctx.fillText("> Cliques com o botão esquerdo do mouse",jogoCanvas.width/2,50);
    ctx.fillText("> Toques na tela tátil",jogoCanvas.width/2,75);
    
    ctx.textAlign = "center";
    ctx.fillText("Clique ou toque nos inimigos para ataca-los e causar-lhes dano.",jogoCanvas.width/2,195);
    ctx.fillText("Você ganhará pontos por cada inimigo derrotado.",jogoCanvas.width/2,220);
    ctx.fillText("Derrote o máximo possível de inimigos antes que os seus pontos",jogoCanvas.width/2,246);
    ctx.fillText("de vida acabem!",jogoCanvas.width/2,272);
    
    //Renderiza o botão para voltar à tela inicial
    ctx.drawImage(interface.btn_voltar, 345, 370);
    
    //Estabelece a evento para quando o botão de voltar for clicado
    jogoCanvas.addEventListener("mousedown", menu_telaInstrucoes);
}

function menu_telaInstrucoes() {
    if ((canvas_x >= 345 && canvas_x < 600) && (canvas_y >= 370 && canvas_y < 445)) {
        // Ocorreu um clique/toque no botão de voltar à Tela Inicial
        tela = 0;
        jogoCanvas.removeEventListener("mousedown", menu_telaInstrucoes);
        main();
    }
}

/* -----------------------------------------------------------------------------
 * Função responsável por carregar a tela em que é contada a história do jogo
 */
function telaHistoria() {
    
    //Interrompe a execução da música de fundo da tela anterior
    music.music_tela_inicial.pause();
    /*O controlador de áudio possui apenas dois estados: em execução(play) e pausado. É preciso definir manualmente a posição da música para o início. Assim, quando a Tela Inicial for carregada a música irá iniciar desde o começo.*/
    music.music_tela_inicial.currentTime = 0;
    
    //Renderiza o fundo da tela
    var padraoFundo = ctx.createPattern( background.historia, "repeat" );
    ctx.fillStyle = padraoFundo;
    ctx.fillRect(0, 0, 640, 480);
    
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "18px Arial Black, Gadget, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Um reino distante vive tempos de crise, estando sob ameaça do",jogoCanvas.width/2,15);
    ctx.fillText("inescrupuloso e sádico Lorde das Trevas. Carregado de um grande ",jogoCanvas.width/2,35);
    ctx.fillText("orgulho, o Lorde desafia o monarca com o propósito de colocar à ",jogoCanvas.width/2,55);
    ctx.fillText("prova as habilidades dos súditos deste reino e a destreza de seu ",jogoCanvas.width/2,75);
    ctx.fillText("exército de criaturas horrendas. Eis que o monarca do reino aceita o ",jogoCanvas.width/2,95);
    ctx.fillText("desafio e atribui à sua mais talentosa Feiticeira a tarefa de derrotar ",jogoCanvas.width/2,115);
    ctx.fillText("o maior número possível de elementos desta tropa maligna.",jogoCanvas.width/2,135);
    
    ctx.font = "18px Arial Black, Gadget, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CLIQUE / TOQUE NA TELA PARA COMEÇAR!",jogoCanvas.width/2,420);
    
    //Estabelece a evento para quando o botão de voltar for clicado
    jogoCanvas.addEventListener("mousedown", toqueNaTelaParaComecar);
}

function toqueNaTelaParaComecar() {
    // Ocorreu um clique/toque na tela... VAMOS COMEÇAR A JOGAR!
    tela = 3;
    jogoCanvas.removeEventListener("mousedown", toqueNaTelaParaComecar);
    main();
}

/* -----------------------------------------------------------------------------
 * Função responsável por carregar a tela de resultados
 */
function telaResultado() {
    
    //Interrompe a execução da música de fundo da tela anterior
    music.music_tela_jogo.pause();
    music.music_tela_jogo.currentTime = 0;
    //Toca música de GAME OVER
    music.music_tela_resultados.play();
    
    //Renderiza o fundo da tela
    var padraoFundo = ctx.createPattern( background.resultados, "repeat" );
    ctx.fillStyle = padraoFundo;
    ctx.fillRect(0, 0, 640, 480);
    
    //Calcula a pontuação final do jogador na partida: pontos por inimigos derrotados MULTIPLICADO pelo nível alcançado
    var pontuacaoFinal = jogador.pontuacao * jogador.nivel;
    
    ctx.fillStyle = "#FF4D4D";
    ctx.font = "24px Arial Black, Gadget, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!",jogoCanvas.width/2,jogoCanvas.height/2 - 60);
    
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px Arial Black, Gadget, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Pontos adquiridos: " + jogador.pontuacao,
        jogoCanvas.width/2,jogoCanvas.height/2 - 20);
    ctx.font = "20px Arial Black, Gadget, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Nível alcançado: " + jogador.nivel,
        jogoCanvas.width/2,jogoCanvas.height/2 + 20);
    
    ctx.fillStyle = "#CFCF53";
    ctx.font = "24px Arial Black, Gadget, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Sua pontuação final: " + pontuacaoFinal,
        jogoCanvas.width/2,jogoCanvas.height/2 + 55);
    
    ctx.drawImage(interface.btn_novamente, 40, 370);
    
    ctx.drawImage(interface.btn_voltar, 345, 370);
    
    //Estabelece um evento para quando um dos botões for clicado
    jogoCanvas.addEventListener("mousedown", menu_telaResultados);
}

function menu_telaResultados() {
    if ((canvas_x >= 40 && canvas_x < 295) && (canvas_y >= 370 && canvas_y < 445)) {
        // Ocorreu um clique/toque no botão de Jogar Novamente!
        tela = 3;
        jogoCanvas.removeEventListener("mousedown", menu_telaResultados);
        main();
    }
    if ((canvas_x >= 345 && canvas_x < 600) && (canvas_y >= 370 && canvas_y < 445)) {
        // Ocorreu um clique/toque no botão de voltar à Tela Inicial
        tela = 0;
        jogoCanvas.removeEventListener("mousedown", menu_telaResultados);
        main();
    }
}

/* -----------------------------------------------------------------------------
 * Função responsável por carregar a lógica de execução do jogo
 */
function comecarJogo() {
    
    //Interrompe a execução da música de GAME OVER
    music.music_tela_resultados.pause();
    music.music_tela_resultados.currentTime = 0;
    
    //Instancia um Objeto para o jogador
    jogador = {
        vida        : 100,  // pontos de vida do jogador
        pontuacao   : 0,    // contador de pontos do jogador
        nivel       : 0,    // controla o nível em que o jogador se encontra no momento
        imgSrc      : null, // objeto Image que contém os sprites da Feiticeira
        animFrame   : 0,    // atributo auxiliar para o controle das animações da Feiticeira
        timerJogo   : null  // guarda referência ao Interval que executa a lógica do jogo
    };
    
    //Instancia um modelo de Objeto para os inimigos a serem enfrentados
    var inimigo = {
        vida        : 0,    // pontos de vida deste tipo de Inimigo
        forca       : 0,    // o quanto de dano este causa ao jogador
        pontos      : 0,    // quantidade de pontos atribuída ao jogador quando este inimigo é derrotado
        frequencia  : 0,    // determina o intervalo de tempo em milissegundos que este inimigo realiza um ataque
        imgSrc      : null, // objeto Image que contém os sprites deste Inimigo
        animFrame   : 0,    // atributo auxiliar para o controle das animações deste Inimigo
        posX        : 0,    // posição X deste inimigo na tela
        posY        : 0,    // posição Y deste inimigo na tela
        timerAtaque : null, // guarda referência ao Interval que realiza ataques ao jogador
        ativo       : false // se diferente de false, indica que este inimigo ainda não foi derrotado
    };
    
    // Vamos instanciar neste vetor três objetos para gerenciar os inimigos presentes em cada nível
    inimigos[0] = Object.create(inimigo);
    inimigos[0].posX = 96;
    inimigos[0].posY = 208;
    
    inimigos[1] = Object.create(inimigo);
    inimigos[1].posX = 160;
    inimigos[1].posY = 144;
    
    inimigos[2] = Object.create(inimigo);
    inimigos[2].posX = 160;
    inimigos[2].posY = 272;
    
    // Atribuo à personagem da Feiticeira seus respectivos sprites
    jogador.imgSrc = sprites.sprite_feiticeira;
    
    //Inicio a música de fundo que toca durante a partida
    music.music_tela_jogo.play();
    
    //Inicia o fluxo de jogo: estabelece a execução contínua do método atualizar tela
    jogador.timerJogo = setInterval(atualizarTela, 1000 / fps);
}

function novoNivel() {
    // Incrementa o nível atual do jogador
    jogador.nivel++;
    
    // Gera um conjunto de inimigos para este nível
    for (i = 0; i < 3; i++) {
        //Estabelece um número aleatório entre 1 e 3 para determinar o tipo de inimigo
        var inimigo_tipo = Math.floor(Math.random() * 3) + 1;
        switch (inimigo_tipo) {
            case 1:
                //Inimigo em questão será um 'Cogumelo Ambulante'
                inimigos[i].vida = 10;
                inimigos[i].forca = 3;
                inimigos[i].pontos = 100;
                inimigos[i].frequencia = 4000;
                inimigos[i].imgSrc = sprites.sprite_cogumelo;
                inimigos[i].ativo = true;
                break;
            case 2:
                //Inimigo em questão será um 'Guerreiro Esqueleto'
                inimigos[i].vida = 15;
                inimigos[i].forca = 5;
                inimigos[i].pontos = 250;
                inimigos[i].frequencia = 6000;
                inimigos[i].imgSrc = sprites.sprite_esqueleto;
                inimigos[i].ativo = true;
                break;
            case 3:
                //Inimigo em questão será uma 'Armadura Assombrada'
                inimigos[i].vida = 20;
                inimigos[i].forca = 4;
                inimigos[i].pontos = 500;
                inimigos[i].frequencia = 5000;
                inimigos[i].imgSrc = sprites.sprite_armadura;
                inimigos[i].ativo = true;
                break;
        }
        
    }
    
    // Posiciona o nosso pelotão de inimigos para atacar a feiticeira em determinado intervalo de tempo!
    inimigos[0].timerAtaque = setInterval(function () {
        jogador.vida = jogador.vida - inimigos[0].forca; // realiza um ataque ao jogador. A quantia subtraída do jogador é determinada pelo atributo 'ataque' deste inimigo.
        sounds.hit_jogador.currentTime = 0;
        sounds.hit_jogador.play(); // executa o efeito sonoro de ataque ao jogador
    }, inimigos[0].frequencia);
    inimigos[1].timerAtaque = setInterval(function () {
        jogador.vida = jogador.vida - inimigos[1].forca; // realiza um ataque ao jogador. A quantia subtraída do jogador é determinada pelo atributo 'ataque' deste inimigo.
        sounds.hit_jogador.currentTime = 0;
        sounds.hit_jogador.play(); // executa o efeito sonoro de ataque ao jogador
    }, inimigos[1].frequencia);
    inimigos[2].timerAtaque = setInterval(function () {
        jogador.vida = jogador.vida - inimigos[2].forca; // realiza um ataque ao jogador. A quantia subtraída do jogador é determinada pelo atributo 'ataque' deste inimigo.
        sounds.hit_jogador.currentTime = 0;
        sounds.hit_jogador.play(); // executa o efeito sonoro de ataque ao jogador
    }, inimigos[2].frequencia);
}

/*
 * Realiza todos os cálculos e testes condicionais que determinam o fluxo do jogo, antes de renderizar a tela.
 */
function atualizarTela() {
    // Executa um método para limpar a tela do Canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Se os pontos de vida do jogador chegarem a zero, finaliza as rotinas de execução do jogo e carrega a tela de resultados
    if(jogador.vida <= 0) {
        clearInterval(jogador.timerJogo);
        clearInterval(inimigos[0].timerAtaque);
        clearInterval(inimigos[1].timerAtaque);
        clearInterval(inimigos[2].timerAtaque);
        tela = 4;
        sounds.kill_jogador.currentTime = 0;
        sounds.kill_jogador.play(); // executa o efeito sonoro que representa a derrota do jogador
        main();
    } else {
        //Se o jogador ainda estiver ativo, atualiza o frame de animação 
        jogador.animFrame++;
        //Para este protótipo, foi estipulado que a Feiticeira e os inimigos possuem animações com 4 sprites atualizados a cada dois frames. Totalizando assim um ciclo de animação com 8 frames.
        if(jogador.animFrame > 3) {
            //retorna para o frame inicial da animação
            jogador.animFrame = 0;
        }
        //Se existe registro de um clique ou toque na tela, verifica se ele ocorreu em um dos inimigos na tela
        //Antes disto, é necessário checar se os inimigos estão ativos...
        for(i = 0; i < 3; i++) {
            if(inimigos[i].ativo) {
                //Se tiver sido registrado um toque na tela
                if(canvas_x !== null && canvas_y !== null) {
                    if ((canvas_x >= inimigos[i].posX && canvas_x < inimigos[i].posX + 64) && (canvas_y >= inimigos[i].posY && canvas_y < inimigos[i].posY + 64)) {
                        //Ocorreu um toque no Inimigo!
                        inimigos[i].vida -= 1;
                        sounds.hit_inimigo.currentTime = 0;
                        sounds.hit_inimigo.play(); // executa o efeito sonoro de ataque ao inimigo
                    }
                }
                //Se a vida do inimigo tiver chegado a zero...
                if(inimigos[i].vida <= 0) {
                    //encerra a execução da função de atacar o jogador
                    clearInterval(inimigos[i].timerAtaque);
                    //altera o seu estado para inativo
                    inimigos[i].ativo = false;
                    //incrementa a pontuação do jogador
                    jogador.pontuacao += inimigos[i].pontos;
                    // executa o efeito sonoro de inimigo derrotado!
                    sounds.kill_inimigo.currentTime = 0;
                    sounds.kill_inimigo.play();
                //Se o inimigo ainda estiver ativo, atualiza o frame de animação do inimigo
                } else {
                    inimigos[i].animFrame++;
                    if(inimigos[i].animFrame > 3) {
                        inimigos[i].animFrame = 0;
                    }
                }
            }
        }
        //Limpa variáveis de captura de tela
        canvas_x = null;
        canvas_y = null;
        document.getElementById("click_X").innerHTML = "";
        document.getElementById("click_y").innerHTML = "";
        
        //Se todos os inimigos estiverem inativos, significa que o nível foi concluído e o jogo deve gerar o próximo nível
        if(!inimigos[0].ativo && !inimigos[1].ativo && !inimigos[2].ativo) {
            novoNivel();
        }
        
        //Após todos os cálculos e testes serem feitos, Executa a renderização dos elementos gráficos na tela...
        renderizarTelaJogo();
    }
}

/*
 * Função dedicada a gerar na tela todos os elementos gráficos presentes durante a execução de uma partida
 */
function renderizarTelaJogo() {
    //Renderiza o cenário da tela
    ctx.drawImage(background.cenario, 0, 0);
    
    //Renderiza os pontos de vida do jogador
    ctx.fillStyle = "#FF3030";
    ctx.font = "16px Arial, Helvetica, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Pontos de Vida: " + jogador.vida,20,15);
    
    //Renderiza a pontuação do jogador
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px Arial, Helvetica, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Pontuação: " + jogador.pontuacao,jogoCanvas.width/2,15);
    
    //Renderiza o nível do jogador
    ctx.font = "16px Arial, Helvetica, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText("Nível: " + jogador.nivel,600,15);
    
    //Renderiza a Feiticeira
    ctx.drawImage(jogador.imgSrc, 64 * jogador.animFrame, 0, 64, 64, 416, 208, 64, 64);
    
    //Se o Inimigo 1 estiver ativo, renderiza ele
    if(inimigos[0].ativo) {
        ctx.drawImage(inimigos[0].imgSrc, 64 * inimigos[0].animFrame, 0, 64, 64,inimigos[0].posX, inimigos[0].posY, 64, 64);
    }
    
    //Se o Inimigo 2 estiver ativo, renderiza ele
    if(inimigos[1].ativo) {
        ctx.drawImage(inimigos[1].imgSrc, 64 * inimigos[1].animFrame, 0, 64, 64,inimigos[1].posX, inimigos[1].posY, 64, 64);
    }
    
    //Se o Inimigo 3 estiver ativo, renderiza ele
    if(inimigos[2].ativo) {
        ctx.drawImage(inimigos[2].imgSrc, 64 * inimigos[2].animFrame, 0, 64, 64,inimigos[2].posX, inimigos[2].posY, 64, 64);
    }
    
}

/* -----------------------------------------------------------------------------
 Fim do arquivo. A WINNER IS YOU! */