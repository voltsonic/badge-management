// Copied from: node_modules/badgen/dist/index.d.ts

declare type BadgenStyleOption = 'flat' | 'classic';
interface IBadgenOptions {
    status: string;
    subject?: string;
    color?: string;
    label?: string;
    labelColor?: string;
    style?: BadgenStyleOption;
    icon?: string;
    iconWidth?: number;
    scale?: number;
}
