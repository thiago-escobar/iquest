class MapScene extends Phaser.Scene {
    constructor() { super({ key: 'MapScene' }); }
    create() {
        // Acessa o gerenciador de estado global
        const gameState = this.game.registry.get('gameState');

        // Mostra uma mensagem diferente com base no progresso da história
        let titleText = 'Mapa da Cidade';
        if (gameState.storyProgress > 0) {
            titleText += ` (Progresso: ${gameState.storyProgress})`;
        }
        this.add.text(400, 50, titleText, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        
        // Botões para navegar para outras cenas
        this.add.text(150, 200, 'Ir para História', { fontSize: '20px', fill: '#0ff' }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('StoryScene'));
        this.add.text(400, 200, 'Ir para Combate', { fontSize: '20px', fill: '#f00' }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('CombatScene'));
        this.add.text(650, 200, 'Ver Menu do Grupo', { fontSize: '20px', fill: '#0f0' }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('PartyMenuScene'));
        this.add.text(150, 400, 'Ir para Loja', { fontSize: '20px', fill: '#f0f' }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('ShopScene'));
        this.add.text(400, 400, 'Abrir App de Trabalho', { fontSize: '20px', fill: '#ff0' }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('GigAppScene'));
    }
}
