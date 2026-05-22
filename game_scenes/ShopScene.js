class ShopScene extends Phaser.Scene {
    constructor() { super({ key: 'ShopScene' }); }
    create() {
        this.add.text(400, 300, '5 - Cena de Compra', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 550, 'Voltar ao Mapa', { fontSize: '20px', fill: '#0f0' }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('MapScene'));
    }
}