let nomJoueur = "Noé";
let filtre = 'aFaire';
let queteActuelle = null;

const quetes = [
  {
    id: 1,
    titre: "Accepter les cookies",
    faite: false,
    description: "Mamie te demande si tu acceptes les cookies.",
    type: "choixOuiNon",
    etapes: [
      { texte: "Mamie : Mon ${nomJoueur}, veux-tu accepter mes cookies ? 🍪" },
      { texteOui: "Mamie : Merci ${nomJoueur}, tu es adorable !", texteNon: "Mamie : Oh, c'est dommage..." }
    ]
  },
  {
    id: 2,
    titre: "Parler avec Mamie",
    faite: false,
    description: "Dis bonjour à Mamie pour un conseil sympa.",
    type: "dialogue",
    dialogues: [
      "Mamie : Bonjour ${nomJoueur} ! Tu sais, dans mon temps, on n'avait pas internet...",
      "Mamie : On jouait aux billes, aux cartes, et surtout : on respectait les anciens !",
      "Mamie : N'oublie pas de mettre une petite laine, il fait frais dehors !"
    ]
  },
  {
    id: 3,
    titre: "Demander un conseil à Mamie",
    faite: false,
    description: "Demande un conseil à Mamie sur la vie ou l'informatique.",
    type: "choixMultiple",
    etapes: [
      { texte: "Mamie : Tu veux un conseil sur quoi ?\n1. La vie\n2. L'informatique" },
      {
        texteVie: "Mamie : La vie, mon petit, c’est comme un couscous… faut de la patience !",
        texteInfo: "Mamie : L’informatique, faut juste pas paniquer quand ça plante !"
      }
    ]
  },
  {
    id: 4,
    titre: "Jouer à Pierre-Feuille-Ciseaux",
    faite: false,
    description: "Mamie veut jouer à pierre-feuille-ciseaux avec toi.",
    type: "miniJeu"
  },
  {
    id: 5,
    titre: "Donner un câlin à Mamie",
    faite: false,
    description: "Un bon gros câlin pour Mamie.",
    type: "dialogue",
    dialogues: [
      "Mamie : Oh, tu viens me faire un câlin ? 💖",
      "Mamie : Viens ici mon petit ${nomJoueur}, Mamie est toute émue...",
      "Mamie : Tu sais, un câlin, ça réchauffe le cœur."
    ]
  },
  {
    id: 6,
    titre: "Offrir un thé à Mamie",
    faite: false,
    description: "Propose un bon thé chaud à Mamie.",
    type: "choixOuiNon",
    etapes: [
      { texte: "Mamie : Tu veux bien me faire un petit thé, mon chéri ? ☕" },
      {
        texteOui: "Mamie : Merci ${nomJoueur}, tu es toujours attentionné.",
        texteNon: "Mamie : Bon, tant pis... je vais me débrouiller."
      }
    ]
  },
  {
    id: 7,
    titre: "Jouer aux cartes avec Mamie",
    faite: false,
    description: "Partie de cartes rapide avec Mamie.",
    type: "dialogue",
    dialogues: [
      "Mamie : Tu sais jouer au tarot, ${nomJoueur} ? Non ? Tant pis, on va faire une bataille ! 🃏",
      "Mamie : Tu gagnes cette manche, bravo !",
      "Mamie : Bon, Mamie est fatiguée maintenant, on rejouera plus tard."
    ]
  }
];

const listeQuetesElem = document.getElementById('liste-quetes');
const texteDialogue = document.getElementById('texte-dialogue');
const btnAFaire = document.getElementById('btn-a-faire');
const btnTerminees = document.getElementById('btn-terminees');
const btnParler = document.getElementById('btn-parler');
const btnAccepter = document.getElementById('btn-accepter');
const btnRefuser = document.getElementById('btn-refuser');

function afficherQuetes() {
  listeQuetesElem.innerHTML = '';
  const quetesFiltree = quetes.filter(q => (filtre === 'aFaire' ? !q.faite : q.faite));
  if (quetesFiltree.length === 0) {
    listeQuetesElem.innerHTML = '<li><em>Aucune quête ici.</em></li>';
    return;
  }

  quetesFiltree.forEach(q => {
    const li = document.createElement('li');
    li.textContent = q.titre;
    li.style.cursor = "pointer";

    const statut = document.createElement('span');
    if (queteActuelle && queteActuelle.id === q.id && !q.faite) {
      statut.textContent = '⏳';
    } else {
      statut.textContent = q.faite ? '✅' : '❌';
    }
    statut.style.marginRight = "10px";
    li.prepend(statut);

    if (!q.faite) {
      li.addEventListener("click", () => {
        queteActuelle = q;
        afficherQuete(q);
      });
    } else {
      li.style.opacity = "0.6";
    }

    listeQuetesElem.appendChild(li);
  });
}

btnAFaire.onclick = () => {
  filtre = 'aFaire';
  btnAFaire.classList.add('active');
  btnTerminees.classList.remove('active');
  afficherQuetes();
};

btnTerminees.onclick = () => {
  filtre = 'terminees';
  btnTerminees.classList.add('active');
  btnAFaire.classList.remove('active');
  afficherQuetes();
};

function afficherQuete(quete) {
  resetZone();
  if (!quete) return;

  switch (quete.type) {
    case "choixOuiNon":
      texteDialogue.textContent = eval('`' + quete.etapes[0].texte + '`');
      btnAccepter.classList.remove('hidden');
      btnRefuser.classList.remove('hidden');
      btnAccepter.onclick = () => terminerQuete(quete, eval('`' + quete.etapes[1].texteOui + '`'));
      btnRefuser.onclick = () => terminerQuete(quete, eval('`' + quete.etapes[1].texteNon + '`'));
      break;

    case "dialogue":
      let i = 0;
      texteDialogue.textContent = eval('`' + quete.dialogues[i] + '`');
      btnParler.classList.remove('hidden');
      btnParler.onclick = () => {
        i++;
        if (i < quete.dialogues.length) {
          texteDialogue.textContent = eval('`' + quete.dialogues[i] + '`');
        } else {
          terminerQuete(quete, `Mamie : Merci pour cette belle discussion, ${nomJoueur} !`);
        }
      };
      break;

    case "choixMultiple":
      texteDialogue.textContent = quete.etapes[0].texte;
      btnAccepter.textContent = "Vie";
      btnRefuser.textContent = "Informatique";
      btnAccepter.classList.remove('hidden');
      btnRefuser.classList.remove('hidden');
      btnAccepter.onclick = () => terminerQuete(quete, quete.etapes[1].texteVie);
      btnRefuser.onclick = () => terminerQuete(quete, quete.etapes[1].texteInfo);
      break;

    case "miniJeu":
      texteDialogue.textContent = "Mamie : Choisis Pierre, Feuille ou Ciseaux !";
      creerBoutonsJeu();
      break;
  }
}

function terminerQuete(quete, message) {
  texteDialogue.textContent = message;
  quete.faite = true;
  queteActuelle = null;
  cacherBoutons();
  afficherQuetes();
}

function creerBoutonsJeu() {
  btnAccepter.classList.remove('hidden');
  btnRefuser.classList.remove('hidden');
  btnAccepter.textContent = "Pierre";
  btnRefuser.textContent = "Feuille";

  let btnCiseaux = document.getElementById("btn-ciseaux");
  if (!btnCiseaux) {
    btnCiseaux = document.createElement("button");
    btnCiseaux.id = "btn-ciseaux";
    btnCiseaux.textContent = "Ciseaux";
    btnCiseaux.className = "btn-ciseaux";
    document.getElementById("zone-actions").appendChild(btnCiseaux);
  }
  btnCiseaux.classList.remove('hidden');

  btnAccepter.onclick = () => lancerJeu("Pierre");
  btnRefuser.onclick = () => lancerJeu("Feuille");
  btnCiseaux.onclick = () => lancerJeu("Ciseaux");
}

function lancerJeu(choix) {
  const mamie = ["Pierre", "Feuille", "Ciseaux"][Math.floor(Math.random() * 3)];
  let res = "Égalité 😐";
  if (choix !== mamie) {
    if (
      (choix === "Pierre" && mamie === "Ciseaux") ||
      (choix === "Feuille" && mamie === "Pierre") ||
      (choix === "Ciseaux" && mamie === "Feuille")
    ) {
      res = "Tu as gagné 🎉";
    } else {
      res = "Mamie a gagné 😈";
    }
  }
  texteDialogue.textContent = `Tu as choisi ${choix}, Mamie a choisi ${mamie}. ${res}`;
  const quete = quetes.find(q => q.id === 4);
  quete.faite = true;
  queteActuelle = null;
  cacherBoutons();
  afficherQuetes();
}

function resetZone() {
  texteDialogue.textContent = `Bonjour mon petit ${nomJoueur}, que veux-tu faire ?`;
  cacherBoutons();
}

function cacherBoutons() {
  btnAccepter.classList.add('hidden');
  btnRefuser.classList.add('hidden');
  btnParler.classList.add('hidden');
  const btnCiseaux = document.getElementById("btn-ciseaux");
  if (btnCiseaux) btnCiseaux.classList.add('hidden');
}

window.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("popup-nom");
  const input = document.getElementById("input-nom");
  const valider = document.getElementById("valider-nom");

  valider.addEventListener("click", () => {
    const nom = input.value.trim();
    if (nom.length > 0) {
      nomJoueur = nom;
      popup.style.display = "none";
      afficherQuetes();
      resetZone();
    } else {
      alert("Entre un prénom valide !");
    }
  });

  afficherQuetes();
  resetZone();
});
