import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateSummaryFromText(text: string): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    const errorMessage = "La clé API Gemini n'est pas configurée. Veuillez l'ajouter à votre fichier .env et redémarrer le serveur.";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Mettre à jour le nom du modèle vers une version plus récente et disponible
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = `Résume le texte suivant pour un étudiant, en te concentrant sur les concepts clés. Le résumé doit être clair, concis, en français et ne pas dépasser 4 phrases. Voici le texte :\n\n"${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error("Erreur lors de la génération du résumé via Gemini:", error);
    throw new Error("Impossible de communiquer avec l'API Gemini. Veuillez vérifier votre clé API et votre connexion Internet.");
  }
}
