/**
 * Gerencia o estado global do jogo, como progresso da história,
 * dados do jogador, inventário, etc.
 * Esta classe é projetada para ser uma "única fonte da verdade".
 */
class GameStateManager {
    constructor() {
        console.log("GameStateManager inicializado!");

        // Em que ponto da história principal o jogador está.
        this.storyProgress = 0;

        // Dados dos personagens do grupo.
        this.party = [
            // { name: 'Herói', level: 1, hp: 100 },
        ];

        // Itens que o jogador possui.
        this.inventory = [];

        // Dinheiro do jogador.
        this.money = 0;

        // Armazena as escolhas e eventos importantes da história.
        // Ex: { isBrave: true, metKing: false }
        this.storyFlags = {};

        // Armazena o nível de relacionamento com cada NPC.
        // Ex: { Amigo: 10, Comerciante: 0 }
        this.npcRelationships = {};
    }

    // Aqui você pode adicionar métodos para manipular o estado de forma segura.
    // Ex: advanceStory(), addPartyMember(member), etc.

    /**
     * Define ou atualiza uma flag no estado da história.
     * @param {string} flag - O nome da flag a ser definida (ex: 'isBrave').
     * @param {*} value - O valor da flag (geralmente true/false).
     */
    setStoryFlag(flag, value) {
        this.storyFlags[flag] = value;
        console.log(`Story flag set: ${flag} = ${value}`);
    }

    /**
     * Atualiza o nível de relacionamento com um NPC.
     * @param {string} npcId - O identificador único do NPC (ex: 'Amigo').
     * @param {number} value - O valor a ser adicionado (pode ser positivo ou negativo).
     */
    updateRelationship(npcId, value) {
        if (this.npcRelationships[npcId] === undefined) {
            this.npcRelationships[npcId] = 0;
        }
        this.npcRelationships[npcId] += value;
        console.log(`Relacionamento com ${npcId} atualizado para: ${this.npcRelationships[npcId]}`);
    }
}