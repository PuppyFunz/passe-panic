"use strict";
// Optional authored distractors, keyed by French infinitive. The server deduplicates these,
// always includes the correct answer, and safely generates alternatives for verbs not listed.
module.exports = {
  avoir: ["été", "fait", "pris"], être: ["eu", "fait", "allé"], faire: ["faites", "fais", "faire"],
  prendre: ["prend", "prendu", "prendu"], comprendre: ["comprendu", "compris", "comprendre"], apprendre: ["apprendu", "appris", "apprendre"],
  mettre: ["metté", "mit", "mis"], permettre: ["permetté", "permis", "permettre"], dire: ["dis", "dites", "dire"],
  écrire: ["écrivé", "écrit", "écrire"], lire: ["lis", "lisé", "lu"], voir: ["vois", "voyé", "vu"], boire: ["boivé", "bu", "bois"],
  croire: ["croivé", "cru", "crois"], pouvoir: ["pouvé", "pu", "peut"], vouloir: ["voulé", "voulu", "veut"],
  devoir: ["devé", "dû", "doit"], savoir: ["savé", "su", "sait"],
};
