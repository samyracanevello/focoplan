/**
 * Coleção de frases motivacionais em Português Brasileiro.
 * Usada no Dashboard e Pomodoro quando showMotivationalQuotes = true.
 */
export const quotes = [
    { text: "A disciplina é a ponte entre metas e realizações.", author: "Jim Rohn" },
    { text: "Cada página que você lê hoje é um passo à frente amanhã.", author: "FocoPlan" },
    { text: "Não é sobre ter tempo, é sobre fazer tempo.", author: "Karen Lamb" },
    { text: "O segredo de ir à frente é começar.", author: "Mark Twain" },
    { text: "Uma hora por dia de estudo pode mudar tudo.", author: "Earl Nightingale" },
    { text: "A aprendizagem é a única coisa que a mente nunca esgota.", author: "Leonardo da Vinci" },
    { text: "Invista em você mesmo. Seu futuro agradece.", author: "FocoPlan" },
    { text: "Foco não é dizer sim a muita coisa, mas dizer não ao que não importa.", author: "Steve Jobs" },
    { text: "O sucesso é a soma de pequenos esforços repetidos dia após dia.", author: "Robert Collier" },
    { text: "Você não precisa ser ótimo para começar, mas precisa começar para ser ótimo.", author: "Zig Ziglar" },
    { text: "25 minutos de foco total valem mais que 4 horas dispersas.", author: "FocoPlan" },
    { text: "Comece onde você está. Use o que você tem. Faça o que você pode.", author: "Arthur Ashe" },
    { text: "O conhecimento de hoje é o sucesso de amanhã.", author: "FocoPlan" },
    { text: "A mente que se abre a uma nova ideia jamais volta ao tamanho original.", author: "Albert Einstein" },
    { text: "Progresso, não perfeição.", author: "FocoPlan" },
    { text: "O aprendizado nunca esgota a mente.", author: "Leonardo da Vinci" },
    { text: "Cada Pomodoro completado é uma vitória pequena e real.", author: "FocoPlan" },
    { text: "A constância supera o talento.", author: "FocoPlan" },
    { text: "Quem estuda enquanto os outros descansam, descansa enquanto os outros trabalham.", author: "Provérbio" },
    { text: "Transforme seu futuro uma sessão de estudo de cada vez.", author: "FocoPlan" },
];

/**
 * Retorna uma frase baseada no dia do ano (rotação diária).
 */
export const getDailyQuote = () => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000);
    return quotes[dayOfYear % quotes.length];
};

/**
 * Retorna uma frase aleatória.
 */
export const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];
