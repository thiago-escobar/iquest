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
            gravity: { y: 0 }, // Gravidade desativada para um jogo top-down
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

// Cria e registra o gerenciador de estado global no Registry do Phaser.
// É uma boa prática fazer isso no evento 'ready' para garantir que todos os sistemas do Phaser
// estejam inicializados antes de registrar dados globais. Isso evita possíveis "race conditions".
game.events.on('ready', () => {
    game.registry.set('gameState', new GameStateManager());
});