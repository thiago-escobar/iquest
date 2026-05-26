class StoryScene extends Phaser.Scene {
    constructor() { super({ key: 'StoryScene' }); }

    preload() {
        // Carrega o arquivo JSON com todos os diálogos da história.
        // Certifique-se de que a pasta 'dialogues' existe e contém o arquivo.
        this.load.json('storyData', './dialogues/story_data.json');
    }

    init() {
        // Pega o gerenciador de estado global que foi registrado em game.js
        this.gameState = this.game.registry.get('gameState');
    }

    create() {
        // Pega o bloco de diálogo correspondente ao progresso atual da história
        const storyProgress = this.gameState.storyProgress;
        this.dialogueData = this.cache.json.get('storyData')[storyProgress];

        // Se não houver diálogo para o progresso atual, volta para o mapa.
        if (!this.dialogueData) {
            console.warn(`Nenhum diálogo encontrado para storyProgress: ${storyProgress}`);
            this.scene.start('MapScene');
            return;
        }

        this.dialogueIndex = 0;
        this.dialogueLines = this.dialogueData.dialogue;

        // --- Criação da Interface Gráfica (UI) ---
        // Caixa de diálogo
        this.add.rectangle(400, 500, 780, 180, 0x000000, 0.7).setStrokeStyle(2, 0xffffff);
        // Caixa para o nome do personagem
        this.nameBox = this.add.rectangle(120, 420, 200, 40, 0x111111, 0.8).setStrokeStyle(1, 0xffffff);
        this.nameText = this.add.text(120, 420, '', { fontSize: '22px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        // Texto do diálogo
        this.dialogueText = this.add.text(30, 440, '', { fontSize: '20px', fill: '#fff', wordWrap: { width: 740 } });

        // Mostra a primeira linha
        this.displayNextLine();

        // Permite avançar o diálogo com um clique
        this.input.on('pointerdown', () => this.displayNextLine());
    }

    /**
     * Exibe a próxima linha de diálogo ou as opções de escolha.
     */
    displayNextLine() {
        // Se já exibimos todas as linhas, encerra a cena.
        if (this.dialogueIndex >= this.dialogueLines.length) {
            this.endScene();
            return;
        }

        const currentLine = this.dialogueLines[this.dialogueIndex];

        // Verifica se a linha atual é um ponto de escolha
        if (currentLine.choices) {
            this.displayChoices(currentLine.choices);
        } else {
            // Atualiza o nome e o texto do diálogo
            this.nameText.setText(currentLine.character || '');
            this.dialogueText.setText(currentLine.text);
            this.dialogueIndex++;
        }
    }

    /**
     * Cria e exibe botões de escolha para o jogador.
     * @param {Array<Object>} choices - Um array de objetos de escolha.
     */
    displayChoices(choices) {
        // Desativa o clique principal para não pular as escolhas
        this.input.off('pointerdown');
        this.dialogueText.setText('Faça sua escolha...');
        this.nameText.setText('');

        let choiceY = 200;
        choices.forEach(choice => {
            const choiceText = this.add.text(400, choiceY, `> ${choice.text}`, {
                fontSize: '24px',
                fill: '#fff',
                backgroundColor: '#333',
                padding: { x: 10, y: 5 }
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

            choiceText.on('pointerover', () => choiceText.setStyle({ fill: '#ff0' }));
            choiceText.on('pointerout', () => choiceText.setStyle({ fill: '#fff' }));

            choiceText.on('pointerdown', () => {
                this.handleChoice(choice);
            });

            choiceY += 60;
        });
    }

    /**
     * Processa a escolha do jogador, salva a flag e avança a história.
     * @param {Object} choice - O objeto de escolha selecionado.
     */
    handleChoice(choice) {
        // Salva a flag da escolha no estado global do jogo
        if (choice.setsFlag) {
            this.gameState.setStoryFlag(choice.setsFlag, true);
        }
        // Atualiza o progresso da história para o próximo passo
        if (choice.nextProgress) {
            this.gameState.storyProgress = choice.nextProgress;
        }
        this.endScene();
    }

    endScene() {
        this.scene.start('MapScene');
    }
}