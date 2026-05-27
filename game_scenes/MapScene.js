class MapScene extends Phaser.Scene {
    constructor() { super({ key: 'MapScene' }); }

    init() {
        // Velocidade de movimento do jogador
        this.playerSpeed = 200;
    }

    create() {
        // Define a cor de fundo da cena para simular a grama
        this.cameras.main.setBackgroundColor('#228B22');

        // Cria o jogador como um quadrado vermelho com física
        this.player = this.add.rectangle(400, 300, 32, 32, 0xff0000);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true); // Impede o jogador de sair da tela

        // Cria um grupo de física estático para todos os locais
        this.locations = this.physics.add.staticGroup();

        // --- Criação dos locais interativos ---
        // Casa da História (Visual Novel com o NPC 'Amigo')
        this.createLocation(150, 200, 120, 100, 0x8B4513, 'Conversa', 'StoryScene', { dialogueFile: 'amigo_dialogue.json', npcId: 'Amigo' });

        // Loja (ShopScene)
        this.createLocation(350, 200, 120, 100, 0xD2691E, 'Loja', 'ShopScene');

        // Arena de Combate (CombatScene)
        this.createLocation(550, 200, 120, 100, 0xA9A9A9, 'Combate', 'CombatScene');

        // App de Trabalho / Agência (GigAppScene)
        this.createLocation(450, 400, 120, 100, 0x4682B4, 'Trabalhos', 'GigAppScene');

        // --- Configuração de Controles e Colisões ---

        // Adiciona um "overlap" (sobreposição) entre o jogador e os locais
        this.physics.add.overlap(this.player, this.locations, this.onLocationOverlap, null, this);
        this.cursors = this.input.keyboard.createCursorKeys();

        // Adiciona a tecla de espaço para abrir o menu
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    /**
     * Função auxiliar para criar um local interativo no mapa.
     * @param {number} x - Posição X do centro do local.
     * @param {number} y - Posição Y do centro do local.
     * @param {number} width - Largura do local.
     * @param {number} height - Altura do local.
     * @param {number} color - Cor do retângulo do local.
     * @param {string} label - Texto a ser exibido no local.
     * @param {string} sceneKey - A chave da cena para a qual navegar.
     * @param {object} sceneData - Dados a serem passados para a cena (via init).
     */
    createLocation(x, y, width, height, color, label, sceneKey, sceneData = {}) {
        // Cria o retângulo do local e o adiciona ao grupo de física
        const location = this.add.rectangle(x, y, width, height, color);
        this.locations.add(location);

        // Adiciona uma borda para destaque visual
        location.setStrokeStyle(2, 0xffffff);

        // Armazena a chave da cena e os dados no próprio objeto do local
        location.setData('sceneKey', sceneKey);
        location.setData('sceneData', sceneData);

        // Adiciona o texto do rótulo sobre o local
        this.add.text(x, y, label, { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
    }

    /**
     * Função chamada quando o jogador sobrepõe um local.
     * @param {Phaser.GameObjects.Rectangle} player - O objeto do jogador.
     * @param {Phaser.GameObjects.Rectangle} location - O objeto do local.
     */
    onLocationOverlap(player, location) {
        // Impede o jogador de se mover e desativa a física para evitar múltiplas transições
        player.body.stop();
        this.physics.pause();

        // Obtém a chave da cena e os dados armazenados no local e inicia a nova cena
        const sceneKey = location.getData('sceneKey');
        const sceneData = location.getData('sceneData');
        this.scene.start(sceneKey, sceneData);
    }

    update() {
        // Reseta a velocidade do jogador a cada frame
        this.player.body.setVelocity(0);

        // Define a velocidade com base nas teclas de seta pressionadas
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-this.playerSpeed);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(this.playerSpeed);
        }

        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-this.playerSpeed);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(this.playerSpeed);
        }
        // Verifica se a tecla de espaço foi pressionada para abrir o menu do grupo
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start('PartyMenuScene');
        }
    }
}