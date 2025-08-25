export declare class APKG {
    private config;
    private db;
    private deck;
    private dest;
    private media;
    constructor(config: DeckConfig, destination: string);
    addCard(card: Card): void;
    afterFinish(): void;
    save(destination: string): void;
    private clean;
}
