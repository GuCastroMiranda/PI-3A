"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/seed.ts
var import_client = require("@prisma/client");
var import_bcryptjs = __toESM(require("bcryptjs"));
var prisma = new import_client.PrismaClient();
async function main() {
  console.log("\u{1F331} Iniciando seed do banco de dados...");
  const passwordHash = await import_bcryptjs.default.hash("123456", 8);
  const user = await prisma.user.upsert({
    where: { email: "teste@farmasus.com" },
    update: {},
    create: {
      name: "Usu\xE1rio Teste",
      email: "teste@farmasus.com",
      password_hash: passwordHash,
      role: "CITIZEN"
    }
  });
  const admin = await prisma.user.upsert({
    where: { email: "admin@farmasus.com" },
    update: {},
    create: {
      name: "Admin Farm\xE1cia",
      email: "admin@farmasus.com",
      password_hash: passwordHash,
      role: "ADMIN"
    }
  });
  const meds = [
    { name: "Dipirona 500mg", category: "Analg\xE9sico", description: "Al\xEDvio da dor e febre" },
    { name: "Amoxicilina 500mg", category: "Antibi\xF3tico", description: "Tratamento de infec\xE7\xF5es bacterianas" },
    { name: "Ibuprofeno 400mg", category: "Anti-inflamat\xF3rio", description: "Redu\xE7\xE3o de inflama\xE7\xF5es e dor" },
    { name: "Losartana 50mg", category: "Anti-hipertensivo", description: "Controle da press\xE3o arterial" },
    { name: "Paracetamol 750mg", category: "Analg\xE9sico", description: "Redu\xE7\xE3o de febre e dor leve" }
  ];
  const createdMeds = [];
  for (const med of meds) {
    const created = await prisma.medication.create({
      data: med
    });
    createdMeds.push(created);
  }
  const pharmacies = [
    { name: "UBS Centro", address: "Rua Principal, 100 - Centro", latitude: -23.5505, longitude: -46.6333 },
    { name: "UBS Sul", address: "Av. Sul, 200 - Zona Sul", latitude: -23.5605, longitude: -46.6433 },
    { name: "UBS Norte", address: "Av. Norte, 300 - Zona Norte", latitude: -23.5405, longitude: -46.6233 },
    { name: "UBS Leste", address: "Av. Leste, 400 - Zona Leste", latitude: -23.5305, longitude: -46.6133 },
    { name: "UBS Oeste", address: "Av. Oeste, 500 - Zona Oeste", latitude: -23.5505, longitude: -46.6533 }
  ];
  const createdPharmacies = [];
  for (const ph of pharmacies) {
    const created = await prisma.pharmacy.create({
      data: ph
    });
    createdPharmacies.push(created);
  }
  console.log("\u{1F48A} Preenchendo estoques...");
  await prisma.inventory.create({ data: { pharmacy_id: createdPharmacies[0].id, medication_id: createdMeds[0].id, quantity: 150 } });
  await prisma.inventory.create({ data: { pharmacy_id: createdPharmacies[1].id, medication_id: createdMeds[1].id, quantity: 0 } });
  await prisma.inventory.create({ data: { pharmacy_id: createdPharmacies[2].id, medication_id: createdMeds[2].id, quantity: 300 } });
  await prisma.inventory.create({ data: { pharmacy_id: createdPharmacies[3].id, medication_id: createdMeds[3].id, quantity: 50 } });
  await prisma.inventory.create({ data: { pharmacy_id: createdPharmacies[4].id, medication_id: createdMeds[4].id, quantity: 0 } });
  console.log("\u2705 Seed finalizado com sucesso!");
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
