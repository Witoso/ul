import { Scene } from 'phaser';
import { ASSET_KEYS } from '../constants';

export class Beehive
{
    private readonly image: Phaser.GameObjects.Image;

    constructor (scene: Scene, x: number, y: number, scale: number)
    {
        this.image = scene.add.image(x, y, ASSET_KEYS.Beehive).setScale(scale);
    }

    getBounds (output?: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle
    {
        return this.image.getBounds(output);
    }
}
