// --- CENA DO MENU PRINCIPAL ---
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
            this.scene.start('MapScene');
        });
    }
}

// --- CENAS DO JOGO (PLACEHOLDERS) ---

// 1 - História: conversa estilo visual novel
class StoryScene extends Phaser.Scene {
    constructor() { super({ key: 'StoryScene' }); }
    create() {
        this.add.text(400, 300, '1 - Cena de História (Visual Novel)', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 550, 'Voltar ao Mapa', { fontSize: '20px', fill: '#0f0' }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('MapScene'));
    }
}

// 2 - Combate: grid com batalha tactics RPG
class CombatScene extends Phaser.Scene {
    constructor() { super({ key: 'CombatScene' }); }
    create() {
        this.add.text(400, 300, '2 - Cena de Combate (Tactics RPG)', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 550, 'Voltar ao Mapa', { fontSize: '20px', fill: '#0f0' }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('MapScene'));
    }
}

// 3 - Mapa: mapa 2D com localidades
class MapScene extends Phaser.Scene {
    constructor() { super({ key: 'MapScene' }); }
    create() {
        this.add.text(400, 50, '3 - Cena do Mapa', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        
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

// 4 - Menu: dados do grupo, itens, etc.
class PartyMenuScene extends Phaser.Scene {
    constructor() { super({ key: 'PartyMenuScene' }); }
    create() {
        this.add.text(400, 300, '4 - Menu do Grupo', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 550, 'Voltar ao Mapa', { fontSize: '20px', fill: '#0f0' }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('MapScene'));
    }
}

// 5 - Compra: menu para comprar itens
class ShopScene extends Phaser.Scene {
    constructor() { super({ key: 'ShopScene' }); }
    create() {
        this.add.text(400, 300, '5 - Cena de Compra', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 550, 'Voltar ao Mapa', { fontSize: '20px', fill: '#0f0' }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('MapScene'));
    }
}

// 6 - App de Celular: ficha de trabalhador e trabalhos
class GigAppScene extends Phaser.Scene {
    constructor() { super({ key: 'GigAppScene' }); }
    create() {
        this.add.text(400, 300, '6 - App de Celular (Trabalhos)', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 550, 'Voltar ao Mapa', { fontSize: '20px', fill: '#0f0' }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('MapScene'));
    }
}

// --- CONFIGURAÇÃO DO JOGO ---
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    // Lista todas as cenas que o jogo usará
    scene: [MainMenuScene, StoryScene, CombatScene, MapScene, PartyMenuScene, ShopScene, GigAppScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);