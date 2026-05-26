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
    }

    // Aqui você pode adicionar métodos para manipular o estado de forma segura.
    // Ex: advanceStory(), addPartyMember(member), etc.
}