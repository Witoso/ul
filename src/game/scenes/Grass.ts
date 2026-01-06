import { Scene } from 'phaser';

export class Grass extends Scene
{
    private bee?: Phaser.GameObjects.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private speed = 220;
    private turnSpeed = 2.5;

    constructor ()
    {
        super('Grass');
    }

    create ()
    {
        const { width, height } = this.scale.gameSize;

        const grass = this.add.tileSprite(0, 0, width, height, 'grass').setOrigin(0);
        grass.setTileScale(0.25, 0.25);

        if (!this.anims.exists('bee-fly'))
        {
            this.anims.create({
                key: 'bee-fly',
                frames: [{ key: 'bee1' }, { key: 'bee2' }],
                frameRate: 8,
                repeat: -1
            });
        }

        this.bee = this.add.sprite(width * 0.5, height * 0.5, 'bee1');
        this.bee.setOrigin(0.5).setScale(0.2).play('bee-fly');

        this.cursors = this.input.keyboard?.createCursorKeys();

        this.input.keyboard?.once('keydown-ESC', () => {
            this.scene.start('MainMenu');
        });
    }

    update (_time: number, delta: number)
    {
        if (!this.bee || !this.cursors)
        {
            return;
        }

        const dt = delta / 1000;
        const { left, right, up } = this.cursors;

        if (left?.isDown)
        {
            this.bee.rotation -= this.turnSpeed * dt;
        }
        else if (right?.isDown)
        {
            this.bee.rotation += this.turnSpeed * dt;
        }

        if (up?.isDown)
        {
            const heading = this.bee.rotation - Math.PI / 2;
            this.bee.x += Math.cos(heading) * this.speed * dt;
            this.bee.y += Math.sin(heading) * this.speed * dt;
        }

        const { width, height } = this.scale.gameSize;

        if (this.bee.x < 0) this.bee.x = width;
        else if (this.bee.x > width) this.bee.x = 0;

        if (this.bee.y < 0) this.bee.y = height;
        else if (this.bee.y > height) this.bee.y = 0;
    }
}
