// --- CONFIGURAÇÃO DO JOGO ---
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    // Lista todas as cenas que o jogo usará
    // As classes das cenas são carregadas de arquivos separados em index.html
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

// Cria e registra o gerenciador de estado global no Registry do Phaser.
game.registry.set('gameState', new GameStateManager());