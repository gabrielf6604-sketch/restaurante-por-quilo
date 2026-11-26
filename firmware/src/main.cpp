#include <Arduino.h>
#include "HX711.h"

// Ajuste os pinos para a placa e a montagem reais.
constexpr uint8_t HX711_DOUT = 4;
constexpr uint8_t HX711_SCK = 5;
constexpr uint32_t SAMPLE_INTERVAL_MS = 100; // referência: 10 leituras por segundo
constexpr uint32_t STABILITY_WINDOW_MS = 2000; // ajustar entre 1,5 e 3 s no piloto

HX711 scale;
unsigned long lastSampleAt = 0;
unsigned long stableSince = 0;
float lastStableGrams = 0.0f;
float candidateGrams = 0.0f;

// Valor ilustrativo. Deve ser obtido por calibração com peso conhecido.
float calibrationFactor = 1.0f;
const float minimumChangeGrams = 30.0f; // ponto inicial a ajustar no piloto
const float stabilityToleranceGrams = 5.0f;

void setup() {
  Serial.begin(115200);
  scale.begin(HX711_DOUT, HX711_SCK);
  scale.set_scale(calibrationFactor);
  scale.tare();
  Serial.println("Sensor iniciado. Calibre antes de usar em operação.");
}

void loop() {
  const unsigned long now = millis();
  if (now - lastSampleAt < SAMPLE_INTERVAL_MS) return;
  lastSampleAt = now;

  if (!scale.is_ready()) {
    Serial.println("HX711 indisponivel");
    return;
  }

  const float currentGrams = scale.get_units(1);
  if (stableSince == 0) {
    candidateGrams = currentGrams;
    stableSince = now;
    return;
  }

  if (fabs(currentGrams - candidateGrams) <= stabilityToleranceGrams) {
    if (now - stableSince >= STABILITY_WINDOW_MS) {
      const float delta = currentGrams - lastStableGrams;
      if (fabs(delta) >= minimumChangeGrams) {
        const char* eventType = delta < 0 ? "RETIRADA" : "REPOSICAO";
        Serial.printf("%s; variacao=%.1f g; peso=%.1f g\n", eventType, fabs(delta), currentGrams);
        // TODO: persistir evento e enviar ao servidor via HTTPS.
        lastStableGrams = currentGrams;
      }
      stableSince = now;
      candidateGrams = currentGrams;
    }
  } else {
    candidateGrams = currentGrams;
    stableSince = now;
  }
}
