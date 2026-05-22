class MapScene extends Phaser.Scene {
    constructor() { super({ key: 'MapScene' }); }

    create() {
        // Fundo do mapa (um grande retângulo verde para simular grama)
        this.add.rectangle(400, 300, 800, 600, 0x228B22);

        // Título da cena
        this.add.text(400, 50, 'Vila Proletária', { fontSize: '32px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

        // --- Criação dos locais interativos ---

        // Casa da História (Visual Novel)
        this.createLocation(150, 200, 120, 100, 0x8B4513, 'Casa', 'StoryScene');

        // Loja (ShopScene)
        this.createLocation(350, 200, 120, 100, 0xD2691E, 'Loja', 'ShopScene');

        // Arena de Combate (CombatScene)
        this.createLocation(550, 200, 120, 100, 0xA9A9A9, 'Arena', 'CombatScene');

        // Menu do Grupo / Casa do Jogador (PartyMenuScene)
        this.createLocation(250, 400, 120, 100, 0x6B8E23, 'Sua Casa', 'PartyMenuScene');

        // App de Trabalho / Agência (GigAppScene)
        this.createLocation(450, 400, 120, 100, 0x4682B4, 'Agência', 'GigAppScene');
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
     */
    createLocation(x, y, width, height, color, label, sceneKey) {
        const location = this.add.rectangle(x, y, width, height, color)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(2, 0xffffff); // Adiciona uma borda branca

        this.add.text(x, y, label, { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);

        // Efeito de hover
        location.on('pointerover', () => location.setStrokeStyle(4, 0xffff00));
        location.on('pointerout', () => location.setStrokeStyle(2, 0xffffff));
        
        // Ação de clique
        location.on('pointerdown', () => this.scene.start(sceneKey));
    }
}