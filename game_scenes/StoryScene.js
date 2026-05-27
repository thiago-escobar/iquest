class StoryScene extends Phaser.Scene {
    constructor() { super({ key: 'StoryScene' }); }

    init(data) {
        // Pega o gerenciador de estado global que foi registrado em game.js
        this.gameState = this.game.registry.get('gameState');

        // Pega os dados passados pela cena anterior (ex: MapScene)
        this.dialogueFile = data.dialogueFile || 'story_data.json'; // Fallback para o arquivo antigo
        this.npcId = data.npcId; // O ID do NPC para esta conversa (ex: 'Amigo')

        // Inicializa/reseta variáveis de controle da cena
        this.choiceObjects = [];
        this.pendingNextProgress = null;
    }

    create() {
        // A chave para o cache do Phaser será o nome do arquivo sem a extensão
        const dialogueKey = this.dialogueFile.replace('.json', '');

        // Verifica se o arquivo de diálogo já está carregado no cache
        if (this.cache.json.has(dialogueKey)) {
            // Se sim, apenas configura a cena
            this.setupScene(dialogueKey);
        } else {
            // Se não, carrega o arquivo JSON específico e, ao completar, configura a cena
            this.load.json(dialogueKey, `dialogues/${this.dialogueFile}`);
            this.load.once('complete', () => {
                this.setupScene(dialogueKey);
            });
            this.load.start(); // Inicia o carregamento
        }
    }

    /**
     * Configura a UI e a lógica da cena depois que os dados do diálogo foram carregados.
     * @param {string} dialogueKey - A chave do JSON de diálogo no cache do Phaser.
     */
    setupScene(dialogueKey) {
        // Pega o bloco de diálogo correspondente ao progresso atual da história
        const storyProgress = this.gameState.storyProgress;
        this.dialogueData = this.cache.json.get(dialogueKey)[storyProgress];

        // Se não houver diálogo para o progresso atual, volta para o mapa.
        if (!this.dialogueData) {
            console.warn(`Nenhum diálogo encontrado para storyProgress: ${storyProgress} no arquivo ${this.dialogueFile}`);
            this.endScene();
            return;
        }

        // --- Criação do Fundo ---
        this.background = this.add.image(400, 300, '').setDepth(-1);
        this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        this.dialogueIndex = 0;
        this.dialogueLines = this.dialogueData.dialogue;

        // --- Criação dos Retratos (Placeholders) ---
        // Cria dois objetos de imagem que servirão como porta-retratos.
        // Eles começam invisíveis e serão atualizados a cada linha de diálogo.
        const portraitY = this.cameras.main.height - 180 - 220; // Posiciona acima da caixa de diálogo
        this.leftPortrait = this.add.image(150, portraitY, '').setScale(150, 200).setOrigin(0.5, 0).setVisible(false);
        this.rightPortrait = this.add.image(650, portraitY, '').setScale(150, 200).setOrigin(0.5, 0).setVisible(false);


        // --- Criação da Interface Gráfica (UI) ---
        // Caixa de diálogo
        this.add.rectangle(400, 500, 780, 180, 0x000000, 0.7).setStrokeStyle(2, 0xffffff);
        // Caixa para o nome do personagem
        this.nameBox = this.add.rectangle(120, 420, 200, 40, 0x111111, 0.8).setStrokeStyle(1, 0xffffff);
        this.nameText = this.add.text(120, 420, '', { fontSize: '22px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        // Texto do diálogo
        this.dialogueText = this.add.text(30, 440, '', { fontSize: '20px', fill: '#fff', wordWrap: { width: 740 } });

        // --- Exibidor de Relacionamento ---
        this.relationshipText = null; // Inicializa a propriedade
        if (this.npcId) {
            this.relationshipText = this.add.text(780, 20, '', {
                fontSize: '20px',
                fill: '#fff',
                fontStyle: 'bold',
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: { x: 8, y: 4 }
            }).setOrigin(1, 0); // Alinha no canto superior direito
            this.updateRelationshipDisplay(); // Define o valor inicial
        }

        // Mostra a primeira linha
        this.displayNextLine();

        // Permite avançar o diálogo com um clique
        this.input.on('pointerdown', () => this.displayNextLine());
    }

    /**
     * Exibe a próxima linha de diálogo ou as opções de escolha.
     */
    displayNextLine() {
        // Deixa os dois retratos em estado "inativo" (escurecido)
        // Isso mantém o personagem que não está falando na tela, mas sem destaque.
        this.leftPortrait?.setTint(0x808080);
        this.rightPortrait?.setTint(0x808080);

        // Se já exibimos todas as linhas, encerra a cena.
        if (this.dialogueIndex >= this.dialogueLines.length) {
            // Se houver um progresso pendente (de uma escolha com resposta), aplique-o agora.
            if (this.pendingNextProgress) {
                this.gameState.storyProgress = this.pendingNextProgress;
                this.pendingNextProgress = null; // Limpa para a próxima vez
            } else if (this.dialogueData.nextProgress) {
                // Se não houver progresso pendente de uma escolha, mas o próprio
                // bloco de diálogo define o próximo passo, aplique-o.
                this.gameState.storyProgress = this.dialogueData.nextProgress;
            }
            this.endScene();
            return;
        }
        const currentLine = this.dialogueLines[this.dialogueIndex];

        // Se a linha atual define um novo fundo, atualiza-o.
        if (currentLine.setBackground) {
            this.updateBackground(currentLine.setBackground);
        }

        // Se a linha atual requer uma flag e o jogador não a possui, pule para a próxima linha.
        if (currentLine.requiresFlag && !this.gameState.storyFlags[currentLine.requiresFlag]) {
            this.dialogueIndex++;
            // Chama a função novamente para processar a próxima linha ou encerrar a cena
            // se não houver mais linhas.
            this.displayNextLine();
            return;
        }

        // Verifica se a linha atual é um ponto de escolha
        if (currentLine.choices) {
            this.displayChoices(currentLine.choices);
        } else if (currentLine.portrait && currentLine.position) {
            // Se a linha tem um retrato para exibir...
            const { portrait, position } = currentLine;

            // Gera uma textura de placeholder colorida se ela ainda não existir.
            // A cor é baseada no nome do retrato, então "amigo_feliz" e "amigo_triste"
            // terão cores diferentes.
            if (!this.textures.exists(portrait)) {
                let h = 0;
                for (let i = 0; i < portrait.length; i++) {
                    h = (h << 5) - h + portrait.charCodeAt(i);
                    h |= 0; // Converte para inteiro de 32bit
                }
                const color = (h & 0x00FFFFFF).toString(16).toUpperCase();
                const paddedColor = '00000'.substring(0, 6 - color.length) + color;
                this.textures.generate(portrait, { data: [paddedColor], pixelWidth: 1 });
            }

            // Define qual retrato é o alvo (o que está falando)
            const targetPortrait = (position === 'left') ? this.leftPortrait : this.rightPortrait;

            // Atualiza a textura, torna visível e remove o escurecimento para dar destaque.
            targetPortrait.setTexture(portrait).setVisible(true).clearTint();

            this.updateDialogueText(currentLine);
        } else {
            // Atualiza o nome e o texto do diálogo
            this.nameText.setText(currentLine.character || '');
            this.dialogueText.setText(currentLine.text);
            this.dialogueIndex++;
        }
    }

    /**
     * Atualiza o texto do nome e do diálogo na tela.
     * @param {object} line - A linha de diálogo atual.
     */
    updateDialogueText(line) {
        this.nameText.setText(line.character || '');
        this.dialogueText.setText(line.text);
        this.dialogueIndex++;
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

        // Esconde os retratos durante a escolha para focar nas opções.
        this.leftPortrait.setVisible(false);
        this.rightPortrait.setVisible(false);

        this.choiceObjects = []; // Limpa referências de escolhas anteriores
        let choiceY = 200;
        choices.forEach(choice => {
            // Se a escolha requer uma flag e o jogador não a possui, não a exiba.
            if (choice.requiresFlag && !this.gameState.storyFlags[choice.requiresFlag]) {
                return; // Pula para a próxima iteração do loop
            }

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

            this.choiceObjects.push(choiceText); // Armazena para poder limpar depois
            choiceY += 60;
        });
    }

    /**
     * Remove os objetos de texto das escolhas da tela.
     */
    clearChoices() {
        this.choiceObjects.forEach(choice => choice.destroy());
        this.choiceObjects = [];
    }

    /**
     * Atualiza a imagem de fundo da cena, usando um placeholder colorido se a imagem não existir.
     * @param {string} bgKey - A chave da textura do novo fundo.
     */
    updateBackground(bgKey) {
        // Gera uma textura de placeholder colorida se ela ainda não existir.
        if (!this.textures.exists(bgKey)) {
            // Usa um hash do nome da imagem para gerar uma cor consistente.
            let h = 0;
            for (let i = 0; i < bgKey.length; i++) {
                h = (h << 5) - h + bgKey.charCodeAt(i);
                h |= 0; // Converte para inteiro de 32bit
            }
            // Gera uma cor mais escura para o fundo para não ofuscar o texto e os retratos.
            const r = (h & 0xFF0000) >> 16;
            const g = (h & 0x00FF00) >> 8;
            const b = h & 0x0000FF;
            const darkColorHex = Phaser.Display.Color.RGBToString(r * 0.5, g * 0.5, b * 0.5).substring(1);
            this.textures.generate(bgKey, { data: [darkColorHex], pixelWidth: 1 });
        }
        this.background.setTexture(bgKey);
    }

    /**
     * Atualiza o texto que exibe o nível de relacionamento com o NPC atual.
     */
    updateRelationshipDisplay() {
        if (this.relationshipText) {
            const value = this.gameState.npcRelationships[this.npcId] || 0;
            this.relationshipText.setText(`Relacionamento: ${value}`);
        }
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

        // Se a escolha afeta o relacionamento e temos um NPC definido, atualiza o estado.
        if (choice.relationshipChange && this.npcId) {
            this.gameState.updateRelationship(this.npcId, choice.relationshipChange);
            this.updateRelationshipDisplay(); // Atualiza o valor na tela
        }

        // Remove os botões de escolha da tela
        this.clearChoices();

        // Pega o resto do diálogo que viria depois do bloco de escolhas
        const remainingDialogue = this.dialogueLines.slice(this.dialogueIndex + 1);

        // Verifica se há uma resposta imediata para a escolha
        if (choice.response && choice.response.length > 0) {
            // Combina a resposta da escolha com o resto do diálogo original
            this.dialogueLines = [...choice.response, ...remainingDialogue];
        } else {
            // Se não houver resposta, apenas continua com o resto do diálogo
            this.dialogueLines = remainingDialogue;
        }

        // Reseta o índice para o início da nova fila de diálogo (seja a resposta ou o que vem depois)
        this.dialogueIndex = 0;

        // Armazena o próximo progresso para ser aplicado quando este bloco de diálogo terminar
        this.pendingNextProgress = choice.nextProgress;

        // Exibe a primeira linha da nova fila de diálogo.
        // Se a nova fila estiver vazia, a verificação no início de displayNextLine() encerrará a cena.
        this.displayNextLine();

        // Reativa o clique na tela no próximo frame para evitar que o clique da escolha
        // avance o diálogo de resposta imediatamente.
        this.time.delayedCall(10, () => {
            if (this.scene.isActive()) { // Garante que a cena ainda existe
                this.input.on('pointerdown', () => this.displayNextLine());
            }
        });
    }

    endScene() {
        this.scene.start('MapScene');
    }
}