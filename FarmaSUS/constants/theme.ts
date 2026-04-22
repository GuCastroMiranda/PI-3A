import { Platform } from 'react-native';

const tintColorLight = '#1A3C6B'; // Azul escuro principal da logo e botões
const tintColorDark = '#6A8FB8';

export const Colors = {
  light: {
    text: '#333333',
    background: '#E6F0FA', // Azul bem clarinho do fundo das telas
    tint: tintColorLight,
    icon: '#6A8FB8',
    tabIconDefault: '#A0B4C8', // Cor dos ícones inativos no menu inferior
    tabIconSelected: tintColorLight, // Cor do ícone ativo no menu inferior
    
    // Cores adicionais do FarmaSUS para facilitar
    primary: '#1A3C6B', // Azul Principal
    secondary: '#2F8F8F', // Verde Água (usado no botão Finalizar Cadastro)
    success: '#00B36B', // Verde de "Em Estoque"
    danger: '#D32F2F', // Vermelho de "Sem Estoque"
    card: '#FFFFFF', // Fundo branco dos cards e inputs
    border: '#D9E2EC', // Bordas dos inputs
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    
    primary: '#6A8FB8',
    secondary: '#2F8F8F',
    success: '#00B36B',
    danger: '#D32F2F',
    card: '#222222',
    border: '#333333',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});