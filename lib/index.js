"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APKG = void 0;
const Database = require('better-sqlite3');
const { join } = require('path');
const { initDatabase, insertCard } = require('./sql');
const { writeFileSync, mkdirSync, rmdirSync, createWriteStream } = require('fs');
const rimraf = require('rimraf');
const archiver = require('archiver');
class APKG {
    constructor(config, destination) {
        this.config = config;
        this.dest = join(destination, config.filename);
        this.media = [];
        this.clean();
        mkdirSync(this.dest);
        this.db = new Database(join(this.dest, 'collection.anki2'), { mode: 0o755 });
        this.deck = Object.assign(Object.assign({}, config), { id: +new Date() });
        initDatabase(this.db, this.deck);
    }
    addCard(card) {
        insertCard(this.db, this.deck, card);
    }
    afterFinish() {
        this.clean();
    }
    save(destination) {
        const directory = join(destination, this.config.filename);
        const archive = archiver('zip');
        var mediaObj = this.media.reduce(function (prev, curr, idx) {
            prev[idx] = curr.filename;
            return prev;
        }, {});
        this.media.forEach((item, i) => {
            writeFileSync(join(this.dest, i + ''), item.data, { mode: 0o755 });
        });
        writeFileSync(join(this.dest, 'media'), JSON.stringify(mediaObj), { mode: 0o755 });
        var output = createWriteStream(join(destination, `${this.config.filename}.apkg`));
        output.on('close', this.afterFinish.bind(this));
        archive.directory(directory, false);
        archive.pipe(output);
        archive.finalize();
    }
    clean() {
        rimraf(this.dest, () => { });
    }
}
exports.APKG = APKG;
