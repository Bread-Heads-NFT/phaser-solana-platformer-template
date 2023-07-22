import * as Phaser from 'phaser';
import { Web3Auth } from '@web3auth/modal';
import { SolflareAdapter } from '@web3auth/solflare-adapter';

declare global {
    interface Window {
        Modal: any;
        SolanaWalletConnectorPlugin: any;
        SolflareAdapter: any;
        rpc: any;
    }
}

export default class LoginScene extends Phaser.Scene {
    _connected: boolean = false;
    startButton: Phaser.GameObjects.Text;
    loginButton: Phaser.GameObjects.Text;
    logoutButton: Phaser.GameObjects.Text;
    web3auth: Web3Auth;

    constructor() {
        super('login');
    }

    preload() {
    }

    create() {
        this.startButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 50,
            'Play',
            {
                fontSize: '32px',
            })
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on(Phaser.Input.Events.POINTER_DOWN, async () => {
                this.startGame();
            })
            .on(Phaser.Input.Events.POINTER_OVER, () => this.startButton.setStyle({ fill: '#f39c12' }))
            .on(Phaser.Input.Events.POINTER_OUT, () => this.startButton.setStyle({ fill: '#FFF' }))
            .setVisible(false);

        this.loginButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Login',
            {
                fontSize: '32px',
            })
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on(Phaser.Input.Events.POINTER_DOWN, async () => {
                await this.login();
            })
            .on(Phaser.Input.Events.POINTER_OVER, () => this.loginButton.setStyle({ fill: '#f39c12' }))
            .on(Phaser.Input.Events.POINTER_OUT, () => this.loginButton.setStyle({ fill: '#FFF' }))

        this.logoutButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            'Logout',
            {
                fontSize: '32px',
            })
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on(Phaser.Input.Events.POINTER_DOWN, async () => {
                await this.logout();
            })
            .on(Phaser.Input.Events.POINTER_OVER, () => this.logoutButton.setStyle({ fill: '#f39c12' }))
            .on(Phaser.Input.Events.POINTER_OUT, () => this.logoutButton.setStyle({ fill: '#FFF' }))
            .setVisible(false);
    }

    async login() {
        // Replace this with your client ID generated at https://dashboard.web3auth.io/.
        const clientId =
            "BKK83z_vYtZWdRWyoYbUK3wAAyZbkPlKG5tgQcGCFA6xPSg1VoAWOtYehhGa_TEd2NDLMsiADApHcncxAHfobVk";

        this.web3auth = new Web3Auth({
            clientId,
            chainConfig: {
                chainNamespace: "solana",
                chainId: "0x1", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
                rpcTarget: "https://solana-mainnet.rpc.extrnode.com", // This is the public RPC we have added, please pass on your own endpoint while creating an app
            },
            web3AuthNetwork: "testnet",
        });

        const solflareAdapter = new SolflareAdapter({
            clientId,
        });
        this.web3auth.configureAdapter(solflareAdapter);

        await this.web3auth.initModal();
        const provider = await this.web3auth.connect();
        console.log(provider);

        this._connected = true;
        this.loginButton.setVisible(false);
        this.logoutButton.setVisible(true);
        this.startButton.setVisible(true);
    }

    async logout() {
        await this.web3auth.logout();
        this._connected = false;
        this.loginButton.setVisible(true);
        this.logoutButton.setVisible(false);
        this.startButton.setVisible(false);
    }

    startGame() {
        if (!this.sys.game.device.os.desktop) {
            this.scale.startFullscreen();
        }
        this.scene.start('game');
    }
}