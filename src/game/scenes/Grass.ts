import { Scene } from 'phaser';
import { ASSET_KEYS, SCENE_KEYS } from '../constants';
import { Bee } from '../objects/Bee';

export class Grass extends Scene
{
    private bee?: Bee;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private readonly grassTileScale = 0.25;

    constructor ()
    {
        super(SCENE_KEYS.Grass);
    }

    create ()
    {
        this.createBackground();
        this.cursors = this.input.keyboard?.createCursorKeys();
        this.createBee();

        this.input.keyboard?.once('keydown-ESC', () => {
            this.scene.start(SCENE_KEYS.MainMenu);
        });
    }

    update (_time: number, delta: number)
    {
        const dt = delta / 1000;

        this.bee?.update(dt, this.scale.gameSize);
    }

    private createBackground (): void
    {
        const { width, height } = this.scale.gameSize;
        const grass = this.add.tileSprite(0, 0, width, height, ASSET_KEYS.Grass).setOrigin(0);
        grass.setTileScale(this.grassTileScale, this.grassTileScale);
    }

    private createBee (): void
    {
        const { width, height } = this.scale.gameSize;
        this.bee = new Bee(this, width * 0.5, height * 0.5);
        this.bee.setControls(this.cursors);
    }
}
