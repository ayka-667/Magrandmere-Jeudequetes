let nomJoueur = "Ayka";
let filtre = 'aFaire';
let queteActuelle = null;

// Définir la quête IA séparément et elle ne sera PAS dans la liste des quêtes normales
const queteIA = {
    id: 100,
    titre: "💬 Discuter avec Mamie",
    faite: false, // Elle ne sera jamais vraiment "faite"
    description: "Parle avec Mamie via l'IA Gemini, elle te répondra comme une vraie mamie !",
    type: "geminiChat"
};

const quetesNormales = [ // Ce tableau ne contient PLUS la quête IA
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
const zoneActions = document.getElementById('zone-actions');

const grandmereContainer = document.querySelector('.grandmere');

// Références pour le chat Gemini intégré
const geminiChatContainer = document.getElementById('gemini-chat-container');
const chatConversation = document.getElementById('chat-conversation');
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat-btn');

// Référence au bouton IA flottant
const btnIAChat = document.getElementById('btn-ia-chat');

// NOUVEAU : Référence pour l'indicateur de saisie
let typingIndicator = null;


function afficherQuetes() {
    listeQuetesElem.innerHTML = ''; // Nettoyer la liste

    const quetesFiltree = quetesNormales.filter(q => (filtre === 'aFaire' ? !q.faite : q.faite));
    
    if (quetesFiltree.length === 0) {
        if (filtre === 'aFaire') {
             const allNormalQuetesDone = quetesNormales.every(q => q.faite);
             if (allNormalQuetesDone) {
                 listeQuetesElem.innerHTML = '<li><em>Toutes les quêtes sont terminées !</em></li>';
             } else {
                 listeQuetesElem.innerHTML = '<li><em>Aucune quête à faire pour le moment.</em></li>';
             }
        } else {
            listeQuetesElem.innerHTML = '<li><em>Aucune quête terminée.</em></li>';
        }
    }

    quetesFiltree.forEach(q => {
        const li = document.createElement('li');
        li.textContent = q.titre;
        li.style.cursor = "pointer";

        const statut = document.createElement('span');
        statut.textContent = (queteActuelle && queteActuelle.id === q.id && !q.faite) ? '⏳' : (q.faite ? '✅' : '❌');
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
    
    const instructionQuetes = document.getElementById('instruction-quetes');
    const hasNormalQuetesToDo = quetesNormales.some(q => !q.faite);
    if (!hasNormalQuetesToDo && filtre === 'aFaire') {
        instructionQuetes.textContent = "🥳 Toutes les quêtes sont terminées ! Mais tu peux toujours discuter avec Mamie.";
    } else {
        instructionQuetes.textContent = "👉 Clique sur une quête pour la commencer";
    }
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
    
    texteDialogue.classList.remove('hidden-for-chat');
    zoneActions.classList.remove('hidden-for-chat');
    grandmereContainer.classList.remove('hidden-for-chat');

    geminiChatContainer.classList.add('hidden');
    geminiChatContainer.classList.remove('visible-for-chat');

    if (!quete) return;

    if (quete.id === queteIA.id) {
        texteDialogue.classList.add('hidden-for-chat');
        zoneActions.classList.add('hidden-for-chat');
        grandmereContainer.classList.add('hidden-for-chat');

        setTimeout(() => {
            geminiChatContainer.classList.remove('hidden');
            geminiChatContainer.classList.add('visible-for-chat');
            chatInput.focus();
        }, 300);

        chatConversation.innerHTML = '';
        addChatMessage(`Dis-moi, mon petit ${nomJoueur}, de quoi as-tu envie de parler aujourd'hui ?`, 'mamie');

        sendChatBtn.onclick = handleGeminiChat;
        chatInput.onkeypress = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleGeminiChat();
            }
        };
        return;
    }

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

async function handleGeminiChat() {
    const message = chatInput.value.trim();
    if (!message) {
        addChatMessage("N'oublie pas de me dire quelque chose mon cœur !", 'mamie');
        return;
    }

    addChatMessage(`${message}`, 'user'); // Le "Vous :" est maintenant géré par le CSS
    chatInput.value = '';
    sendChatBtn.disabled = true;
    chatInput.disabled = true;
    chatInput.placeholder = "Mamie réfléchit...";

    // Afficher l'indicateur de saisie
    typingIndicator = addChatMessage("Mamie est en train d'écrire...", 'mamie', true); // Le 3ème paramètre indique que c'est un indicateur

    try {
        const reponse = await appelerGeminiAPI(message);
        // Supprimer l'indicateur de saisie avant d'ajouter la réponse
        if (typingIndicator && chatConversation.contains(typingIndicator)) {
            chatConversation.removeChild(typingIndicator);
        }
        addChatMessage(`${reponse}`, 'mamie'); // Le "Mamie :" est maintenant géré par le CSS et l'icône
    } catch (err) {
        // Supprimer l'indicateur de saisie même en cas d'erreur
        if (typingIndicator && chatConversation.contains(typingIndicator)) {
            chatConversation.removeChild(typingIndicator);
        }
        const errorMessage = "Mamie a eu un trou de mémoire 😵 (Erreur IA)";
        addChatMessage(errorMessage, 'mamie');
        console.error("Erreur Gemini:", err);
    }

    sendChatBtn.disabled = false;
    chatInput.disabled = false;
    chatInput.focus();
    chatInput.placeholder = "Dis quelque chose à Mamie...";
}

/**
 * Convertit un texte Markdown simple (**gras**, *italique*) en HTML.
 * @param {string} text Le texte contenant du Markdown.
 * @returns {string} Le texte converti en HTML.
 */
function convertMarkdownToHtml(text) {
    // Remplacer les **gras** par <strong>gras</strong>
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Remplacer les *italique* par <em>italique</em>
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return html;
}

/**
 * Ajoute un message à la conversation du chat.
 * @param {string} message Le texte du message.
 * @param {string} sender 'user' ou 'mamie'.
 * @param {boolean} isTypingIndicator Si vrai, c'est un indicateur de saisie.
 * @returns {HTMLElement} L'élément du message créé.
 */
function addChatMessage(message, sender, isTypingIndicator = false) {
    const messageWrapper = document.createElement('div'); // Nouveau wrapper pour l'icône et le message
    messageWrapper.classList.add('chat-message-wrapper', sender);

    if (sender === 'mamie' && !isTypingIndicator) {
        const mamieIcon = document.createElement('img');
        mamieIcon.src = 'icon/mamie.png';
        mamieIcon.alt = 'Mamie';
        mamieIcon.classList.add('chat-mamie-icon');
        messageWrapper.appendChild(mamieIcon);
    }

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', sender);
    
    // NOUVEAU : Convertir le Markdown en HTML avant d'insérer le contenu
    // Pour les messages de Mamie ou les messages normaux, on applique le Markdown.
    // Pour l'indicateur de saisie, on veut juste le texte brut.
    if (isTypingIndicator) {
        messageDiv.textContent = message.replace('${nomJoueur}', nomJoueur);
    } else {
        messageDiv.innerHTML = convertMarkdownToHtml(message.replace('${nomJoueur}', nomJoueur));
    }


    messageWrapper.appendChild(messageDiv);
    chatConversation.appendChild(messageWrapper);
    chatConversation.scrollTop = chatConversation.scrollHeight;
    return messageWrapper; // Retourne le wrapper pour pouvoir le supprimer si c'est un indicateur
}


function terminerQuete(quete, message) {
    if (quete.id !== queteIA.id) {
        texteDialogue.textContent = message;
        quete.faite = true;
    }

    queteActuelle = null;
    cacherBoutons();

    texteDialogue.classList.remove('hidden-for-chat');
    zoneActions.classList.remove('hidden-for-chat');
    grandmereContainer.classList.remove('hidden-for-chat');

    geminiChatContainer.classList.remove('visible-for-chat');
    setTimeout(() => {
        geminiChatContainer.classList.add('hidden');
    }, 300);

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
        zoneActions.appendChild(btnCiseaux);
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
    const quete = quetesNormales.find(q => q.id === 4);
    if (quete) {
        quete.faite = true;
    }
    queteActuelle = null;
    cacherBoutons();
    afficherQuetes();
}

function resetZone() {
    texteDialogue.textContent = `Bonjour mon petit ${nomJoueur}, que veux-tu faire ?`;
    cacherBoutons();
    geminiChatContainer.classList.add('hidden');
    geminiChatContainer.classList.remove('visible-for-chat');
    texteDialogue.classList.remove('hidden-for-chat');
    zoneActions.classList.remove('hidden-for-chat');
    grandmereContainer.classList.remove('hidden-for-chat');
}

function cacherBoutons() {
    btnAccepter.classList.add('hidden');
    btnRefuser.classList.add('hidden');
    btnParler.classList.add('hidden');
    const btnCiseaux = document.getElementById("btn-ciseaux");
    if (btnCiseaux) btnCiseaux.classList.add('hidden');
}

async function appelerGeminiAPI(message) {
    try {
        const res = await fetch('/api/parler-mamie', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                message: message,
                nomJoueur: nomJoueur // NOUVEAU : Envoyer le nom du joueur au backend
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur inconnue");
        return data.texte || "Mamie n’a rien dit...";
    } catch (err) {
        console.error("Erreur Gemini:", err);
        return "Mamie a eu un trou de mémoire 😵";
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const popupNom = document.getElementById("popup-nom");
    const inputNom = document.getElementById("input-nom");
    const validerNom = document.getElementById("valider-nom");

    popupNom.style.display = "flex";
    geminiChatContainer.classList.add('hidden');
    
    texteDialogue.classList.remove('hidden-for-chat');
    zoneActions.classList.remove('hidden-for-chat');
    grandmereContainer.classList.remove('hidden-for-chat');

    validerNom.addEventListener("click", () => {
        const nom = inputNom.value.trim();
        if (nom.length > 0) {
            nomJoueur = nom;
            popupNom.style.display = "none";
            afficherQuetes();
            resetZone();
        } else {
            alert("Entre un prénom valide !");
        }
    });

    btnIAChat.addEventListener('click', () => {
        queteActuelle = queteIA;
        afficherQuete(queteIA);
    });
});