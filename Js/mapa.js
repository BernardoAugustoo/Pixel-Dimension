export async function carregarMapas() {
    try {
        const resposta = await fetch('Data/mapas.json');

        if (!resposta.ok) {
            throw new Error('Não foi possível carregar os mapas.');
        }

        const dados = await resposta.json();

        console.log('Mapas carregados:', dados.mapas);

        return dados.mapas;

    } catch (erro) {
        console.error('Erro ao carregar os mapas:', erro);
    }
}