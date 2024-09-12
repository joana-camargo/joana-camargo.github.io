async function fetchMediumPosts() {
    const rssUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@joana.camargo';

    try {
        const response = await fetch(rssUrl);
        const data = await response.json();

        if (!data || !data.items) {
            console.error('Nenhum post encontrado.');
            return;
        }

        let html = '';

        // Limitar a 3 posts
        const posts = data.items.slice(0, 3);

        // Função para truncar texto
        const truncateText = (text, maxLength) => {
            if (text.length > maxLength) {
                return text.substring(0, maxLength) + '...';
            }
            return text;
        };

        // Iterar apenas sobre os 3 primeiros posts
        posts.forEach((item) => {
            const title = item.title;
            const link = item.link;
            const pubDate = item.pubDate;
            let description = item.description;

            // Sanitizar a descrição para evitar XSS
            description = description.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            description = description.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, ''); // Remove HTML

            // Limitar o número de caracteres da descrição
            const truncatedDescription = truncateText(description, 300);

            html += `
                <div class="post-item">
                    <h2 class="post-title"><a href="${link}" target="_blank">${title}</a></h2>
                    <p class="post-date"><strong>Publicado em:</strong> ${new Date(pubDate).toLocaleDateString()}</p>
                    <p class="post-description">${truncatedDescription}</p>
                    <hr class="post-divider">
                </div>`;
        });

        console.log(html); // Verificar o HTML gerado
        document.getElementById('medium-posts').innerHTML = html;
    } catch (error) {
        console.error('Erro ao buscar os posts:', error);
    }
}

fetchMediumPosts();
