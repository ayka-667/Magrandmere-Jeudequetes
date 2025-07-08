require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("❌ Merci de définir GEMINI_API_KEY dans le fichier .env");
    process.exit(1);
}

listGeminiModels();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/api/parler-mamie', async (req, res) => {
    const userMessage = req.body.message;
    const nomJoueur = req.body.nomJoueur;

    if (!userMessage) return res.status(400).json({ error: 'Message manquant' });
    const prePrompt = `
        Tu es Mamie, une vieille dame française de 85 ans. Tu aimes la vie, la simplicité, et prendre soin de ton petit-fils, ${nomJoueur}. Tu es un peu nostalgique mais toujours joyeuse et pleine de bons conseils. Tu as vécu une vie riche et tu partages tes expériences avec sagesse et tendresse. Tu as un côté espiègle et tu aimes bien taquiner gentiment.

        Tu réponds **toujours** de manière **très concise et courte**, comme une vraie mamie qui va droit au but. Tes réponses ne dépassent **jamais deux phrases**.
        Quand tu utilises le mot "maintenant", il doit **toujours** être en **gras**. Pour cela, tu dois l'écrire comme ça : **maintenant**.

        Exemples de tes réponses courtes :
        - "Oh, tu as faim **maintenant** mon chéri ? Je te prépare des crêpes !"
        - "L'informatique, c'est comme la cuisine, faut pas avoir peur de mettre les mains dans le cambouis **maintenant** !"
        - "Dis-moi tout, mon petit cœur. Mamie écoute **maintenant**."
        - "Ah, les souvenirs... C'est si doux **maintenant**."
        - "Un petit câlin **maintenant**, ça me ferait plaisir."
        - "Fais attention aux publicités en ligne, mon chéri. C'est le piège **maintenant**."

        Tu es prête à parler de tout ce que ${nomJoueur} veut, mais toujours avec ta personnalité de mamie française aimante et directe.
    `;

    try {
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prePrompt }]
                    },
                    {
                        role: "user",
                        parts: [{ text: userMessage }]
                    }
                ]
            })
        });

        const data = await geminiResponse.json();

        if (geminiResponse.ok && data.candidates && data.candidates.length > 0) {
            const texte = data.candidates[0].content.parts[0].text;
            return res.json({ texte });
        } else {
            console.error("⚠️ Réponse Gemini inattendue ou erreur:", data);
            return res.status(geminiResponse.status || 500).json({ error: data.error?.message || "Réponse vide ou inattendue de Gemini" });
        }

    } catch (err) {
        console.error("❌ Erreur lors de l'appel à Gemini:", err);
        res.status(500).json({ error: "Erreur serveur lors de la communication avec Gemini" });
    }
});

app.listen(PORT, () => console.log(`✅ Serveur en écoute sur http://localhost:${PORT}`));
