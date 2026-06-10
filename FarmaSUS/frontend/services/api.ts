import axios from 'axios';

// Em ambiente de desenvolvimento usando o celular ou emulador,
// O emulador Android não consegue acessar o backend via 'localhost' porque o localhost dele é o próprio celular virtual.
// O IP 172.27.3.94 é o IP da sua máquina (onde o servidor Node está rodando).
export const api = axios.create({
  baseURL: 'http://172.27.1.146:3333',
});

