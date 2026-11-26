# Firmware ESP32 + HX711

Firmware previsto em C/C++ com framework Arduino e PlatformIO.

## Hardware de referência

- ESP32.
- Módulo HX711 (conversor de 24 bits).
- Célula de carga dimensionada para a capacidade da travessa.
- Fonte e montagem protegidas contra calor e umidade.

## Preparação

1. Instale o PlatformIO no VS Code.
2. Confira o modelo exato da placa ESP32 e ajuste `platformio.ini`.
3. Defina os pinos DT e SCK conforme a montagem.
4. Instale uma biblioteca HX711 compatível.
5. Calibre com peso conhecido e aplique tara com a travessa vazia.
6. Teste em bancada antes de instalar no buffet.

## Lógica esperada

- Amostrar a aproximadamente 10 Hz.
- Usar janela de estabilidade de 1,5 a 3 segundos.
- Ignorar variações inferiores ao limiar e acumular pequenas retiradas contra o último peso registrado.
- Classificar aumento grande e estável como reposição.
- Persistir eventos localmente quando a rede cair e sincronizar posteriormente.
- Usar HTTPS no piloto; avaliar MQTT ao escalar.

Os parâmetros do firmware são valores iniciais, não calibração universal. Ajuste conforme a célula de carga, o ruído e a estrutura física.
