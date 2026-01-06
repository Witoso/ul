import { Scene } from 'phaser';

export class Grass extends Scene
{
    constructor ()
    {
        super('Grass');
    }

    create ()
    {
        const { width, height } = this.scale.gameSize;

        const grass = this.add.tileSprite(0, 0, width, height, 'grass').setOrigin(0);
        grass.setTileScale(0.25, 0.25);

        this.input.keyboard?.once('keydown-ESC', () => {
            this.scene.start('MainMenu');
        });
    }
}
