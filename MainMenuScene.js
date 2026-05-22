class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        // Adiciona o texto do título
        this.add.text(400, 160, 'iQuest: Aventureiros Proletários', { 
            fontSize: '32px', 
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Adiciona o botão "Começo"
        const startButton = this.add.text(400, 300, 'Começo', { 
            fontSize: '28px', 
            fill: '#fff' 
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        // Efeitos de hover no botão
        startButton.on('pointerover', () => startButton.setStyle({ fill: '#ff0' }));
        startButton.on('pointerout', () => startButton.setStyle({ fill: '#fff' }));

        // Ação de clique: Inicia a cena do Mapa
        startButton.on('pointerdown', () => {
            // Acessa o gerenciador de estado global a partir do registry
            const gameState = this.game.registry.get('gameState');

            // Exemplo: Modifica o estado do jogo
            gameState.storyProgress = 1; // Marca que a introdução foi concluída

            this.scene.start('MapScene');
        });
    }
}
