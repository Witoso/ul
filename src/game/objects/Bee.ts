import { Scene } from 'phaser';
import { ANIM_KEYS, ASSET_KEYS } from '../constants';

export class Bee
{
    private readonly sprite: Phaser.GameObjects.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private readonly flySpeed = 220;
    private readonly turnSpeed = 2.5;
    private readonly scale = 0.15;

    constructor (scene: Scene, x: number, y: number)
    {
        this.ensureAnimation(scene);

        this.sprite = scene.add.sprite(x, y, ASSET_KEYS.Bee1);
        this.sprite.setOrigin(0.5).setScale(this.scale).play(ANIM_KEYS.BeeFly);
    }

    setControls (cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined): void
    {
        this.cursors = cursors;
    }

    update (dt: number, bounds: { width: number; height: number }): void
    {
        this.handleInput(dt);
        this.wrap(bounds);
    }

    private ensureAnimation (scene: Scene): void
    {
        if (scene.anims.exists(ANIM_KEYS.BeeFly))
        {
            return;
        }

        scene.anims.create({
            key: ANIM_KEYS.BeeFly,
            frames: [{ key: ASSET_KEYS.Bee1 }, { key: ASSET_KEYS.Bee2 }],
            frameRate: 8,
            repeat: -1
        });
    }

    private handleInput (dt: number): void
    {
        if (!this.cursors)
        {
            return;
        }

        const { left, right, up } = this.cursors;

        if (left?.isDown)
        {
            this.sprite.rotation -= this.turnSpeed * dt;
        }
        else if (right?.isDown)
        {
            this.sprite.rotation += this.turnSpeed * dt;
        }

        if (up?.isDown)
        {
            const heading = this.sprite.rotation - Math.PI / 2;
            this.sprite.x += Math.cos(heading) * this.flySpeed * dt;
            this.sprite.y += Math.sin(heading) * this.flySpeed * dt;
        }
    }

    private wrap (bounds: { width: number; height: number }): void
    {
        if (this.sprite.x < 0) this.sprite.x = bounds.width;
        else if (this.sprite.x > bounds.width) this.sprite.x = 0;

        if (this.sprite.y < 0) this.sprite.y = bounds.height;
        else if (this.sprite.y > bounds.height) this.sprite.y = 0;
    }
}
