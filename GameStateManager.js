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
}